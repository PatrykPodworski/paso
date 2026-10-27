import type { WritingCorrection, WritingMark, WritingReview } from "../../src/data/types.ts";
import { messagesOf } from "./writing-prompt.ts";
import type { WritingTask } from "./writing-tasks.ts";

const MAX_CORRECTIONS = 8;
const BANDS = [0, 1, 2, 3];
// DELE A1 task 2: under 20 words is not marked, and below the task's range points to band 1.
const MARKED_WORDS = 20;
const SHORT_BAND = 1;

const text = { type: "string" };

const object = <T extends Record<string, object>>(properties: T) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

const coverageItem = object({ point: text, met: { type: "boolean" }, feedback: text });
const correctionItem = object({ original: text, corrected: text, explanation: text });
const mark = object({ band: { type: "integer", enum: BANDS }, reason: text });

// Claude's structured outputs accept no array length limits, so the code enforces them.
export const schemaOf = (task: WritingTask) =>
  object({
    coverage: { type: "array", items: coverageItem },
    corrections: { type: "array", items: correctionItem },
    revised: text,
    ...(task.exam ? { mark } : {}),
  });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isCoverage = (value: unknown): value is { met: boolean; feedback: string } =>
  isRecord(value) && typeof value.met === "boolean" && typeof value.feedback === "string";

const isCorrection = (value: unknown): value is WritingCorrection =>
  isRecord(value) &&
  ["original", "corrected", "explanation"].every((key) => typeof value[key] === "string");

const isMark = (value: unknown): value is WritingMark =>
  isRecord(value) &&
  typeof value.reason === "string" &&
  typeof value.band === "number" &&
  BANDS.includes(value.band);

const isShortLetter = (task: WritingTask, wordCount: number) =>
  task.exam && task.kind === "write" && wordCount < task.wordRange[0];

const parseJson = (content: string): unknown => {
  try {
    return JSON.parse(content);
  } catch {
    return undefined;
  }
};

// Null when the output breaks the schema. Point text comes from the task, not the model.
export const parseReview = (
  task: WritingTask,
  wordCount: number,
  content: string,
): WritingReview | null => {
  const output = parseJson(content);

  if (
    !isRecord(output) ||
    typeof output.revised !== "string" ||
    !Array.isArray(output.coverage) ||
    output.coverage.length !== task.points.length ||
    !output.coverage.every(isCoverage) ||
    !Array.isArray(output.corrections) ||
    !output.corrections.every(isCorrection) ||
    (task.exam && !isMark(output.mark))
  ) {
    return null;
  }

  const review: WritingReview = {
    wordCount,
    coverage: output.coverage.map(({ met, feedback }, i) => ({
      point: task.points[i],
      met,
      feedback,
    })),
    corrections: output.corrections
      .slice(0, MAX_CORRECTIONS)
      .map(({ original, corrected, explanation }) => ({ original, corrected, explanation })),
    revised: output.revised,
  };

  if (!task.exam || !isMark(output.mark)) {
    return review;
  }

  const { band, reason } = output.mark;

  return {
    ...review,
    mark: { band: isShortLetter(task, wordCount) ? Math.min(band, SHORT_BAND) : band, reason },
  };
};

const unmarked = (task: WritingTask, wordCount: number, reason: string): WritingReview => ({
  wordCount,
  coverage: task.points.map((point) => ({ point, met: false, feedback: reason })),
  corrections: [],
  revised: "",
  ...(task.exam ? { mark: { band: 0, reason } } : {}),
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

// Returns null on any failure: an error status, no connection, or output outside the schema.
export const modelReview = async (
  key: string,
  task: WritingTask,
  answer: string,
  wordCount: number,
) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-5.5",
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
