import { describe, expect, it } from "vitest";
import { answerDiff, closestAnswer } from "./answerDiff";
import type { Question } from "./types";

describe("answerDiff", () => {
  it("marks a missing letter with its position in the answer", () => {
    expect(answerDiff("Mi madre tabaja el lunes.", "Mi madre trabaja el lunes.")).toEqual({
      answer: [
        { text: "Mi madre t", mark: "same" },
        { text: "r", mark: "missing" },
        { text: "abaja el lunes.", mark: "same" },
      ],
      correct: [
        { text: "Mi madre t", mark: "same" },
        { text: "r", mark: "changed" },
        { text: "abaja el lunes.", mark: "same" },
      ],
      changes: [{ written: "tabaja", expected: "trabaja" }],
    });
  });

  it("marks a letter that misses its accent", () => {
    expect(answerDiff("Mi madre esta en casa", "Mi madre está en casa.")).toEqual({
      answer: [
        { text: "Mi madre est", mark: "same" },
        { text: "a", mark: "wrong" },
        { text: " en casa", mark: "same" },
      ],
      correct: [
        { text: "Mi madre est", mark: "same" },
        { text: "á", mark: "changed" },
        { text: " en casa.", mark: "same" },
      ],
      changes: [{ written: "esta", expected: "está" }],
    });
  });

  it("marks n written for ñ", () => {
    expect(answerDiff("Tengo veinte anos", "Tengo veinte años").answer).toEqual([
      { text: "Tengo veinte a", mark: "same" },
      { text: "n", mark: "wrong" },
      { text: "os", mark: "same" },
    ]);
  });

  it("ignores case and punctuation, as the checker does", () => {
    expect(answerDiff("¿como te llamas", "¿Cómo te llamas?")).toEqual({
      answer: [
        { text: "¿c", mark: "same" },
        { text: "o", mark: "wrong" },
        { text: "mo te llamas", mark: "same" },
      ],
      correct: [
        { text: "¿C", mark: "same" },
        { text: "ó", mark: "changed" },
        { text: "mo te llamas?", mark: "same" },
      ],
      changes: [{ written: "como", expected: "Cómo" }],
    });
  });

  it("finds no change in an answer that differs only by case, spacing and punctuation", () => {
    expect(answerDiff("hola  buenos dias", "¡Hola, buenos dias!")).toEqual({
      answer: [{ text: "hola  buenos dias", mark: "same" }],
      correct: [{ text: "¡Hola, buenos dias!", mark: "same" }],
      changes: [],
    });
  });

  it("marks a missing space and a missing accent inside one word", () => {
    expect(answerDiff("porque", "por qué")).toEqual({
      answer: [
        { text: "por", mark: "same" },
        { text: " ", mark: "missing" },
        { text: "qu", mark: "same" },
        { text: "e", mark: "wrong" },
      ],
      correct: [
        { text: "por", mark: "same" },
        { text: " ", mark: "changed" },
        { text: "qu", mark: "same" },
        { text: "é", mark: "changed" },
      ],
      changes: [{ written: "porque", expected: "por qué" }],
    });
  });

  it("marks an extra space between two words", () => {
    expect(answerDiff("por que", "porque")).toEqual({
      answer: [
        { text: "por", mark: "same" },
        { text: " ", mark: "wrong" },
        { text: "que", mark: "same" },
      ],
      correct: [{ text: "porque", mark: "same" }],
      changes: [{ written: "por que", expected: "porque" }],
    });
  });

  it("reads a run of spaces inside a changed word as one space", () => {
    expect(answerDiff("por  que", "porque").answer).toEqual([
      { text: "por", mark: "same" },
      { text: " ", mark: "wrong" },
      { text: " que", mark: "same" },
    ]);
  });

  it("leaves punctuation unmarked inside changed words", () => {
    expect(answerDiff("bueno adios", "buenas, adiós").correct).toEqual([
      { text: "buen", mark: "same" },
      { text: "as", mark: "changed" },
      { text: ", adi", mark: "same" },
      { text: "ó", mark: "changed" },
      { text: "s", mark: "same" },
    ]);
  });

  it("marks a missing word before the word that follows it", () => {
    expect(answerDiff("Mi madre el lunes", "Mi madre trabaja el lunes")).toEqual({
      answer: [
        { text: "Mi madre ", mark: "same" },
        { text: "trabaja", mark: "missing" },
        { text: "el lunes", mark: "same" },
      ],
      correct: [
        { text: "Mi madre ", mark: "same" },
        { text: "trabaja", mark: "changed" },
        { text: " el lunes", mark: "same" },
      ],
      changes: [{ written: "", expected: "trabaja" }],
    });
  });

  it("marks a missing last word after the answer", () => {
    expect(answerDiff("Mi madre trabaja", "Mi madre trabaja hoy").answer).toEqual([
      { text: "Mi madre trabaja", mark: "same" },
      { text: "hoy", mark: "missing" },
    ]);
  });

  it("marks an extra word", () => {
    expect(answerDiff("Mi madre muy trabaja", "Mi madre trabaja")).toEqual({
      answer: [
        { text: "Mi madre ", mark: "same" },
        { text: "muy", mark: "wrong" },
        { text: " trabaja", mark: "same" },
      ],
      correct: [{ text: "Mi madre trabaja", mark: "same" }],
      changes: [{ written: "muy", expected: "" }],
    });
  });

  it("marks a whole word when it shares little with the correct one", () => {
    expect(answerDiff("Tengo un perro", "Tengo un gato")).toEqual({
      answer: [
        { text: "Tengo un ", mark: "same" },
        { text: "perro", mark: "wrong" },
      ],
      correct: [
        { text: "Tengo un ", mark: "same" },
        { text: "gato", mark: "changed" },
      ],
      changes: [{ written: "perro", expected: "gato" }],
    });
  });

  it("marks two neighbouring wrong words as one change", () => {
    expect(answerDiff("Yo voy casa mañana", "Yo estoy en mañana")).toEqual({
      answer: [
        { text: "Yo ", mark: "same" },
        { text: "voy casa", mark: "wrong" },
        { text: " mañana", mark: "same" },
      ],
      correct: [
        { text: "Yo ", mark: "same" },
        { text: "estoy en", mark: "changed" },
        { text: " mañana", mark: "same" },
      ],
      changes: [{ written: "voy casa", expected: "estoy en" }],
    });
  });

  it("keeps the changes of separate words apart", () => {
    expect(answerDiff("El esta en Mexico", "Él está en México").changes).toEqual([
      { written: "El esta", expected: "Él está" },
      { written: "Mexico", expected: "México" },
    ]);
  });

  it("marks two missing letters in a row as one gap", () => {
    expect(answerDiff("Mi madre tbaja", "Mi madre trabaja").answer).toEqual([
      { text: "Mi madre t", mark: "same" },
      { text: "ra", mark: "missing" },
      { text: "baja", mark: "same" },
    ]);
  });

  it("marks letters, not the whole word, when half the letters are shared", () => {
    expect(answerDiff("el", "la")).toEqual({
      answer: [
        { text: "e", mark: "wrong" },
        { text: "l", mark: "same" },
        { text: "a", mark: "missing" },
      ],
      correct: [
        { text: "l", mark: "same" },
        { text: "a", mark: "changed" },
      ],
      changes: [{ written: "el", expected: "la" }],
    });
  });

  it.each([
    ["¡¿Que?!", "¿Qué?", { written: "Que", expected: "Qué" }],
    ["Hola, amigos!!", "Hola, amigo.", { written: "amigos", expected: "amigo" }],
    ["bueno, adios", "buenas, adiós", { written: "bueno, adios", expected: "buenas, adiós" }],
  ])("names the change in %j without its outer punctuation", (answer, correct, change) => {
    expect(answerDiff(answer, correct).changes).toEqual([change]);
  });

  it("marks the whole correct answer as missing from an empty answer", () => {
    expect(answerDiff("", "Hola")).toEqual({
      answer: [{ text: "Hola", mark: "missing" }],
      correct: [{ text: "Hola", mark: "changed" }],
      changes: [{ written: "", expected: "Hola" }],
    });
  });

  it("compares accented letters typed as two code points with their single form", () => {
    expect(answerDiff("está", "está").changes).toEqual([]);
  });
});

const friend: Question = {
  id: "friend",
  skill: "writing",
  kind: "type",
  prompt: "My friend is at home.",
  answer: "Mi amiga está en casa.",
  accepted: ["Mi amigo está en casa."],
  explanation: "",
};

describe("closestAnswer", () => {
  it.each([
    ["Mi amigo esta en casa", "Mi amigo está en casa."],
    ["mi amiga esta en kasa", "Mi amiga está en casa."],
    ["Mi amigx está en casa", "Mi amiga está en casa."],
    ["", "Mi amiga está en casa."],
  ])("compares %j with the accepted answer %j", (answer, expected) => {
    expect(closestAnswer(friend, answer)).toBe(expected);
  });

  it("gives the answer of a question with no alternatives", () => {
    expect(closestAnswer({ ...friend, accepted: undefined }, "Mi amigo está en casa")).toBe(
      "Mi amiga está en casa.",
    );
  });
});
