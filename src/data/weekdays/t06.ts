import type { Item } from "../practice-sets/item.ts";

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
    choices: ["Saturday", "Sunday", "Friday"],
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
];
