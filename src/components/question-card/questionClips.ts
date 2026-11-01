import { spokenText } from "../../data/audio";
import type { Question } from "../../data/types";
import { isSilentTask } from "./useAnswer";

// The texts a question can read aloud, matching the players QuestionHeading
// and the sentence builder show.
export const questionClips = (q: Question, exam: boolean) => {
  const spoken = !exam && !isSilentTask(q);
  const answer = q.audio ?? (spoken ? spokenText(q) : undefined);

  return [answer, ...(q.tokens ?? [])].filter((text) => text !== undefined);
};
