import { createHash } from "node:crypto";
import { mockSections } from "../../src/data/mock.ts";
import { REVIEW_WINDOWS } from "../../src/data/progress.ts";
import type {
  Attempt,
  LiveGrade,
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

// An id for legacy records saved without one, the same on every import.
export const stableId = (...parts: unknown[]) =>
  `legacy-${createHash("sha256").update(JSON.stringify(parts)).digest("hex").slice(0, 32)}`;

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

export const completionOf = (value: unknown): Completion | null =>
  isRecord(value) &&
  isCount(value.total, 1, MAX_TOTAL) &&
  isCount(value.score, 0, value.total) &&
  isInstant(value.at)
    ? { score: value.score, total: value.total, at: value.at }
    : null;

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

const MOCK_FIELDS: [keyof MockRun, Check][] = [
  ["stage", (value) => STAGES.includes(value as MockStage)],
  ["deadline", (value) => Number.isSafeInteger(value) && (value as number) >= 0],
  ["started", (value) => value === "" || isInstant(value)],
];

const MOCK_QUESTIONS = new Set(mockSections.flatMap((s) => s.questions.map((q) => q.id)));
const isMockQuestion: Check = (key) => MOCK_QUESTIONS.has(key as string);

// Drafts also hold the speaking preparation notes under "prep".
const MOCK_MAPS: [keyof MockRun, Check, Check][] = [
  ["answers", isMockQuestion, isText],
  ["drafts", (key) => key === "prep" || isMockQuestion(key), isText],
  [
    "scores",
    (key) => key === "writing" || key === "speaking",
    (value) => isText(value, MAX_SCORE_TEXT),
  ],
];

// A question index is only valid within its section, so the two always travel together.
const isPosition = (section: unknown, index: unknown) =>
  isCount(section, 0, mockSections.length - 1) &&
  isCount(index, 0, mockSections[section].questions.length - 1);

// The valid entries of a record, and whether every entry was valid.
const entriesOf = (value: unknown, isKey: Check, isValue: Check) => {
  const entries = isRecord(value) ? Object.entries(value) : [];
  const valid = entries.filter(([key, item]) => isKey(key) && isValue(item));

  return {
    record: isRecord(value),
    valid,
    complete: isRecord(value) && valid.length === entries.length,
  };
};

// Each part returns the fields it read, or null when it is strict and one is invalid.
const positionPart = (value: Record<string, unknown>) => {
  if (!Object.hasOwn(value, "section") && !Object.hasOwn(value, "index")) {
    return {};
  }

  return isPosition(value.section, value.index)
    ? { section: value.section, index: value.index }
    : null;
};

const fieldsPart = (value: Record<string, unknown>, strict: boolean) => {
  const present = MOCK_FIELDS.filter(([name]) => Object.hasOwn(value, name));
  const valid = present.filter(([name, check]) => check(value[name]));

  return strict && valid.length < present.length
    ? null
    : Object.fromEntries(valid.map(([name]) => [name, value[name]]));
};

const mapsPart = (value: Record<string, unknown>, strict: boolean) => {
  const present = MOCK_MAPS.filter(([name]) => Object.hasOwn(value, name)).map(
    ([name, isKey, isValue]) => [name, entriesOf(value[name], isKey, isValue)] as const,
  );

  return strict && present.some(([, entries]) => !entries.complete)
    ? null
    : Object.fromEntries(
        present
          .filter(([, entries]) => entries.record)
          .map(([name, entries]) => [name, Object.fromEntries(entries.valid)]),
      );
};

// Strict: any invalid part refuses the whole change. Otherwise invalid parts are dropped.
const mockRunPartsOf = (value: Record<string, unknown>, strict: boolean) => {
  const parts = [positionPart(value), fieldsPart(value, strict), mapsPart(value, strict)];

  return parts.includes(null) ? null : (Object.assign({}, ...parts) as MockRunPatch);
};

export const mockRunPatchOf = (value: unknown) =>
  isRecord(value) ? mockRunPartsOf(value, true) : null;

// A run the browser kept before the server held it. Its position, stage and answers must be
// valid; other invalid parts are dropped.
export const legacyMockRunOf = (value: unknown) =>
  isRecord(value) &&
  isPosition(value.section, value.index) &&
  STAGES.includes(value.stage as MockStage) &&
  isRecord(value.answers)
    ? mockRunPartsOf(value, false)
    : null;
