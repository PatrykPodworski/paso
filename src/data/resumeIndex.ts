import { lessonPlace } from "./lessonPlace";
import type { Lesson, ProgressSnapshot } from "./types";

// The exercise an unfinished path lesson reopens at: the first one without a stored answer.
// Finished lessons, practice sessions and lessons with every exercise answered start over.
export const resumeIndex = (lesson: Lesson, progress: ProgressSnapshot) => {
  if (!lessonPlace(lesson.id) || progress.completed[lesson.id]) {
    return 0;
  }

  return Math.max(
    0,
    lesson.questions.findIndex((q) => !progress.questions[q.id]),
  );
};
