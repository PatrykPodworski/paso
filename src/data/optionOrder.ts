import { isCorrect } from "./progress.ts";
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

const DRAWS = 10;

// The word bank's tiles in the order one attempt shows them, from the attempt's seed like the
// options. A drawn order that already reads as a correct sentence is drawn again from the next
// seed; the last draw is rotated by one instead. One tile, or identical tiles, stay as they are.
export const shownTokens = (q: Question, seed: number) => {
  const tokens = q.tokens!;
  const salt = hash(JSON.stringify(tokens));
  const solved = (order: string[]) => isCorrect(q, order.join(" "));
  let order = tokens;

  for (let draw = 0; draw < DRAWS; draw++) {
    order = shuffle(tokens, randomFrom((seed + draw) ^ salt));

    if (!solved(order)) {
      return order;
    }
  }

  return [...order.slice(1), order[0]];
};

export const withShownTokens = (q: Question, seed: number): Question =>
  q.tokens ? { ...q, tokens: shownTokens(q, seed) } : q;
