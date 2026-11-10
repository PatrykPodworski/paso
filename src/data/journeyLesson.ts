import { pathLessons, pathUnits } from "./path";
import type { ProgressSnapshot } from "./types";

const unfinished = (progress: ProgressSnapshot) =>
  pathLessons.filter((l) => !progress.completed[l.id]);

// The lesson Continue my journey opens: the first unfinished one with an exercise left to answer.
// A lesson answered in full but never finished would only reopen at exercises already done.
export const journeyLesson = (progress: ProgressSnapshot) =>
  unfinished(progress).find((l) => l.lesson().questions.some((q) => !progress.questions[q.id])) ||
  unfinished(progress)[0] ||
  pathLessons[0];

// The unit that holds the lesson Continue my journey opens.
export const currentUnit = (progress: ProgressSnapshot) => {
  const lesson = journeyLesson(progress);

  return pathUnits.find((u) => u.lessons.includes(lesson))!;
};
