import type { ProgressSnapshot, Question, ReviewState, Skill } from "./types.ts";

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

export const isCorrect = (q: Question, answer: string) =>
  [q.answer, ...(q.accepted || [])].some((a) => normalize(a) === normalize(answer));

export const countWords = (s: string) =>
  s.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length || 0;

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

export const writingHints = (text: string) => {
  const hints: string[] = [];

  if (
    /\b(soy|estoy)\s+(\d+|veinte|treinta|cuarenta|quince|dieciséis|veinticinco)\s+a[nñ]os\b/i.test(
      text,
    )
  ) {
    hints.push("For age, use tener: tengo veinte años, not soy / estoy veinte años.");
  }

  if (/\bme gusta (los|las)\b/i.test(text)) {
    hints.push("Check gustar: a plural noun needs gustan, as in me gustan las manzanas.");
  }

  if (/\bmi (padres|hermanos|amigos|hermanas)\b/i.test(text)) {
    hints.push("A plural possession needs mis: mis padres, mis hermanos.");
  }

  if (/\bde el\b/i.test(text)) {
    hints.push("Usually contract de + el to del: enfrente del banco.");
  }

  if (/\ba el\b/i.test(text)) {
    hints.push("Usually contract a + el to al: voy al parque.");
  }

  if (/\b\d+ anos\b/i.test(text)) {
    hints.push("For years, write años with ñ. Ano is a different word.");
  }

  if (text.includes("?") && !text.includes("¿")) {
    hints.push("Written Spanish questions also need an opening ¿.");
  }

  return hints;
};
