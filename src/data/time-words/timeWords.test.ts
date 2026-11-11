import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { timeWordsLesson, timeWordsUnits } from "./timeWords";

const variations = Array.from(
  { length: 12 },
  (_, i) => `TM-T01-V${String(i + 1).padStart(2, "0")}`,
);

describe("time words lessons", () => {
  it.each([1, 2, 3])(
    "opens L01 on its introduction, the base items in order, then every variation (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-l01", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-l01",
        title: "Today",
        subtitle: "Learn one new time word",
      });

      expect(lesson.questions.slice(0, 7).map((q) => [q.id, q.kind])).toEqual([
        ["TM-T01-INTRO", "teach"],
        ["TM-T01-E01", "choice"],
        ["TM-T01-E02", "choice"],
        ["TM-T01-E03", "type"],
        ["TM-T01-E04", "type"],
        ["TM-T01-E05", "type"],
        ["TM-T01-E06", "choice"],
      ]);

      expect(
        lesson.questions
          .slice(7)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variations);
    },
  );

  it("shows hoy on the introduction card", () => {
    const [intro] = timeWordsLesson("tm-l01", randomFrom(1)).questions;

    expect([intro.prompt, intro.explanation]).toEqual([
      "New word: hoy",
      "hoy means today. Example: Clase de Pablo: hoy.",
    ]);
  });

  it("draws a new variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-l01", randomFrom(seed))
        .questions.slice(7)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("lists four units after course unit 5, only unit 1 with a lesson so far", () => {
    expect(
      timeWordsUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      ["tm-u1", 5, "hoy, mañana, ayer, ahora", ["tm-l01"]],
      ["tm-u2", 5, "antes, después, temprano, tarde", []],
      ["tm-u3", 5, "por la mañana, por la tarde, por la noche, siempre", []],
      ["tm-u4", 5, "a veces, nunca, desde, hasta", []],
    ]);
  });
});
