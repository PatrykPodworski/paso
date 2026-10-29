// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Attempt, ProgressSnapshot } from "../src/data/types.ts";

const store = vi.hoisted(() => new Map<string, unknown>());

vi.mock("@vercel/functions", () => ({
  getCache: () => ({
    get: async (key: string) => store.get(key) ?? null,
    set: async (key: string, value: unknown) => {
      store.set(key, value);
    },
  }),
  ipAddress: (request: Request) => request.headers.get("x-real-ip") ?? undefined,
}));

const { GET, POST, handleProgress } = await import("./progress.ts");
const { passcodeRefusal } = await import("./_lib/passcode.ts");
const { pgliteDb } = await import("../db/pglite.ts");

const db = await pgliteDb();
const PASSCODE = "ole-2026";
const T = "2026-09-09T12:00:00.000Z";

const EMPTY: ProgressSnapshot = {
  name: "",
  goal: 10,
  examDate: "",
  xp: 0,
  imported: false,
  completed: {},
  questions: {},
  vocabularyReviews: {},
  checks: [],
  mockResults: [],
  drafts: {},
  recent: [],
  days: [],
  mockRun: null,
};

const learner = () => crypto.randomUUID();

const request = (id: string, body?: unknown, headers: Record<string, string> = {}) =>
  new Request("https://paso.podwor.ski/api/progress", {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "content-type": "application/json",
      "x-learner-id": id,
      "x-passcode": PASSCODE,
      "x-real-ip": "203.0.113.7",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const send = (id: string, body?: unknown, headers?: Record<string, string>) =>
  handleProgress(request(id, body, headers), db, passcodeRefusal);

const snapshot = async (id: string, body?: unknown) => {
  const response = await send(id, body);

  expect(response.status).toBe(200);

  return (await response.json()) as ProgressSnapshot & { importedNow?: boolean };
};

const attempt = (patch: Partial<Attempt> = {}): Attempt => ({
  id: "a1",
  questionId: "u1-v0",
  skill: "reading",
  correct: true,
  answer: "hola",
  at: T,
  ...patch,
});

const answer = (id: string, patch: Partial<Attempt> = {}, timeZone = "Europe/Warsaw") =>
  snapshot(id, { action: "attempt", attempt: attempt(patch), timeZone });

const importing = (id: string, progress: unknown, timeZone = "Europe/Warsaw") =>
  snapshot(id, { action: "import", progress, timeZone });

beforeEach(() => {
  store.clear();
  vi.stubEnv("PASSCODE", PASSCODE);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("reading progress", () => {
  it("gives a learner without rows the empty snapshot", async () => {
    expect(await snapshot(learner())).toEqual(EMPTY);
  });

  it("shows each learner only their own progress", async () => {
    const ana = learner();

    await answer(ana);

    expect((await snapshot(ana)).xp).toBe(5);
    expect(await snapshot(learner())).toEqual(EMPTY);
  });
});

describe("attempts", () => {
  it("stores an attempt once however often its id is sent, with +5 XP once", async () => {
    const me = learner();

    await answer(me);

    expect(await answer(me)).toEqual({
      ...EMPTY,
      xp: 5,
      questions: {
        "u1-v0": { skill: "reading", at: T, correct: true, answer: "hola", inMistakes: false },
      },
      recent: [attempt()],
      days: ["2026-09-09"],
    });
  });

  it("gives +5 XP for each new question and nothing for another try", async () => {
    const me = learner();

    await answer(me, { id: "a1" });
    await answer(me, { id: "a2", correct: false });

    expect((await answer(me, { id: "a3", questionId: "u1-v1" })).xp).toBe(10);
  });

  it("keeps the previous attempt per question with its help and live grade", async () => {
    const me = learner();

    await answer(me, { id: "a1", answer: "first" });

    const p = await answer(me, {
      id: "a2",
      skill: "speaking",
      answer: "second",
      at: "2026-09-10T08:00:00.000Z",
      assisted: true,
      grade: "good",
    });

    expect(p.questions["u1-v0"]).toEqual({
      skill: "speaking",
      at: "2026-09-10T08:00:00.000Z",
      correct: true,
      answer: "second",
      assisted: true,
      grade: "good",
      inMistakes: false,
    });
  });
});

describe("the mistake and review rules", () => {
  it("puts a wrong answer in the mistakes, due at once", async () => {
    const p = await answer(learner(), { correct: false });

    expect(p.questions["u1-v0"]).toMatchObject({
      inMistakes: true,
      review: { level: 0, nextAt: T },
    });
  });

  it("schedules a legacy mistake that has no review metadata after a correct answer", async () => {
    const me = learner();

    await importing(me, {
      attempts: [attempt({ id: "old", correct: false, at: "2026-09-08T12:00:00.000Z" })],
      mistakes: ["u1-v0"],
    });

    const p = await answer(me);

    expect(p.questions["u1-v0"]).toMatchObject({
      inMistakes: false,
      review: { level: 1, nextAt: "2026-09-10T12:00:00.000Z" },
    });
  });

  it("does not turn writing and speaking self-review into a mistake", async () => {
    const p = await answer(learner(), { skill: "speaking", correct: null, questionId: "u1-o3" });

    expect(p.questions["u1-o3"]).toEqual({
      skill: "speaking",
      at: T,
      correct: null,
      answer: "hola",
      inMistakes: false,
    });
  });

  it("clears a failed live talk on its first pass without spaced returns", async () => {
    const me = learner();
    const talk = { questionId: "u1-o3", skill: "speaking" as const };

    await answer(me, { ...talk, id: "a1", correct: false, grade: "bad" });

    const p = await answer(me, { ...talk, id: "a2", correct: true, grade: "good" });

    expect(p.questions["u1-o3"]).toMatchObject({ inMistakes: false });
    expect(p.questions["u1-o3"].review).toBeUndefined();
    expect(p.questions["u1-o3"].grade).toBe("good");
  });

  it("schedules only the question actually missed and keeps other cards untouched", async () => {
    const me = learner();

    await answer(me, { id: "a1", questionId: "u1-o1", correct: false });
    await answer(me, { id: "a2", questionId: "u1-o1" });
    await answer(me, { id: "a3", questionId: "u1-v1" });

    const p = await answer(me, { id: "a4", correct: false, at: "2026-09-11T09:00:00.000Z" });

    expect(p.questions["u1-o1"]).toMatchObject({
      inMistakes: false,
      review: { level: 1, nextAt: "2026-09-10T12:00:00.000Z" },
    });

    expect(p.questions["u1-v0"]).toMatchObject({
      inMistakes: true,
      review: { level: 0, nextAt: "2026-09-11T09:00:00.000Z" },
    });

    expect(p.questions["u1-v1"]).toMatchObject({ inMistakes: false });
    expect(p.questions["u1-v1"].review).toBeUndefined();
  });

  it("keeps one mistake, and only an unassisted correct answer recovers it", async () => {
    const me = learner();

    await answer(me, { id: "a1", correct: false });
    await answer(me, { id: "a2", correct: false });

    for (const [id, patch] of [
      ["a3", { correct: null }],
      ["a4", { correct: true, assisted: true }],
    ] as const) {
      expect((await answer(me, { id, ...patch })).questions["u1-v0"]).toMatchObject({
        inMistakes: true,
        review: { level: 0, nextAt: T },
      });
    }

    expect((await answer(me, { id: "a5" })).questions["u1-v0"]).toMatchObject({
      inMistakes: false,
      review: { level: 1, nextAt: "2026-09-10T12:00:00.000Z" },
    });

    expect((await answer(me, { id: "a6", correct: false })).questions["u1-v0"]).toMatchObject({
      inMistakes: true,
      review: { level: 0, nextAt: T },
    });
  });

  it("steps through the review windows and stops at the longest", async () => {
    const me = learner();
    const reviews = [];

    await answer(me, { id: "wrong", correct: false });

    for (const id of ["r1", "r2", "r3", "r4", "r5", "r6"]) {
      reviews.push((await answer(me, { id })).questions["u1-v0"].review);
    }

    expect(reviews).toEqual([
      { level: 1, nextAt: "2026-09-10T12:00:00.000Z" },
      { level: 2, nextAt: "2026-09-12T12:00:00.000Z" },
      { level: 3, nextAt: "2026-09-16T12:00:00.000Z" },
      { level: 4, nextAt: "2026-09-23T12:00:00.000Z" },
      { level: 5, nextAt: "2026-10-09T12:00:00.000Z" },
      { level: 5, nextAt: "2026-10-09T12:00:00.000Z" },
    ]);
  });
});

describe("recent attempts and study days", () => {
  it("lists the last 20 attempts, newest first", async () => {
    const me = learner();

    for (let i = 0; i < 25; i++) {
      await answer(me, { id: `a${i}`, at: new Date(Date.UTC(2026, 8, 1, 12, i)).toISOString() });
    }

    const { recent } = await snapshot(me);

    expect(recent.map((a) => a.id)).toEqual(Array.from({ length: 20 }, (_, i) => `a${24 - i}`));
  });

  it("counts the day in the learner's time zone, and in UTC when the zone is unusable", async () => {
    const late = { at: "2026-09-08T22:30:00.000Z" };

    expect((await answer(learner(), late, "Europe/Warsaw")).days).toEqual(["2026-09-09"]);
    expect((await answer(learner(), late, "Mars/Olympus")).days).toEqual(["2026-09-08"]);
    expect((await answer(learner(), late, "+02:00")).days).toEqual(["2026-09-08"]);

    const me = learner();

    await answer(me, { id: "a1", at: "2026-09-07T10:00:00.000Z" }, "UTC");
    await answer(me, { id: "a2", at: "2026-09-09T10:00:00.000Z" }, "UTC");

    expect((await answer(me, { id: "a3", at: "2026-09-09T11:00:00.000Z" }, "UTC")).days).toEqual([
      "2026-09-09",
      "2026-09-07",
    ]);
  });

  it("returns at most the newest 400 study days", async () => {
    const attempts = Array.from({ length: 401 }, (_, i) =>
      attempt({ id: `a${i}`, at: new Date(Date.UTC(2025, 0, 1 + i, 12)).toISOString() }),
    );

    const { days } = await importing(learner(), { attempts }, "UTC");

    expect(days).toHaveLength(400);
    expect([days[0], days[399]]).toEqual(["2026-02-05", "2025-01-02"]);
  });
});

describe("lessons, drafts, vocabulary, checks, settings and mock results", () => {
  it("gives +20 XP for a first completion and keeps the latest score without more XP", async () => {
    const me = learner();

    await snapshot(me, { action: "complete", lessonId: "u1-l1", score: 3, total: 5, at: T });

    const p = await snapshot(me, {
      action: "complete",
      lessonId: "u1-l1",
      score: 5,
      total: 5,
      at: "2026-09-10T12:00:00.000Z",
    });

    expect(p.xp).toBe(20);

    expect(p.completed).toEqual({
      "u1-l1": { score: 5, total: 5, at: "2026-09-10T12:00:00.000Z" },
    });
  });

  it("saves a draft, replaces it, and deletes it when emptied", async () => {
    const me = learner();
    const draft = (text: string) => snapshot(me, { action: "draft", questionId: "u1-w1", text });

    expect((await draft("Hola")).drafts).toEqual({ "u1-w1": "Hola" });
    expect((await draft("Hola, me llamo Ana")).drafts).toEqual({ "u1-w1": "Hola, me llamo Ana" });
    expect((await draft("")).drafts).toEqual({});
  });

  it("saves vocabulary reviews one at a time or as a batch", async () => {
    const me = learner();
    const added = { level: 0, nextAt: T };

    await snapshot(me, { action: "vocabulary", reviews: { casa: added, perro: added } });

    const p = await snapshot(me, {
      action: "vocabulary",
      reviews: { casa: { level: 1, nextAt: "2026-09-10T12:00:00.000Z", reviewedAt: T } },
    });

    expect(p.vocabularyReviews).toEqual({
      casa: { level: 1, nextAt: "2026-09-10T12:00:00.000Z", reviewedAt: T },
      perro: added,
    });
  });

  it("sets a guide check, so sending it twice does not flip it back", async () => {
    const me = learner();

    const check = (checkId: string, done: boolean) =>
      snapshot(me, { action: "check", checkId, done });

    await check("passport", true);
    await check("passport", true);
    expect((await check("photo", true)).checks).toEqual(["passport", "photo"]);
    expect((await check("passport", false)).checks).toEqual(["photo"]);
  });

  it("saves the learner's settings", async () => {
    const p = await snapshot(learner(), {
      action: "settings",
      name: "Ana",
      goal: 20,
      examDate: "2026-11-20",
    });

    expect([p.name, p.goal, p.examDate]).toEqual(["Ana", 20, "2026-11-20"]);
  });

  it("stores a mock result once per id, oldest first", async () => {
    const me = learner();
    const first = { id: "m1", at: "2026-09-10T12:00:00.000Z", reading: 18, listening: 20 };
    const second = { id: "m0", at: T, reading: 10, listening: 12, writing: 15, speaking: 14 };

    await snapshot(me, { action: "mockResult", result: first });
    await snapshot(me, { action: "mockResult", result: first });

    expect((await snapshot(me, { action: "mockResult", result: second })).mockResults).toEqual([
      second,
      first,
    ]);
  });

  it("resets every row of the learner and nobody else's", async () => {
    const [me, other] = [learner(), learner()];

    for (const id of [me, other]) {
      await answer(id);
      await snapshot(id, { action: "complete", lessonId: "u1-l1", score: 3, total: 5, at: T });
      await snapshot(id, { action: "draft", questionId: "u1-w1", text: "Hola" });
      await snapshot(id, { action: "vocabulary", reviews: { casa: { level: 0, nextAt: T } } });
      await snapshot(id, { action: "check", checkId: "passport", done: true });
      await snapshot(id, { action: "settings", name: "Ana", goal: 5, examDate: "" });

      await snapshot(id, {
        action: "mockResult",
        result: { id: "m1", at: T, reading: 1, listening: 2 },
      });

      await snapshot(id, { action: "mockRun", run: { answers: { q1: "a" } } });
    }

    await importing(me, {});

    expect(await snapshot(me, { action: "reset" })).toEqual(EMPTY);
    expect((await snapshot(other)).xp).toBe(25);
  });
});

describe("the mock exam run", () => {
  const FRESH = {
    section: 0,
    index: 0,
    stage: "intro",
    answers: {},
    deadline: 0,
    started: "",
    drafts: {},
    scores: {},
  };

  const DEADLINE = Date.parse(T) + 45 * 60000;
  const started = { stage: "run", started: T, deadline: DEADLINE };

  const change = async (id: string, run: unknown, replace?: boolean) =>
    (await snapshot(id, { action: "mockRun", run, replace })).mockRun;

  it("starts a run from the defaults and merges answers, drafts and scores per key", async () => {
    const me = learner();

    expect(await change(me, started, true)).toEqual({ ...FRESH, ...started });
    await change(me, { answers: { r1: "b" }, section: 0, index: 1 });
    await change(me, { drafts: { w1: "Hola" }, scores: { writing: "12" } });
    await change(me, { answers: { r2: "c" }, drafts: { prep: "" } });

    expect(await change(me, { scores: { speaking: "14.5" }, section: 1, index: 0 })).toEqual({
      ...FRESH,
      ...started,
      section: 1,
      answers: { r1: "b", r2: "c" },
      drafts: { w1: "Hola", prep: "" },
      scores: { writing: "12", speaking: "14.5" },
    });
  });

  it("keeps the answers another tab saved while this tab moves on", async () => {
    const me = learner();

    await change(me, started, true);
    await change(me, { answers: { r1: "a" }, section: 0, index: 1 });

    expect(await change(me, { answers: { r5: "c" }, section: 0, index: 5 })).toMatchObject({
      index: 5,
      answers: { r1: "a", r5: "c" },
    });
  });

  it("starts from the defaults when a change arrives without a run", async () => {
    expect(await change(learner(), { answers: { r1: "a" } })).toEqual({
      ...FRESH,
      answers: { r1: "a" },
    });
  });

  it("replaces the run and its answers when a new one starts", async () => {
    const me = learner();

    await change(me, { ...started, answers: { r1: "a" }, scores: { writing: "3" } }, true);

    expect(await change(me, {}, true)).toEqual(FRESH);
  });

  describe("kept in the browser", () => {
    const kept = { section: 1, index: 2, stage: "run", answers: { r1: "a" }, deadline: DEADLINE };

    const importing = async (id: string, run: unknown) =>
      (await snapshot(id, { action: "importMockRun", run })).mockRun;

    it("imports it once, filling the fields older saves lack", async () => {
      const me = learner();

      expect(await importing(me, kept)).toEqual({ ...FRESH, ...kept });
      expect(await importing(me, { ...kept, section: 2, index: 0 })).toEqual({ ...FRESH, ...kept });
    });

    it("does not replace a run the server already has", async () => {
      const me = learner();

      await change(me, started, true);

      expect(await importing(me, kept)).toEqual({ ...FRESH, ...started });
    });

    it("drops the malformed parts of a run", async () => {
      expect(
        await importing(learner(), {
          ...kept,
          answers: { r1: "a", r2: 5, ["x".repeat(65)]: "b" },
          drafts: null,
          deadline: "soon",
          started: "today",
          scores: { writing: "7", reading: "3" },
          extra: true,
        }),
      ).toEqual({ ...FRESH, ...kept, deadline: 0, scores: { writing: "7" } });
    });

    it.each([
      ["not a run", "saved mock"],
      ["no run", null],
      ["a section out of range", { ...kept, section: 4 }],
      ["a question outside its section", { ...kept, section: 3, index: 3 }],
      ["an index that is not whole", { ...kept, index: 0.5 }],
      ["an unknown stage", { ...kept, stage: "unknown" }],
      ["answers that are not a record", { ...kept, answers: null }],
    ])("imports nothing from %s", async (_, run) => {
      expect(await importing(learner(), run)).toBeNull();
    });
  });
});

describe("importing legacy progress", () => {
  const legacy = {
    version: 1,
    name: "Ana",
    goal: 20,
    examDate: "2026-11-20",
    completed: { "u1-l1": { score: 4, total: 5, at: T } },
    attempts: [
      attempt({ id: "x1", questionId: "q1", correct: true, at: "2026-09-08T12:00:00.000Z" }),
      attempt({ id: "x2", questionId: "q1", correct: false, answer: "adiós" }),
      attempt({ id: "x3", questionId: "q2", skill: "writing", correct: null, answer: "Me llamo" }),
    ],
    mistakes: ["q1"],
    reviewed: ["q2"],
    mistakeReviews: {
      q1: { level: 0, nextAt: T },
      q2: { level: 2, nextAt: "2026-09-12T12:00:00.000Z" },
    },
    vocabularyReviews: { casa: { level: 1, nextAt: T, reviewedAt: T } },
    checks: ["passport"],
    mockResults: [{ at: T, reading: 18, listening: 20 }],
    drafts: { "u1-w1": "Hola" },
  };

  it("imports the document once and recomputes XP", async () => {
    const me = learner();
    const p = await importing(me, legacy);

    expect(p).toEqual({
      name: "Ana",
      goal: 20,
      examDate: "2026-11-20",
      xp: 30,
      imported: true,
      importedNow: true,
      completed: legacy.completed,
      questions: {
        q1: {
          skill: "reading",
          at: T,
          correct: false,
          answer: "adiós",
          inMistakes: true,
          review: { level: 0, nextAt: T },
        },
        q2: {
          skill: "writing",
          at: T,
          correct: null,
          answer: "Me llamo",
          inMistakes: false,
          review: { level: 2, nextAt: "2026-09-12T12:00:00.000Z" },
        },
      },
      vocabularyReviews: legacy.vocabularyReviews,
      checks: ["passport"],
      mockResults: [
        { id: expect.stringMatching(/^legacy-[0-9a-f]{32}$/), ...legacy.mockResults[0] },
      ],
      drafts: { "u1-w1": "Hola" },
      recent: [legacy.attempts[2], legacy.attempts[1], legacy.attempts[0]],
      days: ["2026-09-09", "2026-09-08"],
      mockRun: null,
    });

    const again = await importing(me, {
      ...legacy,
      name: "Eva",
      attempts: [attempt({ id: "x4" })],
    });

    const { importedNow, ...rest } = p;

    expect(importedNow).toBe(true);
    expect(again).toEqual({ ...rest, importedNow: false });
  });

  it("drops only the malformed fields and attempts of a document", async () => {
    const valid = attempt({ id: "ok" });

    const p = await importing(learner(), {
      name: 42,
      goal: 7,
      examDate: "soon",
      completed: "all of them",
      attempts: [
        valid,
        null,
        { ...valid, id: "no-question", questionId: 5 },
        { ...valid, id: "long", answer: "a".repeat(4001) },
        { ...valid, id: "bad-skill", skill: "dancing" },
        { ...valid, id: "bad-date", at: "yesterday" },
        { ...valid, id: "nul", answer: "a\0b" },
        { ...valid, id: "far", at: "2026-09-09T12:00:00+20:00" },
      ],
      mistakes: "u1-v0",
      mistakeReviews: { "u1-v0": { level: "high", nextAt: T } },
      vocabularyReviews: {
        casa: { level: 9, nextAt: T },
        "ga\0to": { level: 0, nextAt: T },
        perro: { level: 0, nextAt: T },
      },
      checks: [1, "passport"],
      mockResults: [{ at: T, reading: "many", listening: 20 }],
      drafts: { "u1-w1": 5, "u1-w2": "Hola", "u1-w3": "Hola \uD83D" },
    });

    expect(p).toEqual({
      ...EMPTY,
      xp: 5,
      imported: true,
      importedNow: true,
      questions: {
        "u1-v0": { skill: "reading", at: T, correct: true, answer: "hola", inMistakes: false },
      },
      vocabularyReviews: { perro: { level: 0, nextAt: T } },
      checks: ["passport"],
      drafts: { "u1-w2": "Hola" },
      recent: [valid],
      days: ["2026-09-09"],
    });
  });

  it("keeps the learner's own rows where the document overlaps them", async () => {
    const me = learner();

    await answer(me);
    await snapshot(me, { action: "complete", lessonId: "u1-l1", score: 4, total: 5, at: T });
    await snapshot(me, { action: "draft", questionId: "u1-w1", text: "Mine" });

    const added = attempt({
      id: "x2",
      questionId: "u1-v1",
      correct: false,
      answer: "no",
      at: "2026-09-09T11:00:00.000Z",
    });

    const p = await importing(me, {
      completed: { "u1-l1": { score: 1, total: 5, at: "2026-09-08T12:00:00.000Z" } },
      attempts: [attempt({ correct: false, answer: "otro" }), added],
      drafts: { "u1-w1": "Theirs" },
    });

    expect(p).toEqual({
      ...EMPTY,
      xp: 30,
      imported: true,
      importedNow: true,
      completed: { "u1-l1": { score: 4, total: 5, at: T } },
      questions: {
        "u1-v0": { skill: "reading", at: T, correct: true, answer: "hola", inMistakes: false },
        "u1-v1": {
          skill: "reading",
          at: added.at,
          correct: false,
          answer: "no",
          inMistakes: false,
        },
      },
      drafts: { "u1-w1": "Mine" },
      recent: [attempt(), added],
      days: ["2026-09-09"],
    });
  });

  it.each([["not progress"], [null], [[1, 2]]])(
    "imports %j as empty progress and still marks the import done",
    async (progress) => {
      expect(await importing(learner(), progress)).toEqual({
        ...EMPTY,
        imported: true,
        importedNow: true,
      });
    },
  );

  it("gives an attempt without an id the same id on every import", async () => {
    const { id: _, ...noId } = attempt();
    const doc = { attempts: [noId, { ...noId, at: "2026-09-10T12:00:00.000Z" }] };
    const ids = async () => (await importing(learner(), doc)).recent.map((a) => a.id);
    const first = await ids();

    expect(first).toEqual([
      expect.stringMatching(/^legacy-[0-9a-f]{32}$/),
      expect.stringMatching(/^legacy-[0-9a-f]{32}$/),
    ]);

    expect(new Set(first).size).toBe(2);
    expect(await ids()).toEqual(first);
  });
});

describe("requests", () => {
  const me = "8c4b3a8e-6f0e-4d0b-9a57-2f4c3f1d0b6a";
  const long = "x".repeat(65);
  const ok = { at: T, reading: 1, listening: 2 };

  it.each([
    ["the learner id", "not-a-uuid", undefined, "learner"],
    ["the action", me, { action: "fly" }, "action"],
    [
      "an attempt with a long id",
      me,
      { action: "attempt", attempt: attempt({ id: long }) },
      "attempt",
    ],
    [
      "an attempt with a long answer",
      me,
      { action: "attempt", attempt: attempt({ answer: "a".repeat(4001) }) },
      "attempt",
    ],
    [
      "an attempt at no date",
      me,
      { action: "attempt", attempt: attempt({ at: "today" }) },
      "attempt",
    ],
    [
      "an attempt on a day that does not exist",
      me,
      { action: "attempt", attempt: attempt({ at: "2026-02-30T10:00:00.000Z" }) },
      "attempt",
    ],
    [
      "an attempt in no skill",
      me,
      { action: "attempt", attempt: { ...attempt(), skill: "art" } },
      "attempt",
    ],
    [
      "an attempt with no grade",
      me,
      { action: "attempt", attempt: { ...attempt(), grade: "A" } },
      "attempt",
    ],
    [
      "a lesson id",
      me,
      { action: "complete", lessonId: "", score: 1, total: 2, at: T },
      "lessonId",
    ],
    ["a score", me, { action: "complete", lessonId: "l", score: 3, total: 2, at: T }, "score"],
    ["a total", me, { action: "complete", lessonId: "l", score: 0, total: 0, at: T }, "total"],
    [
      "a completion date",
      me,
      { action: "complete", lessonId: "l", score: 1, total: 2, at: 5 },
      "at",
    ],
    ["a draft question", me, { action: "draft", questionId: long, text: "" }, "questionId"],
    ["a draft text", me, { action: "draft", questionId: "q", text: "a".repeat(4001) }, "text"],
    ["vocabulary reviews", me, { action: "vocabulary", reviews: [] }, "reviews"],
    [
      "a vocabulary level",
      me,
      { action: "vocabulary", reviews: { casa: { level: 6, nextAt: T } } },
      "reviews",
    ],
    ["a check id", me, { action: "check", checkId: 3, done: true }, "checkId"],
    ["a check state", me, { action: "check", checkId: "c", done: "yes" }, "done"],
    ["a name", me, { action: "settings", name: "a".repeat(33), goal: 5, examDate: "" }, "name"],
    ["a goal", me, { action: "settings", name: "", goal: 7, examDate: "" }, "goal"],
    [
      "an exam date",
      me,
      { action: "settings", name: "", goal: 5, examDate: "2026-13-01" },
      "examDate",
    ],
    [
      "an attempt answer with a NUL character",
      me,
      { action: "attempt", attempt: attempt({ answer: "a\0b" }) },
      "attempt",
    ],
    [
      "an attempt at an offset Postgres does not take",
      me,
      { action: "attempt", attempt: attempt({ at: "2026-09-09T12:00:00+16:00" }) },
      "attempt",
    ],
    [
      "a draft text with a NUL character",
      me,
      { action: "draft", questionId: "q", text: "\0" },
      "text",
    ],
    [
      "a draft text with a lone surrogate",
      me,
      { action: "draft", questionId: "q", text: "Hola \uD83D" },
      "text",
    ],
    [
      "a vocabulary word with a NUL character",
      me,
      { action: "vocabulary", reviews: { "ca\0sa": { level: 1, nextAt: T } } },
      "reviews",
    ],
    [
      "a check id with a lone surrogate",
      me,
      { action: "check", checkId: "\uDC00", done: true },
      "checkId",
    ],
    ["a mock result without an id", me, { action: "mockResult", result: ok }, "result"],
    [
      "a mock score",
      me,
      { action: "mockResult", result: { ...ok, id: "m", reading: 26 } },
      "result",
    ],
    ["a mock run that is not a record", me, { action: "mockRun", run: [] }, "run"],
    ["a mock section without its index", me, { action: "mockRun", run: { section: 1 } }, "run"],
    [
      "a mock question outside its section",
      me,
      { action: "mockRun", run: { section: 3, index: 3 } },
      "run",
    ],
    ["a mock section", me, { action: "mockRun", run: { section: 4, index: 0 } }, "run"],
    ["a mock stage", me, { action: "mockRun", run: { stage: "paused" } }, "run"],
    ["a mock deadline", me, { action: "mockRun", run: { deadline: -1 } }, "run"],
    ["a mock start", me, { action: "mockRun", run: { started: "today" } }, "run"],
    ["a mock answer", me, { action: "mockRun", run: { answers: { r1: 5 } } }, "run"],
    [
      "a long mock draft",
      me,
      { action: "mockRun", run: { drafts: { w1: "a".repeat(4001) } } },
      "run",
    ],
    ["a mock score name", me, { action: "mockRun", run: { scores: { reading: "3" } } }, "run"],
    [
      "a long mock score",
      me,
      { action: "mockRun", run: { scores: { writing: "1".repeat(17) } } },
      "run",
    ],
    ["a replace flag", me, { action: "mockRun", run: {}, replace: "yes" }, "replace"],
  ])("refuses %s", async (_, id, body, error) => {
    const response = await send(id, body);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error });
  });

  it("refuses a body that is not JSON", async () => {
    const response = await handleProgress(
      new Request("https://paso.podwor.ski/api/progress", {
        method: "POST",
        headers: { "x-learner-id": me, "x-passcode": PASSCODE },
        body: "{",
      }),
      db,
      passcodeRefusal,
    );

    expect([response.status, await response.json()]).toEqual([400, { error: "body" }]);
  });

  it("refuses a wrong or missing passcode and writes nothing", async () => {
    const id = learner();

    const wrong = await send(
      id,
      { action: "attempt", attempt: attempt() },
      { "x-passcode": "nope" },
    );

    const missing = await send(id, undefined, { "x-passcode": "" });

    expect([wrong.status, await wrong.json()]).toEqual([401, { error: "passcode" }]);
    expect([missing.status, await missing.json()]).toEqual([401, { error: "passcode" }]);
    expect(await snapshot(id)).toEqual(EMPTY);
  });

  it("reads a URI-encoded passcode, and one that is not valid URI encoding as sent", async () => {
    vi.stubEnv("PASSCODE", "olé-2026");

    const encoded = await send(learner(), undefined, { "x-passcode": "ol%C3%A9-2026" });

    vi.stubEnv("PASSCODE", "100%-ole");

    const raw = await send(learner(), undefined, { "x-passcode": "100%-ole" });

    expect([encoded.status, raw.status]).toEqual([200, 200]);
  });

  it("refuses other methods", async () => {
    const response = await handleProgress(
      new Request("https://paso.podwor.ski/api/progress", {
        method: "PUT",
        headers: { "x-learner-id": me, "x-passcode": PASSCODE },
      }),
      db,
      passcodeRefusal,
    );

    expect(response.status).toBe(405);
  });

  it("says the store is unavailable when no database is configured", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    for (const handler of [GET, POST]) {
      const response = await handler(request(me));

      expect([response.status, await response.json()]).toEqual([503, { error: "unavailable" }]);
    }

    expect(log).toHaveBeenLastCalledWith("Progress is not configured: set DATABASE_URL");
  });
});
