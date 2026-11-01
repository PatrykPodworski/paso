import type { Correction } from "../../src/data/types.ts";

export const MAX_CORRECTIONS = 8;
export const CORRECTION_FIELDS = ["original", "corrected", "explanation"] as const;

// Structured outputs accept no array length limits, so keptCorrections enforces the maximum.
export const correctionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: Object.fromEntries(CORRECTION_FIELDS.map((field) => [field, { type: "string" }])),
    required: CORRECTION_FIELDS,
    additionalProperties: false,
  },
};

const isCorrection = (value: unknown): value is Correction =>
  typeof value === "object" &&
  value !== null &&
  CORRECTION_FIELDS.every((field) => typeof (value as Record<string, unknown>)[field] === "string");

export const isCorrections = (value: unknown): value is Correction[] =>
  Array.isArray(value) && value.every(isCorrection);

export const keptCorrections = (corrections: Correction[]): Correction[] =>
  corrections
    .slice(0, MAX_CORRECTIONS)
    .map(({ original, corrected, explanation }) => ({ original, corrected, explanation }));
