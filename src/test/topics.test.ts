import { describe, expect, it } from "vitest";
import { vocabulary } from "../data/curriculum";
import { topics } from "../data/topics";

const cards = topics.flatMap((t) => t.cards);
const card = (id: string) => cards.find((c) => c.id === id)!;

describe("topic cards", () => {
  it("gives every card a unique ID and an example sentence", () => {
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
    expect(cards.every((c) => c.example?.es && c.example.en)).toBe(true);
  });
  it("keeps a unit word's memory hint and unit", () => {
    const hola = vocabulary.find((w) => w.es === "hola")!;
    expect(card("hola")).toMatchObject({ unit: hola.unit, memoryHint: hola.memoryHint });
    expect(vocabulary.every((w) => card(w.es).unit === w.unit)).toBe(true);
    expect(card("el mono (monkey)").unit).toBeUndefined();
  });
  it("makes each meaning of a word its own card", () => {
    expect(card("el mono")).toMatchObject({ es: "el mono", en: "overalls", topic: "Clothes" });
    expect(card("el mono (monkey)")).toMatchObject({
      es: "el mono",
      en: "monkey",
      topic: "Animals",
    });
  });
  it("passes each topic's optional flag to its cards", () => {
    const art = topics.find((t) => t.topic === "Art")!;
    expect(art.optional).toBe(true);
    expect(art.cards.every((c) => c.optional)).toBe(true);
    expect(card("el pan").optional).toBe(false);
  });
});
