import { expect, it } from "vitest";
import { type Item, questionOf, tilesOf } from "./item";

it.each([
  [
    ["¿Qué", "quieres", "?"],
    ["¿Qué", "quieres?"],
  ],
  [
    ["¿", "Qué", "lee", "Luis", "?"],
    ["¿Qué", "lee", "Luis?"],
  ],
])("joins punctuation chunks %j to their words", (chunks, tiles) => {
  expect(tilesOf(chunks)).toEqual(tiles);
});

const base = {
  id: "WD-X",
  instruction: "Translate into Spanish",
  prompt: "You visit on Monday.",
  answer: "Visitas el lunes.",
  say: "Visitas el lunes.",
  feedback: "",
  hints: ["", ""] as [string, string],
};

it.each<Item>([
  { ...base, mode: "cloze" },
  { ...base, mode: "choice", choices: ["lunes", "martes"] },
])("keeps the task instruction of a $mode item", (item) => {
  const question = questionOf(item);

  expect([question.instruction, question.prompt]).toEqual([
    "Translate into Spanish",
    "You visit on Monday.",
  ]);
});
