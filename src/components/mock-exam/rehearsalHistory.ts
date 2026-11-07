import type { ProgressSnapshot } from "../../data/types";

type Result = ProgressSnapshot["mockResults"][number];

const SKILLS = [
  { section: 0, title: "Reading", key: "reading" },
  { section: 1, title: "Listening", key: "listening" },
  { section: 2, title: "Writing", key: "writing" },
  { section: 3, title: "Speaking", key: "speaking" },
] as const;

export type HistoryMark = {
  title: string;
  // `score` includes zero. `ungraded` is a finished section recorded without a score.
  // `missing` is a result from before productive scores were stored.
  state: "score" | "ungraded" | "missing";
  score?: number;
};

// One mark per section the rehearsal took. A section it skipped is not attempted, so it
// is absent. A stored number, including zero, wins over either empty state.
export const historyMarks = (result: Result): HistoryMark[] =>
  SKILLS.flatMap(({ section, title, key }): HistoryMark[] => {
    if (!result.sections.includes(section)) {
      return [];
    }

    const score = result[key];

    if (score !== undefined) {
      return [{ title, state: "score", score }];
    }

    // Reading and listening are scored from the answers whenever the rehearsal took them.
    if (section < 2) {
      return [];
    }

    return [{ title, state: result.recorded ? "ungraded" : "missing" }];
  });

export const historyMarkText = (mark: HistoryMark) =>
  mark.state === "score"
    ? `${mark.title} ${mark.score}/25`
    : `${mark.title} ${mark.state === "ungraded" ? "ungraded" : "not recorded"}`;
