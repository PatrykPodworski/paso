import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { askingLesson, askingUnits, lessonFrom } from "./askingQuestions";
import { l01 } from "./t01";

const variations = Array.from(
  { length: 12 },
  (_, i) => `AQ-T01-V${String(i + 1).padStart(2, "0")}`,
);

describe("asking questions lessons", () => {
  it("opens L01 on its introduction, then the base items in order, then every variation", () => {
    const lesson = askingLesson("aq-l01", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l01",
      title: "Asking for things",
      subtitle: "Learn one new question word",
    });

    expect(lesson.questions[0].kind).toBe("teach");

    expect(ids.slice(1, 6)).toEqual([
      "AQ-T01-E01",
      "AQ-T01-E02",
      "AQ-T01-E03",
      "AQ-T01-E04",
      "AQ-T01-E05",
    ]);

    expect([...ids.slice(6)].sort()).toEqual(variations);
  });

  it("draws a new variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l01", randomFrom(seed))
        .questions.slice(6)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("shows a form card just before the exercise it introduces", () => {
    const lesson = lessonFrom(
      {
        ...l01,
        recalled: ["AQ-T01-E06"],
        formCards: [{ before: "AQ-T01-E03", heading: "Qué before a noun", text: "¿Qué bebida?" }],
      },
      randomFrom(1),
    );

    expect(lesson.questions.slice(0, 6).map((q) => [q.id, q.kind])).toEqual([
      ["AQ-T01-E06", "choice"],
      ["AQ-T01-INTRO", "teach"],
      ["AQ-T01-E01", "choice"],
      ["AQ-T01-E02", "type"],
      ["AQ-T01-E03-FORM", "teach"],
      ["AQ-T01-E03", "order"],
    ]);
  });

  it("opens L02 on the recalled qué item, then cómo's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l02", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({ id: "aq-l02", title: "Asking how" });

    expect(ids.slice(0, 9)).toEqual([
      "AQ-T01-E04",
      "AQ-T02-INTRO",
      "AQ-T02-E01",
      "AQ-T02-E02",
      "AQ-T02-E03",
      "AQ-T02-E04",
      "AQ-T02-E05",
      "AQ-T01-E06",
      "AQ-T02-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Cómo te llamas?"),
    });

    expect([...ids.slice(9)].sort()).toEqual(variations.map((id) => id.replace("T01", "T02")));
  });

  it("draws a new L02 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l02", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("lists unit 1 with L01 and L02", () => {
    expect(askingUnits.map((u) => [u.title, u.lessons.map((l) => l.id)])).toEqual([
      ["Unit 1", ["aq-l01", "aq-l02"]],
      ["Unit 2", []],
      ["Unit 3", []],
      ["Unit 4", []],
    ]);
  });
});
