import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentMistakes, accentOnlyAnswer, isCorrect } from "../progress";
import { exerciseCount } from "../practice-sets/lesson";
import { placementLesson, placementLessons, placementQuestions } from "./placement";

const ids = (prefix: string) =>
  placementQuestions.map((q) => q.id).filter((id) => id.startsWith(prefix));

const question = (id: string) => placementQuestions.find((q) => q.id === id)!;

describe("placement content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);
    expect(bank).toEqual(expect.arrayContaining(["SP-T01-E01", "SP-T01-E06", "SP-T01-V12"]));
  });

  it("names only authored exercises in its lessons", () => {
    const authored = new Set(placementQuestions.map((q) => q.id));
    const named = placementLessons.flatMap((l) => [...l.recalled, ...l.base, ...l.variations]);

    expect(named).toHaveLength(18);

    for (const id of named) {
      expect(authored, id).toContain(id);
    }
  });

  it("never asks the same exercise twice in one lesson", () => {
    for (const l of placementLessons) {
      const keys = placementLesson(l.id)
        .questions.filter((q) => q.kind !== "teach")
        .map((q) => `${q.kind} ${q.prompt}`);

      const repeated = keys.filter((key, i) => keys.indexOf(key) !== i);

      expect(keys, l.id).toHaveLength(exerciseCount(l));
      expect(repeated, l.id).toEqual([]);
    }
  });

  it("offers each choice's answer once among unique options", () => {
    const choices = placementQuestions.filter((q) => q.kind === "choice");

    expect(choices.map((q) => q.id)).toEqual(["SP-T01-E01", "SP-T01-V12"]);

    for (const q of choices) {
      const answers = q.options!.filter((o) => o === q.answer);

      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      expect(answers, q.id).toHaveLength(1);
    }
  });

  it("gives every exercise two hints and feedback", () => {
    expect(placementQuestions).toHaveLength(18);

    for (const q of placementQuestions) {
      const blank = [...q.hints!, q.explanation].filter((text) => !text.trim());

      expect(q.hints, q.id).toHaveLength(2);
      expect(blank, q.id).toEqual([]);
    }
  });

  it("gives every exercise but a written sentence its Spanish to hear", () => {
    const silent = placementQuestions.filter((q) => !q.pronunciation).map((q) => q.id);

    expect(silent).toEqual(["SP-T01-E06", "SP-T01-V11"]);
    expect(new Set(silent.map((id) => question(id).kind))).toEqual(new Set(["write"]));

    expect(
      ["SP-T01-E01", "SP-T01-E02", "SP-T01-E04", "SP-T01-V09", "SP-T01-V12"].map(
        (id) => question(id).pronunciation,
      ),
    ).toEqual([
      "La bolsa está en la maleta.",
      "en",
      "El móvil está en la mesa.",
      "El billete está en el banco.",
      "El billete está en el banco.",
    ]);
  });

  it("authors six base items and twelve variations for en", () => {
    expect(ids("SP-T01-E")).toEqual([
      "SP-T01-E01",
      "SP-T01-E02",
      "SP-T01-E03",
      "SP-T01-E04",
      "SP-T01-E05",
      "SP-T01-E06",
    ]);

    expect(ids("SP-T01-V")).toHaveLength(12);
  });

  it("names no unit or lesson number in a lesson's title or subtitle", () => {
    const texts = placementLessons.flatMap((l) => [l.title, l.subtitle]);

    expect(texts).toEqual(["In or on", "Learn one new phrase"]);
    expect(texts.filter((text) => /\bunit \d|\blessons? \d/i.test(text))).toEqual([]);
  });

  it("passes the E04 sentence without capitals, accents or a full stop and notes the accents", () => {
    const e04 = question("SP-T01-E04");

    expect(isCorrect(e04, "el movil esta en la mesa")).toBe(true);
    expect(accentOnlyAnswer(e04, "el movil esta en la mesa")).toBe("El móvil está en la mesa.");

    expect(accentMistakes("El móvil está en la mesa.", "el movil esta en la mesa")).toEqual({
      missing: ["ó", "á"],
      extra: [],
    });

    expect(isCorrect(e04, "el movil esta debajo de la mesa")).toBe(false);
  });

  it("takes en, and not dentro de, in the E03 gap", () => {
    expect(isCorrect(question("SP-T01-E03"), "en")).toBe(true);
    expect(isCorrect(question("SP-T01-E03"), "dentro de")).toBe(false);
  });
});
