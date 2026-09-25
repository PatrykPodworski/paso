import words from "./words.json";
import examples from "./examples.json";
import { vocabulary } from "./curriculum";
import type { Progress } from "./types";

// Level 4 reviews come back after 14 days or more.
const KNOWN_LEVEL = 4;

type Card = {
  // SRS and example key. A second sense of a word carries its own key.
  id: string;
  es: string;
  en: string;
  topic: string;
  optional: boolean;
  memoryHint?: string;
  unit?: number;
  example?: { es: string; en: string };
};

const legacy = new Map<string, (typeof vocabulary)[number]>(vocabulary.map((w) => [w.es, w]));
const sentences: Record<string, Card["example"]> = examples;

export const topics = words.map(({ topic, optional, words }) => ({
  topic,
  optional,
  cards: words.map((w): Card => {
    const id = ("key" in w && w.key) || w.es;
    const unitWord = legacy.get(id);
    return {
      id,
      es: w.es,
      en: w.en,
      topic,
      optional,
      memoryHint: unitWord?.memoryHint,
      unit: unitWord?.unit,
      example: sentences[id],
    };
  }),
}));

// A card is in the deck once it has a review entry or its unit's word lesson is done.
const inDeck = (card: Card, progress: Progress) =>
  Boolean(
    progress.vocabularyReviews[card.id] || (card.unit && progress.completed[`u${card.unit}-words`]),
  );

export const cardStatus = (card: Card, progress: Progress) =>
  !inDeck(card, progress)
    ? "new"
    : (progress.vocabularyReviews[card.id]?.level ?? 0) >= KNOWN_LEVEL
      ? "known"
      : "learning";

export const topicCounts = (cards: Card[], progress: Progress) => {
  const counts = { total: cards.length, new: 0, learning: 0, known: 0 };
  for (const card of cards) {
    counts[cardStatus(card, progress)]++;
  }
  return counts;
};
