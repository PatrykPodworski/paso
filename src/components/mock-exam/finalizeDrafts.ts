import { mockSections } from "../../data/mock";
import type { Question } from "../../data/types";
import { formSubmission, parseFields } from "../question-card/formAnswer";
import type { Run } from "./useMockRun";

const draftAnswer = (q: Question, draft: string) => {
  if (q.kind !== "form") {
    return draft.trim() ? draft : "";
  }

  const fields = parseFields(draft);

  return q.fields?.some((f) => fields[f.label]?.trim()) ? formSubmission(q, fields) : "";
};

// The draft is what the learner sees in the field, so it wins over an older saved answer.
export const finalizeDrafts = (run: Run): Run => {
  const answers = { ...run.answers };

  for (const q of mockSections[run.section].questions) {
    const draft = run.drafts[q.id];

    if (draft === undefined) {
      continue;
    }

    const text = draftAnswer(q, draft);

    if (text) {
      answers[q.id] = text;
    } else {
      delete answers[q.id];
    }
  }

  return { ...run, answers };
};
