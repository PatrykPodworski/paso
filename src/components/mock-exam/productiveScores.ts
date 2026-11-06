import { examSections } from "../../data/mock";
import { speakingScore, writingScore } from "../../data/progress";
import type { MockRun } from "../../data/types";
import type { ReviewResult } from "../writing-review/requestReview";

// The DELE band of each review that has one, by question id.
export const marksOf = (results: Record<string, ReviewResult>) =>
  Object.fromEntries(
    Object.entries(results).flatMap(([id, result]) =>
      "review" in result && result.review.mark ? [[id, result.review.mark.band]] : [],
    ),
  );

// Hands on the marks a round of reviews gave, when it gave any.
export const keepMarks =
  (onMarks: (marks: Record<string, number>) => void) => (results: Record<string, ReviewResult>) => {
    const marks = marksOf(results);

    if (Object.keys(marks).length) {
      onMarks(marks);
    }
  };

// The run's writing and speaking scores out of 25 from the AI tutor's marks and Lucía's points.
// Writing needs a mark for both tasks; speaking needs at least one scored talk.
export const productiveScores = (run: Pick<MockRun, "variants" | "marks" | "talks">) => {
  const [, , writing, speaking] = examSections(run.variants);
  const bands = writing.questions.map((q) => run.marks[q.id]);
  const talks = speaking.questions.map((q) => run.talks[q.id]);

  return {
    writing: bands.every((band) => band !== undefined)
      ? writingScore([bands[0], bands[1]])
      : undefined,
    speaking: speakingScore(talks),
    scoredTalks: talks.filter((talk) => talk?.items.length).length,
  };
};
