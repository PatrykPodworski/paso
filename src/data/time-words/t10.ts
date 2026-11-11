import type { Item } from "../practice-sets/item.ts";

// T10, por la tarde: in the afternoon.
const hints: [string, string] = [
  "16:00 is in the afternoon.",
  "Three words: por la and the word for afternoon.",
];

export const t10Items: Item[] = [
  {
    id: "TM-T10-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "por la tarde",
    answer: "in the afternoon",
    choices: ["in the afternoon", "in the morning", "at night"],
    say: "por la tarde",
    feedback: "por la tarde means in the afternoon.",
    hints,
  },
  {
    id: "TM-T10-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "in the afternoon",
    answer: "por la tarde",
    say: "por la tarde",
    feedback: "In the afternoon is por la tarde.",
    hints,
  },
  {
    id: "TM-T10-E04",
    mode: "cloze",
    instruction: "Complete the gap. Pablo works at 16:00.",
    prompt: "Pablo trabaja ___.",
    answer: "por la tarde",
    say: "Pablo trabaja por la tarde.",
    feedback: "Pablo works at 16:00. So: Pablo trabaja por la tarde.",
    hints,
  },
  {
    id: "TM-T10-E05",
    mode: "cloze",
    instruction: "Translate into Spanish. Luis reads at 16:00.",
    prompt: "Luis reads in the afternoon.",
    answer: "Luis lee por la tarde.",
    accepted: ["Por la tarde Luis lee."],
    say: "Luis lee por la tarde.",
    feedback: "One right answer: Luis lee por la tarde.",
    hints,
  },
  {
    id: "TM-T10-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Diego está en casa por la tarde.",
    answer: "Diego is at home at 16:00.",
    choices: [
      "Diego is at home at 16:00.",
      "Diego is at home at 9:00.",
      "Diego is at home at 22:00.",
    ],
    say: "Diego está en casa por la tarde.",
    feedback: "por la tarde means in the afternoon: Diego is at home at 16:00.",
    hints,
  },
  {
    id: "TM-T10-V11",
    mode: "choice",
    instruction: "Choose the word for the gap. Tomás is at home at 16:00.",
    prompt: "Tomás está en casa ___.",
    answer: "por la tarde",
    choices: ["por la tarde", "por la mañana", "por la noche", "tarde"],
    say: "Tomás está en casa por la tarde.",
    feedback: "Tomás is at home at 16:00. So: Tomás está en casa por la tarde.",
    hints,
  },
];
