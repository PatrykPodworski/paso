import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { timeWordsLesson, timeWordsUnits } from "./timeWords";

const VARIATIONS = [
  "TM-T01-E06",
  "TM-T01-V11",
  "TM-T02-E06",
  "TM-T02-V11",
  "TM-T03-E06",
  "TM-T03-V11",
];

const M02_VARIATIONS = [
  "TM-T01-V03",
  "TM-T02-V03",
  "TM-T03-V03",
  "TM-T04-E06",
  "TM-T04-V11",
  "TM-T05-E06",
  "TM-T05-V11",
  "TM-T06-E06",
  "TM-T06-V11",
];

const M03_VARIATIONS = [
  "TM-T01-V04",
  "TM-T02-V04",
  "TM-T03-V04",
  "TM-T04-V03",
  "TM-T05-V03",
  "TM-T06-V03",
  "TM-T07-E06",
  "TM-T07-V11",
  "TM-T08-E06",
  "TM-T08-V11",
];

const R01_ORDER = [
  "TM-T01-V09",
  "TM-T02-V09",
  "TM-T03-V09",
  "TM-T04-V09",
  "TM-T05-V09",
  "TM-T06-V09",
  "TM-T07-V09",
  "TM-T08-V09",
  "TM-T01-V10",
  "TM-T02-V10",
  "TM-T03-V10",
  "TM-T04-V10",
  "TM-T05-V10",
  "TM-T06-V10",
  "TM-T07-V10",
  "TM-T08-V10",
  "TM-G01",
  "TM-G02",
];

const M04_VARIATIONS = [
  "TM-T05-V04",
  "TM-T07-V03",
  "TM-T08-V03",
  "TM-T09-E06",
  "TM-T09-V11",
  "TM-T10-E06",
  "TM-T10-V11",
  "TM-T11-E06",
  "TM-T11-V11",
];

const M05_VARIATIONS = [
  "TM-T07-V04",
  "TM-T09-V03",
  "TM-T10-V03",
  "TM-T11-V03",
  "TM-T12-E06",
  "TM-T12-V11",
  "TM-T13-E06",
  "TM-T13-V11",
  "TM-T14-E06",
  "TM-T14-V11",
];

const M06_VARIATIONS = [
  "TM-T04-V04",
  "TM-T08-V04",
  "TM-T10-V04",
  "TM-T12-V03",
  "TM-T13-V03",
  "TM-T14-V03",
  "TM-T15-E06",
  "TM-T15-V11",
  "TM-T16-E06",
  "TM-T16-V11",
];

const R02_ORDER = [
  "TM-T09-V09",
  "TM-T10-V09",
  "TM-T11-V09",
  "TM-T12-V09",
  "TM-T13-V09",
  "TM-T14-V09",
  "TM-T15-V09",
  "TM-T16-V09",
  "TM-T09-V10",
  "TM-T10-V10",
  "TM-T11-V10",
  "TM-T12-V10",
  "TM-T13-V10",
  "TM-T14-V10",
  "TM-T15-V10",
  "TM-T16-V10",
  "TM-G03",
  "TM-G04",
];

describe("time words lessons", () => {
  it.each([1, 2, 3])(
    "opens M01 on its introduction, the three words alternating in the base, then every variation (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-m01", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-m01",
        title: "Today, tomorrow, yesterday",
        subtitle: "hoy, mañana, ayer",
      });

      expect(lesson.questions.slice(0, 14).map((q) => [q.id, q.kind])).toEqual([
        ["TM-M01-INTRO", "teach"],
        ["TM-T01-E01", "choice"],
        ["TM-T02-E01", "choice"],
        ["TM-T03-E01", "choice"],
        ["TM-T01-E03", "type"],
        ["TM-T02-E03", "type"],
        ["TM-T03-E03", "type"],
        ["TM-T01-E04", "type"],
        ["TM-T02-E04-FORM", "teach"],
        ["TM-T02-E04", "type"],
        ["TM-T03-E04", "type"],
        ["TM-T01-E05", "type"],
        ["TM-T02-E05", "type"],
        ["TM-T03-E05", "type"],
      ]);

      expect(
        lesson.questions
          .slice(14)
          .map((q) => q.id)
          .sort(),
      ).toEqual(VARIATIONS);
    },
  );

  it("introduces the three words on one card and tells mañana from la mañana on its form card", () => {
    const { questions } = timeWordsLesson("tm-m01", randomFrom(1));
    const [intro] = questions;
    const form = questions.find((q) => q.id === "TM-T02-E04-FORM")!;

    expect([intro.teach, form.teach]).toEqual([
      {
        heading: "New words",
        terms: [
          {
            es: "hoy",
            meaning: "today",
            example: { es: "Clase de Pablo: hoy.", en: "Pablo's class: today." },
          },
          {
            es: "mañana",
            meaning: "tomorrow",
            example: { es: "Reunión de Luis: mañana.", en: "Luis's meeting: tomorrow." },
          },
          {
            es: "ayer",
            meaning: "yesterday",
            example: { es: "Visita de Diego: ayer.", en: "Diego's visit: yesterday." },
          },
        ],
      },
      {
        heading: "mañana and la mañana",
        rule: "mañana alone means tomorrow, as in these exercises; la mañana is the morning.",
      },
    ]);
  });

  it("draws a new variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-m01", randomFrom(seed))
        .questions.slice(14)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens M02 on its introduction, ahora, antes and después alternating in the base, then its variations and the mixed-in hoy, mañana and ayer (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-m02", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-m02",
        title: "Now, earlier, later",
        subtitle: "ahora, antes, después",
      });

      expect(lesson.questions.slice(0, 14).map((q) => [q.id, q.kind])).toEqual([
        ["TM-M02-INTRO", "teach"],
        ["TM-T04-E01", "choice"],
        ["TM-T05-E01", "choice"],
        ["TM-T06-E01", "choice"],
        ["TM-T04-E03", "type"],
        ["TM-T05-E03", "type"],
        ["TM-T06-E03", "type"],
        ["TM-T04-E04", "type"],
        ["TM-T05-E04", "type"],
        ["TM-T06-E04-FORM", "teach"],
        ["TM-T06-E04", "type"],
        ["TM-T04-E05", "type"],
        ["TM-T05-E05", "type"],
        ["TM-T06-E05", "type"],
      ]);

      expect(
        lesson.questions
          .slice(14)
          .map((q) => q.id)
          .sort(),
      ).toEqual(M02_VARIATIONS);
    },
  );

  it("introduces ahora, antes and después / luego on one card and tells después from luego on its form card", () => {
    const { questions } = timeWordsLesson("tm-m02", randomFrom(1));
    const [intro] = questions;
    const form = questions.find((q) => q.id === "TM-T06-E04-FORM")!;

    expect([intro.teach, form.teach]).toEqual([
      {
        heading: "New words",
        terms: [
          {
            es: "ahora",
            meaning: "now, at this moment",
            example: { es: "Trabajo ahora.", en: "I'm working now." },
            note: "hoy is the whole day; ahora is this moment.",
          },
          {
            es: "antes",
            meaning: "before, earlier",
            example: {
              es: "Pablo come a las dos. Yo como antes.",
              en: "Pablo eats at two. I eat earlier.",
            },
          },
          {
            es: "después / luego",
            meaning: "after, later",
            example: { es: "Desayuno y luego trabajo.", en: "I have breakfast and then I work." },
            note: "Both words mean the same.",
          },
        ],
      },
      {
        heading: "después or luego",
        rule: "Both mean after, later, so either one is right; después has an accent on the é.",
      },
    ]);
  });

  it("draws a new M02 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-m02", randomFrom(seed))
        .questions.slice(14)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens M03 on its introduction, temprano and tarde alternating in the base, then its variations and the mixed-in words of M01 and M02 (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-m03", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-m03",
        title: "Early and late",
        subtitle: "temprano, tarde",
      });

      expect(lesson.questions.slice(0, 10).map((q) => [q.id, q.kind])).toEqual([
        ["TM-M03-INTRO", "teach"],
        ["TM-T07-E01", "choice"],
        ["TM-T08-E01", "choice"],
        ["TM-T07-E03", "type"],
        ["TM-T08-E03", "type"],
        ["TM-T07-E04", "type"],
        ["TM-T08-E04-FORM", "teach"],
        ["TM-T08-E04", "type"],
        ["TM-T07-E05", "type"],
        ["TM-T08-E05", "type"],
      ]);

      expect(
        lesson.questions
          .slice(10)
          .map((q) => q.id)
          .sort(),
      ).toEqual(M03_VARIATIONS);
    },
  );

  it("introduces temprano and tarde on one card and tells tarde from la tarde on its form card", () => {
    const { questions } = timeWordsLesson("tm-m03", randomFrom(1));
    const [intro] = questions;
    const form = questions.find((q) => q.id === "TM-T08-E04-FORM")!;

    expect([intro.teach, form.teach]).toEqual([
      {
        heading: "New words",
        terms: [
          {
            es: "temprano",
            meaning: "early, earlier than usual or than agreed",
            example: { es: "Hoy Pablo se levanta temprano.", en: "Today Pablo gets up early." },
            note: "In Spain pronto means early too.",
          },
          {
            es: "tarde",
            meaning: "late, later than usual or than agreed",
            example: { es: "Hoy me acuesto tarde.", en: "Today I go to bed late." },
          },
        ],
      },
      {
        heading: "tarde and la tarde",
        rule: "tarde alone means late, as in these exercises; la tarde is the afternoon.",
      },
    ]);
  });

  it("draws a new M03 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-m03", randomFrom(seed))
        .questions.slice(10)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens R01 without an introduction, in its written order on every opening (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-r01", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-r01",
        title: "Unit review",
        subtitle: "Review this unit's lessons",
      });

      expect(lesson.questions.map((q) => q.id)).toEqual(R01_ORDER);
    },
  );

  it.each([1, 2, 3])(
    "opens M04 on its introduction, the three day parts alternating in the base, then its variations and the mixed-in words of M02 and M03 (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-m04", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-m04",
        title: "Morning, afternoon, night",
        subtitle: "por la mañana, por la tarde, por la noche",
      });

      expect(lesson.questions.slice(0, 15).map((q) => [q.id, q.kind])).toEqual([
        ["TM-M04-INTRO", "teach"],
        ["TM-T09-E01", "choice"],
        ["TM-T10-E01", "choice"],
        ["TM-T11-E01", "choice"],
        ["TM-T09-E03", "type"],
        ["TM-T10-E03", "type"],
        ["TM-T11-E03", "type"],
        ["TM-T09-E04-FORM", "teach"],
        ["TM-T09-E04", "type"],
        ["TM-T10-E04-FORM", "teach"],
        ["TM-T10-E04", "type"],
        ["TM-T11-E04", "type"],
        ["TM-T09-E05", "type"],
        ["TM-T10-E05", "type"],
        ["TM-T11-E05", "type"],
      ]);

      expect(
        lesson.questions
          .slice(15)
          .map((q) => q.id)
          .sort(),
      ).toEqual(M04_VARIATIONS);
    },
  );

  it("introduces the three day parts on one card and tells each from the word alone on its form card", () => {
    const { questions } = timeWordsLesson("tm-m04", randomFrom(1));

    const cards = ["TM-M04-INTRO", "TM-T09-E04-FORM", "TM-T10-E04-FORM"].map((id) =>
      questions.find((q) => q.id === id)!,
    );

    expect(cards.map((q) => q.teach)).toEqual([
      {
        heading: "New words",
        terms: [
          {
            es: "por la mañana",
            meaning: "in the morning",
            example: { es: "Pablo estudia por la mañana.", en: "Pablo studies in the morning." },
          },
          {
            es: "por la tarde",
            meaning: "in the afternoon",
            example: { es: "Luis trabaja por la tarde.", en: "Luis works in the afternoon." },
          },
          {
            es: "por la noche",
            meaning: "at night, in the evening",
            example: { es: "Diego lee por la noche.", en: "Diego reads at night." },
          },
        ],
      },
      {
        heading: "por la mañana, not mañana",
        rule: "Keep all three words: por la mañana is in the morning, and mañana alone means tomorrow.",
      },
      {
        heading: "por la tarde, not tarde",
        rule: "Keep all three words: por la tarde is in the afternoon, and tarde alone means late.",
      },
    ]);
  });

  it("draws a new M04 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-m04", randomFrom(seed))
        .questions.slice(15)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens M05 on its introduction, the three frequency words alternating in the base, then its variations and the mixed-in words of M03 and M04 (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-m05", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-m05",
        title: "Always, sometimes, never",
        subtitle: "siempre, a veces, nunca",
      });

      expect(lesson.questions.slice(0, 15).map((q) => [q.id, q.kind])).toEqual([
        ["TM-M05-INTRO", "teach"],
        ["TM-T12-E01", "choice"],
        ["TM-T13-E01", "choice"],
        ["TM-T14-E01", "choice"],
        ["TM-T12-E03", "type"],
        ["TM-T13-E03", "type"],
        ["TM-T14-E03", "type"],
        ["TM-T12-E04-FORM", "teach"],
        ["TM-T12-E04", "type"],
        ["TM-T13-E04", "type"],
        ["TM-T14-E04-FORM", "teach"],
        ["TM-T14-E04", "type"],
        ["TM-T12-E05", "type"],
        ["TM-T13-E05", "type"],
        ["TM-T14-E05", "type"],
      ]);

      expect(
        lesson.questions
          .slice(15)
          .map((q) => q.id)
          .sort(),
      ).toEqual(M05_VARIATIONS);
    },
  );

  it("introduces the three frequency words on one card and places siempre and nunca on their form cards", () => {
    const { questions } = timeWordsLesson("tm-m05", randomFrom(1));

    const cards = ["TM-M05-INTRO", "TM-T12-E04-FORM", "TM-T14-E04-FORM"].map((id) =>
      questions.find((q) => q.id === id)!,
    );

    expect(cards.map((q) => q.teach)).toEqual([
      {
        heading: "New words",
        terms: [
          {
            es: "siempre",
            meaning: "always",
            example: { es: "Pablo siempre estudia en casa.", en: "Pablo always studies at home." },
          },
          {
            es: "a veces",
            meaning: "sometimes",
            example: { es: "Yo a veces voy en autobús.", en: "I sometimes go by bus." },
          },
          {
            es: "nunca",
            meaning: "never",
            example: {
              es: "Tomás nunca trabaja los sábados.",
              en: "Tomás never works on Saturdays.",
            },
          },
        ],
      },
      {
        heading: "siempre and the verb",
        rule: "siempre usually goes before the verb, but after the verb is right too.",
        examples: [
          { es: "Pablo siempre estudia en casa.", en: "Pablo always studies at home." },
          { es: "Pablo estudia siempre en casa.", en: "Pablo always studies at home." },
        ],
      },
      {
        heading: "nunca, with or without no",
        rule: "nunca before the verb is enough; with no, nunca goes after the verb.",
        examples: [
          { es: "Pablo nunca estudia en casa.", en: "Pablo never studies at home." },
          { es: "Pablo no estudia nunca en casa.", en: "Pablo never studies at home." },
        ],
      },
    ]);
  });

  it("draws a new M05 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-m05", randomFrom(seed))
        .questions.slice(15)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens M06 on its introduction, desde and hasta alternating in the base, then its variations and the mixed-in words of earlier lessons (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-m06", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-m06",
        title: "From and until",
        subtitle: "desde, hasta",
      });

      expect(lesson.questions.slice(0, 9).map((q) => [q.id, q.kind])).toEqual([
        ["TM-M06-INTRO", "teach"],
        ["TM-T15-E01", "choice"],
        ["TM-T16-E01", "choice"],
        ["TM-T15-E03", "type"],
        ["TM-T16-E03", "type"],
        ["TM-T15-E04", "type"],
        ["TM-T16-E04", "type"],
        ["TM-T15-E05", "type"],
        ["TM-T16-E05", "type"],
      ]);

      expect(
        lesson.questions
          .slice(9)
          .map((q) => q.id)
          .sort(),
      ).toEqual(M06_VARIATIONS);
    },
  );

  it("introduces desde and hasta on one card", () => {
    const [intro] = timeWordsLesson("tm-m06", randomFrom(1)).questions;

    expect(intro.teach).toEqual({
      heading: "New words",
      terms: [
        {
          es: "desde",
          meaning: "from; it gives the start time",
          example: { es: "Trabajo desde las nueve.", en: "I work from nine." },
        },
        {
          es: "hasta",
          meaning: "until; it gives the end time",
          example: { es: "Trabajo hasta las cinco.", en: "I work until five." },
        },
      ],
    });
  });

  it("draws a new M06 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-m06", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens R02 without an introduction, in its written order on every opening (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-r02", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-r02",
        title: "Unit review",
        subtitle: "Review this unit's lessons",
      });

      expect(lesson.questions.map((q) => q.id)).toEqual(R02_ORDER);
    },
  );

  it("lists two units after course unit 5, each with its three lessons and its review", () => {
    expect(
      timeWordsUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      [
        "tm-u1",
        5,
        "hoy, ahora, antes, temprano and more",
        ["tm-m01", "tm-m02", "tm-m03", "tm-r01"],
      ],
      [
        "tm-u2",
        5,
        "por la mañana, siempre, desde and more",
        ["tm-m04", "tm-m05", "tm-m06", "tm-r02"],
      ],
    ]);
  });
});
