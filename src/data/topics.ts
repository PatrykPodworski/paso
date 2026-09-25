import words from "./words.json";
import examples from "./examples.json";
import { vocabulary } from "./curriculum";

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
