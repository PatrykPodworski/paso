import type { Attempt, ReviewState, VocabularyReview } from "../../src/data/types.ts";
import {
  attemptOf,
  type Completion,
  completionOf,
  GOALS,
  isExamDate,
  isId,
  isRecord,
  isText,
  MAX_NAME,
  type MockResult,
  mockResultOf,
  reviewOf,
  stableId,
} from "./progress-fields.js";

// The browser kept at most this many attempts.
const MAX_ATTEMPTS = 6000;

export type LegacyProgress = {
  name: string;
  goal: number;
  examDate: string;
  completed: Record<string, Completion>;
  attempts: Attempt[];
  mistakes: string[];
  mistakeReviews: Record<string, ReviewState>;
  vocabularyReviews: Record<string, VocabularyReview>;
  checks: string[];
  mockResults: MockResult[];
  drafts: Record<string, string>;
};

const listOf = <T>(value: unknown, parse: (item: unknown) => T | null) =>
  Array.isArray(value) ? value.map(parse).filter((item) => item !== null) : [];

const entriesOf = <T>(value: unknown, parse: (item: unknown) => T | null) =>
  Object.fromEntries(
    Object.entries(isRecord(value) ? value : {}).flatMap(([key, item]) => {
      const parsed = isId(key) ? parse(item) : null;

      return parsed === null ? [] : [[key, parsed] as const];
    }),
  );

const withId = (value: unknown, parts: (item: Record<string, unknown>) => unknown[]) =>
  isRecord(value) && value.id === undefined ? { ...value, id: stableId(...parts(value)) } : value;

// Reads the `paso-progress-v1` document field by field: a malformed field counts as
// empty and a malformed item is dropped, so one bad value never loses the rest.
export const legacyProgressOf = (raw: unknown): LegacyProgress => {
  const doc = isRecord(raw) ? raw : {};

  return {
    name: isText(doc.name, MAX_NAME) ? doc.name : "",
    goal: GOALS.includes(doc.goal as number) ? (doc.goal as number) : 10,
    examDate: isExamDate(doc.examDate) ? doc.examDate : "",
    completed: entriesOf(doc.completed, completionOf),
    attempts: listOf(Array.isArray(doc.attempts) ? doc.attempts.slice(-MAX_ATTEMPTS) : [], (a) =>
      attemptOf(withId(a, (r) => [r.questionId, r.at])),
    ),
    mistakes: [...new Set(listOf(doc.mistakes, (id) => (isId(id) ? id : null)))],
    mistakeReviews: entriesOf(doc.mistakeReviews, (r) => {
      const review = reviewOf(r);

      return review && { level: review.level, nextAt: review.nextAt };
    }),
    vocabularyReviews: entriesOf(doc.vocabularyReviews, reviewOf),
    checks: [...new Set(listOf(doc.checks, (id) => (isId(id) ? id : null)))],
    mockResults: listOf(doc.mockResults, (m) => mockResultOf(withId(m, (r) => ["mock", r.at]))),
    drafts: entriesOf(doc.drafts, (text) => (isText(text) && text !== "" ? text : null)),
  };
};
