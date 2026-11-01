import { examSections } from "../../data/mock";
import { clipText } from "../../data/progress";
import type { MockRun, Question } from "../../data/types";
import { formSubmission, parseFields } from "../question-card/formAnswer";

const draftAnswer = (q: Question, draft: string) => {
  if (q.kind !== "form") {
    return draft.trim() ? draft : "";
  }

  const fields = parseFields(draft);

  // The labels make a form answer longer than its draft, past what the server stores.
  return q.fields?.some((f) => fields[f.label]?.trim()) ? clipText(formSubmission(q, fields)) : "";
};

// The answers that the current section's drafts turn into when the section ends. The draft is
// what the learner sees in the field, so it wins over an older saved answer; an empty draft
// clears the answer to "", which counts as not answered.
export const draftAnswers = (run: MockRun): MockRun["answers"] =>
  Object.fromEntries(
    examSections(run.variants)
      [run.section].questions.filter((q) => run.drafts[q.id] !== undefined)
      .map((q) => [q.id, draftAnswer(q, run.drafts[q.id])]),
  );
