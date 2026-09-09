import { describe, expect, it } from "vitest";
import {
  countWords,
  dailyAnswers,
  emptyProgress,
  isCorrect,
  localDate,
  nextReviewAt,
  normalize,
  passingGroups,
  readProgress,
  skillStats,
  STORAGE_KEY,
  streak,
  withAttempt,
  writingHints,
  xp,
} from "../data/progress";
import { allQuestions } from "../data/curriculum";
import type { Attempt } from "../data/types";
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
