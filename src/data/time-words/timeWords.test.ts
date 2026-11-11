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

  it("lists two units after course unit 5, only unit 1 with a lesson so far", () => {
    expect(
      timeWordsUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      ["tm-u1", 5, "hoy, ahora, antes, temprano and more", ["tm-m01"]],
      ["tm-u2", 5, "por la mañana, siempre, desde and more", []],
    ]);
  });
});
