import type { Attempt, NewMockResult, ReviewState, VocabularyReview } from "../../src/data/types";

// The progress the browser kept before it moved to the server. The app imports it from
// paso-progress-v1 on its first load. Vitest and Playwright both use it, and the visual
// baselines run with the base commit's src, so it lives outside src.
export const legacyProgress = () => ({
  version: 1,
  name: "",
  goal: 10,
  completed: {} as Record<string, { score: number; total: number; at: string }>,
  attempts: [] as Attempt[],
  mistakes: [] as string[],
  reviewed: [] as string[],
  mistakeReviews: {} as Record<string, ReviewState>,
  vocabularyReviews: {} as Record<string, VocabularyReview>,
  checks: [] as string[],
  examDate: "",
  mockResults: [] as NewMockResult[],
  drafts: {} as Record<string, string>,
});

export type LegacyProgress = ReturnType<typeof legacyProgress>;
