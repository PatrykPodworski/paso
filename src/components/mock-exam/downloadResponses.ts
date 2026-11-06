import { examSections } from "../../data/mock";
import { downloadJson } from "../downloadJson";
import type { MockRun } from "../../data/types";
import { productiveScores } from "./productiveScores";

// Exports the sections the run took, with the scores of the scored ones; writing and speaking
// take the AI scores.
export const downloadResponses = (run: MockRun, score: (index: number) => number) => {
  const took = (section: number) => run.sections.includes(section);
  const scored = productiveScores(run);

  const body = {
    date: run.started,
    ...(took(0) ? { reading: score(0) } : {}),
    ...(took(1) ? { listening: score(1) } : {}),
    ...(took(2) ? { writing: scored.writing ?? "Not scored" } : {}),
    ...(took(3) ? { speaking: scored.speaking ?? "Not scored" } : {}),
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
