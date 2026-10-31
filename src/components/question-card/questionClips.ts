import { spokenText } from "../../data/audio";
import type { Question } from "../../data/types";
import { isWritingTask } from "./useAnswer";

// The texts a question can read aloud, matching the players QuestionHeading,
// QuestionMaterials and the sentence builder show.
export const questionClips = (q: Question, exam: boolean) => {
  const spoken = !exam && !isWritingTask(q);
  const answer = q.audio ?? (spoken ? spokenText(q) : undefined);
  const passage = spoken ? q.passage : undefined;

  return [answer, ...(q.tokens ?? []), passage].filter((text) => text !== undefined);
};
