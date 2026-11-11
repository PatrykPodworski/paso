import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { isCorrect } from "../progress";
import { timeWordsLessons, timeWordsQuestions } from "./timeWords";

const ids = (prefix: string) =>
  timeWordsQuestions.map((q) => q.id).filter((id) => id.startsWith(prefix));

const question = (id: string) => timeWordsQuestions.find((q) => q.id === id)!;

const words = ["hoy", "mañana"];

const DAY_OR_TIME =
  /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b|\b\d{1,2}(:\d{2})?\s?(am|pm|o’clock)\b/;

describe("time words content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(bank).toEqual(
      expect.arrayContaining([
        "TM-T01-E01",
        "TM-T01-E06",
        "TM-T01-V12",
        "TM-T02-E01",
        "TM-T02-E06",
        "TM-T02-V12",
      ]),
    );
  });

  it("names only authored exercises in its lessons", () => {
    const authored = new Set(timeWordsQuestions.map((q) => q.id));
    const named = timeWordsLessons.flatMap((l) => [...l.recalled, ...l.base, ...l.variations]);

    expect(named).toHaveLength(37);

    for (const id of named) {
      expect(authored, id).toContain(id);
    }
  });

  it("offers each choice's answer once among unique options", () => {
    const choices = timeWordsQuestions.filter((q) => q.kind === "choice");

    expect(choices.map((q) => q.id)).toEqual([
      "TM-T01-E01",
      "TM-T01-E02",
      "TM-T01-E06",
      "TM-T01-V11",
      "TM-T01-V12",
      "TM-T02-E01",
      "TM-T02-E02",
      "TM-T02-E06",
      "TM-T02-V11",
      "TM-T02-V12",
    ]);

    for (const q of choices) {
      const answers = q.options!.filter((o) => o === q.answer);

      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      expect(answers, q.id).toHaveLength(1);
    }
  });

  it("gives every exercise two hints and feedback", () => {
    expect(timeWordsQuestions).toHaveLength(36);

    for (const q of timeWordsQuestions) {
      const blank = [...q.hints!, q.explanation].filter((text) => !text.trim());

      expect(q.hints, q.id).toHaveLength(2);
      expect(blank, q.id).toEqual([]);
    }
  });

  it("gives every exercise its Spanish to hear", () => {
    expect(timeWordsQuestions.filter((q) => !q.pronunciation).map((q) => q.id)).toEqual([]);

    expect(
      [
        "TM-T01-E01",
        "TM-T01-E04",
        "TM-T01-E06",
        "TM-T01-V08",
        "TM-T02-E01",
        "TM-T02-E04",
        "TM-T02-V09",
        "TM-T02-V11",
      ].map((id) => question(id).pronunciation),
    ).toEqual([
      "hoy",
      "Clase de Pablo: hoy.",
      "Reunión de Luis: hoy.",
      "Clase de español: hoy.",
      "mañana",
      "Clase de Pablo: mañana.",
      "Desayuno con Jorge: mañana.",
      "Clase de español: mañana.",
    ]);
  });

  it("authors six base items and twelve variations for hoy", () => {
    expect(ids("TM-T01-E")).toEqual([
      "TM-T01-E01",
      "TM-T01-E02",
      "TM-T01-E03",
      "TM-T01-E04",
      "TM-T01-E05",
      "TM-T01-E06",
    ]);

    expect(ids("TM-T01-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for mañana", () => {
    expect(ids("TM-T02-E")).toEqual([
      "TM-T02-E01",
      "TM-T02-E02",
      "TM-T02-E03",
      "TM-T02-E04",
      "TM-T02-E05",
      "TM-T02-E06",
    ]);

    expect(ids("TM-T02-V")).toHaveLength(12);
  });

  it("offers morning against tomorrow for mañana in a sentence", () => {
    expect(question("TM-T02-E02")).toMatchObject({
      answer: "tomorrow",
      options: expect.arrayContaining(["tomorrow", "morning"]),
    });
  });

  it("asks for every word so far as Spanish to produce", () => {
    const typed = timeWordsQuestions.filter((q) => q.kind === "type").map((q) => q.answer);

    expect(typed).toEqual(expect.arrayContaining(words));
  });

  it("states a day or a clock time in every gap and full-sentence prompt", () => {
    const framed = timeWordsQuestions.filter((q) =>
      /Complete only the gap|Write the full Spanish sentence/.test(q.prompt),
    );

    expect(framed).toHaveLength(24);

    for (const q of framed) {
      expect(q.prompt, q.id).toMatch(DAY_OR_TIME);
    }
  });

  it("accepts the full sentence without a capital, colon or full stop", () => {
    expect(isCorrect(question("TM-T01-E05"), "clase de pablo hoy")).toBe(true);
    expect(isCorrect(question("TM-T01-E05"), "clase de pablo mañana")).toBe(false);
  });

  it("rejects another time word in the hoy gap", () => {
    expect(isCorrect(question("TM-T01-E04"), "mañana")).toBe(false);
    expect(isCorrect(question("TM-T01-E04"), "Hoy")).toBe(true);
  });

  it("rejects hoy in the mañana gap", () => {
    expect(isCorrect(question("TM-T02-E04"), "hoy")).toBe(false);
    expect(isCorrect(question("TM-T02-E04"), "Mañana")).toBe(true);
  });
});
