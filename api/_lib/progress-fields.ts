import {
  mockExam,
  mockQuestions,
  mockTasks,
  mockTopics,
  sectionSizes,
} from "../../src/data/mock.ts";
import { EXAM_PLAYS } from "../../src/data/audio.ts";
import { CORRECTION_FIELDS, MAX_TALK_CORRECTIONS, MAX_TALK_ITEMS } from "./corrections.ts";
import { REVIEW_WINDOWS } from "../../src/data/progress.ts";
import type {
  Attempt,
  Grade,
  LiveItem,
  MockResponses,
  MockRun,
  MockRunPatch,
  MockStage,
  NewMockResult,
  Skill,
  VocabularyReview,
} from "../../src/data/types.ts";

export type MockResult = NewMockResult & { id: string };
export type Completion = { score: number; total: number; at: string };

export const MAX_NAME = 32;
export const GOALS = [5, 10, 20];
export const MAX_TOTAL = 1000;

const MAX_ID = 64;
const MAX_TEXT = 4000;
const MAX_SECTION = 25;
const MAX_SCORE_TEXT = 16;
// The exam builder takes an unsigned 32-bit seed.
const MAX_SEED = 2 ** 32 - 1;
const STAGES: MockStage[] = ["intro", "run", "review", "prep", "done"];
const SKILLS: Skill[] = ["reading", "listening", "writing", "speaking"];
const GRADES: Grade[] = ["perfect", "good", "bad"];
const LEVELS: LiveItem[] = ["correct", "understandable", "missing"];
const MAX_LABEL = 200;
const DAY = /^[12]\d{3}-\d{2}-\d{2}$/;

// Postgres takes offsets up to ±15:59.
const INSTANT =
  /^[12]\d{3}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?(Z|[+-](0\d|1[0-5]):[0-5]\d)$/;

const LONE_SURROGATE = /\p{Cs}/u;
const ZONE = /^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+)*$/;

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isText = (value: unknown, max = MAX_TEXT): value is string =>
  typeof value === "string" &&
  value.length <= max &&
  // Postgres text cannot hold U+0000, and jsonb refuses a lone UTF-16 surrogate.
  !value.includes("\0") &&
  !LONE_SURROGATE.test(value);

export const isId = (value: unknown): value is string => isText(value, MAX_ID) && value !== "";

export const isCount = (value: unknown, min: number, max: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max;

// A calendar date that exists, such as 2026-11-20; JavaScript would roll 2026-02-30 over.
const isDay = (value: unknown): value is string => {
  const date = new Date(`${value}T00:00:00Z`);

  return (
    typeof value === "string" &&
    DAY.test(value) &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

// The exam date is a calendar date or empty.
export const isExamDate = (value: unknown): value is string => value === "" || isDay(value);

export const isInstant = (value: unknown): value is string =>
  typeof value === "string" &&
  INSTANT.test(value) &&
  isDay(value.slice(0, 10)) &&
  !Number.isNaN(Date.parse(value));

const isScore = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= MAX_SECTION;

// An IANA zone both Intl and Postgres know, or UTC. Offsets such as +02:00 are refused
// because Postgres reads their sign the POSIX way, the opposite of ISO 8601.
export const timeZoneOf = (value: unknown) => {
  if (typeof value !== "string" || value.length > MAX_ID || !ZONE.test(value)) {
    return "UTC";
  }

  try {
    new Intl.DateTimeFormat("en", { timeZone: value });

    return value;
  } catch {
    return "UTC";
  }
};

export const attemptOf = (value: unknown): Attempt | null => {
  if (
    !isRecord(value) ||
    !isId(value.id) ||
    !isId(value.questionId) ||
    !SKILLS.includes(value.skill as Skill) ||
    !(value.correct === null || typeof value.correct === "boolean") ||
    !isText(value.answer) ||
    !isInstant(value.at) ||
    !(value.assisted == null || typeof value.assisted === "boolean") ||
    !(value.grade == null || GRADES.includes(value.grade as Grade)) ||
    // Only a correct answer gets a note.
    !(value.noted == null || value.noted === false || (value.noted === true && value.correct))
  ) {
    return null;
  }

  return {
    id: value.id,
    questionId: value.questionId,
    skill: value.skill as Skill,
    correct: value.correct,
    answer: value.answer,
    at: value.at,
    ...(value.assisted ? { assisted: true } : {}),
    ...(value.grade ? { grade: value.grade as Grade } : {}),
    ...(value.noted ? { noted: true } : {}),
  };
};

export const reviewOf = (value: unknown): VocabularyReview | null => {
  if (
    !isRecord(value) ||
    !isCount(value.level, 0, REVIEW_WINDOWS.length - 1) ||
    !isInstant(value.nextAt) ||
    !(value.reviewedAt === undefined || isInstant(value.reviewedAt))
  ) {
    return null;
  }

  return {
    level: value.level,
    nextAt: value.nextAt,
    ...(value.reviewedAt ? { reviewedAt: value.reviewedAt } : {}),
  };
};

// Sections of the exam in exam order, each once: the whole exam or a part of it.
const isSections = (value: unknown): value is number[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every(
    (section, i) => isCount(section, 0, mockExam.length - 1) && (i === 0 || section > value[i - 1]),
  );

// A score the result has exactly when its run took the section.
const isSectionScore = (score: unknown, sections: number[], section: number) =>
  sections.includes(section) ? isCount(score, 0, MAX_SECTION) : score === undefined;

// Writing and speaking may be absent when the section was taken: that is ungraded, not zero.
// A score for a section the run did not take is refused. Zero is a score.
const isProductiveScore = (score: unknown, sections: number[], section: number) =>
  sections.includes(section) ? score === undefined || isScore(score) : score === undefined;

export const mockResultOf = (value: unknown): MockResult | null => {
  if (
    !isRecord(value) ||
    !isId(value.id) ||
    !isInstant(value.at) ||
    !isSections(value.sections) ||
    !isSectionScore(value.reading, value.sections, 0) ||
    !isSectionScore(value.listening, value.sections, 1) ||
    !isProductiveScore(value.writing, value.sections, 2) ||
    !isProductiveScore(value.speaking, value.sections, 3) ||
    !(value.recorded === undefined || value.recorded === true) ||
    !(value.responses === undefined || isResponses(value.responses, value.sections))
  ) {
    return null;
  }

  return {
    id: value.id,
    at: value.at,
    sections: value.sections,
    ...(value.reading === undefined ? {} : { reading: value.reading as number }),
    ...(value.listening === undefined ? {} : { listening: value.listening as number }),
    ...(value.writing === undefined ? {} : { writing: value.writing as number }),
    ...(value.speaking === undefined ? {} : { speaking: value.speaking as number }),
    ...(value.recorded === true ? { recorded: true as const } : {}),
    ...(value.responses === undefined ? {} : { responses: value.responses as MockResponses }),
  };
};

type Check = (value: unknown) => boolean;

const MOCK_QUESTIONS = new Set(mockQuestions.map((q) => q.id));
const isMockQuestion: Check = (key) => MOCK_QUESTIONS.has(key as string);

const RECORDINGS = new Set(mockQuestions.filter((q) => q.audio).map((q) => q.id));
const isRecording: Check = (key) => RECORDINGS.has(key as string);

// One variant for every task of the exam, each from that task's own pool.
const isExamVariants: Check = (value) =>
  isRecord(value) &&
  Object.keys(value).length === mockTasks.length &&
  mockTasks.every((t) => t.variants.some((v) => v.id === value[t.id]));

const WRITING_QUESTIONS = new Set(
  mockExam[2].tasks.flatMap((t) => t.variants.flatMap((v) => v.questions.map((q) => q.id))),
);

const VARIANTS = new Set(mockTasks.flatMap((t) => t.variants.map((v) => v.id)));

// The variants a section or a whole exam shows: at least one, at most one per task.
export const isSeenVariants = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.length <= mockTasks.length &&
  value.every((id) => VARIANTS.has(id));

const mapOf =
  (isKey: Check, isValue: Check): Check =>
  (value) =>
    isRecord(value) && Object.entries(value).every(([key, item]) => isKey(key) && isValue(item));

const isStoredCorrections: Check = (value) =>
  Array.isArray(value) &&
  value.length <= MAX_TALK_CORRECTIONS &&
  value.every(
    (correction: unknown) =>
      isRecord(correction) &&
      Object.keys(correction).length === CORRECTION_FIELDS.length &&
      CORRECTION_FIELDS.every((field) => isText(correction[field])),
  );

// Lucía's score of a mock exam talk, as api/score-talk returned it.
const isLiveScore: Check = (value) =>
  isRecord(value) &&
  GRADES.includes(value.grade as Grade) &&
  Array.isArray(value.items) &&
  value.items.length <= MAX_TALK_ITEMS &&
  value.items.every(
    (item: unknown) =>
      isRecord(item) &&
      isId(item.id) &&
      isText(item.label, MAX_LABEL) &&
      LEVELS.includes(item.level as LiveItem),
  ) &&
  (value.corrections === undefined || isStoredCorrections(value.corrections)) &&
  Object.keys(value).length === ("corrections" in value ? 3 : 2);

// Each mock question with its section and the variant that holds it.
const PLACES = new Map(
  mockExam.flatMap((s, section) =>
    s.tasks.flatMap((t) =>
      t.variants.flatMap((v) =>
        v.questions.map((q) => [q.id, { section, variantId: v.id }] as const),
      ),
    ),
  ),
);

const hasFields = (value: Record<string, unknown>, fields: string[]) =>
  Object.keys(value).length === fields.length && fields.every((f) => Object.hasOwn(value, f));

const TASK = ["section", "questionId", "variantId"];

const isAnswer = (r: Record<string, unknown>) =>
  hasFields(r, [...TASK, "answer", "correct"]) &&
  isText(r.answer) &&
  typeof r.correct === "boolean";

// A writing task is submitted exactly when its text is not blank.
const isWriting = (r: Record<string, unknown>) =>
  (r.status === "submitted" || r.status === "empty") &&
  hasFields(r, [...TASK, "status", "text", ...(Object.hasOwn(r, "band") ? ["band"] : [])]) &&
  isText(r.text) &&
  (r.text.trim() !== "") === (r.status === "submitted") &&
  (r.band === undefined || isCount(r.band, 0, 3));

// Only a scored talk has a transcript: the run keeps none for a talk Lucía did not score.
const isTalk = (r: Record<string, unknown>) =>
  r.status === "scored"
    ? hasFields(r, [...TASK, "status", "transcript", "score"]) &&
      isText(r.transcript) &&
      isLiveScore(r.score)
    : r.status === "none" && hasFields(r, [...TASK, "status"]);

// The response check of each section, by section index.
const RESPONSES_OF = [isAnswer, isAnswer, isWriting, isTalk];

const isResponse = (r: unknown, sections: number[]) => {
  const place = isRecord(r) && typeof r.questionId === "string" && PLACES.get(r.questionId);

  return (
    !!place &&
    place.section === r.section &&
    place.variantId === r.variantId &&
    sections.includes(place.section) &&
    RESPONSES_OF[place.section](r)
  );
};

// The responses of a rehearsal that took the given sections, at most one per question.
const isResponses = (value: unknown, sections: number[]) =>
  isRecord(value) &&
  hasFields(value, ["started", "items"]) &&
  (value.started === "" || isInstant(value.started)) &&
  Array.isArray(value.items) &&
  value.items.every((r) => isResponse(r, sections)) &&
  new Set(value.items.map((r: { questionId: string }) => r.questionId)).size === value.items.length;

const MOCK_FIELDS: [keyof MockRun, Check][] = [
  ["stage", (value) => STAGES.includes(value as MockStage)],
  ["deadline", (value) => Number.isSafeInteger(value) && (value as number) >= 0],
  ["started", (value) => value === "" || isInstant(value)],
  ["answers", mapOf(isMockQuestion, isText)],
  // Drafts also hold the speaking preparation notes under "prep".
  ["drafts", mapOf((key) => key === "prep" || isMockQuestion(key), isText)],
  [
    "scores",
    mapOf(
      (key) => key === "writing" || key === "speaking",
      (value) => isText(value, MAX_SCORE_TEXT),
    ),
  ],
  ["topic", (value) => mockTopics.some((topic) => topic.id === value)],
  ["talks", mapOf(isMockQuestion, isLiveScore)],
  // A DELE writing band from 0 to 3 per writing task.
  [
    "marks",
    mapOf(
      (key) => WRITING_QUESTIONS.has(key as string),
      (value) => isCount(value, 0, 3),
    ),
  ],
  ["plays", mapOf(isRecording, (value) => isCount(value, 1, EXAM_PLAYS))],
  ["seed", (value) => isCount(value, 0, MAX_SEED)],
  ["variants", isExamVariants],
  ["sections", isSections],
  ["resultId", isId],
];

// A question index is only valid within its section, so the two always travel together.
const isPosition = (section: unknown, index: unknown) =>
  isCount(section, 0, sectionSizes.length - 1) && isCount(index, 0, sectionSizes[section] - 1);

// The fields a change to the mock run sets, or null when one of them is invalid.
export const mockRunPatchOf = (value: unknown): MockRunPatch | null => {
  if (!isRecord(value)) {
    return null;
  }

  const moves = Object.hasOwn(value, "section") || Object.hasOwn(value, "index");
  const present = MOCK_FIELDS.filter(([name]) => Object.hasOwn(value, name));

  if (
    (moves && !isPosition(value.section, value.index)) ||
    !present.every(([name, check]) => check(value[name]))
  ) {
    return null;
  }

  return Object.fromEntries([
    ...(moves ? ["section", "index"] : []).map((name) => [name, value[name]]),
    ...present.map(([name]) => [name, value[name]]),
  ]) as MockRunPatch;
};
