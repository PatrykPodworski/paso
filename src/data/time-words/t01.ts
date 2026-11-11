import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T01, hoy: today.
const hints: [string, string] = [
  "The event is on the same day as today.",
  "It is three letters and starts with h-, which you do not hear.",
];

export const t01Items: Item[] = [
  {
    id: "TM-T01-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “hoy”.",
    answer: "today",
    choices: ["today", "tomorrow", "yesterday"],
    say: "hoy",
    feedback: "hoy means today.",
    hints,
  },
  {
    id: "TM-T01-E02",
    mode: "choice",
    prompt: "What does “hoy” mean in this sentence? Café con Tomás: hoy.",
    answer: "today",
    choices: ["today", "tomorrow", "yesterday"],
    say: "Café con Tomás: hoy.",
    feedback: "Here hoy means today.",
    hints,
  },
  {
    id: "TM-T01-E03",
    mode: "cloze",
    prompt: "Write the Spanish for “today”.",
    answer: "hoy",
    say: "hoy",
    feedback: "Today is hoy.",
    hints,
  },
  {
    id: "TM-T01-E04",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Pablo’s class is on Tuesday. Complete only the gap: Clase de Pablo: ___.",
    answer: "hoy",
    say: "Clase de Pablo: hoy.",
    feedback: "Today is Tuesday. Pablo’s class is on Tuesday. So: Clase de Pablo: hoy.",
    hints,
  },
  {
    id: "TM-T01-E05",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Pablo’s class is on Tuesday. Write the full Spanish sentence: Clase de Pablo: ___.",
    answer: "Clase de Pablo: hoy.",
    say: "Clase de Pablo: hoy.",
    feedback: "Full sentence: Clase de Pablo: hoy.",
    hints,
  },
  {
    id: "TM-T01-E06",
    mode: "choice",
    prompt: "Which situation fits “Reunión de Luis: hoy.”?",
    answer: "Today is Tuesday. Luis’s meeting is on Tuesday.",
    choices: [
      "Today is Tuesday. Luis’s meeting is on Tuesday.",
      "Today is Tuesday. Luis’s meeting is on Wednesday.",
      "Today is Tuesday. Luis’s meeting was on Monday.",
    ],
    say: "Reunión de Luis: hoy.",
    feedback: "hoy means today: Today is Tuesday. Luis’s meeting is on Tuesday.",
    hints,
  },
  {
    id: "TM-T01-V01",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Luis’s meeting is on Tuesday. Complete only the gap: Reunión de Luis: ___.",
    answer: "hoy",
    say: "Reunión de Luis: hoy.",
    feedback: "Today is Tuesday. Luis’s meeting is on Tuesday. So: Reunión de Luis: hoy.",
    hints,
  },
  {
    id: "TM-T01-V02",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Luis’s meeting is on Tuesday. Write the full Spanish sentence: Reunión de Luis: ___.",
    answer: "Reunión de Luis: hoy.",
    say: "Reunión de Luis: hoy.",
    feedback: "Full sentence: Reunión de Luis: hoy.",
    hints,
  },
  {
    id: "TM-T01-V03",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Diego’s visit is on Tuesday. Complete only the gap: Visita de Diego: ___.",
    answer: "hoy",
    say: "Visita de Diego: hoy.",
    feedback: "Today is Tuesday. Diego’s visit is on Tuesday. So: Visita de Diego: hoy.",
    hints,
  },
  {
    id: "TM-T01-V04",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Diego’s visit is on Tuesday. Write the full Spanish sentence: Visita de Diego: ___.",
    answer: "Visita de Diego: hoy.",
    say: "Visita de Diego: hoy.",
    feedback: "Full sentence: Visita de Diego: hoy.",
    hints,
  },
  {
    id: "TM-T01-V05",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Coffee with Tomás is on Tuesday. Complete only the gap: Café con Tomás: ___.",
    answer: "hoy",
    say: "Café con Tomás: hoy.",
    feedback: "Today is Tuesday. Coffee with Tomás is on Tuesday. So: Café con Tomás: hoy.",
    hints,
  },
  {
    id: "TM-T01-V06",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Coffee with Tomás is on Tuesday. Write the full Spanish sentence: Café con Tomás: ___.",
    answer: "Café con Tomás: hoy.",
    say: "Café con Tomás: hoy.",
    feedback: "Full sentence: Café con Tomás: hoy.",
    hints,
  },
  {
    id: "TM-T01-V07",
    mode: "cloze",
    prompt:
      "Today is Tuesday. The Spanish class is on Tuesday. Complete only the gap: Clase de español: ___.",
    answer: "hoy",
    say: "Clase de español: hoy.",
    feedback: "Today is Tuesday. The Spanish class is on Tuesday. So: Clase de español: hoy.",
    hints,
  },
  {
    id: "TM-T01-V08",
    mode: "cloze",
    prompt:
      "Today is Tuesday. The Spanish class is on Tuesday. Write the full Spanish sentence: Clase de español: ___.",
    answer: "Clase de español: hoy.",
    say: "Clase de español: hoy.",
    feedback: "Full sentence: Clase de español: hoy.",
    hints,
  },
  {
    id: "TM-T01-V09",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Breakfast with Jorge is on Tuesday. Complete only the gap: Desayuno con Jorge: ___.",
    answer: "hoy",
    say: "Desayuno con Jorge: hoy.",
    feedback: "Today is Tuesday. Breakfast with Jorge is on Tuesday. So: Desayuno con Jorge: hoy.",
    hints,
  },
  {
    id: "TM-T01-V10",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Breakfast with Jorge is on Tuesday. Write the full Spanish sentence: Desayuno con Jorge: ___.",
    answer: "Desayuno con Jorge: hoy.",
    say: "Desayuno con Jorge: hoy.",
    feedback: "Full sentence: Desayuno con Jorge: hoy.",
    hints,
  },
  {
    id: "TM-T01-V11",
    mode: "choice",
    prompt: "What does “hoy” mean in this sentence? Clase de español: hoy.",
    answer: "today",
    choices: ["today", "tomorrow", "yesterday"],
    say: "Clase de español: hoy.",
    feedback: "Here hoy means today.",
    hints,
  },
  {
    id: "TM-T01-V12",
    mode: "choice",
    prompt: "Which situation fits “Visita de Diego: hoy.”?",
    answer: "Today is Tuesday. Diego’s visit is on Tuesday.",
    choices: [
      "Today is Tuesday. Diego’s visit is on Tuesday.",
      "Today is Tuesday. Diego’s visit is on Wednesday.",
      "Today is Tuesday. Diego’s visit was on Monday.",
    ],
    say: "Visita de Diego: hoy.",
    feedback: "hoy means today: Today is Tuesday. Diego’s visit is on Tuesday.",
    hints,
  },
];

const t01Introduction = teachingCard(
  "TM-T01-INTRO",
  "New word: hoy",
  "hoy means today. Example: Clase de Pablo: hoy.",
);

export const l01: SetLesson = {
  id: "tm-l01",
  title: "Today",
  subtitle: "Learn one new time word",
  recalled: [],
  introduction: t01Introduction,
  base: ["TM-T01-E01", "TM-T01-E02", "TM-T01-E03", "TM-T01-E04", "TM-T01-E05", "TM-T01-E06"],
  formCards: [],
  variations: t01Items.map((i) => i.id).filter((id) => id.startsWith("TM-T01-V")),
};
