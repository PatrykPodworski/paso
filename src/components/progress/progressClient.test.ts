import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Attempt, ProgressSnapshot } from "../../data/types";
import { emptySnapshot } from "../../test/progress";
import { createProgressClient, RETRY_DELAYS, type ProgressState } from "./progressClient";

const LEARNER = "0b7e3c4a-2f6d-4a8e-9c1b-5d3f7e9a1c2b";

type Call = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | undefined;
  reply: (response: Response) => void;
  fail: () => void;
};

let calls: Call[];
let states: ProgressState[];
let clients: ReturnType<typeof createProgressClient>[];

const latest = () => states.at(-1);
const snapshot = (patch: Partial<ProgressSnapshot> = {}) => ({ ...emptySnapshot(), ...patch });
const ok = (body: object) => Response.json(body);

// Every request waits until the test answers it, so the order of requests is visible.
beforeEach(() => {
  calls = [];
  states = [];
  clients = [];
  localStorage.clear();
  // Each failed request is reported to the console.
  vi.spyOn(console, "error").mockImplementation(() => {});

  vi.stubGlobal(
    "fetch",
    vi.fn(
      (url: string, init: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
          expect(url).toMatch(/^\/api\/progress(\?result=[^&]+)?$/);

          calls.push({
            url,
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
  clients.forEach((c) => c.stop());
  vi.useRealTimers();
});

const client = () => {
  const c = createProgressClient(LEARNER, (state) => states.push(state));

  clients.push(c);

  return c;
};

const UNSENT = `paso-unsent-v1-${LEARNER}`;
const unsent = () => JSON.parse(localStorage.getItem(UNSENT) ?? "null");
const refuse = (c: Call, status = 400) => c.reply(Response.json({ error: "run" }, { status }));

const call = async (n: number) => {
  await vi.waitFor(() => expect(calls.length).toBeGreaterThan(n));

  return calls[n];
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

const loaded = async (patch: Partial<ProgressSnapshot> = {}) => {
  const c = client();

  void c.load();
  (await call(0)).reply(ok(snapshot(patch)));
  await vi.waitFor(() => expect(latest()?.snapshot ?? null).not.toBeNull());

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
  it("reads the snapshot with the learner id only", async () => {
    const c = client();

    void c.load();
    const get = await call(0);

    expect(get.method).toBe("GET");
    expect(get.headers).toEqual({ "x-learner-id": LEARNER });
    expect(latest()).toBeUndefined();
    get.reply(ok(snapshot({ name: "Bruno" })));

    await vi.waitFor(() =>
      expect(latest()).toEqual({
        snapshot: snapshot({ name: "Bruno" }),
        problem: null,
      }),
    );
  });

  it("sends no passcode when one is stored for the live talk", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: false, passcode: "olé" }));
    void client().load();

    expect((await call(0)).headers).toEqual({ "x-learner-id": LEARNER });
  });

  it("starts one request when asked to load twice", async () => {
    const c = client();

    void c.load();
    void c.load();
    (await call(0)).reply(ok(snapshot({ xp: 5 })));
    await vi.waitFor(() => expect(latest()?.snapshot?.xp).toBe(5));
    expect(calls).toHaveLength(1);
  });

  it.each([
    ["a server error", (c: Call) => c.reply(new Response("{}", { status: 500 }))],
    ["a rate limit", (c: Call) => c.reply(Response.json({ error: "rate" }, { status: 429 }))],
    ["a network error", (c: Call) => c.fail()],
    ["a body that is not JSON", (c: Call) => c.reply(new Response("<html>"))],
  ])("reports a failed load on %s, and Retry loads again", async (_, answer) => {
    const c = client();

    void c.load();
    answer(await call(0));
    await vi.waitFor(() => expect(latest()).toEqual({ snapshot: null, problem: "load" }));

    void c.retry();
    expect(latest()).toEqual({ snapshot: null, problem: null });
    (await call(1)).reply(ok(snapshot({ xp: 5 })));
    await vi.waitFor(() => expect(latest()?.snapshot?.xp).toBe(5));
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

    first.reply(ok(snapshot({ xp: 5 })));
    const second = await call(2);

    expect(latest()?.snapshot?.xp).toBe(5);

    expect(second.body).toEqual({
      action: "complete",
      lessonId: "u1-l1",
      score: 3,
      total: 4,
      at: "2026-10-29T11:00:00.000Z",
    });

    second.reply(ok(snapshot({ xp: 25 })));
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
    expect(latest()?.snapshot).toEqual(snapshot());

    void c.retry();
    const resent = await call(2);

    expect(resent.body).toEqual({ action: "attempt", attempt, timeZone: "Europe/Madrid" });
    resent.reply(ok(snapshot({ xp: 5 })));
    expect((await call(3)).body).toEqual({ action: "check", checkId: "visa", done: true });
  });

  it("sends the body of each action", async () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue("5f0c2a9e-1b3d-4e7f-8a6c-9d2e4f1b3a5c");
    const c = await loaded();
    const review = { level: 1, nextAt: "2026-10-30T10:00:00.000Z" };

    const result = {
      at: "2026-10-29T10:00:00.000Z",
      sections: [0, 1, 2, 3],
      reading: 20,
      listening: 18,
    };

    c.vocabulary({ casa: review });
    c.check("visa", false);
    c.settings({ name: "Bruno", goal: 5, examDate: "2026-11-20" });
    c.mockResult(result);
    c.reset();

    const bodies = [];

    for (let n = 1; n <= 5; n++) {
      const next = await call(n);

      bodies.push(next.body);
      next.reply(ok(snapshot()));
    }

    expect(bodies).toEqual([
      { action: "vocabulary", reviews: { casa: review } },
      { action: "check", checkId: "visa", done: false },
      { action: "settings", name: "Bruno", goal: 5, examDate: "2026-11-20" },
      {
        action: "mockResult",
        result: { id: "5f0c2a9e-1b3d-4e7f-8a6c-9d2e4f1b3a5c", ...result },
      },
      { action: "reset" },
    ]);
  });
});

describe("failed writes", () => {
  const check = { action: "check", checkId: "visa", done: true };

  it.each([
    ["a network error", (c: Call) => c.fail()],
    ["a server error", (c: Call) => c.reply(new Response("{}", { status: 503 }))],
    ["a rate limit", (c: Call) => refuse(c, 429)],
    ["a timeout", (c: Call) => refuse(c, 408)],
  ])("sends a write again by itself after %s, with longer waits", async (_, answer) => {
    const c = await loaded();

    vi.useFakeTimers();
    c.check("visa", true);

    for (const [n, delay] of RETRY_DELAYS.entries()) {
      answer(calls[n + 1]);
      await vi.advanceTimersByTimeAsync(delay - 1);
      expect(calls).toHaveLength(n + 2);
      await vi.advanceTimersByTimeAsync(1);
      expect(calls[n + 2].body).toEqual(check);
    }

    calls.at(-1)!.reply(ok(snapshot({ checks: ["visa"] })));
    await vi.advanceTimersByTimeAsync(0);

    expect(latest()).toEqual({ snapshot: snapshot({ checks: ["visa"] }), problem: null });
  });

  it("keeps waiting the longest delay between later tries", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.check("visa", true);

    for (const delay of [...RETRY_DELAYS, 30000, 30000]) {
      calls.at(-1)!.fail();
      await vi.advanceTimersByTimeAsync(delay);
    }

    expect(calls).toHaveLength(RETRY_DELAYS.length + 4);
  });

  it("sends a failed write at once when the browser is back online", async () => {
    const c = await loaded();

    c.check("visa", true);
    (await call(1)).fail();
    await vi.waitFor(() => expect(latest()?.problem).toBe("save"));
    window.dispatchEvent(new Event("online"));

    expect((await call(2)).body).toEqual(check);
  });

  it("drops a write the server refuses, says so, and sends the writes behind it", async () => {
    const c = await loaded();

    c.check("visa", true);
    c.attempt(attempt);
    refuse(await call(1));

    const next = await call(2);

    expect(next.body?.action).toBe("attempt");
    expect(latest()?.problem).toBe("refused");
    next.reply(ok(snapshot({ xp: 5 })));
    await vi.waitFor(() => expect(latest()?.snapshot?.xp).toBe(5));
    expect(latest()?.problem).toBe("refused");
    expect(unsent()).toBeNull();
  });

  it("closes the dialog on Continue and does not open it again for background tries", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.check("visa", true);
    calls[1].fail();
    await vi.advanceTimersByTimeAsync(0);
    expect(latest()?.problem).toBe("save");

    c.dismiss();
    expect(latest()?.problem).toBeNull();
    await vi.advanceTimersByTimeAsync(RETRY_DELAYS[0]);
    calls[2].fail();
    await vi.advanceTimersByTimeAsync(0);
    expect(latest()?.problem).toBeNull();

    // Once everything is saved, the next failure opens it again.
    await vi.advanceTimersByTimeAsync(RETRY_DELAYS[1]);
    calls[3].reply(ok(snapshot()));
    await vi.advanceTimersByTimeAsync(0);
    c.attempt(attempt);
    calls[4].fail();
    await vi.advanceTimersByTimeAsync(0);

    expect(latest()?.problem).toBe("save");
  });

  it("closes the dialog once a try in the background saves the write", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.check("visa", true);
    calls[1].fail();
    await vi.advanceTimersByTimeAsync(RETRY_DELAYS[0]);
    calls[2].reply(ok(snapshot()));
    await vi.advanceTimersByTimeAsync(0);

    expect(latest()?.problem).toBeNull();
  });

  it("keeps unsent writes on this device while a write fails, and forgets them once saved", async () => {
    const c = await loaded();

    c.check("visa", true);
    expect(unsent()).toBeNull();
    (await call(1)).fail();
    await vi.waitFor(() => expect(unsent()).toEqual([check]));
    c.attempt(attempt);

    const both = [check, { action: "attempt", attempt, timeZone: "Europe/Madrid" }];

    expect(unsent()).toEqual(both);
    void c.retry();
    (await call(2)).reply(ok(snapshot()));
    await vi.waitFor(() => expect(unsent()).toEqual(both.slice(1)));
    (await call(3)).reply(ok(snapshot()));
    await vi.waitFor(() => expect(unsent()).toBeNull());
  });

  it("sends the writes kept from an earlier visit before it shows progress", async () => {
    localStorage.setItem(UNSENT, JSON.stringify([check, { action: "reset" }]));
    void client().load();

    (await call(0)).reply(ok(snapshot({ checks: ["visa"] })));
    expect((await call(1)).body).toEqual({ action: "reset" });
    expect(latest()).toBeUndefined();
    expect(unsent()).toEqual([{ action: "reset" }]);
    calls[1].reply(ok(snapshot({ xp: 0 })));
    (await call(2)).reply(ok(snapshot({ name: "Bruno" })));

    await vi.waitFor(() => expect(latest()?.snapshot?.name).toBe("Bruno"));
    expect(calls.map((c) => c.method)).toEqual(["POST", "POST", "GET"]);
    expect(unsent()).toBeNull();
  });

  it("drops a kept write the server refuses on load, and fails the load on a failed one", async () => {
    localStorage.setItem(UNSENT, JSON.stringify([check, { action: "reset" }]));
    const c = client();

    void c.load();
    refuse(await call(0));
    (await call(1)).fail();
    await vi.waitFor(() => expect(latest()).toEqual({ snapshot: null, problem: "load" }));
    expect(unsent()).toEqual([{ action: "reset" }]);

    void c.retry();
    expect((await call(2)).body).toEqual({ action: "reset" });
  });

  it("ignores kept writes it cannot read", async () => {
    localStorage.setItem(UNSENT, "{not json");
    void client().load();

    expect((await call(0)).method).toBe("GET");
  });

  it("reports each failed request to the console", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const c = await loaded();

    c.check("visa", true);
    refuse(await call(1), 413);

    await vi.waitFor(() =>
      expect(log).toHaveBeenCalledWith("Progress save refused", { action: "check", status: 413 }),
    );
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
    first.reply(ok(snapshot()));
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
    sent.reply(ok(snapshot()));
    const mock = await call(2);

    expect(mock.body).toEqual({ action: "mockRun", run: { drafts: { prep: "notas" } } });
    mock.reply(ok(snapshot()));
    await settle();
    expect(calls).toHaveLength(3);
  });

  it("shows a sent draft until its own response arrives", async () => {
    const c = await loaded({ drafts: { "u2-w1": "Hola" } });

    c.attempt(attempt);
    c.draft("u2-w1", "Me llamo");
    c.flushDrafts();
    expect(latest()?.snapshot?.drafts).toEqual({ "u2-w1": "Me llamo" });

    (await call(1)).reply(ok(snapshot({ drafts: { "u2-w1": "Hola" } })));
    const draft = await call(2);

    expect(latest()?.snapshot?.drafts).toEqual({ "u2-w1": "Me llamo" });
    expect(latest()?.snapshot?.recent).toEqual([]);

    draft.reply(ok(snapshot({ drafts: { "u2-w1": "Me llamo Bruno" } })));
    await settle();
    expect(latest()?.snapshot?.drafts).toEqual({ "u2-w1": "Me llamo Bruno" });
  });

  it("keeps showing the newer draft when the response to an older one arrives", async () => {
    const c = await loaded({ drafts: { "u2-w1": "Hola" } });

    c.draft("u2-w1", "Me");
    c.flushDrafts();
    c.draft("u2-w1", "Me llamo");
    c.flushDrafts();
    (await call(1)).reply(ok(snapshot({ drafts: { "u2-w1": "Me" } })));
    await call(2);

    expect(latest()?.snapshot?.drafts).toEqual({ "u2-w1": "Me llamo" });
  });

  it("keeps showing a sent draft while its request waits for a retry", async () => {
    const c = await loaded({ drafts: { "u2-w1": "Hola" } });

    c.draft("u2-w1", "Me llamo");
    c.flushDrafts();
    (await call(1)).fail();
    await vi.waitFor(() => expect(latest()?.problem).toBe("save"));

    expect(latest()?.snapshot?.drafts).toEqual({ "u2-w1": "Me llamo" });
  });

  it("drops drafts still waiting when progress is reset", async () => {
    const c = await loaded();

    vi.useFakeTimers();
    c.draft("u2-w1", "Me llamo");
    c.mockRun({ drafts: { prep: "notas" } });
    c.reset();
    vi.advanceTimersByTime(800);
    vi.useRealTimers();
    (await call(1)).reply(ok(snapshot()));
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
    calls[1].reply(ok(snapshot()));

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
    (await call(1)).reply(ok(snapshot()));
    await settle();

    expect(calls.map((call) => call.body)).toEqual([
      undefined,
      { action: "mockRun", run: started, replace: true },
    ]);
  });
});

describe("mock result responses", () => {
  const responses = {
    started: "2026-10-29T10:00:00.000Z",
    items: [{ section: 2, questionId: "mock-w1", variantId: "w1-v1", status: "empty", text: "" }],
  };

  it("reads one result's responses with the learner id, outside the write queue", async () => {
    const c = await loaded();

    c.check("passport", true);
    const read = c.mockResponses("a b");
    const get = await call(2);

    expect([get.url, get.method, get.headers]).toEqual([
      "/api/progress?result=a%20b",
      "GET",
      { "x-learner-id": LEARNER },
    ]);

    get.reply(ok({ responses }));

    expect(await read).toEqual(responses);
  });

  it("returns null for a result without responses", async () => {
    const c = client();
    const read = c.mockResponses("old");

    (await call(0)).reply(ok({ responses: null }));

    expect(await read).toBeNull();
  });

  it("rejects when the read fails, and leaves the snapshot and its problem alone", async () => {
    const c = await loaded({ name: "Bruno" });
    const refused = c.mockResponses("m");

    (await call(1)).reply(Response.json({ error: "result" }, { status: 400 }));
    await expect(refused).rejects.toThrow("Responses not loaded: 400");

    const offline = c.mockResponses("m");

    (await call(2)).fail();
    await expect(offline).rejects.toThrow("Failed to fetch");
    expect(latest()).toEqual({ snapshot: snapshot({ name: "Bruno" }), problem: null });
  });
});
