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
    instruction: "Choose the English meaning",
    prompt: "sábado",
    answer: "Saturday",
    choices: ["Saturday", "Sunday", "Friday"],
    say: "sábado",
    feedback: "sábado means Saturday.",
    hints: meaning,
  },
  {
    id: "WD-T06-E02",
    mode: "cloze",
    instruction: "Write the English meaning",
    prompt: "sábado",
    answer: "Saturday",
    say: "sábado",
    feedback: "sábado means Saturday.",
    hints: meaning,
  },
  {
    id: "WD-T06-E03",
    mode: "cloze",
    instruction: "Write one Spanish word, not a sentence",
    prompt: "Saturday",
    answer: "sábado",
    say: "sábado",
    feedback: "Use sábado.",
    hints: spanish,
  },
  {
    id: "WD-T06-E04",
    mode: "cloze",
    instruction: "Complete the gap",
    context: "The displayed calendar says Saturday.",
    prompt: "Hoy es ___.",
    answer: "sábado",
    say: "Hoy es sábado.",
    feedback: "Use sábado; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T06-N01",
    mode: "cloze",
    instruction: "Translate into Spanish",
    prompt: "My brother works on Saturday.",
    answer: "Mi hermano trabaja el sábado.",
    accepted: ["El sábado mi hermano trabaja."],
    say: "Mi hermano trabaja el sábado.",
    feedback: "Mi hermano trabaja el sábado. Use el sábado for one Saturday.",
    hints: spanish,
  },
  {
    id: "WD-T06-N02",
    mode: "cloze",
    instruction: "Translate into Spanish",
    prompt: "I have breakfast at home every Saturday.",
    answer: "Desayuno en casa los sábados.",
    accepted: [
      "Desayuno los sábados en casa.",
      "Los sábados desayuno en casa.",
      "Desayuno en casa todos los sábados.",
      "Desayuno todos los sábados en casa.",
      "Todos los sábados desayuno en casa.",
      "Desayuno en casa cada sábado.",
      "Desayuno cada sábado en casa.",
      "Cada sábado desayuno en casa.",
      "Yo desayuno en casa los sábados.",
      "Yo desayuno los sábados en casa.",
      "Los sábados yo desayuno en casa.",
      "Yo desayuno en casa todos los sábados.",
      "Yo desayuno todos los sábados en casa.",
      "Todos los sábados yo desayuno en casa.",
      "Yo desayuno en casa cada sábado.",
      "Yo desayuno cada sábado en casa.",
      "Cada sábado yo desayuno en casa.",
    ],
    say: "Desayuno en casa los sábados.",
    feedback:
      "Desayuno en casa los sábados. Use los sábados for every Saturday; todos los sábados and cada sábado are right too.",
    hints: everySaturday,
  },
  {
    id: "WD-T06-V01",
    mode: "cloze",
    instruction: "Complete the gap",
    context: "Pablo goes to the museum Saturday.",
    prompt: "Pablo va al museo el ___.",
    answer: "sábado",
    say: "Pablo va al museo el sábado.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T06-N04",
    mode: "cloze",
    instruction: "Translate into Spanish",
    prompt: "Pablo studies on Saturday.",
    answer: "Pablo estudia el sábado.",
    accepted: ["El sábado Pablo estudia."],
    say: "Pablo estudia el sábado.",
    feedback: "Pablo estudia el sábado. Use el sábado for one Saturday.",
    hints: spanish,
  },
  {
    id: "WD-T06-V09",
    mode: "cloze",
    instruction: "Complete the gap",
    context: "I work on Saturdays.",
    prompt: "Trabajo los ___.",
    answer: "sábados",
    say: "Trabajo los sábados.",
    feedback: inFrameEvery,
    hints: everySaturday,
  },
  {
    id: "WD-T06-N07",
    mode: "cloze",
    instruction: "Translate into Spanish",
    prompt: "My father is at home every Saturday.",
    answer: "Mi padre está en casa los sábados.",
    accepted: [
      "Mi padre está los sábados en casa.",
      "Los sábados mi padre está en casa.",
      "Mi padre está en casa todos los sábados.",
      "Mi padre está todos los sábados en casa.",
      "Todos los sábados mi padre está en casa.",
      "Mi padre está en casa cada sábado.",
      "Mi padre está cada sábado en casa.",
      "Cada sábado mi padre está en casa.",
    ],
    say: "Mi padre está en casa los sábados.",
    feedback:
      "Mi padre está en casa los sábados. Use los sábados for every Saturday; todos los sábados and cada sábado are right too.",
    hints: everySaturday,
  },
];
