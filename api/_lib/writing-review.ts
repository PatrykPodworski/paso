import type { Correction, Grade, WritingMark, WritingReview } from "../../src/data/types.ts";
import { correctionsSchema, isCorrections, keptCorrections } from "./corrections.ts";
import { messagesOf } from "./writing-prompt.ts";
import type { WritingTask } from "./writing-tasks.ts";

// Mirrors the 2000-character limit on the answer, so the revision cannot grow into free text.
const MAX_REVISED = 2000;
const MAX_TOKENS = 4000;
const BANDS = [0, 1, 2, 3];
// DELE A1 task 2: under 20 words is not marked, and below the task's range points to band 1.
const MARKED_WORDS = 20;
const SHORT_BAND = 1;

// A practice task's result and the grade the app records for it.
export const RESULT_GRADES = {
  passed: "perfect",
  partly: "good",
  failed: "bad",
} as const satisfies Record<string, Grade>;

type Result = keyof typeof RESULT_GRADES;

// Points a practice pass may miss in the model's own coverage.
const MISSES_ALLOWED = { write: 1, form: 0 };

const text = { type: "string" };

const object = <T extends Record<string, object>>(properties: T) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

const coverageItem = object({ point: text, met: { type: "boolean" }, feedback: text });
const mark = object({ band: { type: "integer", enum: BANDS }, reason: text });
const result = { type: "string", enum: Object.keys(RESULT_GRADES) };

// Claude's structured outputs accept no array length limits, so the code enforces them.
export const schemaOf = (task: WritingTask) =>
  object({
    coverage: { type: "array", items: coverageItem },
    corrections: correctionsSchema,
    revised: text,
    ...(task.exam ? { mark } : { result }),
  });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isCoverage = (value: unknown): value is { met: boolean; feedback: string } =>
  isRecord(value) && typeof value.met === "boolean" && typeof value.feedback === "string";

const isMark = (value: unknown): value is WritingMark =>
  isRecord(value) &&
  typeof value.reason === "string" &&
  typeof value.band === "number" &&
  BANDS.includes(value.band);

const isResult = (value: unknown): value is Result =>
  typeof value === "string" && Object.hasOwn(RESULT_GRADES, value);

const isCoverageOf = (
  task: WritingTask,
  value: unknown,
): value is { met: boolean; feedback: string }[] =>
  Array.isArray(value) && value.length === task.points.length && value.every(isCoverage);

const isRevised = (value: unknown): value is string =>
  typeof value === "string" && value.length <= MAX_REVISED;

const isShortLetter = (task: WritingTask, wordCount: number) =>
  task.exam && task.kind === "write" && wordCount < task.wordRange[0];

// Mirrors the exam's short-letter cap: a pass needs the points the model itself found covered
// and, for a letter, the minimum word count. It only ever lowers passed to partly.
const cappedResult = (
  task: WritingTask,
  wordCount: number,
  coverage: { met: boolean }[],
  result: Result,
): Result => {
  const missed = coverage.filter((c) => !c.met).length > MISSES_ALLOWED[task.kind];
  const short = task.kind === "write" && wordCount < task.wordRange[0];

  return result === "passed" && (missed || short) ? "partly" : result;
};

const parseJson = (content: string): unknown => {
  try {
    return JSON.parse(content);
  } catch {
    return undefined;
  }
};

type Output = {
  coverage: { met: boolean; feedback: string }[];
  corrections: Correction[];
  revised: string;
  mark?: WritingMark;
  result?: Result;
};

const isOutput = (task: WritingTask, value: unknown): value is Output =>
  isRecord(value) &&
  isCoverageOf(task, value.coverage) &&
  isCorrections(value.corrections) &&
  isRevised(value.revised) &&
  (task.exam ? isMark(value.mark) : isResult(value.result));

// Null when the output breaks the schema. Point text comes from the task, not the model.
export const parseReview = (
  task: WritingTask,
  wordCount: number,
  content: string,
): WritingReview | null => {
  const output = parseJson(content);

  if (!isOutput(task, output)) {
    return null;
  }

  const { coverage, corrections, revised, mark, result } = output;

  const review: WritingReview = {
    wordCount,
    coverage: coverage.map(({ met, feedback }, i) => ({ point: task.points[i], met, feedback })),
    corrections: keptCorrections(corrections),
    revised,
  };

  if (!task.exam || !mark) {
    return { ...review, grade: RESULT_GRADES[cappedResult(task, wordCount, coverage, result!)] };
  }

  const band = isShortLetter(task, wordCount) ? Math.min(mark.band, SHORT_BAND) : mark.band;

  return { ...review, mark: { band, reason: mark.reason } };
};

const unmarked = (task: WritingTask, wordCount: number, reason: string): WritingReview => ({
  wordCount,
  coverage: task.points.map((point) => ({ point, met: false, feedback: reason })),
  corrections: [],
  revised: "",
  ...(task.exam ? { mark: { band: 0, reason } } : { grade: "bad" as const }),
});

// The review of an answer too short to send to the model, or null when the model must read it.
export const presetReview = (task: WritingTask, wordCount: number) =>
  wordCount === 0
    ? unmarked(task, wordCount, "Blank answer.")
    : isShortLetter(task, wordCount) && wordCount < MARKED_WORDS
      ? unmarked(task, wordCount, "Under 20 words: not marked.")
      : null;

const modelContent = (data: unknown) => {
  const choice: unknown = isRecord(data) && Array.isArray(data.choices) ? data.choices[0] : null;
  const message = isRecord(choice) ? choice.message : null;

  return isRecord(message) && typeof message.content === "string" ? message.content : "";
};

export type OpenRouter = { key: string; model: string };

const SETTINGS = ["OPENROUTER_API_KEY", "OPENROUTER_MODEL"];

// The key and the model come only from the environment: a missing one is an error, so a
// model change is always deliberate.
export const openRouter = (): OpenRouter | { missing: string[] } => {
  const missing = SETTINGS.filter((name) => !process.env[name]);

  return missing.length
    ? { missing }
    : { key: process.env.OPENROUTER_API_KEY!, model: process.env.OPENROUTER_MODEL! };
};

// Returns null on any failure: an error status, no connection, or output outside the schema.
export const modelReview = async (
  { key, model }: OpenRouter,
  task: WritingTask,
  answer: string,
  wordCount: number,
) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        temperature: 0,
        messages: messagesOf(task, answer, wordCount),
        response_format: {
          type: "json_schema",
          json_schema: { name: "writing_review", strict: true, schema: schemaOf(task) },
        },
      }),
    });

    const review = response.ok
      ? parseReview(task, wordCount, modelContent(await response.json()))
      : null;

    if (!review) {
      console.error("Writing review failed", response.status);
    }

    return review;
  } catch (error) {
    console.error("Writing review failed", error);

    return null;
  }
};
