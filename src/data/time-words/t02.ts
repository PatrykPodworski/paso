import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T02, mañana: tomorrow.
const hints: [string, string] = [
  "The event is one day after today.",
  "It starts with ma- and has an ñ.",
];

export const t02Items: Item[] = [
  {
    id: "TM-T02-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “mañana”.",
    answer: "tomorrow",
    choices: ["tomorrow", "today", "yesterday"],
    say: "mañana",
    feedback: "mañana means tomorrow.",
    hints,
  },
  {
    id: "TM-T02-E02",
    mode: "choice",
    prompt: "What does “mañana” mean in this sentence? Café con Tomás: mañana.",
    answer: "tomorrow",
    choices: ["tomorrow", "morning", "today"],
    say: "Café con Tomás: mañana.",
    feedback: "Here mañana means tomorrow.",
    hints,
  },
  {
    id: "TM-T02-E03",
    mode: "cloze",
    prompt: "Write the Spanish for “tomorrow”.",
    answer: "mañana",
    say: "mañana",
    feedback: "Tomorrow is mañana.",
    hints,
  },
  {
    id: "TM-T02-E04",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Pablo’s class is on Wednesday. Complete only the gap: Clase de Pablo: ___.",
    answer: "mañana",
    say: "Clase de Pablo: mañana.",
    feedback: "Today is Tuesday. Pablo’s class is on Wednesday. So: Clase de Pablo: mañana.",
    hints,
  },
  {
    id: "TM-T02-E05",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Pablo’s class is on Wednesday. Write the full Spanish sentence: Clase de Pablo: ___.",
    answer: "Clase de Pablo: mañana.",
    say: "Clase de Pablo: mañana.",
    feedback: "Full sentence: Clase de Pablo: mañana.",
    hints,
  },
  {
    id: "TM-T02-E06",
    mode: "choice",
    prompt: "Which situation fits “Reunión de Luis: mañana.”?",
    answer: "Today is Tuesday. Luis’s meeting is on Wednesday.",
    choices: [
      "Today is Tuesday. Luis’s meeting is on Wednesday.",
      "Today is Tuesday. Luis’s meeting is on Tuesday.",
      "Today is Tuesday. Luis’s meeting was on Monday.",
    ],
    say: "Reunión de Luis: mañana.",
    feedback: "mañana means tomorrow: Today is Tuesday. Luis’s meeting is on Wednesday.",
    hints,
  },
  {
    id: "TM-T02-V01",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Luis’s meeting is on Wednesday. Complete only the gap: Reunión de Luis: ___.",
    answer: "mañana",
    say: "Reunión de Luis: mañana.",
    feedback: "Today is Tuesday. Luis’s meeting is on Wednesday. So: Reunión de Luis: mañana.",
    hints,
  },
  {
    id: "TM-T02-V02",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Luis’s meeting is on Wednesday. Write the full Spanish sentence: Reunión de Luis: ___.",
    answer: "Reunión de Luis: mañana.",
    say: "Reunión de Luis: mañana.",
    feedback: "Full sentence: Reunión de Luis: mañana.",
    hints,
  },
  {
    id: "TM-T02-V03",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Diego’s visit is on Wednesday. Complete only the gap: Visita de Diego: ___.",
    answer: "mañana",
    say: "Visita de Diego: mañana.",
    feedback: "Today is Tuesday. Diego’s visit is on Wednesday. So: Visita de Diego: mañana.",
    hints,
  },
  {
    id: "TM-T02-V04",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Diego’s visit is on Wednesday. Write the full Spanish sentence: Visita de Diego: ___.",
    answer: "Visita de Diego: mañana.",
    say: "Visita de Diego: mañana.",
    feedback: "Full sentence: Visita de Diego: mañana.",
    hints,
  },
  {
    id: "TM-T02-V05",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Coffee with Tomás is on Wednesday. Complete only the gap: Café con Tomás: ___.",
    answer: "mañana",
    say: "Café con Tomás: mañana.",
    feedback: "Today is Tuesday. Coffee with Tomás is on Wednesday. So: Café con Tomás: mañana.",
    hints,
  },
  {
    id: "TM-T02-V06",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Coffee with Tomás is on Wednesday. Write the full Spanish sentence: Café con Tomás: ___.",
    answer: "Café con Tomás: mañana.",
    say: "Café con Tomás: mañana.",
    feedback: "Full sentence: Café con Tomás: mañana.",
    hints,
  },
  {
    id: "TM-T02-V07",
    mode: "cloze",
    prompt:
      "Today is Tuesday. The Spanish class is on Wednesday. Complete only the gap: Clase de español: ___.",
    answer: "mañana",
    say: "Clase de español: mañana.",
    feedback: "Today is Tuesday. The Spanish class is on Wednesday. So: Clase de español: mañana.",
    hints,
  },
  {
    id: "TM-T02-V08",
    mode: "cloze",
    prompt:
      "Today is Tuesday. The Spanish class is on Wednesday. Write the full Spanish sentence: Clase de español: ___.",
    answer: "Clase de español: mañana.",
    say: "Clase de español: mañana.",
    feedback: "Full sentence: Clase de español: mañana.",
    hints,
  },
  {
    id: "TM-T02-V09",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Breakfast with Jorge is on Wednesday. Complete only the gap: Desayuno con Jorge: ___.",
    answer: "mañana",
    say: "Desayuno con Jorge: mañana.",
    feedback:
      "Today is Tuesday. Breakfast with Jorge is on Wednesday. So: Desayuno con Jorge: mañana.",
    hints,
  },
  {
    id: "TM-T02-V10",
    mode: "cloze",
    prompt:
      "Today is Tuesday. Breakfast with Jorge is on Wednesday. Write the full Spanish sentence: Desayuno con Jorge: ___.",
    answer: "Desayuno con Jorge: mañana.",
    say: "Desayuno con Jorge: mañana.",
    feedback: "Full sentence: Desayuno con Jorge: mañana.",
    hints,
  },
  {
    id: "TM-T02-V11",
    mode: "choice",
    prompt:
      "Today is Tuesday. The Spanish class is on Wednesday. Which word completes the sentence? Clase de español: ___.",
    answer: "mañana",
    choices: ["mañana", "hoy"],
    say: "Clase de español: mañana.",
    feedback: "Today is Tuesday. The Spanish class is on Wednesday. So: Clase de español: mañana.",
    hints,
  },
  {
    id: "TM-T02-V12",
    mode: "choice",
    prompt: "Which situation fits “Visita de Diego: mañana.”?",
    answer: "Today is Tuesday. Diego’s visit is on Wednesday.",
    choices: [
      "Today is Tuesday. Diego’s visit is on Wednesday.",
      "Today is Tuesday. Diego’s visit is on Tuesday.",
      "Today is Tuesday. Diego’s visit was on Monday.",
    ],
    say: "Visita de Diego: mañana.",
    feedback: "mañana means tomorrow: Today is Tuesday. Diego’s visit is on Wednesday.",
    hints,
  },
];

const t02Introduction = teachingCard(
  "TM-T02-INTRO",
  "New word: mañana",
  "mañana means tomorrow. Example: Reunión de Luis: mañana.",
);

export const l02: SetLesson = {
  id: "tm-l02",
  title: "Tomorrow",
  subtitle: "Learn one new time word",
  recalled: ["TM-T01-V09"],
  introduction: t02Introduction,
  base: ["TM-T02-E01", "TM-T02-E02", "TM-T02-E03", "TM-T02-E04", "TM-T02-E05", "TM-T02-E06"],
  formCards: [
    {
      before: "TM-T02-E04",
      heading: "mañana and la mañana",
      text: "mañana alone means tomorrow. With la, la mañana is the morning. In these exercises mañana means tomorrow.",
    },
  ],
  variations: t02Items.map((i) => i.id).filter((id) => id.startsWith("TM-T02-V")),
};
