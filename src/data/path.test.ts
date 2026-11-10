import { expect, it } from "vitest";
import { allLessons, units } from "./curriculum";
import { courseUnitNumber, currentUnit, pathLessons, pathPlace, pathUnits } from "./path";
import { emptySnapshot, questionState } from "../test/progress";

const finishUnits = (progress: ReturnType<typeof emptySnapshot>, count: number) => {
  for (const lesson of units.slice(0, count).flatMap((u) => u.lessons)) {
    progress.completed[lesson.id] = { score: 1, total: 1, at: "2026-09-09T08:00:00Z" };
  }
};

it("numbers a path lesson by its unit and its position in that unit", () => {
  expect(pathPlace(units[3].lessons[1].id)).toEqual({ unit: 4, lesson: 2 });
  expect(pathPlace(units[0].lessons[0].id)).toEqual({ unit: 1, lesson: 1 });
});

it("gives a practice session no place on the path", () => {
  expect(pathPlace("practice-all")).toBeUndefined();
});

it("numbers the path units from 1 without gaps", () => {
  expect(pathUnits.map((u) => u.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

it("holds every course lesson once, in course order", () => {
  expect(pathLessons.map((l) => l.id)).toEqual(allLessons.map((l) => l.id));
  expect(pathLessons[5].lesson()).toBe(units[1].lessons[1]);
});

it("shows a course unit under its course number while only course units are on the path", () => {
  expect(courseUnitNumber(1)).toBe(1);
  expect(courseUnitNumber(7)).toBe(7);
  expect(courseUnitNumber(12)).toBe(12);
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
