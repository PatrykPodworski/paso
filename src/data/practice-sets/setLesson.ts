import type { Question, TeachContent } from "../types.ts";

// A teaching card for a new form, shown just before the exercise `before`.
export type FormCard = { before: string } & (
  | { heading: string; text: string }
  | { teach: TeachContent }
);

// A set lesson: the recalled items, the introduction (a review has none), the base items in
// order with their form cards, then the variations in an order drawn when the lesson opens.
export type SetLesson = {
  id: string;
  title: string;
  subtitle: string;
  recalled: string[];
  introduction?: Question;
  base: string[];
  formCards: FormCard[];
  variations: string[];
};
