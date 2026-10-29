import type { ProgressSnapshot } from "../data/types";

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
