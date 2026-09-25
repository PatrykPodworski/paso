import { describe, expect, it } from "vitest";
import { vocabulary } from "../data/curriculum";
import { emptyProgress } from "../data/progress";
import { addWords, cardStatus, deckCards, topicCounts, topics } from "../data/topics";

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

describe("card status and topic counts", () => {
  const family = topics.find((t) => t.topic === "Family")!.cards;
  const review = (level: number) => ({ level, nextAt: "2026-09-25T00:00:00.000Z" });
  it("counts every word of a topic as new on empty progress", () => {
    expect(topicCounts(family, emptyProgress())).toEqual({
      total: family.length,
      new: family.length,
      learning: 0,
      known: 0,
    });
  });
  it("treats a completed unit's words as learning before their first review", () => {
    const progress = emptyProgress();
    const unit = card("la madre").unit!;
    progress.completed[`u${unit}-words`] = { score: 1, total: 1, at: "2026-09-25" };
    expect(cardStatus(card("la madre"), progress)).toBe("learning");
    expect(cardStatus(card("el suegro"), progress)).toBe("new");
  });
  it("marks a word known from review level 4", () => {
    const progress = emptyProgress();
    progress.vocabularyReviews["el suegro"] = review(3);
    progress.vocabularyReviews["la suegra"] = review(4);
    expect(cardStatus(card("el suegro"), progress)).toBe("learning");
    expect(cardStatus(card("la suegra"), progress)).toBe("known");
    expect(topicCounts(family, progress)).toMatchObject({ learning: 1, known: 1 });
  });
  it("tracks each meaning of a word separately", () => {
    const progress = emptyProgress();
    progress.vocabularyReviews["el mono"] = review(0);
    expect(cardStatus(card("el mono"), progress)).toBe("learning");
    expect(cardStatus(card("el mono (monkey)"), progress)).toBe("new");
  });
});

describe("adding words from a topic", () => {
  const at = "2026-09-25T10:00:00.000Z";
  const weather = topics.find((t) => t.topic === "Weather")!.cards;
  it("adds the next five new words in list order, due at once", () => {
    const progress = emptyProgress();
    progress.vocabularyReviews[weather[1].id] = { level: 2, nextAt: at };
    const added = addWords(weather, progress, at);
    expect(Object.keys(added)).toEqual([0, 2, 3, 4, 5].map((i) => weather[i].id));
    expect(Object.values(added).every((r) => r.level === 0 && r.nextAt === at)).toBe(true);
  });
  it("adds only what is left, and nothing once the topic is exhausted", () => {
    const progress = emptyProgress();
    for (const c of weather.slice(0, -3)) {
      progress.vocabularyReviews[c.id] = { level: 1, nextAt: at };
    }
    expect(Object.keys(addWords(weather, progress, at))).toHaveLength(3);
    Object.assign(progress.vocabularyReviews, addWords(weather, progress, at));
    expect(addWords(weather, progress, at)).toEqual({});
  });
});

describe("the learner's deck", () => {
  it("is empty on new progress", () => {
    expect(deckCards(emptyProgress())).toEqual([]);
  });
  it("holds added topic words and completed unit words once each", () => {
    const progress = emptyProgress();
    const unit = card("hola").unit!;
    progress.completed[`u${unit}-words`] = { score: 1, total: 1, at: "2026-09-25" };
    const unitWords = vocabulary.filter((w) => w.unit === unit).map((w) => w.es);
    const animals = topics.find((t) => t.topic === "Animals")!.cards;
    Object.assign(progress.vocabularyReviews, addWords(animals, progress), {
      hola: { level: 1, nextAt: "2026-09-25T00:00:00.000Z" },
    });
    const ids = deckCards(progress).map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.sort()).toEqual([...unitWords, ...animals.slice(0, 5).map((c) => c.id)].sort());
  });
});
