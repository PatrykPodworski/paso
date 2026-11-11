import type { Item } from "../practice-sets/item.ts";

// T03, ayer: yesterday.
const hints: [string, string] = ["The event was one day before today.", "It starts with ay-."];

export const t03Items: Item[] = [
  {
    id: "TM-T03-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "ayer",
    answer: "yesterday",
    choices: ["yesterday", "today", "tomorrow"],
    say: "ayer",
    feedback: "ayer means yesterday.",
    hints,
  },
  {
    id: "TM-T03-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "yesterday",
    answer: "ayer",
    say: "ayer",
    feedback: "Yesterday is ayer.",
    hints,
  },
  {
    id: "TM-T03-E04",
    mode: "cloze",
    instruction: "Complete the gap. Today is Tuesday. Coffee with Luis was on Monday.",
    prompt: "Café con Luis: ___.",
    answer: "ayer",
    say: "Café con Luis: ayer.",
    feedback: "Today is Tuesday. Coffee with Luis was on Monday. So: Café con Luis: ayer.",
    hints,
  },
  {
    id: "TM-T03-E05",
    mode: "cloze",
    instruction:
      "Translate the calendar note into Spanish. Today is Tuesday. Breakfast with Diego was on Monday.",
    prompt: "Breakfast with Diego: yesterday.",
    answer: "Desayuno con Diego: ayer.",
    accepted: ["El desayuno con Diego: ayer.", "El desayuno con Diego fue ayer."],
    say: "Desayuno con Diego: ayer.",
    feedback: "One right answer: Desayuno con Diego: ayer.",
    hints,
  },
  {
    id: "TM-T03-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Clase de Tomás: ayer.",
    answer: "Today is Tuesday. Tomás’s class was on Monday.",
    choices: [
      "Today is Tuesday. Tomás’s class was on Monday.",
      "Today is Tuesday. Tomás’s class is on Tuesday.",
      "Today is Tuesday. Tomás’s class is on Wednesday.",
    ],
    say: "Clase de Tomás: ayer.",
    feedback: "ayer means yesterday: Today is Tuesday. Tomás’s class was on Monday.",
    hints,
  },
  {
    id: "TM-T03-V11",
    mode: "choice",
    instruction:
      "Choose the word for the gap. Today is Tuesday. Breakfast with Tomás was on Monday.",
    prompt: "Desayuno con Tomás: ___.",
    answer: "ayer",
    choices: ["ayer", "hoy", "mañana"],
    say: "Desayuno con Tomás: ayer.",
    feedback: "Today is Tuesday. Breakfast with Tomás was on Monday. So: Desayuno con Tomás: ayer.",
    hints,
  },
  {
    id: "TM-T03-V03",
    mode: "cloze",
    instruction: "Complete the gap. Today is Tuesday. Pablo’s class was on Monday.",
    prompt: "Clase de Pablo: ___.",
    answer: "ayer",
    say: "Clase de Pablo: ayer.",
    feedback: "Today is Tuesday. Pablo’s class was on Monday. So: Clase de Pablo: ayer.",
    hints,
  },
];
