import { mockSections, mockTopics } from "../../src/data/mock.ts";
import { REVIEW_WINDOWS } from "../../src/data/progress.ts";
import type {
  Attempt,
  LiveGrade,
  LiveItem,
  MockRun,
  MockRunPatch,
  MockStage,
  ProgressSnapshot,
  Skill,
  VocabularyReview,
} from "../../src/data/types.ts";

export type MockResult = ProgressSnapshot["mockResults"][number];
export type Completion = { score: number; total: number; at: string };

export const MAX_NAME = 32;
export const GOALS = [5, 10, 20];
export const MAX_TOTAL = 1000;

const MAX_ID = 64;
const MAX_TEXT = 4000;
const MAX_SECTION = 25;
const MAX_SCORE_TEXT = 16;
const STAGES: MockStage[] = ["intro", "run", "review", "prep", "done"];
const SKILLS: Skill[] = ["reading", "listening", "writing", "speaking"];
const GRADES: LiveGrade[] = ["perfect", "good", "bad"];
const LEVELS: LiveItem[] = ["correct", "understandable", "missing"];
const MAX_TALK_ITEMS = 20;
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
    !(value.grade == null || GRADES.includes(value.grade as LiveGrade))
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
    ...(value.grade ? { grade: value.grade as LiveGrade } : {}),
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

export const mockResultOf = (value: unknown): MockResult | null => {
  if (
    !isRecord(value) ||
    !isId(value.id) ||
    !isInstant(value.at) ||
    !isCount(value.reading, 0, MAX_SECTION) ||
    !isCount(value.listening, 0, MAX_SECTION) ||
    !(value.writing === undefined || isScore(value.writing)) ||
    !(value.speaking === undefined || isScore(value.speaking))
  ) {
    return null;
  }

  return {
    id: value.id,
    at: value.at,
    reading: value.reading,
    listening: value.listening,
    ...(value.writing === undefined ? {} : { writing: value.writing as number }),
    ...(value.speaking === undefined ? {} : { speaking: value.speaking as number }),
  };
};

type Check = (value: unknown) => boolean;

const MOCK_QUESTIONS = new Set(mockSections.flatMap((s) => s.questions.map((q) => q.id)));
const isMockQuestion: Check = (key) => MOCK_QUESTIONS.has(key as string);

const mapOf =
  (isKey: Check, isValue: Check): Check =>
  (value) =>
    isRecord(value) && Object.entries(value).every(([key, item]) => isKey(key) && isValue(item));

// Lucía's score of a mock exam talk, as api/score-talk returned it.
const isLiveScore: Check = (value) =>
  isRecord(value) &&
  GRADES.includes(value.grade as LiveGrade) &&
  Array.isArray(value.items) &&
  value.items.length <= MAX_TALK_ITEMS &&
  value.items.every(
    (item: unknown) =>
      isRecord(item) &&
      isId(item.id) &&
      isText(item.label, MAX_LABEL) &&
      LEVELS.includes(item.level as LiveItem),
  ) &&
  Object.keys(value).length === 2;

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
];

// A question index is only valid within its section, so the two always travel together.
const isPosition = (section: unknown, index: unknown) =>
  isCount(section, 0, mockSections.length - 1) &&
  isCount(index, 0, mockSections[section].questions.length - 1);

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
