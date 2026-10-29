import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Attempt, ProgressSnapshot } from "../../data/types";
import { emptySnapshot } from "../../test/progress";
import { createProgressClient, type ProgressState } from "./progressClient";

const LEARNER = "0b7e3c4a-2f6d-4a8e-9c1b-5d3f7e9a1c2b";

type Call = {
  method: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | undefined;
  reply: (response: Response) => void;
  fail: () => void;
};

let calls: Call[];
let states: ProgressState[];

const latest = () => states.at(-1);
const snapshot = (patch: Partial<ProgressSnapshot> = {}) => ({ ...emptySnapshot(), ...patch });
const ok = (body: object) => Response.json(body);

// Every request waits until the test answers it, so the order of requests is visible.
beforeEach(() => {
  calls = [];
  states = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(
      (url: string, init: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
          expect(url).toBe("/api/progress");

          calls.push({
            method: init.method ?? "GET",
            headers: init.headers as Record<string, string>,
            body: init.body ? JSON.parse(init.body as string) : undefined,
            reply: resolve,
            fail: () => reject(new TypeError("Failed to fetch")),
          });
        }),
    ),
  );

  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    timeZone: "Europe/Madrid",
  } as Intl.ResolvedDateTimeFormatOptions);
});

afterEach(() => {
  vi.useRealTimers();
});

const client = () => createProgressClient(LEARNER, (state) => states.push(state));

const call = async (n: number) => {
  await vi.waitFor(() => expect(calls.length).toBeGreaterThan(n));

  return calls[n];
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

const loaded = async (patch: Partial<ProgressSnapshot> = { imported: true }) => {
  const c = client();

  void c.load();
  (await call(0)).reply(ok(snapshot(patch)));
  await vi.waitFor(() => expect(latest()?.snapshot).not.toBeNull());

  return c;
};

const attempt: Attempt = {
  id: "a1",
  questionId: "u1-v0",
  skill: "reading",
  correct: false,
  answer: "hola",
  at: "2026-10-29T10:00:00.000Z",
};

describe("load", () => {
  it("reads the snapshot with the learner id and no passcode when none is stored", async () => {
    const c = client();

    void c.load();
    const get = await call(0);

    expect(get.method).toBe("GET");
    expect(get.headers).toEqual({ "x-learner-id": LEARNER });
    expect(latest()).toBeUndefined();
    get.reply(ok(snapshot({ name: "Ana", imported: true })));

    await vi.waitFor(() =>
      expect(latest()).toEqual({
        snapshot: snapshot({ name: "Ana", imported: true }),
        problem: null,
      }),
    );
  });

  it("sends the stored passcode URI-encoded", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: false, passcode: "olé" }));
    void client().load();

    expect((await call(0)).headers["x-passcode"]).toBe("ol%C3%A9");
  });

  it("starts one request when asked to load twice", async () => {
    const c = client();

    void c.load();
    void c.load();
    (await call(0)).reply(ok(snapshot({ imported: true })));
    await vi.waitFor(() => expect(latest()?.snapshot?.imported).toBe(true));
    expect(calls).toHaveLength(1);
  });

  it.each([
    ["a server error", (c: Call) => c.reply(new Response("{}", { status: 500 }))],
    ["a network error", (c: Call) => c.fail()],
    ["a body that is not JSON", (c: Call) => c.reply(new Response("<html>"))],
  ])("reports a failed load on %s, and Retry loads again", async (_, answer) => {
    const c = client();

    void c.load();
    answer(await call(0));
    await vi.waitFor(() => expect(latest()).toEqual({ snapshot: null, problem: "load" }));

    void c.retry();
    expect(latest()).toEqual({ snapshot: null, problem: null });
    (await call(1)).reply(ok(snapshot({ xp: 5, imported: true })));
    await vi.waitFor(() => expect(latest()?.snapshot?.xp).toBe(5));
  });
});

describe("passcode", () => {
  it("asks for a passcode, stores it and loads with it", async () => {
    const c = client();

    void c.load();
    (await call(0)).reply(Response.json({ error: "passcode" }, { status: 401 }));
    await vi.waitFor(() => expect(latest()).toEqual({ snapshot: null, problem: "passcode" }));

    void c.unlock("olé");

    expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
      freeUsed: false,
      passcode: "olé",
    });

    const retried = await call(1);

    expect(retried.headers["x-passcode"]).toBe("ol%C3%A9");
    retried.reply(ok(snapshot({ imported: true })));
    await vi.waitFor(() => expect(latest()?.snapshot).toEqual(snapshot({ imported: true })));
  });

  it("keeps the passcode for this visit when browser storage is unavailable", async () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const c = client();

    void c.load();
    (await call(0)).reply(Response.json({ error: "passcode" }, { status: 401 }));
    await vi.waitFor(() => expect(latest()?.problem).toBe("passcode"));
    void c.unlock("olé");

    expect((await call(1)).headers["x-passcode"]).toBe("ol%C3%A9");
  });

  it("forgets a stored passcode the server rejects", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "old" }));
    void client().load();
    (await call(0)).reply(Response.json({ error: "passcode" }, { status: 401 }));

    await vi.waitFor(() => expect(latest()?.problem).toBe("wrongPasscode"));

    expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
      freeUsed: true,
      passcode: "",
    });
  });

  it("reports too many wrong passcodes", async () => {
    void client().load();
    (await call(0)).reply(Response.json({ error: "passcode_tries" }, { status: 429 }));

    await vi.waitFor(() => expect(latest()?.problem).toBe("passcodeTries"));
  });

  it("resends a write that needed the passcode", async () => {
    const c = await loaded();

    c.check("visa", true);
    (await call(1)).reply(Response.json({ error: "passcode" }, { status: 401 }));
    await vi.waitFor(() => expect(latest()?.problem).toBe("passcode"));

    void c.unlock("olé");
    const resent = await call(2);

    expect(resent.body).toEqual({ action: "check", checkId: "visa", done: true });
    expect(resent.headers["x-passcode"]).toBe("ol%C3%A9");
    resent.reply(ok(snapshot({ imported: true, checks: ["visa"] })));

    await vi.waitFor(() =>
      expect(latest()).toEqual({
        snapshot: snapshot({ imported: true, checks: ["visa"] }),
        problem: null,
      }),
    );
  });
});

describe("import", () => {
  const legacy = '{"version":1,"name":"Ana","attempts":[]}';

  it("posts stored progress once and keeps it under a backup key", async () => {
    localStorage.setItem("paso-progress-v1", legacy);
    void client().load();
    (await call(0)).reply(ok(snapshot()));

    const post = await call(1);

    expect(post.method).toBe("POST");
    expect(post.headers).toEqual({ "x-learner-id": LEARNER, "content-type": "application/json" });

    expect(post.body).toEqual({
      action: "import",
      progress: { version: 1, name: "Ana", attempts: [] },
      timeZone: "Europe/Madrid",
    });

    expect(latest()).toBeUndefined();
    post.reply(ok({ ...snapshot({ name: "Ana", imported: true }), importedNow: true }));

    await vi.waitFor(() =>
      expect(latest()).toEqual({
        snapshot: snapshot({ name: "Ana", imported: true }),
        problem: null,
      }),
    );

    expect(localStorage.getItem("paso-progress-v1")).toBeNull();
    expect(localStorage.getItem("paso-progress-v1-imported")).toBe(legacy);
  });

  it("does not import for a learner already imported", async () => {
    localStorage.setItem("paso-progress-v1", legacy);
    await loaded({ imported: true });
    await settle();

    expect(calls).toHaveLength(1);
    expect(localStorage.getItem("paso-progress-v1")).toBe(legacy);
  });

  it.each([
    ["nothing is stored", null],
    ["the stored text is not JSON", "{oops"],
  ])("does not import when %s", async (_, stored) => {
    if (stored) {
      localStorage.setItem("paso-progress-v1", stored);
    }

    await loaded({ imported: false });
    await settle();

    expect(calls).toHaveLength(1);
    expect(localStorage.getItem("paso-progress-v1")).toBe(stored);
    expect(localStorage.getItem("paso-progress-v1-imported")).toBeNull();
  });

  it("keeps the stored progress when the import fails, and Retry imports it", async () => {
    localStorage.setItem("paso-progress-v1", legacy);
    const c = client();

    void c.load();
    (await call(0)).reply(ok(snapshot()));
    (await call(1)).reply(new Response("{}", { status: 500 }));
    await vi.waitFor(() => expect(latest()).toEqual({ snapshot: null, problem: "load" }));
    expect(localStorage.getItem("paso-progress-v1")).toBe(legacy);

    void c.retry();
    (await call(2)).reply(ok(snapshot()));
    expect((await call(3)).body?.action).toBe("import");
  });
});

describe("writes", () => {
  it("sends writes one at a time, in order, and shows each response", async () => {
    const c = await loaded();

    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-29T11:00:00Z"));

    c.attempt(attempt);
    c.complete("u1-l1", 3, 4);
    const first = await call(1);

    expect(first.body).toEqual({ action: "attempt", attempt, timeZone: "Europe/Madrid" });
    await settle();
    expect(calls).toHaveLength(2);

    first.reply(ok(snapshot({ imported: true, xp: 5 })));
    const second = await call(2);

    expect(latest()?.snapshot?.xp).toBe(5);

    expect(second.body).toEqual({
      action: "complete",
      lessonId: "u1-l1",
      score: 3,
      total: 4,
      at: "2026-10-29T11:00:00.000Z",
    });

    second.reply(ok(snapshot({ imported: true, xp: 25 })));
    await vi.waitFor(() => expect(latest()?.snapshot?.xp).toBe(25));
  });

  it("holds later writes behind a failed one, and Retry resends the same request", async () => {
    const c = await loaded();

    c.attempt(attempt);
    c.check("visa", true);
    (await call(1)).fail();
    await vi.waitFor(() => expect(latest()?.problem).toBe("save"));
    await settle();
    expect(calls).toHaveLength(2);
    expect(latest()?.snapshot).toEqual(snapshot({ imported: true }));

    void c.retry();
    const resent = await call(2);

    expect(resent.body).toEqual({ action: "attempt", attempt, timeZone: "Europe/Madrid" });
    resent.reply(ok(snapshot({ imported: true, xp: 5 })));
    expect((await call(3)).body).toEqual({ action: "check", checkId: "visa", done: true });
  });

  it("sends the body of each action", async () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue("5f0c2a9e-1b3d-4e7f-8a6c-9d2e4f1b3a5c");
    const c = await loaded();
    const review = { level: 1, nextAt: "2026-10-30T10:00:00.000Z" };
    const result = { at: "2026-10-29T10:00:00.000Z", reading: 20, listening: 18 };

    c.vocabulary({ casa: review });
    c.check("visa", false);
    c.settings({ name: "Ana", goal: 5, examDate: "2026-11-20" });
    c.mockResult(result);
    c.reset();

    const bodies = [];

    for (let n = 1; n <= 5; n++) {
      const next = await call(n);

      bodies.push(next.body);
      next.reply(ok(snapshot({ imported: true })));
    }

    expect(bodies).toEqual([
      { action: "vocabulary", reviews: { casa: review } },
      { action: "check", checkId: "visa", done: false },
      { action: "settings", name: "Ana", goal: 5, examDate: "2026-11-20" },
      {
        action: "mockResult",
        result: { id: "5f0c2a9e-1b3d-4e7f-8a6c-9d2e4f1b3a5c", ...result },
      },
      { action: "reset" },
    ]);
  });
});

describe("drafts", () => {
  it("saves a draft 800 ms after the last change, per question", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.draft("u2-w1", "Me");
    vi.advanceTimersByTime(500);
    c.draft("u2-w1", "Me llamo");
    c.draft("u3-w1", "Vivo");
    vi.advanceTimersByTime(799);
    expect(calls).toHaveLength(1);

    vi.advanceTimersByTime(1);
    vi.useRealTimers();
    const first = await call(1);

    expect(first.body).toEqual({ action: "draft", questionId: "u2-w1", text: "Me llamo" });
    first.reply(ok(snapshot({ imported: true })));
    expect((await call(2)).body).toEqual({ action: "draft", questionId: "u3-w1", text: "Vivo" });
  });

  it("sends waiting drafts at once when asked to", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.draft("u2-w1", "Me llamo");
    c.mockRun({ drafts: { prep: "notas" } });
    c.flushDrafts();
    expect(calls).toHaveLength(2);
    vi.advanceTimersByTime(800);
    vi.useRealTimers();
    const sent = await call(1);

    expect(sent.body).toEqual({ action: "draft", questionId: "u2-w1", text: "Me llamo" });
    sent.reply(ok(snapshot({ imported: true })));
    const mock = await call(2);

    expect(mock.body).toEqual({ action: "mockRun", run: { drafts: { prep: "notas" } } });
    mock.reply(ok(snapshot({ imported: true })));
    await settle();
    expect(calls).toHaveLength(3);
  });

  it("drops drafts still waiting when progress is reset", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.draft("u2-w1", "Me llamo");
    c.mockRun({ drafts: { prep: "notas" } });
    c.reset();
    vi.advanceTimersByTime(800);
    vi.useRealTimers();
    (await call(1)).reply(ok(snapshot({ imported: true })));
    await settle();

    expect(calls.map((c) => c.body?.action)).toEqual([undefined, "reset"]);
  });
});

describe("mock run", () => {
  const started = { stage: "run" as const, started: "2026-10-29T10:00:00.000Z", deadline: 1 };

  it("sends a change at once and the drafts together 800 ms after the last one", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.mockRun({ drafts: { w1: "Ho" } });
    vi.advanceTimersByTime(500);
    c.mockRun({ drafts: { w1: "Hola" } });
    c.mockRun({ drafts: { prep: "notas" }, answers: { r1: "a" }, section: 0, index: 1 });
    vi.advanceTimersByTime(799);

    expect(calls.map((call) => call.body)).toEqual([
      undefined,
      { action: "mockRun", run: { answers: { r1: "a" }, section: 0, index: 1 } },
    ]);

    vi.advanceTimersByTime(1);
    vi.useRealTimers();
    calls[1].reply(ok(snapshot({ imported: true })));

    expect((await call(2)).body).toEqual({
      action: "mockRun",
      run: { drafts: { w1: "Hola", prep: "notas" } },
    });
  });

  it("starts a new run in place of the old one and drops the old run's drafts", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.mockRun({ drafts: { w1: "Hola" } });
    c.newMockRun(started);
    vi.advanceTimersByTime(800);
    vi.useRealTimers();
    (await call(1)).reply(ok(snapshot({ imported: true })));
    await settle();

    expect(calls.map((call) => call.body)).toEqual([
      undefined,
      { action: "mockRun", run: started, replace: true },
    ]);
  });

  describe("kept in this browser", () => {
    const kept = '{"section":1,"index":2,"stage":"run","answers":{}}';
    const run = { ...started, section: 1, index: 2, answers: {}, drafts: {}, scores: {} };

    it("is posted once the server has no run, and kept under a backup key", async () => {
      localStorage.setItem("paso-mock-v1", kept);
      void client().load();
      (await call(0)).reply(ok(snapshot({ imported: true })));
      const post = await call(1);

      expect(post.body).toEqual({ action: "importMockRun", run: JSON.parse(kept) });
      expect(latest()).toBeUndefined();
      post.reply(ok(snapshot({ imported: true, mockRun: run })));

      await vi.waitFor(() =>
        expect(latest()).toEqual({
          snapshot: snapshot({ imported: true, mockRun: run }),
          problem: null,
        }),
      );

      expect(localStorage.getItem("paso-mock-v1")).toBeNull();
      expect(localStorage.getItem("paso-mock-v1-imported")).toBe(kept);
    });

    it("is left alone when the server has a run", async () => {
      localStorage.setItem("paso-mock-v1", kept);
      await loaded({ imported: true, mockRun: run });
      await settle();

      expect(calls).toHaveLength(1);
      expect(localStorage.getItem("paso-mock-v1")).toBe(kept);
    });

    it("is posted after the progress import", async () => {
      localStorage.setItem("paso-progress-v1", '{"version":1}');
      localStorage.setItem("paso-mock-v1", kept);
      void client().load();
      (await call(0)).reply(ok(snapshot()));
      (await call(1)).reply(ok({ ...snapshot({ imported: true }), importedNow: true }));
      (await call(2)).reply(ok(snapshot({ imported: true, mockRun: run })));
      await vi.waitFor(() => expect(latest()?.snapshot?.mockRun).toEqual(run));

      expect(calls.map((call) => call.body?.action)).toEqual([
        undefined,
        "import",
        "importMockRun",
      ]);

      expect(latest()?.snapshot).toEqual(snapshot({ imported: true, mockRun: run }));
    });
  });
});
