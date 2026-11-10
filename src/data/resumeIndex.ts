import { lessonPlace } from "./lessonPlace";
import { setOf } from "./practice-sets/index";
import type { Lesson, ProgressSnapshot } from "./types";

const resumable = (lessonId: string) => Boolean(lessonPlace(lessonId)) || Boolean(setOf(lessonId));

// The exercise an unfinished path or set lesson reopens at: the first one without a stored
// answer, or the teaching cards just before it. Finished lessons, practice sessions and lessons
// with every exercise answered start over.
export const resumeIndex = (lesson: Lesson, progress: ProgressSnapshot) => {
  if (!resumable(lesson.id) || progress.completed[lesson.id]) {
    return 0;
  }

  const questions = lesson.questions;
  let index = questions.findIndex((q) => q.kind !== "teach" && !progress.questions[q.id]);

  while (index > 0 && questions[index - 1].kind === "teach") {
    index--;
  }

  return Math.max(0, index);
};
