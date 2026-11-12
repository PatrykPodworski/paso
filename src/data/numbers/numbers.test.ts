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
  {
    id: "nu-m05",
    title: "Eight and nine",
    subtitle: "ocho, nueve",
    terms: ["ocho", "nueve"],
    opening: [
      "NU-M05-INTRO",
      "NU-T09-E01",
      "NU-T10-E01",
      "NU-T09-E02",
      "NU-T10-E02",
      "NU-T09-E03",
      "NU-T10-E03",
      "NU-T09-E04",
      "NU-T10-E04",
      "NU-T09-E05",
      "NU-T10-E05",
    ],
    variations: [
      "NU-P05",
      "NU-T07-V03",
      "NU-T08-V03",
      "NU-T09-E06",
      "NU-T09-V01",
      "NU-T09-V02",
      "NU-T10-E06",
      "NU-T10-V01",
      "NU-T10-V02",
    ],
  },
  {
    id: "nu-m06",
    title: "Ten and eleven",
    subtitle: "diez, once",
    terms: ["diez", "once"],
    opening: [
      "NU-M06-INTRO",
      "NU-T11-E01",
      "NU-T12-E01",
      "NU-T11-E02",
      "NU-T12-E02",
      "NU-T11-E03",
      "NU-T12-E03",
      "NU-T11-E04",
      "NU-T12-E04",
      "NU-T11-E05",
      "NU-T12-E05",
    ],
    variations: [
      "NU-P06",
      "NU-T09-V03",
      "NU-T10-V03",
      "NU-T11-E06",
      "NU-T11-V01",
      "NU-T11-V02",
      "NU-T12-E06",
      "NU-T12-V01",
      "NU-T12-V02",
    ],
  },
  {
    id: "nu-m07",
    title: "Twelve and thirteen",
    subtitle: "doce, trece",
    terms: ["doce", "trece"],
    opening: [
      "NU-M07-INTRO",
      "NU-T13-E01",
      "NU-T14-E01",
      "NU-T13-E02",
      "NU-T14-E02",
      "NU-T13-E03",
      "NU-T14-E03",
      "NU-T13-E04",
      "NU-T14-E04",
      "NU-T13-E05",
      "NU-T14-E05",
    ],
    variations: [
      "NU-P07",
      "NU-T11-V03",
      "NU-T12-V03",
      "NU-T13-E06",
      "NU-T13-V01",
      "NU-T13-V02",
      "NU-T14-E06",
      "NU-T14-V01",
      "NU-T14-V02",
    ],
  },
  {
    id: "nu-m08",
    title: "Fourteen and fifteen",
    subtitle: "catorce, quince",
    terms: ["catorce", "quince"],
    opening: [
      "NU-M08-INTRO",
      "NU-T15-E01",
      "NU-T16-E01",
      "NU-T15-E02",
      "NU-T16-E02",
      "NU-T15-E03",
      "NU-T16-E03",
      "NU-T15-E04",
      "NU-T16-E04",
      "NU-T15-E05",
      "NU-T16-E05",
    ],
    variations: [
      "NU-P08",
      "NU-T13-V03",
      "NU-T14-V03",
      "NU-T15-E06",
      "NU-T15-V01",
      "NU-T15-V02",
      "NU-T16-E06",
      "NU-T16-V01",
      "NU-T16-V02",
    ],
  },
  {
    id: "nu-r02",
    title: "Unit review",
    subtitle: "Review this unit's lessons",
    terms: [],
    opening: [
      "NU-T09-V09",
      "NU-T10-V09",
      "NU-T11-V09",
      "NU-T12-V09",
      "NU-T13-V09",
      "NU-T14-V09",
      "NU-T15-V09",
      "NU-T16-V09",
      "NU-T09-V10",
      "NU-T10-V10",
      "NU-T11-V10",
      "NU-T12-V10",
      "NU-T13-V10",
      "NU-T14-V10",
      "NU-T15-V10",
      "NU-T16-V10",
      "NU-Pr02",
      "NU-G21",
      "NU-G22",
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
      ["nu-u2", 2, "ocho to quince", ["nu-m05", "nu-m06", "nu-m07", "nu-m08", "nu-r02"]],
      ["nu-u3", 3, "dieciséis to veintinueve", []],
      ["nu-u4", 4, "treinta to cien", []],
    ]);
  });
});
