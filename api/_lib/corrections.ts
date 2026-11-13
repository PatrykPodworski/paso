import type { Correction } from "../../src/data/types.ts";

export { mergedCorrections } from "../../src/data/corrections.ts";

// Structured outputs accept no array length limits. Fixes for missed points and for items
// below correct sit outside this cap; other corrections stop here.
export const MAX_CORRECTIONS = 8;
// The most items a talk task grades.
export const MAX_TALK_ITEMS = 20;
// A talk score lists one fix per item below correct, then at most MAX_CORRECTIONS others.
export const MAX_TALK_CORRECTIONS = MAX_TALK_ITEMS + MAX_CORRECTIONS;
export const CORRECTION_FIELDS = ["original", "corrected", "explanation"] as const;

export const correctionSchema = {
  type: "object",
  properties: Object.fromEntries(CORRECTION_FIELDS.map((field) => [field, { type: "string" }])),
  required: CORRECTION_FIELDS,
  additionalProperties: false,
};

// Structured outputs accept no array length limits, so the assembled list is capped in code.
export const correctionsSchema = { type: "array", items: correctionSchema };

export const isCorrection = (value: unknown): value is Correction =>
  typeof value === "object" &&
  value !== null &&
  CORRECTION_FIELDS.every((field) => typeof (value as Record<string, unknown>)[field] === "string");

export const isCorrections = (value: unknown): value is Correction[] =>
  Array.isArray(value) && value.every(isCorrection);

const isFilled = (value: string) => value.trim() !== "";

// A fix for a missed or flawed point must give the corrected phrase and say why. Its original
// may be empty when the learner gave nothing to quote.
export const isFix = (fix: Correction) => isFilled(fix.corrected) && isFilled(fix.explanation);
