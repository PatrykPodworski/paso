import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { isCorrect } from "../progress";
import { weekdaysLessons, weekdaysQuestions } from "./weekdays";

const ids = (prefix: string) =>
  weekdaysQuestions.map((q) => q.id).filter((id) => id.startsWith(prefix));

const question = (id: string) => weekdaysQuestions.find((q) => q.id === id)!;

describe("weekdays content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);
    expect(bank).toEqual(expect.arrayContaining(["WD-T01-E01", "WD-T01-E06", "WD-T01-V12"]));
  });

  it("names only authored exercises in its lessons", () => {
    const authored = new Set(weekdaysQuestions.map((q) => q.id));

    for (const l of weekdaysLessons) {
      for (const id of [...l.recalled, ...l.base, ...l.variations]) {
        expect(authored, `${l.id} ${id}`).toContain(id);
      }
    }
  });

  it("offers each choice's answer once among unique options", () => {
    const choices = weekdaysQuestions.filter((q) => q.kind === "choice");

    expect(choices.map((q) => q.id)).toEqual(["WD-T01-E01"]);

    for (const q of choices) {
      const answers = q.options!.filter((o) => o === q.answer);

      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      expect(answers, q.id).toHaveLength(1);
    }
  });

  it("gives every exercise two hints and feedback", () => {
    for (const q of weekdaysQuestions) {
      const blank = [...q.hints!, q.explanation].filter((text) => !text.trim());

      expect(q.hints, q.id).toHaveLength(2);
      expect(blank, q.id).toEqual([]);
    }
  });

  it("gives every exercise but a written sentence its Spanish to hear", () => {
    const silent = weekdaysQuestions.filter((q) => !q.pronunciation).map((q) => q.id);

    expect(silent).toEqual(["WD-T01-E06", "WD-T01-V10", "WD-T01-V12"]);
    expect(silent.map((id) => question(id).kind)).toEqual(["write", "write", "write"]);

    expect(
      ["WD-T01-E01", "WD-T01-E04", "WD-T01-V08"].map((id) => question(id).pronunciation),
    ).toEqual(["lunes", "Hoy es lunes.", "Tu visita es el lunes."]);
  });

  it("authors six base items and twelve variations for lunes", () => {
    expect(ids("WD-T01-E")).toEqual([
      "WD-T01-E01",
      "WD-T01-E02",
      "WD-T01-E03",
      "WD-T01-E04",
      "WD-T01-E05",
      "WD-T01-E06",
    ]);

    expect(ids("WD-T01-V")).toHaveLength(12);
  });

  it("asks for every day so far as the answer of a typed Spanish item", () => {
    const typed = weekdaysQuestions.filter((q) => q.kind === "type").map((q) => q.answer);

    expect(typed).toEqual(expect.arrayContaining(["lunes"]));
  });

  it("accepts the full sentence without a capital or a full stop", () => {
    expect(isCorrect(question("WD-T01-E05"), "hoy es lunes")).toBe(true);
    expect(isCorrect(question("WD-T01-E05"), "hoy es martes")).toBe(false);
  });

  it("rejects another day in the lunes gap", () => {
    expect(isCorrect(question("WD-T01-E04"), "martes")).toBe(false);
    expect(isCorrect(question("WD-T01-E04"), "Lunes")).toBe(true);
  });
});
