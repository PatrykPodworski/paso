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

  it("lists two units after course unit 5, only unit 1 with lessons so far", () => {
    expect(
      timeWordsUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      [
        "tm-u1",
        5,
        "hoy, ahora, antes, temprano and more",
        ["tm-m01", "tm-m02", "tm-m03", "tm-r01"],
      ],
      ["tm-u2", 5, "por la mañana, siempre, desde and more", []],
    ]);
  });
});
