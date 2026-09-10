import type { Attempt, Progress, Question, Skill } from "./types.ts";

export const REVIEW_WINDOWS = [0, 1, 3, 7, 14, 30] as const;

export type ReviewState = {
  level: number;
  nextAt: string;
};

export const STORAGE_KEY = "paso-progress-v1";
export const emptyProgress = (): Progress => ({
  version: 1,
  name: "",
  goal: 10,
  completed: {},
  attempts: [],
  mistakes: [],
  reviewed: [],
  mistakeReviews: {},
  vocabularyReviews: {},
  checks: [],
  examDate: "",
  mockResults: [],
  drafts: {},
});
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
      : new Date(new Date(at).getTime() + 10 * 60_000).toISOString(),
  };
};
export const readProgress = (): Progress => {
  try {
    // Stryker disable next-line StringLiteral: equivalent mutant. Any other placeholder
    // either parses to a falsy value or throws, and both routes return emptyProgress().
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (
      !raw ||
      raw.version !== 1 ||
      !Array.isArray(raw.attempts) ||
      !raw.completed ||
      !Array.isArray(raw.mistakes)
    ) {
      return emptyProgress();
    }
    return { ...emptyProgress(), ...raw };
  } catch {
    return emptyProgress();
  }
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
export const withAttempt = (p: Progress, attempt: Attempt): Progress => {
  const mistakes = new Set(p.mistakes);
  const trackedMistakeReview =
    p.mistakes.includes(attempt.questionId) || p.mistakeReviews[attempt.questionId];
  const mistakeReviews = { ...p.mistakeReviews };
  if (attempt.correct === false) {
    mistakes.add(attempt.questionId);
    mistakeReviews[attempt.questionId] = { level: 0, nextAt: attempt.at };
  }
  if (attempt.correct === true && !attempt.assisted && trackedMistakeReview) {
    const nextLevel = nextReviewLevel(p.mistakeReviews[attempt.questionId]?.level ?? 0);
    mistakeReviews[attempt.questionId] = {
      level: nextLevel,
      nextAt: nextReviewAt(attempt.at, nextLevel),
    };
    mistakes.delete(attempt.questionId);
  }
  return {
    ...p,
    attempts: [...p.attempts, attempt].slice(-6000),
    mistakes: [...mistakes],
    mistakeReviews,
    reviewed:
      attempt.correct === true && p.mistakes.includes(attempt.questionId) && !attempt.assisted
        ? [...new Set([...p.reviewed, attempt.questionId])]
        : p.reviewed,
  };
};
export const dailyAnswers = (p: Progress, date = localDate()) =>
  new Set(p.attempts.filter((a) => localDate(new Date(a.at)) === date).map((a) => a.questionId))
    .size;
export const streak = (p: Progress) => {
  const days = new Set(p.attempts.map((a) => localDate(new Date(a.at))));
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
export const xp = (p: Progress) =>
  new Set(p.attempts.map((a) => a.questionId)).size * 5 + Object.keys(p.completed).length * 20;
export const skillStats = (p: Progress, skill: Skill) => {
  const latest = new Map<string, Attempt>();
  p.attempts.filter((a) => a.skill === skill).forEach((a) => latest.set(a.questionId, a));
  const attempts = [...latest.values()];
  const graded = attempts.filter((a) => a.correct !== null && !a.assisted);
  return {
    practised: attempts.length,
    graded: graded.length,
    accuracy: graded.length
      ? Math.round((graded.filter((a) => a.correct).length / graded.length) * 100)
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
