import type { Item } from "../practice-sets/item.ts";

// T01, hoy: today.
const hints: [string, string] = [
  "The event is on the same day as today.",
  "It is three letters and starts with h-, which you do not hear.",
];

export const t01Items: Item[] = [
  {
    id: "TM-T01-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "hoy",
    answer: "today",
    choices: ["today", "tomorrow", "yesterday"],
    say: "hoy",
    feedback: "hoy means today.",
    hints,
  },
  {
    id: "TM-T01-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "today",
    answer: "hoy",
    say: "hoy",
    feedback: "Today is hoy.",
    hints,
  },
  {
    id: "TM-T01-E04",
    mode: "cloze",
    instruction: "Complete the gap. Today is Tuesday. Luis’s meeting is on Tuesday.",
    prompt: "Reunión de Luis: ___.",
    answer: "hoy",
    say: "Reunión de Luis: hoy.",
    feedback: "Today is Tuesday. Luis’s meeting is on Tuesday. So: Reunión de Luis: hoy.",
    hints,
  },
  {
    id: "TM-T01-E05",
    mode: "cloze",
    instruction:
      "Translate the calendar note into Spanish. Today is Tuesday. Diego’s visit is on Tuesday.",
    prompt: "Diego’s visit: today.",
    answer: "Visita de Diego: hoy.",
    accepted: ["La visita de Diego: hoy.", "La visita de Diego es hoy."],
    say: "Visita de Diego: hoy.",
    feedback: "One right answer: Visita de Diego: hoy.",
    hints,
  },
  {
    id: "TM-T01-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Café con Tomás: hoy.",
    answer: "Today is Tuesday. Coffee with Tomás is on Tuesday.",
    choices: [
      "Today is Tuesday. Coffee with Tomás is on Tuesday.",
      "Today is Tuesday. Coffee with Tomás is on Wednesday.",
      "Today is Tuesday. Coffee with Tomás was on Monday.",
    ],
    say: "Café con Tomás: hoy.",
    feedback: "hoy means today: Today is Tuesday. Coffee with Tomás is on Tuesday.",
    hints,
  },
  {
    id: "TM-T01-V11",
    mode: "choice",
    instruction: "Choose the word for the gap. Today is Tuesday. Jorge’s meeting is on Tuesday.",
    prompt: "Reunión de Jorge: ___.",
    answer: "hoy",
    choices: ["hoy", "mañana", "ayer"],
    say: "Reunión de Jorge: hoy.",
    feedback: "Today is Tuesday. Jorge’s meeting is on Tuesday. So: Reunión de Jorge: hoy.",
    hints,
  },
];
