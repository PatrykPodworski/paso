import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { weekdaysLesson, weekdaysUnits } from "./weekdays";

const variationsOf = (day: string) =>
  Array.from({ length: 12 }, (_, i) => `WD-${day}-V${String(i + 1).padStart(2, "0")}`);

const variations = variationsOf("T01");

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

  it.each([1, 2, 3])(
    "opens L02 on the recalled T01-V04, its introduction, the base items with the form card before E04, then every variation (seed %i)",
    (seed) => {
      const lesson = weekdaysLesson("wd-l02", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "wd-l02",
        title: "Tuesday",
        subtitle: "Learn one new day",
      });

      expect(lesson.questions.slice(0, 9).map((q) => [q.id, q.kind])).toEqual([
        ["WD-T01-V04", "type"],
        ["WD-T02-INTRO", "teach"],
        ["WD-T02-E01", "choice"],
        ["WD-T02-E02", "type"],
        ["WD-T02-E03", "type"],
        ["WD-T02-E04-FORM", "teach"],
        ["WD-T02-E04", "type"],
        ["WD-T02-E05", "type"],
        ["WD-T02-E06", "write"],
      ]);

      expect(
        lesson.questions
          .slice(9)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("T02"));
    },
  );

  it("shows martes on the L02 introduction card and el martes, los martes on its form card", () => {
    const [, intro, , , , form] = weekdaysLesson("wd-l02", randomFrom(1)).questions;

    expect([intro.prompt, form.prompt]).toEqual(["New day: martes", "el martes, los martes"]);
  });

  it("draws a new L02 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      weekdaysLesson("wd-l02", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens L03 on the recalled T02-V04, its introduction, the base items with the form card before E04, then every variation (seed %i)",
    (seed) => {
      const lesson = weekdaysLesson("wd-l03", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "wd-l03",
        title: "Wednesday",
        subtitle: "Learn one new day",
      });

      expect(lesson.questions.slice(0, 9).map((q) => [q.id, q.kind])).toEqual([
        ["WD-T02-V04", "type"],
        ["WD-T03-INTRO", "teach"],
        ["WD-T03-E01", "choice"],
        ["WD-T03-E02", "type"],
        ["WD-T03-E03", "type"],
        ["WD-T03-E04-FORM", "teach"],
        ["WD-T03-E04", "type"],
        ["WD-T03-E05", "type"],
        ["WD-T03-E06", "write"],
      ]);

      expect(
        lesson.questions
          .slice(9)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("T03"));
    },
  );

  it("shows miércoles on the L03 introduction card and el miércoles, los miércoles on its form card", () => {
    const [, intro, , , , form] = weekdaysLesson("wd-l03", randomFrom(1)).questions;

    expect([intro.prompt, form.prompt]).toEqual([
      "New day: miércoles",
      "el miércoles, los miércoles",
    ]);
  });

  it("draws a new L03 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      weekdaysLesson("wd-l03", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens L04 on the recalled T03-V04, its introduction, the base items with the form card before E04, then every variation (seed %i)",
    (seed) => {
      const lesson = weekdaysLesson("wd-l04", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "wd-l04",
        title: "Thursday",
        subtitle: "Learn one new day",
      });

      expect(lesson.questions.slice(0, 9).map((q) => [q.id, q.kind])).toEqual([
        ["WD-T03-V04", "type"],
        ["WD-T04-INTRO", "teach"],
        ["WD-T04-E01", "choice"],
        ["WD-T04-E02", "type"],
        ["WD-T04-E03", "type"],
        ["WD-T04-E04-FORM", "teach"],
        ["WD-T04-E04", "type"],
        ["WD-T04-E05", "type"],
        ["WD-T04-E06", "write"],
      ]);

      expect(
        lesson.questions
          .slice(9)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("T04"));
    },
  );

  it("shows jueves on the L04 introduction card and el jueves, los jueves on its form card", () => {
    const [, intro, , , , form] = weekdaysLesson("wd-l04", randomFrom(1)).questions;

    expect([intro.prompt, form.prompt]).toEqual(["New day: jueves", "el jueves, los jueves"]);
  });

  it("draws a new L04 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      weekdaysLesson("wd-l04", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens L05 on the recalled T04-V04, its introduction, the base items with the form card before E04, then every variation (seed %i)",
    (seed) => {
      const lesson = weekdaysLesson("wd-l05", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "wd-l05",
        title: "Friday",
        subtitle: "Learn one new day",
      });

      expect(lesson.questions.slice(0, 9).map((q) => [q.id, q.kind])).toEqual([
        ["WD-T04-V04", "type"],
        ["WD-T05-INTRO", "teach"],
        ["WD-T05-E01", "choice"],
        ["WD-T05-E02", "type"],
        ["WD-T05-E03", "type"],
        ["WD-T05-E04-FORM", "teach"],
        ["WD-T05-E04", "type"],
        ["WD-T05-E05", "type"],
        ["WD-T05-E06", "write"],
      ]);

      expect(
        lesson.questions
          .slice(9)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("T05"));
    },
  );

  it("shows viernes on the L05 introduction card and el viernes, los viernes on its form card", () => {
    const [, intro, , , , form] = weekdaysLesson("wd-l05", randomFrom(1)).questions;

    expect([intro.prompt, form.prompt]).toEqual(["New day: viernes", "el viernes, los viernes"]);
  });

  it("draws a new L05 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      weekdaysLesson("wd-l05", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])("runs R01 as the three days' V04 sentences in order (seed %i)", (seed) => {
    const lesson = weekdaysLesson("wd-r01", randomFrom(seed));

    expect(lesson).toMatchObject({
      id: "wd-r01",
      title: "Unit review",
      subtitle: "Review this unit's lessons",
    });

    expect(lesson.questions.map((q) => q.id)).toEqual(["WD-T01-V04", "WD-T02-V04", "WD-T03-V04"]);
  });

  it("lists unit 1 with L01 to L03 and R01, unit 2 with L04 and L05, the only lessons so far, and leaves unit 3 empty", () => {
    expect(weekdaysUnits.map((u) => [u.id, u.lessons.map((l) => l.id)])).toEqual([
      ["wd-u1", ["wd-l01", "wd-l02", "wd-l03", "wd-r01"]],
      ["wd-u2", ["wd-l04", "wd-l05"]],
      ["wd-u3", []],
    ]);
  });
});
