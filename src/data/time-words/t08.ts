import type { Item } from "../practice-sets/item.ts";

// T08, tarde: late.
const hints: [string, string] = [
  "Compare with the usual time: this is later than usual.",
  "It is one word without la, and starts with ta-.",
];

export const t08Items: Item[] = [
  {
    id: "TM-T08-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "tarde",
    answer: "late",
    choices: ["late", "early", "after, later"],
    say: "tarde",
    feedback: "tarde means late.",
    hints,
  },
  {
    id: "TM-T08-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "late",
    answer: "tarde",
    say: "tarde",
    feedback: "Late is tarde.",
    hints,
  },
  {
    id: "TM-T08-E04",
    mode: "cloze",
    instruction:
      "Complete the gap. Pablo usually has breakfast at 9:00. Today he has breakfast at 12:00.",
    prompt: "Hoy Pablo desayuna ___.",
    answer: "tarde",
    say: "Hoy Pablo desayuna tarde.",
    feedback:
      "Pablo usually has breakfast at 9:00. Today he has breakfast at 12:00. So: Hoy Pablo desayuna tarde.",
    hints,
  },
  {
    id: "TM-T08-E05",
    mode: "cloze",
    instruction:
      "Translate into Spanish. Luis usually goes to bed at 23:00. Today he goes to bed at 2:00.",
    prompt: "Today Luis goes to bed late.",
    answer: "Hoy Luis se acuesta tarde.",
    accepted: [
      "Luis se acuesta tarde hoy.",
      "Hoy Luis se acuesta más tarde.",
      "Luis se acuesta más tarde hoy.",
    ],
    say: "Hoy Luis se acuesta tarde.",
    feedback: "One right answer: Hoy Luis se acuesta tarde.",
    hints,
  },
  {
    id: "TM-T08-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Hoy Diego come tarde.",
    answer: "Diego usually eats at 14:00. Today he eats at 16:00.",
    choices: [
      "Diego usually eats at 14:00. Today he eats at 16:00.",
      "Diego usually eats at 14:00. Today he eats at 12:00.",
      "Diego usually eats at 14:00. Today he eats at 14:00.",
    ],
    say: "Hoy Diego come tarde.",
    feedback: "tarde means late: Diego usually eats at 14:00. Today he eats at 16:00.",
    hints,
  },
  {
    id: "TM-T08-V11",
    mode: "choice",
    instruction:
      "Choose the word for the gap. Tomás usually eats at 14:00. Today he eats at 16:00.",
    prompt: "Hoy Tomás come ___.",
    answer: "tarde",
    choices: ["tarde", "temprano", "después"],
    say: "Hoy Tomás come tarde.",
    feedback: "Tomás usually eats at 14:00. Today he eats at 16:00. So: Hoy Tomás come tarde.",
    hints,
  },
  {
    id: "TM-T08-V09",
    mode: "cloze",
    instruction:
      "Complete the gap. Luis usually has breakfast at 9:00. Today he has breakfast at 12:00.",
    prompt: "Hoy Luis desayuna ___.",
    answer: "tarde",
    say: "Hoy Luis desayuna tarde.",
    feedback:
      "Luis usually has breakfast at 9:00. Today he has breakfast at 12:00. So: Hoy Luis desayuna tarde.",
    hints,
  },
  {
    id: "TM-T08-V10",
    mode: "cloze",
    instruction:
      "Translate into Spanish. Diego usually goes to bed at 23:00. Today he goes to bed at 2:00.",
    prompt: "Today Diego goes to bed late.",
    answer: "Hoy Diego se acuesta tarde.",
    accepted: [
      "Diego se acuesta tarde hoy.",
      "Hoy Diego se acuesta más tarde.",
      "Diego se acuesta más tarde hoy.",
    ],
    say: "Hoy Diego se acuesta tarde.",
    feedback: "One right answer: Hoy Diego se acuesta tarde.",
    hints,
  },
];
