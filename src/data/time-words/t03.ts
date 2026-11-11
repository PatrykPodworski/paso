import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T03, ayer: yesterday.
const hints: [string, string] = ["The event was one day before today.", "It starts with ay-."];

export const t03Items: Item[] = [
  {
    id: "TM-T03-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “ayer”.",
    answer: "yesterday",
    choices: ["yesterday", "today", "tomorrow"],
    say: "ayer",
    feedback: "ayer means yesterday.",
    hints,
  },
  {
    id: "TM-T03-E02",
    mode: "choice",
    prompt: "What does “ayer” mean in this sentence? Café con Tomás: ayer.",
    answer: "yesterday",
    choices: ["yesterday", "today", "tomorrow"],
    say: "Café con Tomás: ayer.",
    feedback: "Here ayer means yesterday.",
    hints,
  },
  {
    id: "TM-T03-E03",
    mode: "cloze",
    prompt: "Write the Spanish for “yesterday”.",
    answer: "ayer",
    say: "ayer",
    feedback: "Yesterday is ayer.",
    hints,
  },
  {
    id: "TM-T03-E04",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Pablo’s class was on Monday. Complete only the gap: Clase de Pablo: ___.",
    answer: "ayer",
    say: "Clase de Pablo: ayer.",
    feedback: "Today is Tuesday. Pablo’s class was on Monday. So: Clase de Pablo: ayer.",
    hints,
  },
  {
    id: "TM-T03-E05",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Pablo’s class was on Monday. Write the full Spanish sentence: Clase de Pablo: ___.",
    answer: "Clase de Pablo: ayer.",
    say: "Clase de Pablo: ayer.",
    feedback: "Full sentence: Clase de Pablo: ayer.",
    hints,
  },
  {
    id: "TM-T03-E06",
    mode: "choice",
    prompt: "Which situation fits “Reunión de Luis: ayer.”?",
    answer: "Today is Tuesday. Luis’s meeting was on Monday.",
    choices: [
      "Today is Tuesday. Luis’s meeting was on Monday.",
      "Today is Tuesday. Luis’s meeting is on Tuesday.",
      "Today is Tuesday. Luis’s meeting is on Wednesday.",
    ],
    say: "Reunión de Luis: ayer.",
    feedback: "ayer means yesterday: Today is Tuesday. Luis’s meeting was on Monday.",
    hints,
  },
  {
    id: "TM-T03-V01",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Luis’s meeting was on Monday. Complete only the gap: Reunión de Luis: ___.",
    answer: "ayer",
    say: "Reunión de Luis: ayer.",
    feedback: "Today is Tuesday. Luis’s meeting was on Monday. So: Reunión de Luis: ayer.",
    hints,
  },
  {
    id: "TM-T03-V02",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Luis’s meeting was on Monday. Write the full Spanish sentence: Reunión de Luis: ___.",
    answer: "Reunión de Luis: ayer.",
    say: "Reunión de Luis: ayer.",
    feedback: "Full sentence: Reunión de Luis: ayer.",
    hints,
  },
  {
    id: "TM-T03-V03",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Diego’s visit was on Monday. Complete only the gap: Visita de Diego: ___.",
    answer: "ayer",
    say: "Visita de Diego: ayer.",
    feedback: "Today is Tuesday. Diego’s visit was on Monday. So: Visita de Diego: ayer.",
    hints,
  },
  {
    id: "TM-T03-V04",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Diego’s visit was on Monday. Write the full Spanish sentence: Visita de Diego: ___.",
    answer: "Visita de Diego: ayer.",
    say: "Visita de Diego: ayer.",
    feedback: "Full sentence: Visita de Diego: ayer.",
    hints,
  },
  {
    id: "TM-T03-V05",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Coffee with Tomás was on Monday. Complete only the gap: Café con Tomás: ___.",
    answer: "ayer",
    say: "Café con Tomás: ayer.",
    feedback: "Today is Tuesday. Coffee with Tomás was on Monday. So: Café con Tomás: ayer.",
    hints,
  },
  {
    id: "TM-T03-V06",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Coffee with Tomás was on Monday. Write the full Spanish sentence: Café con Tomás: ___.",
    answer: "Café con Tomás: ayer.",
    say: "Café con Tomás: ayer.",
    feedback: "Full sentence: Café con Tomás: ayer.",
    hints,
  },
  {
    id: "TM-T03-V07",
    mode: "cloze",
    prompt:
      "Today is Tuesday. The Spanish class was on Monday. Complete only the gap: Clase de español: ___.",
    answer: "ayer",
    say: "Clase de español: ayer.",
    feedback: "Today is Tuesday. The Spanish class was on Monday. So: Clase de español: ayer.",
    hints,
  },
  {
    id: "TM-T03-V08",
    mode: "cloze",
    prompt:
      "Today is Tuesday. The Spanish class was on Monday. Write the full Spanish sentence: Clase de español: ___.",
    answer: "Clase de español: ayer.",
    say: "Clase de español: ayer.",
    feedback: "Full sentence: Clase de español: ayer.",
    hints,
  },
  {
    id: "TM-T03-V09",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Breakfast with Jorge was on Monday. Complete only the gap: Desayuno con Jorge: ___.",
    answer: "ayer",
    say: "Desayuno con Jorge: ayer.",
    feedback: "Today is Tuesday. Breakfast with Jorge was on Monday. So: Desayuno con Jorge: ayer.",
    hints,
  },
  {
    id: "TM-T03-V10",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Breakfast with Jorge was on Monday. Write the full Spanish sentence: Desayuno con Jorge: ___.",
    answer: "Desayuno con Jorge: ayer.",
    say: "Desayuno con Jorge: ayer.",
    feedback: "Full sentence: Desayuno con Jorge: ayer.",
    hints,
  },
  {
    id: "TM-T03-V11",
    mode: "choice",
    prompt:
      "Today is Tuesday. The Spanish class was on Monday. Which word completes the sentence? Clase de español: ___.",
    answer: "ayer",
    choices: ["ayer", "hoy", "mañana"],
    say: "Clase de español: ayer.",
    feedback: "Today is Tuesday. The Spanish class was on Monday. So: Clase de español: ayer.",
    hints,
  },
  {
    id: "TM-T03-V12",
    mode: "choice",
    prompt: "Which situation fits “Visita de Diego: ayer.”?",
    answer: "Today is Tuesday. Diego’s visit was on Monday.",
    choices: [
      "Today is Tuesday. Diego’s visit was on Monday.",
      "Today is Tuesday. Diego’s visit is on Tuesday.",
      "Today is Tuesday. Diego’s visit is on Wednesday.",
    ],
    say: "Visita de Diego: ayer.",
    feedback: "ayer means yesterday: Today is Tuesday. Diego’s visit was on Monday.",
    hints,
  },
];

const t03Introduction = teachingCard(
  "TM-T03-INTRO",
  "New word: ayer",
  "ayer means yesterday. Example: Visita de Diego: ayer.",
);

export const l03: SetLesson = {
  id: "tm-l03",
  title: "Yesterday",
  subtitle: "Learn one new time word",
  recalled: ["TM-T02-V09"],
  introduction: t03Introduction,
  base: ["TM-T03-E01", "TM-T03-E02", "TM-T03-E03", "TM-T03-E04", "TM-T03-E05", "TM-T03-E06"],
  formCards: [],
  variations: t03Items.map((i) => i.id).filter((id) => id.startsWith("TM-T03-V")),
};
