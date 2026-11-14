import { describe, expect, it } from "vitest";
import { shownTokens } from "../optionOrder";
import { randomFrom } from "../random";
import { weekdaysLesson, weekdaysLessons, weekdaysUnits } from "./weekdays";

// Each lesson's opening runs in written order; its variations follow in an order drawn from the
// seed. A review has no opening.
const lessons = [
  {
    id: "wd-m01",
    title: "Monday to Wednesday",
    subtitle: "Learn three new days",
    opening: [
      ["WD-M01-INTRO", "teach"],
      ["WD-T02-E01", "choice"],
      ["WD-T01-E01", "choice"],
      ["WD-T03-E01", "choice"],
      ["WD-T03-E03", "type"],
      ["WD-T01-E03", "type"],
      ["WD-T02-E03", "type"],
      ["WD-T01-E04-FORM", "teach"],
      ["WD-T01-E04", "type"],
      ["WD-T03-E04", "type"],
      ["WD-T02-E04", "type"],
      ["WD-T03-N01", "type"],
      ["WD-T01-N01", "type"],
      ["WD-T02-N01", "type"],
      ["WD-T01-N02", "type"],
      ["WD-T03-N02", "type"],
      ["WD-T02-N02", "type"],
    ],
    variations: [
      "WD-T01-N07",
      "WD-T01-V01",
      "WD-T02-N07",
      "WD-T02-V01",
      "WD-T03-N07",
      "WD-T03-V01",
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
      ["WD-T04-N01", "type"],
      ["WD-T05-N01", "type"],
      ["WD-T04-N02", "type"],
      ["WD-T05-N02", "type"],
    ],
    variations: [
      "WD-T01-E02",
      "WD-T01-N03",
      "WD-T02-E02",
      "WD-T02-N03",
      "WD-T03-E02",
      "WD-T03-N03",
      "WD-T04-N07",
      "WD-T04-V01",
      "WD-T05-N07",
      "WD-T05-V01",
    ],
  },
  {
    id: "wd-mr01",
    title: "Monday to Friday",
    subtitle: "Review the five days so far",
    opening: [],
    variations: [
      "WD-T01-N04",
      "WD-T01-N08",
      "WD-T01-V03",
      "WD-T01-V09",
      "WD-T02-N04",
      "WD-T02-N08",
      "WD-T02-V03",
      "WD-T02-V11",
      "WD-T03-N04",
      "WD-T03-N08",
      "WD-T03-V03",
      "WD-T03-V11",
      "WD-T04-E02",
      "WD-T04-N04",
      "WD-T04-N08",
      "WD-T04-V03",
      "WD-T04-V09",
      "WD-T05-E02",
      "WD-T05-N04",
      "WD-T05-N08",
      "WD-T05-V03",
      "WD-T05-V09",
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
      ["WD-T06-N01", "type"],
      ["WD-T07-N01", "type"],
      ["WD-T06-N02", "type"],
      ["WD-T07-N02", "type"],
    ],
    variations: [
      "WD-T01-V05",
      "WD-T02-V05",
      "WD-T03-V05",
      "WD-T04-N05",
      "WD-T05-N05",
      "WD-T06-N07",
      "WD-T06-V01",
      "WD-T06-V09",
      "WD-T07-N07",
      "WD-T07-V07",
      "WD-T07-V09",
    ],
  },
  {
    id: "wd-mr02",
    title: "The whole week",
    subtitle: "Review all seven days and their order",
    opening: [],
    variations: [
      "WD-G01-C01",
      "WD-G01-C02",
      "WD-G01-C03",
      "WD-G01-C04",
      "WD-G01-C05",
      "WD-G01-C06",
      "WD-G01-C07",
      "WD-G02-C01",
      "WD-G02-C02",
      "WD-G02-C03",
      "WD-G02-C04",
      "WD-G02-C05",
      "WD-G02-C06",
      "WD-G02-C07",
      "WD-G03",
      "WD-G04-C01",
      "WD-G04-C02",
      "WD-T06-E02",
      "WD-T06-N04",
      "WD-T07-E02",
      "WD-T07-E04",
      "WD-T07-N04",
      "WD-T07-N08",
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

    it("draws its variation order from the seed", () => {
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
      {
        heading: "New days: lunes, martes, miércoles",
        terms: [
          {
            es: "lunes",
            meaning: "Monday",
            example: { es: "Hoy es lunes.", en: "Today is Monday." },
            note: "From la Luna, the Moon.",
          },
          { es: "martes", meaning: "Tuesday", note: "From Marte, Mars." },
          {
            es: "miércoles",
            meaning: "Wednesday",
            note: "From Mercurio, Mercury. Write it with the accent on the é.",
          },
        ],
      },
      {
        heading: "el lunes, los lunes",
        rule: "el is one day, los is every day. lunes, martes and miércoles stay the same, and days are written in lowercase.",
        examples: [
          { es: "el lunes", en: "one Monday" },
          { es: "los lunes", en: "every Monday" },
        ],
      },
    ],
    [
      "wd-m02",
      {
        heading: "New days: jueves, viernes",
        terms: [
          {
            es: "jueves",
            meaning: "Thursday",
            example: { es: "La visita es el jueves.", en: "The visit is on Thursday." },
            note: "From Júpiter, Jupiter.",
          },
          { es: "viernes", meaning: "Friday", note: "From Venus." },
        ],
      },
      {
        heading: "el jueves, los jueves",
        rule: "jueves and viernes end in -s already, so they stay the same for every week.",
        examples: [
          { es: "los jueves", en: "every Thursday" },
          { es: "los viernes", en: "every Friday" },
        ],
      },
    ],
    [
      "wd-m03",
      {
        heading: "New days: sábado, domingo",
        terms: [
          {
            es: "sábado",
            meaning: "Saturday",
            example: { es: "Hoy es sábado.", en: "Today is Saturday." },
            note: "From the Sabbath, the day of rest. Write it with the accent on the á.",
          },
          {
            es: "domingo",
            meaning: "Sunday",
            note: "From dies Dominicus, Latin for the Lord’s day.",
          },
        ],
      },
      {
        heading: "el sábado, los sábados",
        rule: "sábado and domingo add -s for every week.",
        examples: [
          { es: "el sábado", en: "one Saturday" },
          { es: "los sábados", en: "every Saturday" },
          { es: "los domingos", en: "every Sunday" },
        ],
      },
    ],
  ])("shows the %s introduction and form cards", (id, intro, form) => {
    const questions = weekdaysLesson(id, randomFrom(1)).questions;
    const formCard = questions.find((q) => q.id.endsWith("-FORM"))!;

    expect([questions[0].prompt, questions[0].teach]).toEqual([intro.heading, intro]);
    expect([formCard.prompt, formCard.teach]).toEqual([form.heading, form]);
  });

  it("gives every teaching card structured content, none a plain-text paragraph", () => {
    const cards = weekdaysLessons
      .flatMap((l) => weekdaysLesson(l.id, randomFrom(1)).questions)
      .filter((q) => q.kind === "teach");

    expect(cards.map((q) => [q.id, q.explanation, !!q.teach])).toEqual([
      ["WD-M01-INTRO", "", true],
      ["WD-T01-E04-FORM", "", true],
      ["WD-M02-INTRO", "", true],
      ["WD-T04-E04-FORM", "", true],
      ["WD-M03-INTRO", "", true],
      ["WD-T06-E04-FORM", "", true],
    ]);
  });

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
