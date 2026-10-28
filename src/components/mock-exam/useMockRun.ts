import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { mockSections, type MockTopic } from "../../data/mock";
import type { LiveScore } from "../../data/types";

const STAGES = ["intro", "run", "review", "prep", "done"] as const;

export interface Run {
  section: number;
  index: number;
  stage: (typeof STAGES)[number];
  answers: Record<string, string>;
  deadline: number;
  started: string;
  drafts: Record<string, string>;
  // The topic picked for speaking Tasks 2 and 3.
  topic?: MockTopic;
  // Lucía's score for each finished talk, by question id.
  talks: Record<string, LiveScore>;
}

export type SetRun = Dispatch<SetStateAction<Run>>;
export const MOCK_STORAGE_KEY = "paso-mock-v1";

export const fresh = (): Run => ({
  section: 0,
  index: 0,
  stage: "intro",
  answers: {},
  deadline: 0,
  started: "",
  drafts: {},
  talks: {},
});

export const load = (): Run => {
  try {
    const raw = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || "null");

    return raw &&
      Number.isInteger(raw.section) &&
      raw.section >= 0 &&
      raw.section < 4 &&
      Number.isInteger(raw.index) &&
      raw.index >= 0 &&
      raw.index < mockSections[raw.section].questions.length &&
      STAGES.includes(raw.stage) &&
      raw.answers
      ? { ...fresh(), ...raw }
      : fresh();
  } catch {
    return fresh();
  }
};

export const clearMockRun = () => {
  try {
    localStorage.removeItem(MOCK_STORAGE_KEY);
  } catch {
    /* The caller's state still resets for this visit. */
  }
};

export const useMockRun = () => {
  const [run, setRun] = useState<Run>(load);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(run));
    } catch {
      setStorageError(true);
    }
  }, [run]);

  return { run, setRun, storageError };
};
