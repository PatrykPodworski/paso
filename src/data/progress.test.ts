import { afterEach, describe, expect, it, vi } from "vitest";
import {
  accentOnlyAnswer,
  answerWords,
  clipText,
  countWords,
  dailyAnswers,
  isCorrect,
  localDate,
  missingQuestionMarks,
  nextReviewAt,
  nextReviewLevel,
  normalize,
  passingGroups,
  REVIEW_WINDOWS,
  skillStats,
  speakingScore,
  streak,
  writingScore,
} from "./progress";
import { allQuestions } from "./curriculum";
import type { Attempt, LiveItem, LiveScore, Question } from "./types";
import { emptySnapshot, questionState } from "../test/progress";

// The snapshot's latest answer per question, from attempts in time order.
const answered = (attempts: Attempt[]) => ({
  ...emptySnapshot(),
  questions: Object.fromEntries(
    attempts.map(({ id: _, questionId, ...answer }) => [questionId, questionState(answer)]),
  ),
});

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
  it("does not turn writing and speaking self-review into an exam score", () => {
    const p = answered([attempt({ skill: "speaking", correct: null, questionId: "u1-o3" })]);

    expect(skillStats(p, "speaking")).toEqual({ practised: 1, graded: 0, accuracy: null });
  });

  it("counts local study days without ISO UTC midnight shifts", () => {
    const d = new Date(2026, 8, 7, 0, 5);

    expect(localDate(d)).toBe("2026-09-07");
    expect(dailyAnswers(answered([attempt({ at: d.toISOString() })]), "2026-09-07")).toBe(1);
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
  it.each([
    ["¿¡HÓLA!,.;:…?", "hóla"],
    ["  ¿DÓNDE   está? ", "dónde está"],
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

    expect(
      isCorrect(
        allQuestions.find((q) => q.id === "u1-o1")!,
        "  soy de polonia!",
      ),
    ).toBe(true);
  });

  it.each([
    ["", 0],
    [" … — / ", 0],
    ["Bruno-Mario d’Ávila O'Neil 25", 4],
    ["uno\ndos\ttres", 3],
    ["¡Sí! café 中文", 3],
    ["¡Hola! ¿Cómo estás?", 3],
    ["  \n ", 0],
    ["Bruno Mario López, treinta años.", 5],
  ])("counts words in %s", (input, n) => expect(countWords(input)).toBe(n));

  it("counts only the field values of a form answer", () => {
    const form =
      "Nombre y apellidos: Pedro García\nNacionalidad: polaca\nCiudad: \nAficiones: leer: novelas";

    expect(answerWords({ kind: "form" }, form)).toBe(5);
    expect(answerWords({ kind: "write" }, form)).toBe(11);
    expect(answerWords({ kind: "write" }, "Hola, Bruno: nos vemos.")).toBe(4);
    expect(answerWords({ kind: "form" }, "Nombre: Bruno\nCiudad:")).toBe(1);
  });

  it.each([
    [[2, 2], 16.67],
    [[3, 3], 25],
    [[0, 0], 0],
    [[3, 0], 12.5],
    [[1, 2], 12.5],
    [[3, 2], 20.83],
    [[1, 0], 4.17],
  ] as const)("scales DELE writing bands %j to %d out of 25", (bands, score) =>
    expect(writingScore(bands)).toBe(score),
  );

  // A talk as Lucía scores it, with one item per level given.
  const talk = (...levels: LiveItem[]): LiveScore => ({
    grade: "good",
    items: levels.map((level, i) => ({ id: `p${i}`, label: `Point ${i}`, level })),
  });

  it.each([
    ["every point correct", [talk("correct"), talk("correct", "correct"), talk("correct")], 25],
    ["every point missing", [talk("missing"), talk("missing"), talk("missing", "missing")], 0],
    [
      "understandable as half a point",
      [talk("correct", "understandable"), talk("correct"), talk("correct")],
      22.92,
    ],
    [
      "each talk as a third",
      [talk("correct", "correct", "correct", "correct"), talk(), talk()],
      8.33,
    ],
    ["a missing talk as zero", [talk("understandable"), undefined, undefined], 4.17],
  ] as const)("converts Lucía's points to speaking points: %s", (_, talks, score) =>
    expect(speakingScore(talks)).toBe(score),
  );

  it("gives no speaking score when no talk has a point scored", () => {
    expect(speakingScore([undefined, undefined, undefined])).toBeUndefined();
    expect(speakingScore([talk(), undefined, undefined])).toBeUndefined();
  });

  it("counts the questions last answered on the requested local day", () => {
    const p = answered([
      a(),
      a({ questionId: "two", correct: null }),
      a({ questionId: "yesterday", at: new Date(2026, 8, 8, 12).toISOString() }),
    ]);

    expect(dailyAnswers(p, "2026-09-09")).toBe(2);
    expect(dailyAnswers(p, "2026-09-08")).toBe(1);
    expect(dailyAnswers(p, "2026-09-07")).toBe(0);
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
    [[9, 8, 6], 2],
    [[], 0],
  ])("counts consecutive calendar days %j", (days, n) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 9, 12));

    expect(streak({ ...emptySnapshot(), days: days.map((d) => `2026-09-0${d}`) })).toBe(n);
  });

  it("uses the latest answer per question, excludes help and productive work, and rounds accuracy", () => {
    const attempts = [
      a(),
      a({ questionId: "two", correct: false }),
      a({ questionId: "three" }),
      a({ questionId: "help", assisted: true }),
      a({ questionId: "creative", correct: null }),
      a({ questionId: "foreign", skill: "listening" }),
    ];

    expect(skillStats(answered(attempts), "reading")).toEqual({
      practised: 5,
      graded: 3,
      accuracy: 67,
    });

    expect(skillStats(answered(attempts), "writing")).toEqual({
      practised: 0,
      graded: 0,
      accuracy: null,
    });

    expect(skillStats(answered([...attempts, a({ assisted: true })]), "reading")).toEqual({
      practised: 5,
      graded: 2,
      accuracy: 50,
    });
  });

  it.each([
    [15, 15, 15, 15, true],
    [24, 6, 10, 20, true],
    [25, 25, 5, 5, false],
    [25, 5, 25, 5, true],
    [25, 4.99, 25, 25, false],
    [25, 25, 25, 4.99, false],
    [0, 0, 25, 25, false],
    [25, 25, 0, 0, false],
  ])("requires BOTH groups at the boundary %s/%s/%s/%s", (r, w, l, s, pass) =>
    expect(passingGroups(r, w, l, s)).toEqual({ group1: r + w, group2: l + s, pass }),
  );
});

describe("accent-only mistakes", () => {
  const who = { answer: "¿Quién eres?", accepted: ["¿Y tú quién eres?"] } as Question;

  it.each([
    ["quien eres", who, "¿Quién eres?"],
    ["Y tu quien eres", who, "¿Y tú quién eres?"],
    ["Que quieres", { answer: "¿Qué quieres?" } as Question, "¿Qué quieres?"],
    [
      "Qué tengas un buen día",
      { answer: "Que tengas un buen día." } as Question,
      "Que tengas un buen día.",
    ],
    ["pinguino", { answer: "pingüino" } as Question, "pingüino"],
    ["quien eres", { answer: "¿Quie\u0301n eres?" } as Question, "¿Quie\u0301n eres?"],
    ["quie\u0301n", { answer: "quien" } as Question, "quien"],
    ["quién", { answer: "quien" } as Question, "quien"],
  ])("finds the accepted answer %s misses only by accents", (answer, q, expected) =>
    expect(accentOnlyAnswer(q, answer)).toBe(expected),
  );

  it.each([
    ["nino", { answer: "niño" } as Question],
    ["niño", { answer: "nino" } as Question],
    ["nin\u0303o", { answer: "nino" } as Question],
    ["porque estudias español", { answer: "¿Por qué estudias español?" } as Question],
    ["¿Quién eres?", who],
    ["quien es", who],
  ])("finds no accent-only match for %s", (answer, q) =>
    expect(accentOnlyAnswer(q, answer)).toBeUndefined(),
  );
});

describe("missing question marks", () => {
  const flagged = { answer: "¿Qué quieres?", questionMarks: true } as Question;

  it.each([
    ["Qué quieres", true],
    ["¿Qué quieres", true],
    ["Qué quieres?", true],
    ["¿Qué quieres?", false],
    ["  ¿qué quieres?  ", false],
  ])("flags %s as %s on a full Spanish question", (answer, expected) =>
    expect(missingQuestionMarks(flagged, answer)).toBe(expected),
  );

  it("ignores the marks on an unflagged question", () => {
    expect(missingQuestionMarks({ ...flagged, questionMarks: undefined }, "Qué quieres")).toBe(
      false,
    );
  });
});

it("does not accidentally accept an undeclared fallback answer", () => {
  expect(isCorrect({ answer: "hola" } as Question, "Stryker was here")).toBe(false);
});

it("clips text to the 4000 characters the server stores without splitting a character", () => {
  expect(clipText("a".repeat(4001))).toBe("a".repeat(4000));
  expect(clipText(`${"a".repeat(3999)}😀`)).toBe("a".repeat(3999));
  expect(clipText("hola")).toBe("hola");
});
