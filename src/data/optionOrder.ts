import { hash, randomFrom, shuffle } from "./random.ts";
import type { Question } from "./types.ts";

// Single letters name the lettered texts of a passage, so they keep the order of the texts.
const isLetters = (options: string[]) => options.every((option) => /^[A-Z]$/.test(option));

// The options in the order one attempt shows them. The order comes from the attempt's seed and
// the options themselves, so it never follows the answers, it stays the same for the whole
// attempt, and the questions that share one list show it in one order.
export const shownOptions = (options: string[], seed: number) =>
  isLetters(options) ? options : shuffle(options, randomFrom(seed ^ hash(JSON.stringify(options))));

export const withShownOptions = (q: Question, seed: number): Question =>
  q.options ? { ...q, options: shownOptions(q.options, seed) } : q;
