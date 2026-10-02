import { afterEach, describe, expect, it, vi } from "vitest";
import {
  countWords,
  dailyAnswers,
  emptyProgress,
  isCorrect,
  localDate,
  nextReviewAt,
  nextReviewLevel,
  normalize,
  passingGroups,
  readProgress,
  REVIEW_WINDOWS,
  skillStats,
  STORAGE_KEY,
  streak,
  withAttempt,
  writingHints,
  xp,
} from "./progress";
import { allQuestions } from "./curriculum";
import type { Attempt, Question } from "./types";

const attempt = (patch: Partial<Attempt> = {}): Attempt => ({
  id: "a1",
  questionId: "u1-v0",
  skill: "reading",
  answer: "hello",
  correct: true,
  at: new Date().toISOString(),
  ...patch,
});

describe("DELE scoring and progress", () => {
  it("requires 30 in each group rather than 60 overall", () => {
    expect(passingGroups(25, 25, 5, 5).pass).toBe(false);
    expect(passingGroups(15, 15, 15, 15).pass).toBe(true);
    expect(passingGroups(24, 6, 10, 20).pass).toBe(true);
    expect(passingGroups(25, 4.99, 25, 25).pass).toBe(false);
  });

  it("normalizes punctuation and spaces but preserves accents and ñ", () => {
    expect(normalize("  ¿DÓNDE   está? ")).toBe("dónde está");
    expect(normalize("años")).not.toBe(normalize("anos"));

    expect(
      isCorrect(
        allQuestions.find((q) => q.id === "u1-o1")!,
        "  soy de polonia!",
      ),
    ).toBe(true);
  });

  it("keeps a mistake until an unassisted correct answer", () => {
    let p = withAttempt(emptyProgress(), attempt({ correct: false }));

    expect(p.mistakes).toEqual(["u1-v0"]);
    p = withAttempt(p, attempt({ correct: true, assisted: true }));
    expect(p.mistakes).toEqual(["u1-v0"]);
    p = withAttempt(p, attempt({ correct: true }));
    expect(p.mistakes).toEqual([]);
    expect(p.reviewed).toEqual(["u1-v0"]);
  });

  it("schedules a legacy mistake that has no review metadata after a correct answer", () => {
    const p = emptyProgress();

    p.mistakes = ["u1-v0"];
    const saved = withAttempt(p, attempt({ at: "2026-09-09T12:00:00.000Z" }));

    expect(saved.mistakes).toEqual([]);

    expect(saved.mistakeReviews["u1-v0"]).toEqual({
      level: 1,
      nextAt: "2026-09-10T12:00:00.000Z",
    });
  });

  it("does not turn writing and speaking self-review into an exam score", () => {
    const p = withAttempt(
      emptyProgress(),
      attempt({ skill: "speaking", correct: null, questionId: "u1-o3" }),
    );

    expect(p.mistakes).toEqual([]);
    expect(skillStats(p, "speaking")).toEqual({ practised: 1, graded: 0, accuracy: null });
  });

  it("does not farm XP or daily progress by repeating the same question", () => {
    const p = withAttempt(withAttempt(emptyProgress(), attempt()), attempt({ id: "a2" }));

    expect(dailyAnswers(p)).toBe(1);
    expect(xp(p)).toBe(5);
  });

  it("uses the latest unassisted objective attempt for skill statistics", () => {
    let p = withAttempt(emptyProgress(), attempt({ correct: false }));

    p = withAttempt(p, attempt());
    expect(skillStats(p, "reading").accuracy).toBe(100);
  });

  it("counts local study days without ISO UTC midnight shifts", () => {
    const d = new Date(2026, 8, 7, 0, 5);

    expect(localDate(d)).toBe("2026-09-07");
    const p = emptyProgress();

    p.attempts = [attempt({ at: d.toISOString() })];
    expect(dailyAnswers(p, "2026-09-07")).toBe(1);
  });

  it("starts a streak only after real practice", () => {
    expect(streak(emptyProgress())).toBe(0);
    expect(streak(withAttempt(emptyProgress(), attempt()))).toBe(1);
  });

  it("recovers from malformed storage", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    expect(readProgress()).toEqual(emptyProgress());
    localStorage.setItem(STORAGE_KEY, '{"version":9}');
    expect(readProgress()).toEqual(emptyProgress());
  });

  it("makes an invalid saved review date immediately reviewable", () => {
    const before = Date.now();
    const repaired = new Date(nextReviewAt("invalid saved date", 3)).getTime();

    expect(repaired).toBeGreaterThanOrEqual(before);
    expect(repaired).toBeLessThanOrEqual(Date.now());
  });

  it("caps spaced repetition at the longest review window", () => {
    expect(nextReviewLevel(0)).toBe(1);
    expect(nextReviewLevel(99)).toBe(REVIEW_WINDOWS.length - 1);
    expect(nextReviewAt("2026-09-09T12:00:00.000Z", 1)).toBe("2026-09-10T12:00:00.000Z");
    expect(nextReviewAt("2026-09-09T12:00:00.000Z", 99)).toBe("2026-10-09T12:00:00.000Z");
  });

  it("schedules only the questions actually missed and keeps other cards untouched", () => {
    const other = { level: 3, nextAt: "2026-09-20T12:00:00.000Z" };
    const p = { ...emptyProgress(), mistakeReviews: { "u1-o1": other } };
    const missed = withAttempt(p, attempt({ correct: false, at: "2026-09-09T12:00:00.000Z" }));

    expect(missed.mistakeReviews).toEqual({
      "u1-o1": other,
      "u1-v0": { level: 0, nextAt: "2026-09-09T12:00:00.000Z" },
    });

    expect(withAttempt(p, attempt()).mistakeReviews).toEqual({ "u1-o1": other });
  });

  it("counts Spanish words without counting punctuation", () => {
    expect(countWords("¡Hola! ¿Cómo estás?")).toBe(3);
    expect(countWords("  \n ")).toBe(0);
    expect(countWords("Ana María López, treinta años.")).toBe(5);
  });

  it("explains targeted writing errors without pretending to grade everything", () => {
    expect(
      writingHints("Soy 20 años. Me gusta las manzanas. Mi padres viven a el lado de el banco."),
    ).toHaveLength(5);

    expect(writingHints("Tengo veinte años. Me gustan las manzanas.")).toHaveLength(0);
  });
});

const a = (patch: Partial<Attempt> = {}): Attempt => ({
  id: "attempt",
  questionId: "one",
  skill: "reading",
  answer: "hola",
  correct: true,
  at: "2026-09-09T10:00:00Z",
  ...patch,
});

afterEach(() => vi.useRealTimers());

describe("progress contracts", () => {
  it("returns independent empty collections and exact initial preferences", () => {
    const p = emptyProgress();

    p.mistakes.push("x");
    p.completed.x = { score: 1, total: 1, at: "today" };

    expect(emptyProgress()).toEqual({
      version: 1,
      name: "",
      goal: 10,
      completed: {},
      attempts: [],
      mistakes: [],
      reviewed: [],
      mistakeReviews: {},
      vocabularyReviews: {},
      checks: [],
      examDate: "",
      mockResults: [],
      drafts: {},
    });
  });

  it.each([
    null,
    {},
    { version: 2 },
    { version: 1, attempts: {}, completed: {}, mistakes: [] },
    { version: 1, attempts: [], completed: null, mistakes: [] },
    { version: 1, attempts: [], completed: {}, mistakes: {} },
  ])("rejects invalid saved envelope %j", (raw) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    expect(readProgress()).toEqual(emptyProgress());
  });

  it("restores older valid progress with defaults for newly added fields", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        attempts: [a()],
        completed: { lesson: { score: 2, total: 3, at: "day" } },
        mistakes: ["one"],
        name: "Ana",
        goal: 20,
      }),
    );

    expect(readProgress()).toEqual({
      ...emptyProgress(),
      attempts: [a()],
      completed: { lesson: { score: 2, total: 3, at: "day" } },
      mistakes: ["one"],
      name: "Ana",
      goal: 20,
    });
  });

  it("recovers when storage access itself is denied", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("Denied");
    });

    expect(readProgress()).toEqual(emptyProgress());
  });

  it.each([
    ["¿¡HÓLA!,.;:…?", "hóla"],
    ["  uno\n\t dos  ", "uno dos"],
    ["cafe\u0301", "café"],
    ["año", "año"],
    ["el / la", "el / la"],
  ])("normalizes %s without losing meaningful letters", (input, expected) =>
    expect(normalize(input)).toBe(expected),
  );

  it("accepts declared alternatives while preserving spelling distinctions", () => {
    const q = { answer: "España", accepted: ["Soy español"] } as Question;

    expect(isCorrect(q, "¡SOY ESPAÑOL!")).toBe(true);
    expect(isCorrect(q, "Espana")).toBe(false);
    expect(isCorrect({ ...q, accepted: undefined }, "España")).toBe(true);
    expect(isCorrect(q, "Hola")).toBe(false);
  });

  it.each([
    ["", 0],
    [" … — / ", 0],
    ["Ana-María d’Ávila O'Neil 25", 4],
    ["uno\ndos\ttres", 3],
    ["¡Sí! café 中文", 3],
  ])("counts words in %s", (input, n) => expect(countWords(input)).toBe(n));

  it("caps attempt history at the newest 6000 without changing its input", () => {
    const p = emptyProgress();

    p.attempts = Array.from({ length: 6000 }, (_, i) => a({ id: String(i) }));
    const next = withAttempt(p, a({ id: "new", correct: false }));

    expect(next.attempts).toHaveLength(6000);
    expect(next.attempts[0].id).toBe("1");
    expect(next.attempts.at(-1)?.id).toBe("new");
    expect(p.attempts[0].id).toBe("0");
    expect(p.mistakes).toEqual([]);
  });

  it("deduplicates mistakes and only records an unassisted recovery", () => {
    let p = withAttempt(emptyProgress(), a({ correct: false }));

    p = withAttempt(p, a({ correct: false }));
    expect(p.mistakes).toEqual(["one"]);

    for (const patch of [
      { correct: null },
      { correct: true, assisted: true },
    ] as Partial<Attempt>[]) {
      p = withAttempt(p, a(patch));
      expect(p.mistakes).toEqual(["one"]);
      expect(p.reviewed).toEqual([]);
    }

    p = withAttempt(p, a());
    expect(p.mistakes).toEqual([]);
    expect(p.reviewed).toEqual(["one"]);
    p = withAttempt(withAttempt(p, a({ correct: false })), a());
    expect(p.reviewed).toEqual(["one"]);
    expect(withAttempt(emptyProgress(), a()).reviewed).toEqual([]);
  });

  it("counts unique questions on the requested local day and awards lesson XP separately", () => {
    const p = emptyProgress();

    p.attempts = [
      a(),
      a({ id: "again", correct: false }),
      a({ questionId: "two", correct: null }),
      a({ questionId: "yesterday", at: new Date(2026, 8, 8, 12).toISOString() }),
    ];

    p.completed.lesson = { score: 0, total: 2, at: "date" };
    expect(dailyAnswers(p, "2026-09-09")).toBe(2);
    expect(dailyAnswers(p, "2026-09-07")).toBe(0);
    expect(xp(p)).toBe(35);
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 9, 12));
    expect(dailyAnswers(p)).toBe(2);
    expect(localDate()).toBe("2026-09-09");
  });

  it.each([
    [[9, 8, 7], 3],
    [[8, 7], 2],
    [[9, 7], 1],
    [[7, 6], 0],
    [[9, 9, 8, 6], 2],
  ])("counts consecutive calendar days %j", (days, n) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 9, 12));
    const p = emptyProgress();

    p.attempts = days.map((d) => a({ at: new Date(2026, 8, d, 12).toISOString() }));
    expect(streak(p)).toBe(n);
  });

  it("uses latest answer per question, excludes help and productive work, and rounds accuracy", () => {
    const p = emptyProgress();

    p.attempts = [
      a({ correct: false }),
      a(),
      a({ questionId: "two", correct: false }),
      a({ questionId: "three" }),
      a({ questionId: "help", assisted: true }),
      a({ questionId: "creative", correct: null }),
      a({ questionId: "foreign", skill: "listening" }),
    ];

    expect(skillStats(p, "reading")).toEqual({ practised: 5, graded: 3, accuracy: 67 });
    expect(skillStats(p, "writing")).toEqual({ practised: 0, graded: 0, accuracy: null });
    p.attempts.push(a({ assisted: true }));
    expect(skillStats(p, "reading")).toEqual({ practised: 5, graded: 2, accuracy: 50 });
  });

  it.each([
    [15, 15, 15, 15, true],
    [25, 5, 25, 5, true],
    [25, 4.99, 25, 25, false],
    [25, 25, 25, 4.99, false],
    [0, 0, 25, 25, false],
    [25, 25, 0, 0, false],
  ])("requires BOTH groups at the boundary %s/%s/%s/%s", (r, w, l, s, pass) =>
    expect(passingGroups(r, w, l, s)).toEqual({ group1: r + w, group2: l + s, pass }),
  );

  it.each([
    ["ESTOY quince años", "For age, use tener"],
    ["Soy 21 años", "For age, use tener"],
    ["Me gusta los libros", "plural noun"],
    ["mi hermanas", "plural possession"],
    ["cerca de el banco", "de + el"],
    ["voy a el parque", "a + el"],
    ["Tengo 20 anos", "write años"],
    ["Cómo estás?", "opening ¿"],
  ])("explains a specific error: %s", (text, fragment) =>
    expect(writingHints(text).join(" ")).toContain(fragment),
  );

  it.each([
    "Tengo veinte años. Me gustan los libros. Mis padres viven cerca del banco. Voy al parque.",
    "¿Cómo estás?",
    "Todo bien.",
    "soy profesor",
    "Me gusta el café",
    "Mi hermana",
    "de ella",
    "a ella",
    "Tengo años",
    "¿Hola",
  ])("does not invent hints for %s", (text) => expect(writingHints(text)).toEqual([]));
});

it("keeps the public storage key and rejects a wrong version with otherwise valid data", () => {
  expect(STORAGE_KEY).toBe("paso-progress-v1");
  localStorage.setItem("paso-progress-v1", JSON.stringify({ ...emptyProgress(), version: 2 }));
  expect(readProgress()).toEqual(emptyProgress());
});

it("handles flexible whitespace in age errors and accepts a genuinely zero allowance", () => {
  expect(writingHints("Soy   veinte   años")).toHaveLength(1);
});

it("does not accidentally accept an undeclared fallback answer", () => {
  expect(isCorrect({ answer: "hola" } as Question, "Stryker was here")).toBe(false);
});
