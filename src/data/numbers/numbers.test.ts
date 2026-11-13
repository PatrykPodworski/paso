import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { numbersLesson, numbersUnits } from "./numbers";

// Each lesson as written: its intro card and base in order, with form cards before their item,
// then its variations, which the lesson shuffles. A review has no intro and no variations.
const LESSONS = [
  {
    id: "nu-m01",
    title: "Zero and one",
    subtitle: "cero, uno",
    terms: ["cero", "uno"],
    opening: [
      "NU-M01-INTRO",
      "NU-T01-E01",
      "NU-T02-E01",
      "NU-T01-E02",
      "NU-T02-E02",
      "NU-T01-E03",
      "NU-T02-E03",
      "NU-T01-E04",
      "NU-T02-E04-FORM",
      "NU-T02-E04",
      "NU-T01-E05",
      "NU-T02-E05",
    ],
    variations: ["NU-T01-E06", "NU-T01-V04", "NU-T02-E06", "NU-T02-V04"],
  },
  {
    id: "nu-m02",
    title: "Two and three",
    subtitle: "dos, tres",
    terms: ["dos", "tres"],
    opening: [
      "NU-M02-INTRO",
      "NU-T03-E01",
      "NU-T04-E01",
      "NU-T03-E02",
      "NU-T04-E02",
      "NU-T03-E03",
      "NU-T04-E03",
      "NU-T03-E04",
      "NU-T04-E04",
      "NU-T03-E05",
      "NU-T04-E05",
    ],
    variations: [
      "NU-T01-V01",
      "NU-T02-V03",
      "NU-T03-E06",
      "NU-T03-V01",
      "NU-T03-V02",
      "NU-T04-E06",
      "NU-T04-V01",
      "NU-T04-V02",
    ],
  },
  {
    id: "nu-m03",
    title: "Four and five",
    subtitle: "cuatro, cinco",
    terms: ["cuatro", "cinco"],
    opening: [
      "NU-M03-INTRO",
      "NU-T05-E01",
      "NU-T06-E01",
      "NU-T05-E02",
      "NU-T06-E02",
      "NU-T05-E03",
      "NU-T06-E03",
      "NU-T05-E04",
      "NU-T06-E04",
      "NU-T05-E05",
      "NU-T06-E05",
    ],
    variations: [
      "NU-T01-V02",
      "NU-T03-V03",
      "NU-T04-V03",
      "NU-T05-E06",
      "NU-T05-V01",
      "NU-T05-V02",
      "NU-T06-E06",
      "NU-T06-V01",
      "NU-T06-V02",
    ],
  },
  {
    id: "nu-m04",
    title: "Six and seven",
    subtitle: "seis, siete",
    terms: ["seis", "siete"],
    opening: [
      "NU-M04-INTRO",
      "NU-T07-E01",
      "NU-T08-E01",
      "NU-T07-E02",
      "NU-T08-E02",
      "NU-T07-E03",
      "NU-T08-E03",
      "NU-T07-E04",
      "NU-T08-E04",
      "NU-T07-E05",
      "NU-T08-E05",
    ],
    variations: [
      "NU-P04",
      "NU-T05-V03",
      "NU-T06-V03",
      "NU-T07-E06",
      "NU-T07-V01",
      "NU-T07-V02",
      "NU-T08-E06",
      "NU-T08-V01",
      "NU-T08-V02",
    ],
  },
  {
    id: "nu-r01",
    title: "Unit review",
    subtitle: "Review this unit's lessons",
    terms: [],
    opening: [
      "NU-T01-V09",
      "NU-T02-V09",
      "NU-T03-V09",
      "NU-T04-V09",
      "NU-T05-V09",
      "NU-T06-V09",
      "NU-T07-V09",
      "NU-T08-V09",
      "NU-T02-V10",
      "NU-T03-V10",
      "NU-T04-V10",
      "NU-T05-V10",
      "NU-T06-V10",
      "NU-T07-V10",
      "NU-T08-V10",
      "NU-Pr01",
      "NU-G11",
      "NU-G12",
    ],
    variations: [],
  },
];

describe("numbers lessons", () => {
  describe.each(LESSONS)("$id", ({ id, title, subtitle, terms, opening, variations }) => {
    it.each([1, 2, 3])(
      "opens on its intro card and base in order, then its variations (seed %i)",
      (seed) => {
        const lesson = numbersLesson(id, randomFrom(seed));

        expect(lesson).toMatchObject({ id, title, subtitle });
        expect(lesson.questions.slice(0, opening.length).map((q) => q.id)).toEqual(opening);

        expect(
          lesson.questions
            .slice(opening.length)
            .map((q) => q.id)
            .sort(),
        ).toEqual(variations);
      },
    );

    it("introduces its new numbers on one card", () => {
      const [first] = numbersLesson(id, randomFrom(1)).questions;

      expect(first.teach?.terms?.map((t) => t.es) ?? []).toEqual(terms);
    });

    it("draws a new variation order each time it opens, or keeps a review in order", () => {
      const orders = [1, 2, 3].map((seed) =>
        numbersLesson(id, randomFrom(seed))
          .questions.slice(opening.length)
          .map((q) => q.id)
          .join(),
      );

      if (variations.length) {
        expect(new Set(orders).size).toBeGreaterThan(1);
      } else {
        expect(new Set(orders).size).toBe(1);
      }
    });
  });

  it("lists four units, each after the course unit whose words it uses", () => {
    expect(
      numbersUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      ["nu-u1", 2, "cero to siete", ["nu-m01", "nu-m02", "nu-m03", "nu-m04", "nu-r01"]],
      ["nu-u2", 2, "ocho to quince", []],
      ["nu-u3", 3, "dieciséis to veintinueve", []],
      ["nu-u4", 4, "treinta to cien", []],
    ]);
  });
});
