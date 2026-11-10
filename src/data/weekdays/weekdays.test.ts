import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { weekdaysLesson, weekdaysUnits } from "./weekdays";

const variations = Array.from(
  { length: 12 },
  (_, i) => `WD-T01-V${String(i + 1).padStart(2, "0")}`,
);

describe("weekdays lessons", () => {
  it.each([1, 2, 3])(
    "opens L01 on its introduction, the base items with the form card before E04, then every variation (seed %i)",
    (seed) => {
      const lesson = weekdaysLesson("wd-l01", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "wd-l01",
        title: "Monday",
        subtitle: "Learn one new day",
      });

      expect(lesson.questions.slice(0, 8).map((q) => [q.id, q.kind])).toEqual([
        ["WD-T01-INTRO", "teach"],
        ["WD-T01-E01", "choice"],
        ["WD-T01-E02", "type"],
        ["WD-T01-E03", "type"],
        ["WD-T01-E04-FORM", "teach"],
        ["WD-T01-E04", "type"],
        ["WD-T01-E05", "type"],
        ["WD-T01-E06", "write"],
      ]);

      expect(
        lesson.questions
          .slice(8)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variations);
    },
  );

  it("shows lunes on the introduction card and el lunes, los lunes on the form card", () => {
    const [intro, , , , form] = weekdaysLesson("wd-l01", randomFrom(1)).questions;

    expect([intro.prompt, form.prompt]).toEqual(["New day: lunes", "el lunes, los lunes"]);
  });

  it("draws a new variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      weekdaysLesson("wd-l01", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("lists unit 1 with L01, the only lesson so far, and leaves units 2 and 3 empty", () => {
    expect(weekdaysUnits.map((u) => [u.title, u.lessons.map((l) => l.id)])).toEqual([
      ["Unit 1", ["wd-l01"]],
      ["Unit 2", []],
      ["Unit 3", []],
    ]);
  });
});
