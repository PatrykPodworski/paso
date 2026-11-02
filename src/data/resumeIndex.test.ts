import { expect, it } from "vitest";
import { resumeIndex } from "./resumeIndex";
import { allLessons } from "./curriculum";
import { emptySnapshot, questionState } from "../test/progress";

const lesson = { ...allLessons[0], questions: allLessons[0].questions.slice(0, 4) };

const answered = (count: number) => {
  const progress = emptySnapshot();

  for (const q of lesson.questions.slice(0, count)) {
    progress.questions[q.id] = questionState();
  }

  return progress;
};

it("opens an unfinished lesson at its first exercise without a stored answer", () => {
  expect(resumeIndex(lesson, answered(3))).toBe(3);
  expect(resumeIndex(lesson, answered(1))).toBe(1);
});

it("opens at a gap even when a later exercise has an answer", () => {
  const progress = answered(4);

  delete progress.questions[lesson.questions[1].id];
  expect(resumeIndex(lesson, progress)).toBe(1);
});

it("starts from the first exercise when nothing is left to answer or nothing was answered", () => {
  expect(resumeIndex(lesson, answered(0))).toBe(0);
  expect(resumeIndex(lesson, answered(4))).toBe(0);
});

it("starts a finished lesson over", () => {
  const progress = answered(3);

  progress.completed[lesson.id] = { score: 3, total: 4, at: "2026-09-09T08:00:00.000Z" };
  expect(resumeIndex(lesson, progress)).toBe(0);
});

it("starts a practice session from its first exercise", () => {
  expect(resumeIndex({ ...lesson, id: "practice-all" }, answered(3))).toBe(0);
});
