import { expect, it } from "vitest";
import { currentUnit, journeyLesson } from "./journeyLesson";
import { allLessons, units } from "./curriculum";
import { emptySnapshot, questionState } from "../test/progress";

const finish = (progress: ReturnType<typeof emptySnapshot>, index: number) => {
  progress.completed[allLessons[index].id] = { score: 1, total: 1, at: "2026-09-09T08:00:00Z" };
};

const finishUnits = (progress: ReturnType<typeof emptySnapshot>, count: number) => {
  for (const lesson of units.slice(0, count).flatMap((u) => u.lessons)) {
    progress.completed[lesson.id] = { score: 1, total: 1, at: "2026-09-09T08:00:00Z" };
  }
};

const answerAll = (progress: ReturnType<typeof emptySnapshot>, index: number) => {
  for (const q of allLessons[index].questions) {
    progress.questions[q.id] = questionState();
  }
};

it("opens the first unfinished lesson", () => {
  const progress = emptySnapshot();

  expect(journeyLesson(progress).id).toBe(allLessons[0].id);
  finish(progress, 0);
  expect(journeyLesson(progress).lesson()).toBe(allLessons[1]);
});

it("passes over an unfinished lesson whose every exercise is already answered", () => {
  const progress = emptySnapshot();

  answerAll(progress, 0);
  expect(journeyLesson(progress).id).toBe(allLessons[1].id);
});

it("opens an unfinished lesson with an exercise left to answer", () => {
  const progress = emptySnapshot();

  answerAll(progress, 0);
  delete progress.questions[allLessons[0].questions.at(-1)!.id];
  expect(journeyLesson(progress).id).toBe(allLessons[0].id);
});

it("opens the first unfinished lesson when every one left is fully answered", () => {
  const progress = emptySnapshot();

  allLessons.forEach((_, i) => (i === 2 || i === 5 ? answerAll(progress, i) : finish(progress, i)));
  expect(journeyLesson(progress).id).toBe(allLessons[2].id);
});

it("starts over at the first lesson when the path is finished", () => {
  const progress = emptySnapshot();

  allLessons.forEach((_, i) => finish(progress, i));
  expect(journeyLesson(progress).lesson()).toBe(allLessons[0]);
});

it("starts a fresh learner at unit 01", () => {
  expect(currentUnit(emptySnapshot()).number).toBe(1);
});

it("moves to the unit after the finished ones", () => {
  const progress = emptySnapshot();

  finishUnits(progress, 4);
  expect(currentUnit(progress).number).toBe(5);
});

it("follows the journey lesson past a unit whose exercises are all answered", () => {
  const progress = emptySnapshot();

  finishUnits(progress, 1);

  for (const q of units[1].lessons.flatMap((l) => l.questions)) {
    progress.questions[q.id] = questionState();
  }

  expect(currentUnit(progress).number).toBe(3);
});

it("returns to unit 01 when the whole path is finished", () => {
  const progress = emptySnapshot();

  finishUnits(progress, units.length);
  expect(currentUnit(progress).number).toBe(1);
});
