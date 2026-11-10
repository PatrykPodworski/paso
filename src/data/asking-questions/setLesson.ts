import type { Question } from "../types.ts";

// A teaching card for a new form, shown just before the exercise `before`.
export type FormCard = { before: string; heading: string; text: string };

// A learning lesson: the recalled items, the introduction, the target's base items in order
// with their form cards, then the variations in an order drawn when the lesson opens.
export type SetLesson = {
  id: string;
  title: string;
  subtitle: string;
  recalled: string[];
  introduction: Question;
  base: string[];
  formCards: FormCard[];
  variations: string[];
};
