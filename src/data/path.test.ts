import { expect, it } from "vitest";
import { allLessons, units } from "./curriculum";
import { courseUnitNumber, pathLessons, pathPlace, pathUnits } from "./path";

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
