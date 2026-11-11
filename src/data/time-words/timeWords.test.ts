import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { timeWordsLesson, timeWordsUnits } from "./timeWords";

const variationsOf = (word: string) =>
  Array.from({ length: 12 }, (_, i) => `TM-${word}-V${String(i + 1).padStart(2, "0")}`);

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
      ).toEqual(variationsOf("T01"));
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

  it.each([1, 2, 3])(
    "opens L02 on the recalled T01-V09, its introduction, the base items with the form card before E04, then every variation (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-l02", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-l02",
        title: "Tomorrow",
        subtitle: "Learn one new time word",
      });

      expect(lesson.questions.slice(0, 9).map((q) => [q.id, q.kind])).toEqual([
        ["TM-T01-V09", "type"],
        ["TM-T02-INTRO", "teach"],
        ["TM-T02-E01", "choice"],
        ["TM-T02-E02", "choice"],
        ["TM-T02-E03", "type"],
        ["TM-T02-E04-FORM", "teach"],
        ["TM-T02-E04", "type"],
        ["TM-T02-E05", "type"],
        ["TM-T02-E06", "choice"],
      ]);

      expect(
        lesson.questions
          .slice(9)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("T02"));
    },
  );

  it("shows mañana on the L02 introduction card and tells it from la mañana on its form card", () => {
    const [, intro, , , , form] = timeWordsLesson("tm-l02", randomFrom(1)).questions;

    expect([intro.prompt, intro.explanation, form.prompt, form.explanation]).toEqual([
      "New word: mañana",
      "mañana means tomorrow. Example: Reunión de Luis: mañana.",
      "mañana and la mañana",
      "mañana alone means tomorrow. With la, la mañana is the morning. In these exercises mañana means tomorrow.",
    ]);
  });

  it("draws a new L02 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-l02", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it.each([1, 2, 3])(
    "opens L03 on the recalled T02-V09, its introduction, the base items in order, then every variation (seed %i)",
    (seed) => {
      const lesson = timeWordsLesson("tm-l03", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "tm-l03",
        title: "Yesterday",
        subtitle: "Learn one new time word",
      });

      expect(lesson.questions.slice(0, 8).map((q) => [q.id, q.kind])).toEqual([
        ["TM-T02-V09", "type"],
        ["TM-T03-INTRO", "teach"],
        ["TM-T03-E01", "choice"],
        ["TM-T03-E02", "choice"],
        ["TM-T03-E03", "type"],
        ["TM-T03-E04", "type"],
        ["TM-T03-E05", "type"],
        ["TM-T03-E06", "choice"],
      ]);

      expect(
        lesson.questions
          .slice(8)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("T03"));
    },
  );

  it("shows ayer on the L03 introduction card", () => {
    const [, intro] = timeWordsLesson("tm-l03", randomFrom(1)).questions;

    expect([intro.prompt, intro.explanation]).toEqual([
      "New word: ayer",
      "ayer means yesterday. Example: Visita de Diego: ayer.",
    ]);
  });

  it("draws a new L03 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      timeWordsLesson("tm-l03", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("lists four units after course unit 5, only unit 1 with lessons so far", () => {
    expect(
      timeWordsUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      ["tm-u1", 5, "hoy, mañana, ayer, ahora", ["tm-l01", "tm-l02", "tm-l03"]],
      ["tm-u2", 5, "antes, después, temprano, tarde", []],
      ["tm-u3", 5, "por la mañana, por la tarde, por la noche, siempre", []],
      ["tm-u4", 5, "a veces, nunca, desde, hasta", []],
    ]);
  });
});
