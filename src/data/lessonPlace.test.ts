import { expect, it } from "vitest";
import { lessonPlace } from "./lessonPlace";
import { units } from "./curriculum";

it("numbers a path lesson by its unit and its position in that unit", () => {
  expect(lessonPlace(units[3].lessons[1].id)).toEqual({ unit: 4, lesson: 2 });
  expect(lessonPlace(units[0].lessons[0].id)).toEqual({ unit: 1, lesson: 1 });
});

it("gives a practice session no place on the path", () => {
  expect(lessonPlace("practice-all")).toBeUndefined();
});
