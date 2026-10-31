import type { Attempt } from "../../data/types";

// Writing and speaking practice has no right answer, so it is not graded.
export const answerResult = (correct: Attempt["correct"]) =>
  correct === null
    ? { label: "Not graded", tone: "text-sage-500" }
    : correct
      ? { label: "Correct", tone: "text-olive-600" }
      : { label: "Wrong", tone: "text-coral-600" };
