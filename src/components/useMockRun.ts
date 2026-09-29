import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { mockSections } from "../data/mock";

export interface Run {
  section: number;
  index: number;
  stage: "intro" | "run" | "review" | "prep" | "done";
  answers: Record<string, string>;
  deadline: number;
  started: string;
  drafts: Record<string, string>;
}

export type SetRun = Dispatch<SetStateAction<Run>>;
const KEY = "paso-mock-v1";

export const fresh = (): Run => ({
  section: 0,
  index: 0,
  stage: "intro",
  answers: {},
  deadline: 0,
  started: "",
  drafts: {},
});

export const load = (): Run => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");

    return raw &&
      Number.isInteger(raw.section) &&
      raw.section >= 0 &&
      raw.section < 4 &&
      Number.isInteger(raw.index) &&
      raw.index >= 0 &&
      raw.index < mockSections[raw.section].questions.length &&
      ["intro", "run", "review", "prep", "done"].includes(raw.stage) &&
      raw.answers
      ? { ...fresh(), ...raw }
      : fresh();
  } catch {
    return fresh();
  }
};

export const useMockRun = () => {
  const [run, setRun] = useState<Run>(load);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(run));
    } catch {
      setStorageError(true);
    }
  }, [run]);

  return { run, setRun, storageError };
};
