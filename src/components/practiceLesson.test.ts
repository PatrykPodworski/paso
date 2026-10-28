import { describe, expect, it } from "vitest";
import { practiceLesson } from "./practiceLesson";
import { exerciseBank } from "./practice";
import { emptyProgress } from "../data/progress";
import type { Attempt } from "../data/types";

const talks = exerciseBank.filter((q) => q.kind === "live");

const attempt = (questionId: string, at: string): Attempt => ({
  id: questionId,
  questionId,
  skill: "speaking",
  answer: "",
  correct: true,
  at,
});

describe("practice lesson", () => {
  it("builds no lesson from an empty mistake queue", () => {
    expect(practiceLesson("mistakes", emptyProgress(), [])).toBeNull();
  });

  it("opens one live talk for speaking practice, the least recently practised first", () => {
    const p = emptyProgress();

    p.attempts = [attempt(talks[0].id, "2026-09-08T12:00:00Z")];
    expect(practiceLesson("speaking", p, [])!.questions).toEqual([talks[1]]);

    p.attempts = talks.map((t, i) =>
      attempt(t.id, i === 2 ? "2026-09-01T12:00:00Z" : "2026-09-08T12:00:00Z"),
    );

    expect(practiceLesson("speaking", p, [])!.questions).toEqual([talks[2]]);
  });

  it("keeps the live talks out of the daily mix but brings one back as a mistake", () => {
    expect(practiceLesson("all", emptyProgress(), [])!.questions).not.toContain(talks[0]);
    expect(practiceLesson("mistakes", emptyProgress(), [talks[0]])!.questions).toEqual([talks[0]]);
  });
});
