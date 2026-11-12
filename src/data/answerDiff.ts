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

type Marks = {
  answer: ("same" | "wrong")[];
  correct: ("same" | "changed")[];
  // Text the answer leaves out, by the position in the answer where it belongs.
  missing: Map<number, string>;
};

type Gap = { a: [number, number]; c: [number, number] };

// The index ranges of a and of b between their common pairs, where the two differ.
const gaps = (common: [number, number][], aLength: number, bLength: number) => {
  const result: Gap[] = [];
  let i = 0;
  let j = 0;

  for (const [pi, pj] of [...common, [aLength, bLength]]) {
    if (pi > i || pj > j) {
      result.push({ a: [i, pi], c: [j, pj] });
    }

    i = pi + 1;
    j = pj + 1;
  }

  return result;
};

type Span = { text: string; at: number[]; start: number; end: number };

const span = (text: string, gap: Word[], fallback: number): Span => {
  const start = gap[0]?.start ?? fallback;
  const end = gap.at(-1)?.end ?? fallback;

  return { text, at: comparedPositions(text, start, end), start, end };
};

const markWhole = (marks: Marks, a: Span, c: Span, insertAt: number, expected: string) => {
  a.at.forEach((p) => (marks.answer[p] = "wrong"));
  c.at.forEach((p) => (marks.correct[p] = "changed"));

  if (a.at.length === 0) {
    marks.missing.set(insertAt, expected);
  }
};

const markLetters = (marks: Marks, a: Span, c: Span, common: [number, number][]) => {
  for (const gap of gaps(common, a.at.length, c.at.length)) {
    const extra = a.at.slice(...gap.a);
    const absent = c.at.slice(...gap.c);

    extra.forEach((p) => (marks.answer[p] = "wrong"));
    absent.forEach((p) => (marks.correct[p] = "changed"));

    if (extra.length === 0) {
      marks.missing.set(a.at[gap.a[1]] ?? a.end, absent.map((p) => c.text[p]).join(""));
    }
  }
};

// Marks the differing words of a and c, and returns them as one change.
const markWords = (
  marks: Marks,
  a: string,
  c: string,
  aGap: Word[],
  cGap: Word[],
  insertAt: number,
) => {
  const aSpan = span(a, aGap, insertAt);
  const cSpan = span(c, cGap, 0);
  const written = a.slice(aSpan.start, aSpan.end);
  const expected = c.slice(cSpan.start, cSpan.end);

  const common = commonPairs(
    aSpan.at.map((p) => comparedKey(a, p)),
    cSpan.at.map((p) => comparedKey(c, p)),
  );

  if ((2 * common.length) / (aSpan.at.length + cSpan.at.length) < SIMILAR) {
    markWhole(marks, aSpan, cSpan, insertAt, expected);
  } else {
    markLetters(marks, aSpan, cSpan, common);
  }

  return {
    written: written.replace(OUTER_PUNCTUATION, ""),
    expected: expected.replace(OUTER_PUNCTUATION, ""),
  };
};

// The learner's answer against the correct one, by words and then by letters within the words
// that differ. Case, punctuation and repeated spaces are not differences, as in the checker.
export const answerDiff = (answer: string, correct: string): AnswerDiff => {
  const a = answer.normalize("NFC");
  const c = correct.normalize("NFC");

  const marks: Marks = {
    answer: Array<"same" | "wrong">(a.length).fill("same"),
    correct: Array<"same" | "changed">(c.length).fill("same"),
    missing: new Map(),
  };

  const aWords = words(a);
  const cWords = words(c);

  const common = commonPairs(
    aWords.map((w) => w.key),
    cWords.map((w) => w.key),
  );

  const changes = gaps(common, aWords.length, cWords.length).map(({ a: [i, wi], c: [j, wj] }) =>
    markWords(
      marks,
      a,
      c,
      aWords.slice(i, wi),
      cWords.slice(j, wj),
      aWords[wi]?.start ?? aWords[i - 1]?.end ?? 0,
    ),
  );

  return {
    answer: pieces(a, marks.answer, marks.missing) as AnswerPiece[],
    correct: pieces(c, marks.correct) as CorrectPiece[],
    changes,
  };
};
