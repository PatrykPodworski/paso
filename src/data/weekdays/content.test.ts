import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentMistakes, accentOnlyAnswer, isCorrect } from "../progress";
import { weekdaysLessons, weekdaysQuestions } from "./weekdays";

const ids = (prefix: string) =>
  weekdaysQuestions.map((q) => q.id).filter((id) => id.startsWith(prefix));

const question = (id: string) => weekdaysQuestions.find((q) => q.id === id)!;

describe("weekdays content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(bank).toEqual(
      expect.arrayContaining([
        "WD-T01-E01",
        "WD-T01-V12",
        "WD-T02-E01",
        "WD-T02-E06",
        "WD-T02-V12",
        "WD-T03-E01",
        "WD-T03-E06",
        "WD-T03-V12",
        "WD-T04-E01",
        "WD-T04-E06",
        "WD-T04-V12",
        "WD-T05-E01",
        "WD-T05-E06",
        "WD-T05-V12",
      ]),
    );
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

    expect(choices.map((q) => q.id)).toEqual([
      "WD-T01-E01",
      "WD-T02-E01",
      "WD-T03-E01",
      "WD-T04-E01",
      "WD-T05-E01",
    ]);

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

    expect(silent).toEqual([
      "WD-T01-E06",
      "WD-T01-V10",
      "WD-T01-V12",
      "WD-T02-E06",
      "WD-T02-V10",
      "WD-T02-V12",
      "WD-T03-E06",
      "WD-T03-V10",
      "WD-T03-V12",
      "WD-T04-E06",
      "WD-T04-V10",
      "WD-T04-V12",
      "WD-T05-E06",
      "WD-T05-V10",
      "WD-T05-V12",
    ]);

    expect(new Set(silent.map((id) => question(id).kind))).toEqual(new Set(["write"]));

    expect(
      [
        "WD-T01-E01",
        "WD-T01-E04",
        "WD-T01-V08",
        "WD-T02-E01",
        "WD-T02-E04",
        "WD-T02-V02",
        "WD-T03-E01",
        "WD-T03-E04",
        "WD-T03-V11",
        "WD-T04-E01",
        "WD-T04-E04",
        "WD-T04-V05",
        "WD-T05-E01",
        "WD-T05-E04",
        "WD-T05-V05",
      ].map((id) => question(id).pronunciation),
    ).toEqual([
      "lunes",
      "Hoy es lunes.",
      "Tu visita es el lunes.",
      "martes",
      "La clase es el martes.",
      "Pablo tiene una reunión el martes.",
      "miércoles",
      "La reunión es el miércoles.",
      "Pablo va al museo los miércoles.",
      "jueves",
      "La visita es el jueves.",
      "Luis tiene una reunión el jueves.",
      "viernes",
      "La cita es el viernes.",
      "El curso de Luis empieza el viernes.",
    ]);
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

  it("authors six base items and twelve variations for martes", () => {
    expect(ids("WD-T02-E")).toEqual([
      "WD-T02-E01",
      "WD-T02-E02",
      "WD-T02-E03",
      "WD-T02-E04",
      "WD-T02-E05",
      "WD-T02-E06",
    ]);

    expect(ids("WD-T02-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for miércoles", () => {
    expect(ids("WD-T03-E")).toEqual([
      "WD-T03-E01",
      "WD-T03-E02",
      "WD-T03-E03",
      "WD-T03-E04",
      "WD-T03-E05",
      "WD-T03-E06",
    ]);

    expect(ids("WD-T03-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for jueves", () => {
    expect(ids("WD-T04-E")).toEqual([
      "WD-T04-E01",
      "WD-T04-E02",
      "WD-T04-E03",
      "WD-T04-E04",
      "WD-T04-E05",
      "WD-T04-E06",
    ]);

    expect(ids("WD-T04-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for viernes", () => {
    expect(ids("WD-T05-E")).toEqual([
      "WD-T05-E01",
      "WD-T05-E02",
      "WD-T05-E03",
      "WD-T05-E04",
      "WD-T05-E05",
      "WD-T05-E06",
    ]);

    expect(ids("WD-T05-V")).toHaveLength(12);
  });

  it("asks for every day so far as the answer of a typed Spanish item", () => {
    const typed = weekdaysQuestions.filter((q) => q.kind === "type").map((q) => q.answer);

    expect(typed).toEqual(
      expect.arrayContaining(["lunes", "martes", "miércoles", "jueves", "viernes"]),
    );
  });

  it("accepts the full sentence without a capital or a full stop", () => {
    expect(isCorrect(question("WD-T01-E05"), "hoy es lunes")).toBe(true);
    expect(isCorrect(question("WD-T01-E05"), "hoy es martes")).toBe(false);
  });

  it("rejects another day in the lunes gap", () => {
    expect(isCorrect(question("WD-T01-E04"), "martes")).toBe(false);
    expect(isCorrect(question("WD-T01-E04"), "Lunes")).toBe(true);
  });

  it("rejects another day in the martes gap", () => {
    expect(isCorrect(question("WD-T02-E04"), "lunes")).toBe(false);
    expect(isCorrect(question("WD-T02-E04"), "Martes")).toBe(true);
  });

  it("rejects another day in the jueves gap", () => {
    expect(isCorrect(question("WD-T04-E04"), "miércoles")).toBe(false);
    expect(isCorrect(question("WD-T04-E04"), "Jueves")).toBe(true);
  });

  it("rejects another day in the viernes gap", () => {
    expect(isCorrect(question("WD-T05-E04"), "jueves")).toBe(false);
    expect(isCorrect(question("WD-T05-E04"), "Viernes")).toBe(true);
  });

  it("passes miercoles for the miércoles word and notes the missing é", () => {
    const e03 = question("WD-T03-E03");

    expect(isCorrect(e03, "miercoles")).toBe(true);
    expect(accentOnlyAnswer(e03, "miercoles")).toBe("miércoles");

    expect(accentMistakes(accentOnlyAnswer(e03, "miercoles")!, "miercoles")).toEqual({
      missing: ["é"],
      extra: [],
    });

    expect(accentOnlyAnswer(e03, "miércoles")).toBeUndefined();
    expect(isCorrect(e03, "martes")).toBe(false);
  });
});
