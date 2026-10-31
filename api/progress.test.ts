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

  return (await response.json()) as ProgressSnapshot;
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
    const me = learner();

    // 400 days of attempts straight into the table, then the 401st day through the API.
    await db.transaction([
      { text: "INSERT INTO learners (id) VALUES ($1)", params: [me] },
      {
        text: `INSERT INTO attempts (learner_id, id, question_id, skill, correct, answer, at, local_day)
               SELECT $1, 'a' || i, 'u1-v0', 'reading', true, 'hola', day + time '12:00', day
               FROM generate_series(0, 399) AS i, LATERAL (SELECT date '2025-01-01' + i AS day) d`,
        params: [me],
      },
    ]);

    const { days } = await answer(me, { id: "a400", at: "2026-02-05T12:00:00.000Z" }, "UTC");

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

      await snapshot(id, { action: "mockRun", run: { answers: { "mock-r1-0": "a" } } });
    }

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
    await change(me, { answers: { "mock-r1-0": "b" }, section: 0, index: 1 });
    await change(me, { drafts: { "mock-w1": "Hola" }, scores: { writing: "12" } });
    await change(me, { answers: { "mock-r1-1": "c" }, drafts: { prep: "" } });

    expect(await change(me, { scores: { speaking: "14.5" }, section: 1, index: 0 })).toEqual({
      ...FRESH,
      ...started,
      section: 1,
      answers: { "mock-r1-0": "b", "mock-r1-1": "c" },
      drafts: { "mock-w1": "Hola", prep: "" },
      scores: { writing: "12", speaking: "14.5" },
    });
  });

  it("keeps the answers another tab saved while this tab moves on", async () => {
    const me = learner();

    await change(me, started, true);
    await change(me, { answers: { "mock-r1-0": "a" }, section: 0, index: 1 });

    expect(await change(me, { answers: { "mock-r1-4": "c" }, section: 0, index: 5 })).toMatchObject(
      {
        index: 5,
        answers: { "mock-r1-0": "a", "mock-r1-4": "c" },
      },
    );
  });

  it("starts from the defaults when a change arrives without a run", async () => {
    expect(await change(learner(), { answers: { "mock-r1-0": "a" } })).toEqual({
      ...FRESH,
      answers: { "mock-r1-0": "a" },
    });
  });

  it("replaces the run and its answers when a new one starts", async () => {
    const me = learner();

    await change(me, { ...started, answers: { "mock-r1-0": "a" }, scores: { writing: "3" } }, true);

    expect(await change(me, {}, true)).toEqual(FRESH);
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
    ["a mock answer", me, { action: "mockRun", run: { answers: { "mock-r1-0": 5 } } }, "run"],
    [
      "mock answers that are not a record",
      me,
      { action: "mockRun", run: { answers: null } },
      "run",
    ],
    [
      "a mock answer to no exam question",
      me,
      { action: "mockRun", run: { answers: { "u1-v0": "a" } } },
      "run",
    ],
    [
      "a mock answer to the notes",
      me,
      { action: "mockRun", run: { answers: { prep: "a" } } },
      "run",
    ],
    [
      "a mock draft for no exam question",
      me,
      { action: "mockRun", run: { drafts: { "u1-w1": "Hola" } } },
      "run",
    ],
    [
      "a long mock draft",
      me,
      { action: "mockRun", run: { drafts: { "mock-w1": "a".repeat(4001) } } },
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
