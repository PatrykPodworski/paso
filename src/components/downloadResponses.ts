import { mockSections } from "../data/mock";
import type { Run } from "./useMockRun";
export const downloadResponses = (run: Run, score: (index: number) => number) => {
  const body = {
    date: run.started,
    reading: score(0),
    listening: score(1),
    writing: "Requires human assessment",
    speaking: "Requires human assessment",
    responses: mockSections.flatMap((s) =>
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
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(body, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "paso-exam-responses.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
