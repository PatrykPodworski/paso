import { acceptedAnswers, normalize } from "./progress";
import type { Question } from "./types";

export type AnswerPiece = { text: string; mark: "same" | "wrong" | "missing" };
export type CorrectPiece = { text: string; mark: "same" | "changed" };
export type AnswerChange = { written: string; expected: string };

export type AnswerDiff = {
  answer: AnswerPiece[];
  correct: CorrectPiece[];
  changes: AnswerChange[];
};

const PUNCTUATION = /[¿?¡!.,;:…]/;
const OUTER_PUNCTUATION = /^[¿?¡!.,;:…]+|[¿?¡!.,;:…]+$/g;

// Below this share of common letters, two words are told apart as whole words.
const SIMILAR = 0.5;

// The index pairs of a longest common subsequence of a and b.
const commonPairs = <T>(a: T[], b: T[]) => {
  const lengths = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lengths[i][j] =
        a[i] === b[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
  }

  const pairs: [number, number][] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pairs.push([i, j]);
      i++;
      j++;
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }

  return pairs;
};

type Word = { start: number; end: number; key: string };

const words = (text: string): Word[] =>
  [...text.matchAll(/\S+/g)]
    .map((m) => ({
      start: m.index,
      end: m.index + m[0].length,
      key: [...m[0].toLocaleLowerCase("es")].filter((c) => !PUNCTUATION.test(c)).join(""),
    }))
    .filter((w) => w.key !== "");

// The positions the comparison reads: no punctuation, and one space for a run of spaces.
const comparedPositions = (text: string, start: number, end: number) => {
  const positions: number[] = [];

  for (let p = start; p < end; p++) {
    const space = /\s/.test(text[p]);

    if (!PUNCTUATION.test(text[p]) && !(space && /\s/.test(text[p - 1] ?? ""))) {
      positions.push(p);
    }
  }

  return positions;
};

const comparedKey = (text: string, p: number) =>
  /\s/.test(text[p]) ? " " : text[p].toLocaleLowerCase("es");

const pieces = <M extends string>(
  text: string,
  marks: M[],
  missing = new Map<number, string>(),
) => {
  const result: { text: string; mark: M | "missing" }[] = [];

  const add = (piece: string, mark: M | "missing") => {
    const last = result.at(-1);

    if (last && last.mark === mark && mark !== "missing") {
      last.text += piece;
    } else {
      result.push({ text: piece, mark });
    }
  };

  for (let p = 0; p <= text.length; p++) {
    const absent = missing.get(p);

    if (absent) {
      add(absent, "missing");
    }

    if (p < text.length) {
      add(text[p], marks[p]);
    }
  }

  return result;
};

// The learner's answer against the correct one, by words and then by letters within the words
// that differ. Case, punctuation and repeated spaces are not differences, as in the checker.
export const answerDiff = (answer: string, correct: string): AnswerDiff => {
  const a = answer.normalize("NFC");
  const c = correct.normalize("NFC");
  const aMarks = Array<"same" | "wrong">(a.length).fill("same");
  const cMarks = Array<"same" | "changed">(c.length).fill("same");
  const missing = new Map<number, string>();
  const changes: AnswerChange[] = [];

  const compare = (aGap: Word[], cGap: Word[], insertAt: number) => {
    const aStart = aGap[0]?.start ?? insertAt;
    const aEnd = aGap.at(-1)?.end ?? insertAt;
    const cStart = cGap[0]?.start ?? 0;
    const cEnd = cGap.at(-1)?.end ?? 0;

    changes.push({
      written: a.slice(aStart, aEnd).replace(OUTER_PUNCTUATION, ""),
      expected: c.slice(cStart, cEnd).replace(OUTER_PUNCTUATION, ""),
    });

    const aAt = comparedPositions(a, aStart, aEnd);
    const cAt = comparedPositions(c, cStart, cEnd);

    const common = commonPairs(
      aAt.map((p) => comparedKey(a, p)),
      cAt.map((p) => comparedKey(c, p)),
    );

    if ((2 * common.length) / (aAt.length + cAt.length) < SIMILAR) {
      aAt.forEach((p) => (aMarks[p] = "wrong"));
      cAt.forEach((p) => (cMarks[p] = "changed"));

      if (aAt.length === 0) {
        missing.set(insertAt, c.slice(cStart, cEnd));
      }

      return;
    }

    let i = 0;
    let j = 0;

    for (const [pi, pj] of [...common, [aAt.length, cAt.length]]) {
      const extra = aAt.slice(i, pi);
      const absent = cAt.slice(j, pj);

      extra.forEach((p) => (aMarks[p] = "wrong"));
      absent.forEach((p) => (cMarks[p] = "changed"));

      if (extra.length === 0 && absent.length > 0) {
        missing.set(aAt[pi] ?? aEnd, absent.map((p) => c[p]).join(""));
      }

      i = pi + 1;
      j = pj + 1;
    }
  };

  const aWords = words(a);
  const cWords = words(c);
  let i = 0;
  let j = 0;

  for (const [wi, wj] of [
    ...commonPairs(
      aWords.map((w) => w.key),
      cWords.map((w) => w.key),
    ),
    [aWords.length, cWords.length],
  ]) {
    if (wi > i || wj > j) {
      compare(
        aWords.slice(i, wi),
        cWords.slice(j, wj),
        aWords[wi]?.start ?? aWords[i - 1]?.end ?? 0,
      );
    }

    i = wi + 1;
    j = wj + 1;
  }

  return {
    answer: pieces(a, aMarks, missing) as AnswerPiece[],
    correct: pieces(c, cMarks) as CorrectPiece[],
    changes,
  };
};

const distance = (a: string, b: string) =>
  a.length + b.length - 2 * commonPairs([...a], [...b]).length;

// The accepted answer the learner's answer is nearest to, the main answer on a tie.
export const closestAnswer = (q: Question, answer: string) =>
  acceptedAnswers(q).reduce((best, candidate) =>
    distance(normalize(candidate), normalize(answer)) < distance(normalize(best), normalize(answer))
      ? candidate
      : best,
  );
