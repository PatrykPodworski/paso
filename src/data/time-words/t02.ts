import type { Item } from "../practice-sets/item.ts";

// T02, mañana: tomorrow.
const hints: [string, string] = [
  "The event is one day after today.",
  "It starts with ma- and has an ñ.",
];

export const t02Items: Item[] = [
  {
    id: "TM-T02-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "mañana",
    answer: "tomorrow",
    choices: ["tomorrow", "today", "yesterday"],
    say: "mañana",
    feedback: "mañana means tomorrow.",
    hints,
  },
  {
    id: "TM-T02-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "tomorrow",
    answer: "mañana",
    say: "mañana",
    feedback: "Tomorrow is mañana.",
    hints,
  },
  {
    id: "TM-T02-E04",
    mode: "cloze",
    instruction: "Complete the gap. Today is Tuesday. Luis’s visit is on Wednesday.",
    prompt: "Visita de Luis: ___.",
    answer: "mañana",
    say: "Visita de Luis: mañana.",
    feedback: "Today is Tuesday. Luis’s visit is on Wednesday. So: Visita de Luis: mañana.",
    hints,
  },
  {
    id: "TM-T02-E05",
    mode: "cloze",
    instruction:
      "Translate the calendar note into Spanish. Today is Tuesday. Coffee with Diego is on Wednesday.",
    prompt: "Coffee with Diego: tomorrow.",
    answer: "Café con Diego: mañana.",
    accepted: ["El café con Diego: mañana.", "El café con Diego es mañana."],
    say: "Café con Diego: mañana.",
    feedback: "One right answer: Café con Diego: mañana.",
    hints,
  },
  {
    id: "TM-T02-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Desayuno con Tomás: mañana.",
    answer: "Today is Tuesday. Breakfast with Tomás is on Wednesday.",
    choices: [
      "Today is Tuesday. Breakfast with Tomás is on Wednesday.",
      "Today is Tuesday. Breakfast with Tomás is on Tuesday.",
      "Today is Tuesday. Breakfast with Tomás was on Monday.",
    ],
    say: "Desayuno con Tomás: mañana.",
    feedback: "mañana means tomorrow: Today is Tuesday. Breakfast with Tomás is on Wednesday.",
    hints,
  },
  {
    id: "TM-T02-V11",
    mode: "choice",
    instruction:
      "Choose the word for the gap. Today is Tuesday. Coffee with Tomás is on Wednesday.",
    prompt: "Café con Tomás: ___.",
    answer: "mañana",
    choices: ["mañana", "hoy", "ayer"],
    say: "Café con Tomás: mañana.",
    feedback: "Today is Tuesday. Coffee with Tomás is on Wednesday. So: Café con Tomás: mañana.",
    hints,
  },
];
