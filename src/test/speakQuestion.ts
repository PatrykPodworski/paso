import type { Question } from "../data/types";

// No shipped question records any more; the recorder's tests keep one until #350 removes it.
export const speakQuestion: Question = {
  id: "test-speak",
  kind: "speak",
  skill: "speaking",
  prompt: "Present yourself in Spanish.",
  answer: "Me llamo Ana y soy de Polonia.",
  explanation: "A short presentation with a name and an origin is enough.",
  checklist: ["I said my name.", "I said where I am from."],
};
