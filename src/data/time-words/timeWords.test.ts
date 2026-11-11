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

    expect([intro.prompt, intro.explanation, form.prompt, form.explanation]).toEqual([
      "New words: hoy, mañana, ayer",
      "hoy means today. Example: Clase de Pablo: hoy. mañana means tomorrow. Example: Reunión de Luis: mañana. ayer means yesterday. Example: Visita de Diego: ayer.",
      "mañana and la mañana",
      "mañana alone means tomorrow. With la, la mañana is the morning. In these exercises mañana means tomorrow.",
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

    expect([intro.prompt, intro.explanation, form.prompt, form.explanation]).toEqual([
      "New words: ahora, antes, después / luego",
      "ahora means now, at this moment. hoy is the whole day; ahora is this moment. Example: Trabajo ahora. antes means before, earlier. Example: Pablo come a las dos. Yo como antes. después and luego both mean after, later. Example: Desayuno y luego trabajo.",
      "después or luego",
      "Both mean after, later. Either one is right in these exercises. después has an accent on the é.",
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

    expect([intro.prompt, intro.explanation, form.prompt, form.explanation]).toEqual([
      "New words: temprano, tarde",
      "temprano means early, earlier than usual or than agreed. In Spain pronto means early too. Example: Hoy Pablo se levanta temprano. tarde means late, later than usual or than agreed. Example: Hoy me acuesto tarde.",
      "tarde and la tarde",
      "tarde alone means late. With la, la tarde is the afternoon. In these exercises tarde means late.",
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

    expect(cards.map((q) => [q.prompt, q.explanation])).toEqual([
      [
        "New words: por la mañana, por la tarde, por la noche",
        "por la mañana means in the morning. Example: Pablo estudia por la mañana. por la tarde means in the afternoon. Example: Luis trabaja por la tarde. por la noche means at night, in the evening. Example: Diego lee por la noche.",
      ],
      [
        "por la mañana, not mañana",
        "Keep all three words: por la mañana is in the morning. mañana alone means tomorrow.",
      ],
      [
        "por la tarde, not tarde",
        "Keep all three words: por la tarde is in the afternoon. tarde alone means late.",
      ],
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

    expect(cards.map((q) => [q.prompt, q.explanation])).toEqual([
      [
        "New words: siempre, a veces, nunca",
        "siempre means always. Example: Pablo siempre estudia en casa. a veces means sometimes. Example: Yo a veces voy en autobús. nunca means never. Example: Tomás nunca trabaja los sábados.",
      ],
      [
        "siempre and the verb",
        "siempre usually goes before the verb: Pablo siempre estudia en casa. After the verb is right too: Pablo estudia siempre en casa.",
      ],
      [
        "nunca, with or without no",
        "nunca before the verb is enough: Pablo nunca estudia en casa. With no, nunca goes after the verb: Pablo no estudia nunca en casa.",
      ],
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

  it("lists two units after course unit 5, unit 2 with its first lessons so far", () => {
    expect(
      timeWordsUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      [
        "tm-u1",
        5,
        "hoy, ahora, antes, temprano and more",
        ["tm-m01", "tm-m02", "tm-m03", "tm-r01"],
      ],
      ["tm-u2", 5, "por la mañana, siempre, desde and more", ["tm-m04", "tm-m05"]],
    ]);
  });
});
