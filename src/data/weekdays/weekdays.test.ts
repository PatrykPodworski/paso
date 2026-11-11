import { describe, expect, it } from "vitest";
import { shownTokens } from "../optionOrder";
import { randomFrom } from "../random";
import { weekdaysLesson, weekdaysUnits } from "./weekdays";

const calendar = [
  ["WD-G01-C01", "type"],
  ["WD-G01-C02", "type"],
  ["WD-G01-C03", "type"],
  ["WD-G01-C04", "type"],
  ["WD-G01-C05", "type"],
  ["WD-G01-C06", "type"],
  ["WD-G01-C07", "type"],
  ["WD-G02-C01", "choice"],
  ["WD-G02-C02", "choice"],
  ["WD-G02-C03", "choice"],
  ["WD-G02-C04", "choice"],
  ["WD-G02-C05", "choice"],
  ["WD-G02-C06", "choice"],
  ["WD-G02-C07", "choice"],
  ["WD-G03", "order"],
  ["WD-G04-C01", "type"],
  ["WD-G04-C02", "type"],
];

// Each lesson's opening runs in written order; its variations follow in an order drawn anew.
const lessons = [
  {
    id: "wd-m01",
    title: "Monday to Wednesday",
    subtitle: "Learn three new days",
    opening: [
      ["WD-M01-INTRO", "teach"],
      ["WD-T01-E01", "choice"],
      ["WD-T02-E01", "choice"],
      ["WD-T03-E01", "choice"],
      ["WD-T01-E03", "type"],
      ["WD-T02-E03", "type"],
      ["WD-T03-E03", "type"],
      ["WD-T01-E04-FORM", "teach"],
      ["WD-T01-E04", "type"],
      ["WD-T02-E04", "type"],
      ["WD-T03-E04", "type"],
      ["WD-T01-E05", "type"],
      ["WD-T02-E05", "type"],
      ["WD-T03-E05", "type"],
      ["WD-T01-E06", "write"],
      ["WD-T02-E06", "write"],
      ["WD-T03-E06", "write"],
    ],
    variations: [
      "WD-T01-V01",
      "WD-T01-V10",
      "WD-T02-V01",
      "WD-T02-V10",
      "WD-T03-V01",
      "WD-T03-V10",
    ],
  },
  {
    id: "wd-m02",
    title: "Thursday and Friday",
    subtitle: "Learn two new days, mixed with Monday to Wednesday",
    opening: [
      ["WD-M02-INTRO", "teach"],
      ["WD-T04-E01", "choice"],
      ["WD-T05-E01", "choice"],
      ["WD-T04-E03", "type"],
      ["WD-T05-E03", "type"],
      ["WD-T04-E04-FORM", "teach"],
      ["WD-T04-E04", "type"],
      ["WD-T05-E04", "type"],
      ["WD-T04-E05", "type"],
      ["WD-T05-E05", "type"],
      ["WD-T04-E06", "write"],
      ["WD-T05-E06", "write"],
    ],
    variations: [
      "WD-T01-E02",
      "WD-T01-V02",
      "WD-T02-E02",
      "WD-T02-V02",
      "WD-T03-E02",
      "WD-T03-V02",
      "WD-T04-V01",
      "WD-T04-V10",
      "WD-T05-V01",
      "WD-T05-V10",
    ],
  },
  {
    id: "wd-mr01",
    title: "Monday to Friday",
    subtitle: "Review the five days so far",
    opening: [],
    variations: [
      "WD-T01-V03",
      "WD-T01-V04",
      "WD-T01-V09",
      "WD-T01-V12",
      "WD-T02-V03",
      "WD-T02-V04",
      "WD-T02-V11",
      "WD-T02-V12",
      "WD-T03-V03",
      "WD-T03-V04",
      "WD-T03-V11",
      "WD-T03-V12",
      "WD-T04-E02",
      "WD-T04-V03",
      "WD-T04-V04",
      "WD-T04-V09",
      "WD-T04-V12",
      "WD-T05-E02",
      "WD-T05-V03",
      "WD-T05-V04",
      "WD-T05-V09",
      "WD-T05-V12",
    ],
  },
  {
    id: "wd-m03",
    title: "Saturday and Sunday",
    subtitle: "Learn the weekend, mixed with Monday to Friday",
    opening: [
      ["WD-M03-INTRO", "teach"],
      ["WD-T06-E01", "choice"],
      ["WD-T07-E01", "choice"],
      ["WD-T06-E03", "type"],
      ["WD-T07-E03", "type"],
      ["WD-T06-E04-FORM", "teach"],
      ["WD-T06-E04", "type"],
      ["WD-T07-V01", "type"],
      ["WD-T06-E05", "type"],
      ["WD-T07-E05", "type"],
      ["WD-T06-E06", "write"],
      ["WD-T07-E06", "write"],
    ],
    variations: [
      "WD-T01-V05",
      "WD-T02-V05",
      "WD-T03-V05",
      "WD-T04-V06",
      "WD-T05-V06",
      "WD-T06-V01",
      "WD-T06-V09",
      "WD-T06-V10",
      "WD-T07-V07",
      "WD-T07-V09",
      "WD-T07-V10",
    ],
  },
  {
    id: "wd-mr02",
    title: "The whole week",
    subtitle: "Review all seven days and their order",
    opening: calendar,
    variations: [
      "WD-T06-E02",
      "WD-T06-V04",
      "WD-T07-E02",
      "WD-T07-E04",
      "WD-T07-V04",
      "WD-T07-V12",
    ],
  },
];

describe("weekdays lessons", () => {
  describe.each(lessons)("$id", ({ id, title, subtitle, opening, variations }) => {
    it.each([1, 2, 3])(
      "opens on its introduction and base items in order, then every variation (seed %i)",
      (seed) => {
        const lesson = weekdaysLesson(id, randomFrom(seed));

        expect(lesson).toMatchObject({ id, title, subtitle });

        expect(lesson.questions.slice(0, opening.length).map((q) => [q.id, q.kind])).toEqual(
          opening,
        );

        expect(
          lesson.questions
            .slice(opening.length)
            .map((q) => q.id)
            .sort(),
        ).toEqual(variations);
      },
    );

    it("draws a new variation order each time the lesson opens", () => {
      const orders = [1, 2, 3].map((seed) =>
        weekdaysLesson(id, randomFrom(seed))
          .questions.slice(opening.length)
          .map((q) => q.id)
          .join(),
      );

      expect(new Set(orders).size).toBe(3);
    });
  });

  it.each([
    [
      "wd-m01",
      "New days: lunes, martes, miércoles",
      "lunes is Monday, from la Luna, the Moon. martes is Tuesday, from Marte, Mars. miércoles is Wednesday, from Mercurio, Mercury: write it with the accent on the é. Example: Hoy es lunes.",
      "el lunes, los lunes",
      "el lunes is one Monday. los lunes is every Monday: lunes, martes and miércoles stay the same. Days are written in lowercase.",
    ],
    [
      "wd-m02",
      "New days: jueves, viernes",
      "jueves is Thursday, from Júpiter, Jupiter. viernes is Friday, from Venus. Example: La visita es el jueves.",
      "el jueves, los jueves",
      "jueves and viernes end in -s already, so every Thursday is los jueves and every Friday los viernes.",
    ],
    [
      "wd-m03",
      "New days: sábado, domingo",
      "sábado is Saturday, from the Sabbath, the day of rest: write it with the accent on the á. domingo is Sunday, from dies Dominicus, Latin for the Lord’s day. Example: Hoy es sábado.",
      "el sábado, los sábados",
      "el sábado is one Saturday. los sábados is every Saturday: sábado and domingo add -s, so every Sunday is los domingos.",
    ],
  ])(
    "shows the %s introduction and form cards",
    (id, introHeading, introText, formHeading, formText) => {
      const questions = weekdaysLesson(id, randomFrom(1)).questions;
      const form = questions.find((q) => q.id.endsWith("-FORM"))!;

      expect([questions[0].prompt, questions[0].explanation]).toEqual([introHeading, introText]);
      expect([form.prompt, form.explanation]).toEqual([formHeading, formText]);
    },
  );

  it("shows the MR02 week tiles in another order on each attempt, never already in order", () => {
    const g03 = weekdaysLesson("wd-mr02", randomFrom(1)).questions.find((q) => q.id === "WD-G03")!;
    const [first, second] = [1, 2].map((seed) => shownTokens(g03, seed).join(" "));

    expect(first).not.toBe(second);

    for (const shown of [first, second]) {
      expect(shown).not.toBe("lunes martes miércoles jueves viernes sábado domingo");
      expect(shown.split(" ").toSorted()).toEqual(g03.answer.split(" ").toSorted());
    }
  });

  it("lists unit 1 with M01, M02 and MR01, and unit 2 with M03 and MR02", () => {
    expect(weekdaysUnits.map((u) => [u.id, u.subtitle, u.lessons.map((l) => l.id)])).toEqual([
      ["wd-u1", "lunes to viernes", ["wd-m01", "wd-m02", "wd-mr01"]],
      ["wd-u2", "the weekend and the whole week", ["wd-m03", "wd-mr02"]],
    ]);
  });
});
