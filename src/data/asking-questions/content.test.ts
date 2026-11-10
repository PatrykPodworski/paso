import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentOnlyAnswer, isCorrect } from "../progress";
import { askingLessons, askingQuestions } from "./askingQuestions";

const ids = (prefix: string) =>
  askingQuestions.map((q) => q.id).filter((id) => id.startsWith(prefix));

describe("asking questions content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(bank).toEqual(
      expect.arrayContaining(["AQ-T01-E01", "AQ-T01-V12", "AQ-T02-E01", "AQ-T02-V12"]),
    );
  });

  it("names only authored exercises in its lessons", () => {
    const authored = new Set(askingQuestions.map((q) => q.id));

    for (const l of askingLessons) {
      for (const id of [...l.recalled, ...l.base, ...l.variations]) {
        expect(authored, `${l.id} ${id}`).toContain(id);
      }
    }
  });

  it("offers each choice's answer once among unique options", () => {
    for (const q of askingQuestions.filter((q) => q.kind === "choice")) {
      const answers = q.options!.filter((o) => o === q.answer);

      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      expect(answers, q.id).toHaveLength(1);
    }
  });

  it("builds each order answer from the words of its tiles", () => {
    for (const q of askingQuestions.filter((q) => q.kind === "order")) {
      const words = q.tokens!.flatMap((t) => t.split(" "));

      expect(words.sort(), q.id).toEqual(q.answer.split(" ").sort());
    }
  });

  it("gives every exercise two hints and feedback", () => {
    for (const q of askingQuestions) {
      const blank = [...q.hints!, q.explanation].filter((text) => !text.trim());

      expect(q.hints, q.id).toHaveLength(2);
      expect(blank, q.id).toEqual([]);
    }
  });

  it("authors six base items and twelve variations for qué", () => {
    expect(ids("AQ-T01-E")).toEqual([
      "AQ-T01-E01",
      "AQ-T01-E02",
      "AQ-T01-E03",
      "AQ-T01-E04",
      "AQ-T01-E05",
      "AQ-T01-E06",
    ]);

    expect(ids("AQ-T01-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for cómo", () => {
    expect(ids("AQ-T02-E")).toEqual([
      "AQ-T02-E01",
      "AQ-T02-E02",
      "AQ-T02-E03",
      "AQ-T02-E04",
      "AQ-T02-E05",
      "AQ-T02-E06",
    ]);

    expect(ids("AQ-T02-V")).toHaveLength(12);
  });

  it("accepts cómo, notes a missing accent and rejects qué in a cómo cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T02-V08")!;

    expect([isCorrect(q, "Cómo"), isCorrect(q, "qué")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "como")).toBe("cómo");
  });

  it("accepts the typed cómo question and rejects one that asks for a thing", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T02-V10")!;

    expect(isCorrect(q, "¿Cómo vas al hotel?")).toBe(true);
    expect(isCorrect(q, "¿Qué vas al hotel?")).toBe(false);
  });

  it("gives every exercise but a written dialogue its Spanish question to hear", () => {
    const silent = askingQuestions.filter((q) => !q.pronunciation).map((q) => q.id);

    expect(silent).toEqual([
      "AQ-T01-E05",
      "AQ-T01-V06",
      "AQ-T01-V12",
      "AQ-T02-E05",
      "AQ-T02-V06",
      "AQ-T02-V12",
    ]);

    expect(askingQuestions.find((q) => q.id === "AQ-T01-V08")?.pronunciation).toBe(
      "¿Qué bebida quiere Luis?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T02-V08")?.pronunciation).toBe(
      "¿Cómo va Luis al centro?",
    );
  });
});
