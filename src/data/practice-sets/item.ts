import type { Question } from "../types.ts";

type Base = {
  id: string;
  instruction?: string;
  prompt: string;
  answer: string;
  feedback: string;
  hints: [string, string];
};

// One exercise as the specification's manifest writes it. `say` is the Spanish the learner
// hears after answering.
export type Item = Base &
  (
    | { mode: "choice"; choices: string[]; say: string }
    | { mode: "cloze"; accepted?: string[]; say: string }
    | { mode: "order"; chunks: string[] }
    | { mode: "ask"; accepted?: string[] }
    | { mode: "sentence"; constraints: string[] }
  );

// A chunk of punctuation alone joins its word: ¿ the next chunk, ? the previous one, so the
// tiles join with spaces into the answer.
export const tilesOf = (chunks: string[]) => {
  const tiles: string[] = [];
  let opening = "";

  for (const chunk of chunks) {
    if (/^[¿¡]+$/.test(chunk)) {
      opening += chunk;
    } else if (/^[?!]+$/.test(chunk) && tiles.length) {
      tiles[tiles.length - 1] += chunk;
    } else {
      tiles.push(opening + chunk);
      opening = "";
    }
  }

  return tiles;
};

export const questionOf = (item: Item): Question => {
  const common = {
    id: item.id,
    instruction: item.instruction,
    prompt: item.prompt,
    answer: item.answer,
    explanation: item.feedback,
    hints: item.hints,
  };

  switch (item.mode) {
    case "choice":
      return {
        ...common,
        kind: "choice",
        skill: "reading",
        options: item.choices,
        pronunciation: item.say,
      };
    case "cloze":
      return {
        ...common,
        kind: "type",
        skill: "writing",
        accepted: item.accepted,
        pronunciation: item.say,
      };
    case "order":
      return {
        ...common,
        kind: "order",
        skill: "writing",
        tokens: tilesOf(item.chunks),
        pronunciation: item.answer,
      };
    case "ask":
      return {
        ...common,
        kind: "type",
        skill: "writing",
        accepted: item.accepted,
        pronunciation: item.answer,
        questionMarks: true,
      };
    case "sentence":
      return {
        ...common,
        kind: "write",
        skill: "writing",
        checklist: item.constraints,
        single: "sentence",
        minWords: 2,
        maxWords: 15,
      };
  }
};

// An unscored card that introduces a question word or one of its forms.
export const teachingCard = (id: string, heading: string, text: string): Question => ({
  id,
  kind: "teach",
  skill: "reading",
  prompt: heading,
  answer: "",
  explanation: text,
});
