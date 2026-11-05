import { examSections } from "../../data/mock";
import { downloadJson } from "../downloadJson";
import type { MockRun } from "../../data/types";

// Exports the sections the run took, with the scores of the scored ones.
export const downloadResponses = (run: MockRun, score: (index: number) => number) => {
  const took = (section: number) => run.sections.includes(section);

  const body = {
    date: run.started,
    ...(took(0) ? { reading: score(0) } : {}),
    ...(took(1) ? { listening: score(1) } : {}),
    ...(took(2) ? { writing: "Requires human assessment" } : {}),
    ...(took(3) ? { speaking: "Requires human assessment" } : {}),
    responses: examSections(run.variants)
      .filter((_, i) => took(i))
      .flatMap((s) =>
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
