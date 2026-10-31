import { reviewDue } from "../data/progress";
import type { ProgressSnapshot } from "../data/types";
import { exerciseBank } from "./practice";

const exerciseMap = new Map(exerciseBank.map((q) => [q.id, q]));

// Open mistakes and due reviews, earliest due first. At the same due time open mistakes
// come first, in the order they were answered.
export const mistakeQueue = (progress: ProgressSnapshot, now: Date) => {
  const entries = Object.entries(progress.questions).flatMap(([id, state]) => {
    const q = exerciseMap.get(id);

    return q && (state.inMistakes || (state.review && reviewDue(state.review, now)))
      ? [{ q, state, due: state.review ? new Date(state.review.nextAt).getTime() : now.getTime() }]
      : [];
  });

  return entries
    .sort(
      (a, b) =>
        a.due - b.due ||
        Number(b.state.inMistakes) - Number(a.state.inMistakes) ||
        a.state.at.localeCompare(b.state.at),
    )
    .map(({ q }) => q);
};
