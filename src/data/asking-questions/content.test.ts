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
      expect.arrayContaining([
        "AQ-T01-E01",
        "AQ-T01-V12",
        "AQ-T02-E01",
        "AQ-T02-V12",
        "AQ-T03-E01",
        "AQ-T03-V12",
        "AQ-T04-E01",
        "AQ-T04-V12",
        "AQ-T05-E01",
        "AQ-T05-V12",
      ]),
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

  it("authors six base items and twelve variations for dónde", () => {
    expect(ids("AQ-T03-E")).toEqual([
      "AQ-T03-E01",
      "AQ-T03-E02",
      "AQ-T03-E03",
      "AQ-T03-E04",
      "AQ-T03-E05",
      "AQ-T03-E06",
    ]);

    expect(ids("AQ-T03-V")).toHaveLength(12);
  });

  it("accepts dónde, notes a missing accent and rejects qué in a dónde cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T03-V08")!;

    expect([isCorrect(q, "Dónde"), isCorrect(q, "qué")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "donde")).toBe("dónde");
  });

  it("accepts the typed dónde question and rejects one that asks for a thing", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T03-V10")!;

    expect(isCorrect(q, "¿Dónde está la mochila?")).toBe(true);
    expect(isCorrect(q, "¿Qué está la mochila?")).toBe(false);
  });

  it("authors six base items and twelve variations for cuándo", () => {
    expect(ids("AQ-T04-E")).toEqual([
      "AQ-T04-E01",
      "AQ-T04-E02",
      "AQ-T04-E03",
      "AQ-T04-E04",
      "AQ-T04-E05",
      "AQ-T04-E06",
    ]);

    expect(ids("AQ-T04-V")).toHaveLength(12);
  });

  it("accepts cuándo, notes a missing accent and rejects dónde in a cuándo cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T04-V01")!;

    expect([isCorrect(q, "Cuándo"), isCorrect(q, "dónde")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "cuando")).toBe("cuándo");
  });

  it("accepts the typed cuándo question and rejects one that asks for a place", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T04-V10")!;

    expect(isCorrect(q, "¿Cuándo empieza la visita?")).toBe(true);
    expect(isCorrect(q, "¿Dónde empieza la visita?")).toBe(false);
  });

  it("authors six base items and twelve variations for quién / quiénes", () => {
    expect(ids("AQ-T05-E")).toEqual([
      "AQ-T05-E01",
      "AQ-T05-E02",
      "AQ-T05-E03",
      "AQ-T05-E04",
      "AQ-T05-E05",
      "AQ-T05-E06",
    ]);

    expect(ids("AQ-T05-V")).toHaveLength(12);
  });

  it("accepts quiénes, notes a missing accent and rejects quién in a plural cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T05-V02")!;

    expect([isCorrect(q, "Quiénes"), isCorrect(q, "quién")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "quienes")).toBe("quiénes");
  });

  it("accepts the typed quiénes question and rejects the singular one", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T05-V05")!;

    expect(isCorrect(q, "¿Quiénes vienen mañana?")).toBe(true);
    expect(isCorrect(q, "¿Quién vienen mañana?")).toBe(false);
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
      "AQ-T03-E05",
      "AQ-T03-V06",
      "AQ-T03-V12",
      "AQ-T04-E05",
      "AQ-T04-V06",
      "AQ-T04-V12",
      "AQ-T05-E05",
      "AQ-T05-V06",
      "AQ-T05-V12",
    ]);

    expect(askingQuestions.find((q) => q.id === "AQ-T01-V08")?.pronunciation).toBe(
      "¿Qué bebida quiere Luis?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T02-V08")?.pronunciation).toBe(
      "¿Cómo va Luis al centro?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T03-V01")?.pronunciation).toBe(
      "¿Dónde está la entrada?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T04-V02")?.pronunciation).toBe(
      "¿Cuándo viene Pablo?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T05-V08")?.pronunciation).toBe(
      "¿Quiénes estudian español?",
    );
  });
});
