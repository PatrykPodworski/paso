import type { Attempt, Progress, Question, ReviewState, Skill } from "./types.ts";

export const REVIEW_WINDOWS = [0, 1, 3, 7, 14, 30] as const;

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

// A form answer is one "Label: value" line per field; only the values are the learner's words.
export const answerWords = (q: Pick<Question, "kind">, answer: string) =>
  countWords(q.kind === "form" ? answer.replace(/^.*?:[^\S\n]*/gm, "") : answer);

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

    // A graded attempt, a live talk or a writing review, costs a model call, so passing it
    // once clears it for good.
    if (attempt.grade) {
      delete mistakeReviews[attempt.questionId];
    } else {
      mistakeReviews[attempt.questionId] = {
        level: nextLevel,
        nextAt: nextReviewAt(attempt.at, nextLevel),
      };
    }

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

// DELE A1 marks each writing task 0–3; the two tasks weigh equally in a 25-point section.
export const writingScore = ([first, second]: readonly [number, number]) =>
  Math.round(((first + second) / 2) * (25 / 3) * 100) / 100;
