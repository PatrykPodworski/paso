import type { Question } from "../../data/types";

// A form draft is stored as JSON of the field values, keyed by field label.
export const parseFields = (draft: string): Record<string, string> => {
  try {
    const parsed = JSON.parse(draft);

    return parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      Object.values(parsed).every((v) => typeof v === "string")
      ? parsed
      : {};
  } catch {
    return {};
  }
};

export const formSubmission = (q: Question, fieldValues: Record<string, string>) =>
  (q.fields || []).map((f) => `${f.label}: ${fieldValues[f.label] || ""}`).join("\n");
