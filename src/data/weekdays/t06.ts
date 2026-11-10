import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T06, sábado: Saturday, the sixth day of the Spanish week.
const meaning: [string, string] = [
  "sábado comes from the Sabbath, the day of rest.",
  "It is day 6 of the Spanish week, which starts on Monday.",
];

const spanish: [string, string] = [
  "Saturday is named after the Sabbath, the day of rest.",
  "It starts with sá- and has an accent on the á.",
];

const everySaturday: [string, string] = [
  "Saturday is named after the Sabbath, the day of rest.",
  "It starts with sá- and ends in -s, because it means every Saturday.",
];

const inFrame =
  "Use sábado in this frame. Keep the stated calendar label; do not use the current real date.";

const inFrameEvery =
  "Use sábados in this frame. Keep the stated calendar label; do not use the current real date.";

export const t06Items: Item[] = [
  {
    id: "WD-T06-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “sábado”.",
    answer: "Saturday",
    choices: ["Saturday", "Friday", "Sunday"],
    say: "sábado",
    feedback: "sábado means Saturday.",
    hints: meaning,
  },
  {
    id: "WD-T06-E02",
    mode: "cloze",
    prompt: "Write the English meaning of the Spanish word “sábado”.",
    answer: "Saturday",
    say: "sábado",
    feedback: "sábado means Saturday.",
    hints: meaning,
  },
  {
    id: "WD-T06-E03",
    mode: "cloze",
    prompt: "Write the Spanish dictionary form for “Saturday”. Give one word, not a sentence.",
    answer: "sábado",
    say: "sábado",
    feedback: "Use sábado.",
    hints: spanish,
  },
  {
    id: "WD-T06-E04",
    mode: "cloze",
    prompt: "The displayed calendar says Saturday. Complete only the gap: Hoy es ___.",
    answer: "sábado",
    say: "Hoy es sábado.",
    feedback: "Use sábado; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T06-E05",
    mode: "cloze",
    prompt:
      "The displayed calendar says Saturday. Write the full Spanish sentence using exactly this frame: Hoy es ___.",
    answer: "Hoy es sábado.",
    say: "Hoy es sábado.",
    feedback: "The complete constrained answer is Hoy es sábado. Do not change the referent.",
    hints: spanish,
  },
  {
    id: "WD-T06-E06",
    mode: "sentence",
    prompt:
      "The displayed calendar says Saturday. Express this fact naturally in Spanish. Use the words you know.",
    answer: "Hoy es sábado.",
    constraints: ["Uses sábado for Saturday", "Keeps the fact and the people of the situation"],
    feedback: "Model answer: Hoy es sábado. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T06-V01",
    mode: "cloze",
    prompt: "Pablo goes to the museum Saturday. Complete only the gap: Pablo va al museo el ___.",
    answer: "sábado",
    say: "Pablo va al museo el sábado.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T06-V02",
    mode: "cloze",
    prompt:
      "Pablo goes to the museum Saturday. Write the full Spanish sentence using exactly this frame: Pablo va al museo el ___.",
    answer: "Pablo va al museo el sábado.",
    say: "Pablo va al museo el sábado.",
    feedback: `${inFrame} Full example: Pablo va al museo el sábado.`,
    hints: spanish,
  },
  {
    id: "WD-T06-V03",
    mode: "cloze",
    prompt: "My visit is Saturday. Complete only the gap: Mi visita es el ___.",
    answer: "sábado",
    say: "Mi visita es el sábado.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T06-V04",
    mode: "cloze",
    prompt:
      "My visit is Saturday. Write the full Spanish sentence using exactly this frame: Mi visita es el ___.",
    answer: "Mi visita es el sábado.",
    say: "Mi visita es el sábado.",
    feedback: `${inFrame} Full example: Mi visita es el sábado.`,
    hints: spanish,
  },
  {
    id: "WD-T06-V05",
    mode: "cloze",
    prompt: "Luis has an appointment Saturday. Complete only the gap: Luis tiene una cita el ___.",
    answer: "sábado",
    say: "Luis tiene una cita el sábado.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T06-V06",
    mode: "cloze",
    prompt:
      "Luis has an appointment Saturday. Write the full Spanish sentence using exactly this frame: Luis tiene una cita el ___.",
    answer: "Luis tiene una cita el sábado.",
    say: "Luis tiene una cita el sábado.",
    feedback: `${inFrame} Full example: Luis tiene una cita el sábado.`,
    hints: spanish,
  },
  {
    id: "WD-T06-V07",
    mode: "cloze",
    prompt: "You have class Saturday. Complete only the gap: Tienes clase el ___.",
    answer: "sábado",
    say: "Tienes clase el sábado.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T06-V08",
    mode: "cloze",
    prompt:
      "You have class Saturday. Write the full Spanish sentence using exactly this frame: Tienes clase el ___.",
    answer: "Tienes clase el sábado.",
    say: "Tienes clase el sábado.",
    feedback: `${inFrame} Full example: Tienes clase el sábado.`,
    hints: spanish,
  },
  {
    id: "WD-T06-V09",
    mode: "cloze",
    prompt: "I work on Saturdays. Complete only the gap: Trabajo los ___.",
    answer: "sábados",
    say: "Trabajo los sábados.",
    feedback: inFrameEvery,
    hints: everySaturday,
  },
  {
    id: "WD-T06-V10",
    mode: "sentence",
    prompt:
      "I work on Saturdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Trabajo los sábados.",
    constraints: [
      "Uses los sábados for every Saturday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Trabajo los sábados. Other wording can be right too.",
    hints: everySaturday,
  },
  {
    id: "WD-T06-V11",
    mode: "cloze",
    prompt: "The shop opens on Saturdays. Complete only the gap: La tienda abre los ___.",
    answer: "sábados",
    say: "La tienda abre los sábados.",
    feedback: inFrameEvery,
    hints: everySaturday,
  },
  {
    id: "WD-T06-V12",
    mode: "sentence",
    prompt:
      "The shop opens on Saturdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "La tienda abre los sábados.",
    constraints: [
      "Uses los sábados for every Saturday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: La tienda abre los sábados. Other wording can be right too.",
    hints: everySaturday,
  },
];

const t06Introduction = teachingCard(
  "WD-T06-INTRO",
  "New day: sábado",
  "sábado means Saturday. It comes from the Sabbath, the day of rest. Example: Hoy es sábado. Write it with the accent on the á.",
);

const variations = t06Items.map((i) => i.id).filter((id) => id.startsWith("WD-T06-V"));

export const l06: SetLesson = {
  id: "wd-l06",
  title: "Saturday",
  subtitle: "Learn one new day",
  recalled: ["WD-T05-V04"],
  introduction: t06Introduction,
  base: ["WD-T06-E01", "WD-T06-E02", "WD-T06-E03", "WD-T06-E04", "WD-T06-E05", "WD-T06-E06"],
  formCards: [
    {
      before: "WD-T06-E04",
      heading: "el sábado, los sábados",
      text: "el sábado is one Saturday. los sábados is every Saturday: add -s. Days are written in lowercase.",
    },
  ],
  variations,
};

// R02 closes unit 2: each day's full sentence again, in the days' order, with no cards.
export const r02: SetLesson = {
  id: "wd-r02",
  title: "Review: unit 2",
  subtitle: "Review lessons 4–6",
  recalled: [],
  base: ["WD-T04-V04", "WD-T05-V04", "WD-T06-V04"],
  formCards: [],
  variations: [],
};
