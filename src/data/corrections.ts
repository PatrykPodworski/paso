import type { Correction } from "./types.ts";

// Quotes are compared as words. Case, extra spaces and surrounding punctuation come from
// the transcript, so they do not make a second copy of the same correction.
const wordsOf = (value: string): string[] =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(/^[^\p{L}\p{N}]+/u, "").replace(/[^\p{L}\p{N}]+$/u, ""))
    .filter((word) => word !== "");

const sameWordList = (left: string[], right: string[]) =>
  left.length === right.length && left.every((word, index) => word === right[index]);

const sameWords = (a: string, b: string) => sameWordList(wordsOf(a), wordsOf(b));

// True when `inner` quotes the same change as `outer`, including when `outer` keeps
// words around that change. A second edit in the surrounding words is a different mistake.
const sameChange = (outer: Correction, inner: Correction): boolean => {
  const outerOriginal = wordsOf(outer.original);
  const innerOriginal = wordsOf(inner.original);

  if (innerOriginal.length === 0 || innerOriginal.length > outerOriginal.length) {
    return false;
  }

  const outerCorrected = wordsOf(outer.corrected);
  const innerCorrected = wordsOf(inner.corrected);

  for (let at = 0; at <= outerOriginal.length - innerOriginal.length; at++) {
    const fits = innerOriginal.every((word, index) => word === outerOriginal[at + index]);

    if (!fits) {
      continue;
    }

    const expected = [
      ...outerOriginal.slice(0, at),
      ...innerCorrected,
      ...outerOriginal.slice(at + innerOriginal.length),
    ];

    if (sameWordList(expected, outerCorrected)) {
      return true;
    }
  }

  return false;
};

const sameMistake = (a: Correction, b: Correction): boolean =>
  (sameWords(a.original, b.original) && sameWords(a.corrected, b.corrected)) ||
  sameChange(a, b) ||
  sameChange(b, a);

// The quote with more of the learner's words stays. The longer explanation stays with it
// when the two notes differ.
const prefer = (earlier: Correction, later: Correction): Correction => {
  const fuller =
    wordsOf(later.original).length > wordsOf(earlier.original).length ? later : earlier;

  const other = fuller === earlier ? later : earlier;

  if (other.explanation.trim().length > fuller.explanation.trim().length) {
    return { ...fuller, explanation: other.explanation };
  }

  return fuller;
};

const absorb = (kept: Correction[], candidate: Correction) => {
  const at = kept.findIndex((prev) => sameMistake(prev, candidate));

  if (at < 0) {
    return false;
  }

  kept[at] = prefer(kept[at], candidate);

  return true;
};

const copyOf = ({ original, corrected, explanation }: Correction): Correction => ({
  original,
  corrected,
  explanation,
});

// Exact copies, and a shorter quote of the same change, become one correction.
// Mistakes that only share an explanation, or only sit next to each other, both stay.
export const uniqueCorrections = (corrections: Correction[]): Correction[] => {
  const kept: Correction[] = [];

  for (const candidate of corrections) {
    if (!absorb(kept, candidate)) {
      kept.push(candidate);
    }
  }

  return kept;
};

// Item and point fixes come first and do not use up `maxExtra`. A later correction can
// still replace one of them when it quotes the same change with more context.
export const mergedCorrections = (
  primary: Correction[],
  extra: Correction[],
  maxExtra: number,
): Correction[] => {
  const kept = uniqueCorrections(primary.map(copyOf));
  let added = 0;

  for (const candidate of extra) {
    const clean = copyOf(candidate);

    if (absorb(kept, clean)) {
      continue;
    }

    if (added >= maxExtra) {
      continue;
    }

    kept.push(clean);
    added += 1;
  }

  return kept;
};
