import type {
  Attempt,
  NewMockResult,
  ProgressSnapshot,
  ReviewState,
  VocabularyReview,
} from "../data/types";

export const emptySnapshot = (): ProgressSnapshot => ({
  name: "",
  goal: 10,
  examDate: "",
  xp: 0,
  imported: false,
  completed: {},
  questions: {},
  vocabularyReviews: {},
  checks: [],
  mockResults: [],
  drafts: {},
  recent: [],
  days: [],
  mockRun: null,
});

type QuestionState = ProgressSnapshot["questions"][string];

export const questionState = (patch: Partial<QuestionState> = {}): QuestionState => ({
  skill: "reading",
  at: "2026-09-09T08:00:00.000Z",
  correct: true,
  answer: "",
  inMistakes: false,
  ...patch,
});

// The shape the browser kept before progress moved to the server. Tests store it under
// paso-progress-v1, and the app imports it on its first load.
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
