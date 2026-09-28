import type { allQuestions } from "../data/curriculum";
import { reviewDue } from "../data/progress";
import type { Progress } from "../data/types";
import { exerciseBank } from "./practice";
const exerciseMap = new Map(exerciseBank.map((q) => [q.id, q]));
export const mistakeQueue = (progress: Progress, now: Date) => {
  const mistakeEntries = new Map<
    string,
    { id: string; q: (typeof allQuestions)[number]; insertion: number; inQueue: boolean }
  >();
  for (const [i, id] of progress.mistakes.entries()) {
    const q = exerciseMap.get(id);
    if (!q) {
      continue;
    }
    mistakeEntries.set(id, { id, q, insertion: i, inQueue: true });
  }
  for (const [id, review] of Object.entries(progress.mistakeReviews)) {
    if (mistakeEntries.has(id) || !exerciseMap.has(id)) {
      continue;
    }
    const q = exerciseMap.get(id);
    if (!q) {
      continue;
    }
    const insertion = progress.mistakes.length;
    if (!review.nextAt || reviewDue(review, now)) {
      mistakeEntries.set(id, { id, q, insertion, inQueue: false });
    }
  }
  return [...mistakeEntries.values()]
    .filter((entry) => entry.inQueue || reviewDue(progress.mistakeReviews[entry.id], now))
    .sort((a, b) => {
      const aDue = progress.mistakeReviews[a.id]?.nextAt
        ? new Date(progress.mistakeReviews[a.id]!.nextAt).getTime()
        : now.getTime();
      const bDue = progress.mistakeReviews[b.id]?.nextAt
        ? new Date(progress.mistakeReviews[b.id]!.nextAt).getTime()
        : now.getTime();
      if (aDue !== bDue) {
        return aDue - bDue;
      }
      return a.insertion - b.insertion;
    })
    .map(({ q }) => q);
};
