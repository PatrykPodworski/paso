import { reviewDue } from "../data/progress";
import type { Progress, Question } from "../data/types";
import { exerciseBank } from "./practice";

const exerciseMap = new Map(exerciseBank.map((q) => [q.id, q]));

export const mistakeQueue = (progress: Progress, now: Date) => {
  const mistakeEntries = new Map<
    string,
    { id: string; q: Question; insertion: number; inQueue: boolean }
  >();

  for (const [i, id] of progress.mistakes.entries()) {
    const q = exerciseMap.get(id);

    if (!q) {
      continue;
    }

    mistakeEntries.set(id, { id, q, insertion: i, inQueue: true });
  }

  for (const [id, review] of Object.entries(progress.mistakeReviews)) {
    const q = exerciseMap.get(id);

    if (mistakeEntries.has(id) || !q) {
      continue;
    }

    const insertion = progress.mistakes.length;

    if (reviewDue(review, now)) {
      mistakeEntries.set(id, { id, q, insertion, inQueue: false });
    }
  }

  const dueTime = (id: string) => {
    const nextAt = progress.mistakeReviews[id]?.nextAt;

    return nextAt ? new Date(nextAt).getTime() : now.getTime();
  };

  return [...mistakeEntries.values()]
    .filter((entry) => entry.inQueue || reviewDue(progress.mistakeReviews[entry.id], now))
    .sort((a, b) => {
      const aDue = dueTime(a.id);
      const bDue = dueTime(b.id);

      if (aDue !== bDue) {
        return aDue - bDue;
      }

      return a.insertion - b.insertion;
    })
    .map(({ q }) => q);
};
