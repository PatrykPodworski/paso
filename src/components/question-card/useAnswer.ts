import { useState } from "react";
import type { Question } from "../../data/types";
import { countWords, isCorrect, MAX_TEXT } from "../../data/progress";

const parseFields = (draft: string): Record<string, string> => {
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

const answerValue = (q: Question, built: string, formText: string, answer: string) =>
  q.kind === "order" ? built : q.kind === "form" ? formText : answer;

const ready = (
  q: Question,
  {
    fieldValues,
    selected,
    answer,
  }: {
    fieldValues: Record<string, string>;
    selected: number[];
    answer: string;
  },
) =>
  q.kind === "form"
    ? q.fields?.every((f) => fieldValues[f.label]?.trim())
    : q.kind === "order"
      ? selected.length === q.tokens?.length
      : !!answer.trim();

// A writing task is judged on its text; its model answer is never read aloud.
export const isWritingTask = (q: Question) => q.kind === "write" || q.kind === "form";

// The learner's in-progress answer for one question, and everything derived from it.
export const useAnswer = (q: Question, draft: string, onDraft?: (text: string) => void) => {
  const [answer, setAnswer] = useState(draft);
  const [selected, setSelected] = useState<number[]>([]);
  const [checks, setChecks] = useState<number[]>([]);
  const [fieldValues, setFieldValues] = useState(() => parseFields(draft));
  const productive = ["write", "form"].includes(q.kind);
  const built = selected.map((i) => q.tokens![i]).join(" ");
  const formText = (q.fields || []).map((f) => fieldValues[f.label] || "").join(" ");
  const value = answerValue(q, built, formText, answer);

  const submission =
    q.kind === "form"
      ? (q.fields || []).map((f) => `${f.label}: ${fieldValues[f.label] || ""}`).join("\n")
      : value;

  const setText = (text: string) => {
    if (text.length > MAX_TEXT) {
      return;
    }

    setAnswer(text);
    onDraft?.(text);
  };

  const setField = (label: string, text: string) => {
    const next = { ...fieldValues, [label]: text };
    const draft = JSON.stringify(next);

    // The saved draft holds every field, so the limit applies to all of them together.
    if (draft.length > MAX_TEXT) {
      return;
    }

    setFieldValues(next);
    onDraft?.(draft);
  };

  const toggleCheck = (i: number) =>
    setChecks((v) => (v.includes(i) ? v.filter((x) => x !== i) : [...v, i]));

  return {
    answer,
    setText,
    selected,
    setSelected,
    fieldValues,
    setField,
    checks,
    toggleCheck,
    productive,
    value,
    submission,
    correct: productive ? null : isCorrect(q, value),
    words: countWords(value),
    canSubmit: ready(q, { fieldValues, selected, answer }),
  };
};

export type Answer = ReturnType<typeof useAnswer>;
