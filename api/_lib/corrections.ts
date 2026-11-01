import type { Correction } from "../../src/data/types.ts";

const MAX_CORRECTIONS = 8;
const FIELDS = ["original", "corrected", "explanation"] as const;

// Structured outputs accept no array length limits, so keptCorrections enforces the maximum.
export const correctionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: Object.fromEntries(FIELDS.map((field) => [field, { type: "string" }])),
    required: FIELDS,
    additionalProperties: false,
  },
};

const isCorrection = (value: unknown): value is Correction =>
  typeof value === "object" &&
  value !== null &&
  FIELDS.every((field) => typeof (value as Record<string, unknown>)[field] === "string");

export const isCorrections = (value: unknown): value is Correction[] =>
  Array.isArray(value) && value.every(isCorrection);

export const keptCorrections = (corrections: Correction[]): Correction[] =>
  corrections
    .slice(0, MAX_CORRECTIONS)
    .map(({ original, corrected, explanation }) => ({ original, corrected, explanation }));
