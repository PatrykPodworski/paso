import type { MockRun, NewMockResult } from "../../data/types";
import { productiveScores } from "./productiveScores";

// The rehearsal result for a finished run. Reading and listening are counted whenever that
// section was taken, including a genuine zero. Writing and speaking are included only when
// the AI scored them, including a genuine zero. A section that was taken and not scored is
// left out, and `recorded` says that absence is ungraded rather than a result from before
// these scores were stored.
export const rehearsalResult = (
  run: Pick<MockRun, "sections" | "variants" | "marks" | "talks">,
  objective: { reading: number; listening: number },
  at: string,
): NewMockResult => {
  const took = (section: number) => run.sections.includes(section);
  const scored = productiveScores(run);

  const include = (section: number, value: number | undefined) =>
    took(section) && value !== undefined;

  return {
    at,
    sections: run.sections,
    recorded: true,
    ...(include(0, objective.reading) ? { reading: objective.reading } : {}),
    ...(include(1, objective.listening) ? { listening: objective.listening } : {}),
    ...(include(2, scored.writing) ? { writing: scored.writing } : {}),
    ...(include(3, scored.speaking) ? { speaking: scored.speaking } : {}),
  };
};
