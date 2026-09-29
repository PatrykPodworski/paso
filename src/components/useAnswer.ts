import { useState } from "react";
import type { Question } from "../data/types";
import { countWords, isCorrect } from "../data/progress";

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

const answerValue = (
  q: Question,
  built: string,
  formText: string,
  spoken: boolean,
  answer: string,
) =>
  q.kind === "order"
    ? built
    : q.kind === "form"
      ? formText
      : q.kind === "speak" && spoken
        ? "Practised aloud. Audio must be reviewed from the downloaded recording."
        : answer;

const ready = (
  q: Question,
  {
    recording,
    spoken,
    checks,
    fieldValues,
    selected,
    answer,
  }: {
    recording: boolean;
    spoken: boolean;
    checks: number[];
    fieldValues: Record<string, string>;
    selected: number[];
    answer: string;
  },
) =>
  q.kind === "speak"
    ? !recording && (spoken || checks.length > 0)
    : q.kind === "form"
      ? q.fields?.every((f) => fieldValues[f.label]?.trim())
      : q.kind === "order"
        ? selected.length === q.tokens?.length
        : !!answer.trim();

// The learner's in-progress answer for one question, and everything derived from it.
export const useAnswer = (q: Question, draft: string, onDraft?: (text: string) => void) => {
  const [recording, setRecording] = useState(false);
  const [answer, setAnswer] = useState(draft);
  const [selected, setSelected] = useState<number[]>([]);
  const [checks, setChecks] = useState<number[]>([]);
  const [spoken, setSpoken] = useState(false);
  const [fieldValues, setFieldValues] = useState(() => parseFields(draft));
  const productive = ["write", "speak", "form"].includes(q.kind);
  const built = selected.map((i) => q.tokens![i]).join(" ");
  const formText = (q.fields || []).map((f) => fieldValues[f.label] || "").join(" ");
  const value = answerValue(q, built, formText, spoken, answer);

  const submission =
    q.kind === "form"
      ? (q.fields || []).map((f) => `${f.label}: ${fieldValues[f.label] || ""}`).join("\n")
      : value;

  const setText = (text: string) => {
    setAnswer(text);
    onDraft?.(text);
  };

  const setField = (label: string, text: string) => {
    const next = { ...fieldValues, [label]: text };

    setFieldValues(next);
    onDraft?.(JSON.stringify(next));
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
    spoken,
    setSpoken,
    checks,
    toggleCheck,
    recording,
    setRecording,
    productive,
    value,
    submission,
    correct: productive ? null : isCorrect(q, value),
    words: countWords(value),
    canSubmit: ready(q, { recording, spoken, checks, fieldValues, selected, answer }),
  };
};

export type Answer = ReturnType<typeof useAnswer>;
