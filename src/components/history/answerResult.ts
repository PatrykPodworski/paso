import type { Attempt } from "../../data/types";

// Writing and speaking practice has no right answer, so it is not graded.
export const answerResult = (correct: Attempt["correct"]) =>
  correct === null
    ? { label: "Not graded", tone: "text-muted-foreground" }
    : correct
      ? { label: "Correct", tone: "text-success" }
      : { label: "Wrong", tone: "text-destructive" };
