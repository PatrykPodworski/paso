import type { Attempt, NewMockResult, ReviewState, VocabularyReview } from "../../src/data/types";

// Progress a test starts from. It has the shape the app kept in paso-progress-v1 before
// progress moved to the server, because the visual compare drives the base commit's app,
// which may still read that key. Vitest and Playwright both use it, and the base run takes
// the base commit's src, so it lives outside src.
export const progressSeed = () => ({
  version: 1,
  name: "",
  goal: 10,
  completed: {} as Record<string, { score: number; total: number; at: string }>,
  attempts: [] as Attempt[],
  // The server derives mistakes from wrong attempts; only the base app reads this list.
  mistakes: [] as string[],
  reviewed: [] as string[],
  // No api/progress write sets a review window; the Vitest seed writes them to the table.
  mistakeReviews: {} as Record<string, ReviewState>,
  vocabularyReviews: {} as Record<string, VocabularyReview>,
  checks: [] as string[],
  examDate: "",
  mockResults: [] as NewMockResult[],
  drafts: {} as Record<string, string>,
});

export type ProgressSeed = ReturnType<typeof progressSeed>;

// The api/progress writes that store a seed, in the order the app would send them.
export const seedWrites = (seed: Partial<ProgressSeed>, timeZone: string) => {
  const { name = "", goal = 10, examDate = "" } = seed;
  const reviews = seed.vocabularyReviews ?? {};

  return [
    ...(name || goal !== 10 || examDate ? [{ action: "settings", name, goal, examDate }] : []),
    ...Object.entries(seed.completed ?? {}).map(([lessonId, c]) => ({
      action: "complete",
      lessonId,
      ...c,
    })),
    ...(seed.attempts ?? []).map((attempt) => ({ action: "attempt", attempt, timeZone })),
    ...(Object.keys(reviews).length ? [{ action: "vocabulary", reviews }] : []),
    ...(seed.checks ?? []).map((checkId) => ({ action: "check", checkId, done: true })),
    ...(seed.mockResults ?? []).map((result, i) => ({
      action: "mockResult",
      result: { id: `seed-${i}`, ...result },
    })),
    ...Object.entries(seed.drafts ?? {}).map(([questionId, text]) => ({
      action: "draft",
      questionId,
      text,
    })),
  ];
};
