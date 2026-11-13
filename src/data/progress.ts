import type {
  LiveItem,
  LiveScore,
  ProgressSnapshot,
  Question,
  ReviewState,
  Skill,
} from "./types.ts";

export const REVIEW_WINDOWS = [0, 1, 3, 7, 14, 30] as const;

export const RELEARN_MINUTES = 10;

// The longest answer or draft api/progress stores.
export const MAX_TEXT = 4000;

// Cuts on a whole character: the server refuses a lone half of a surrogate pair.
export const clipText = (text: string) => {
  const clipped = text.slice(0, MAX_TEXT);

  return /[\uD800-\uDBFF]$/.test(clipped) ? clipped.slice(0, -1) : clipped;
};

export const localDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const reviewStep = (level: number) =>
  REVIEW_WINDOWS[Math.min(Math.max(level, 0), REVIEW_WINDOWS.length - 1)];

export const nextReviewAt = (from: string, level: number) => {
  const base = new Date(from);

  if (Number.isNaN(base.getTime())) {
    return new Date().toISOString();
  }

  return new Date(base.getTime() + reviewStep(level) * 86_400_000).toISOString();
};

export const reviewDue = (entry: ReviewState | undefined, now = new Date()) =>
  !entry || !entry.nextAt || new Date(entry.nextAt).getTime() <= now.getTime();

export const nextReviewLevel = (level: number) =>
  Math.min(Math.max(level, 0) + 1, REVIEW_WINDOWS.length - 1);

export const vocabularyReview = (
  previous: ReviewState | undefined,
  correct: boolean,
  at = new Date().toISOString(),
) => {
  const level = correct ? nextReviewLevel(previous?.level ?? 0) : 0;

  return {
    level,
    reviewedAt: at,
    nextAt: correct
      ? nextReviewAt(at, level)
      : new Date(new Date(at).getTime() + RELEARN_MINUTES * 60_000).toISOString(),
  };
};

export const normalize = (s: string) =>
  s
    .normalize("NFC")
    .toLocaleLowerCase("es")
    .replace(/[¿?¡!.,;:…]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const acceptedAnswers = (q: Question) => [q.answer, ...(q.accepted || [])];

const ACCENT = /[\u0301\u0308]/g;

// Only the acute accent and the diaeresis go: the tilde makes ñ a letter of its own.
const withoutAccents = (s: string) =>
  normalize(s).normalize("NFD").replace(ACCENT, "").normalize("NFC");

const exactMatch = (q: Question, answer: string) =>
  acceptedAnswers(q).some((a) => normalize(a) === normalize(answer));

// Only a typed answer passes without its accents: options and tiles can differ by accents alone.
const accentMatch = (q: Question, answer: string) =>
  q.kind === "type"
    ? acceptedAnswers(q).find((a) => withoutAccents(a) === withoutAccents(answer))
    : undefined;

export const isCorrect = (q: Question, answer: string) =>
  exactMatch(q, answer) || accentMatch(q, answer) !== undefined;

// The accepted answer, as written, that a correct answer matches only once accents are ignored.
export const accentOnlyAnswer = (q: Question, answer: string) =>
  exactMatch(q, answer) ? undefined : accentMatch(q, answer);

// The number of single-letter insertions, deletions and substitutions that turn one text into
// the other.
const editDistance = (a: string, b: string) => {
  let previous = [...Array(b.length + 1).keys()];

  for (let i = 1; i <= a.length; i++) {
    const current = [i];

    for (let j = 1; j <= b.length; j++) {
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);

      current.push(Math.min(previous[j] + 1, current[j - 1] + 1, substitution));
    }

    previous = current;
  }

  return previous[b.length];
};

// The accepted answer, as written, nearest to the learner's answer, so the feedback shows the
// variant they aimed at (ADR 0014). Ties go to the main answer.
export const closestAnswer = (q: Question, answer: string) => {
  const typed = normalize(answer);
  let closest = q.answer;
  let distance = editDistance(normalize(q.answer), typed);

  for (const accepted of q.accepted ?? []) {
    const d = editDistance(normalize(accepted), typed);

    if (d < distance) {
      closest = accepted;
      distance = d;
    }
  }

  return closest;
};

// The accented letters of one text where the other has a different letter.
const accentedDifferences = (text: string, other: string) => {
  const letters = [...normalize(other)];

  return [
    ...new Set(
      [...normalize(text)].filter(
        (letter, i) => letter !== letters[i] && letter.normalize("NFD").search(ACCENT) >= 0,
      ),
    ),
  ];
};

// The accents an answer leaves out of the accepted answer, and the ones it adds.
export const accentMistakes = (accepted: string, answer: string) => ({
  missing: accentedDifferences(accepted, answer),
  extra: accentedDifferences(answer, accepted),
});

export const missingQuestionMarks = (q: Question, answer: string) => {
  const text = answer.trim();

  return !!q.questionMarks && !(text.startsWith("¿") && text.endsWith("?"));
};

// A correct typed answer that gets an accent or ¿ ? note.
export const notedAnswer = (q: Question, answer: string) =>
  accentOnlyAnswer(q, answer) !== undefined ||
  (q.kind === "type" && isCorrect(q, answer) && missingQuestionMarks(q, answer));

const lowered = (s: string) =>
  s.normalize("NFC").toLocaleLowerCase("es").replace(/\s+/g, " ").trim();

const withoutAccentsOrQuestionMarks = (s: string) =>
  lowered(s.normalize("NFD").replace(ACCENT, "").replace(/[¿?]/g, ""));

// The case may change along with them, as a sentence that gains its ¿ gains a capital letter.
export const changesOnlyAccentsOrQuestionMarks = (original: string, corrected: string) =>
  lowered(original) !== lowered(corrected) &&
  withoutAccentsOrQuestionMarks(original) === withoutAccentsOrQuestionMarks(corrected);

export const countWords = (s: string) =>
  s.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length || 0;

// A form answer is one "Label: value" line per field; only the values are the learner's words.
export const answerWords = (q: { kind: string }, answer: string) =>
  countWords(q.kind === "form" ? answer.replace(/^.*?:[^\S\n]*/gm, "") : answer);

// A question answered on the day has its latest answer on that day.
export const dailyAnswers = (p: ProgressSnapshot, date = localDate()) =>
  Object.values(p.questions).filter((q) => localDate(new Date(q.at)) === date).length;

export const streak = (p: ProgressSnapshot) => {
  const days = new Set(p.days);
  const date = new Date();
  let count = 0;

  if (!days.has(localDate(date))) {
    date.setDate(date.getDate() - 1);
  }

  while (days.has(localDate(date))) {
    count++;
    date.setDate(date.getDate() - 1);
  }

  return count;
};

export const skillStats = (p: ProgressSnapshot, skill: Skill) => {
  const answers = Object.values(p.questions).filter((q) => q.skill === skill);
  const graded = answers.filter((q) => q.correct !== null && !q.assisted);

  return {
    practised: answers.length,
    graded: graded.length,
    accuracy: graded.length
      ? Math.round((graded.filter((q) => q.correct).length / graded.length) * 100)
      : null,
  };
};

export const passingGroups = (
  reading: number,
  writing: number,
  listening: number,
  speaking: number,
) => ({
  group1: reading + writing,
  group2: listening + speaking,
  pass: reading + writing >= 30 && listening + speaking >= 30,
});

// DELE A1 marks each writing task 0–3; the two tasks weigh equally in a 25-point section.
export const writingScore = ([first, second]: readonly [number, number]) =>
  Math.round(((first + second) / 2) * (25 / 3) * 100) / 100;

const POINTS: Record<LiveItem, number> = { correct: 1, understandable: 0.5, missing: 0 };

// The share of a talk's points Lucía found, or undefined when she scored no point.
const talkShare = (talk: LiveScore | undefined) =>
  talk?.items.length
    ? talk.items.reduce((sum, item) => sum + POINTS[item.level], 0) / talk.items.length
    : undefined;

// The app's stand-in for a DELE speaking mark, since no examiner listens: each talk is the share
// of its points, a talk without a score counts 0, and the talks weigh equally in 25 points.
// Undefined when no talk has a score.
export const speakingScore = (talks: readonly (LiveScore | undefined)[]) => {
  const shares = talks.map(talkShare);

  if (shares.every((share) => share === undefined)) {
    return undefined;
  }

  const total = shares.reduce<number>((sum, share) => sum + (share ?? 0), 0);

  return Math.round((total / talks.length) * 25 * 100) / 100;
};
