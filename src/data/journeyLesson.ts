import { allLessons } from "./curriculum";
import type { ProgressSnapshot } from "./types";

const unfinished = (progress: ProgressSnapshot) =>
  allLessons.filter((l) => !progress.completed[l.id]);

// The lesson Continue my journey opens: the first unfinished one with an exercise left to answer.
// A lesson answered in full but never finished would only reopen at exercises already done.
export const journeyLesson = (progress: ProgressSnapshot) =>
  unfinished(progress).find((l) => l.questions.some((q) => !progress.questions[q.id])) ||
  unfinished(progress)[0] ||
  allLessons[0];
