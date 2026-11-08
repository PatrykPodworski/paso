import { mockExam } from "../../data/mock";
import { isCorrect } from "../../data/progress";
import type { MockResponse, MockResponses, MockRun, Question } from "../../data/types";

type Run = Pick<MockRun, "started" | "sections" | "variants" | "answers" | "marks" | "talks">;

const responseOf = (run: Run, section: number, q: Question, variantId: string): MockResponse => {
  const task = { questionId: q.id, variantId };
  const answer = run.answers[q.id] ?? "";

  if (section < 2) {
    return { section: section === 0 ? 0 : 1, ...task, answer, correct: isCorrect(q, answer) };
  }

  if (section === 2) {
    const band = run.marks[q.id];

    return {
      section,
      ...task,
      status: answer.trim() ? "submitted" : "empty",
      text: answer,
      ...(band === undefined ? {} : { band }),
    };
  }

  // A talk keeps its transcript only once Lucía has scored it.
  const score = run.talks[q.id];

  return score
    ? { section: 3, ...task, status: "scored", transcript: answer, score }
    : { section: 3, ...task, status: "none" };
};

// The learner's responses in every section the run took, in exam order, as the rehearsal
// result stores them.
export const mockResponses = (run: Run): MockResponses => ({
  started: run.started,
  items: run.sections.flatMap((section) =>
    mockExam[section].tasks.flatMap((t) =>
      t.variants
        .filter((v) => v.id === run.variants[t.id])
        .flatMap((v) => v.questions.map((q) => responseOf(run, section, q, v.id))),
    ),
  ),
});
