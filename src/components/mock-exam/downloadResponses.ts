import { examSections } from "../../data/mock";
import { downloadJson } from "../downloadJson";
import type { MockRun } from "../../data/types";

export const downloadResponses = (run: MockRun, score: (index: number) => number) => {
  const body = {
    date: run.started,
    reading: score(0),
    listening: score(1),
    writing: "Requires human assessment",
    speaking: "Requires human assessment",
    responses: examSections(run.variants).flatMap((s) =>
      s.questions.map((q) => ({
        skill: s.title,
        task: q.task,
        prompt: q.prompt,
        response: run.answers[q.id] || "",
        model: q.answer,
        explanation: q.explanation,
      })),
    ),
  };

  downloadJson(body, "paso-exam-responses.json");
};
