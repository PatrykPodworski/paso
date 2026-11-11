import type { Item } from "../practice-sets/item.ts";

// T07, domingo: Sunday, the seventh day of the Spanish week.
const meaning: [string, string] = [
  "domingo comes from dies Dominicus, Latin for the Lord’s day.",
  "It is day 7 of the Spanish week, which starts on Monday.",
];

const spanish: [string, string] = [
  "Sunday is named after dies Dominicus, Latin for the Lord’s day.",
  "It starts with do-.",
];

const everySunday: [string, string] = [
  "Sunday is named after dies Dominicus, Latin for the Lord’s day.",
  "It starts with do- and ends in -s, because it means every Sunday.",
];

const inFrame =
  "Use domingo in this frame. Keep the stated calendar label; do not use the current real date.";

const inFrameEvery =
  "Use domingos in this frame. Keep the stated calendar label; do not use the current real date.";

export const t07Items: Item[] = [
  {
    id: "WD-T07-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “domingo”.",
    answer: "Sunday",
    choices: ["Sunday", "Saturday", "Monday"],
    say: "domingo",
    feedback: "domingo means Sunday.",
    hints: meaning,
  },
  {
    id: "WD-T07-E02",
    mode: "cloze",
    prompt: "Write the English meaning of the Spanish word “domingo”.",
    answer: "Sunday",
    say: "domingo",
    feedback: "domingo means Sunday.",
    hints: meaning,
  },
  {
    id: "WD-T07-E03",
    mode: "cloze",
    prompt: "Write the Spanish dictionary form for “Sunday”. Give one word, not a sentence.",
    answer: "domingo",
    say: "domingo",
    feedback: "Use domingo.",
    hints: spanish,
  },
  {
    id: "WD-T07-E04",
    mode: "cloze",
    prompt: "The displayed calendar says Sunday. Complete only the gap: Hoy es ___.",
    answer: "domingo",
    say: "Hoy es domingo.",
    feedback: "Use domingo; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T07-E05",
    mode: "cloze",
    prompt:
      "The displayed calendar says Sunday. Write the full Spanish sentence using exactly this frame: Hoy es ___.",
    answer: "Hoy es domingo.",
    say: "Hoy es domingo.",
    feedback: "The complete constrained answer is Hoy es domingo. Do not change the referent.",
    hints: spanish,
  },
  {
    id: "WD-T07-E06",
    mode: "sentence",
    prompt:
      "The displayed calendar says Sunday. Express this fact naturally in Spanish. Use the words you know.",
    answer: "Hoy es domingo.",
    constraints: ["Uses domingo for Sunday", "Keeps the fact and the people of the situation"],
    feedback: "Model answer: Hoy es domingo. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T07-V01",
    mode: "cloze",
    prompt: "Pablo’s visit is Sunday. Complete only the gap: La visita de Pablo es el ___.",
    answer: "domingo",
    say: "La visita de Pablo es el domingo.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T07-V04",
    mode: "cloze",
    prompt:
      "I go to the museum Sunday. Write the full Spanish sentence using exactly this frame: Voy al museo el ___.",
    answer: "Voy al museo el domingo.",
    say: "Voy al museo el domingo.",
    feedback: `${inFrame} Full example: Voy al museo el domingo.`,
    hints: spanish,
  },
  {
    id: "WD-T07-V07",
    mode: "cloze",
    prompt: "Your appointment is Sunday. Complete only the gap: Tu cita es el ___.",
    answer: "domingo",
    say: "Tu cita es el domingo.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T07-V09",
    mode: "cloze",
    prompt: "Luis works on Sundays. Complete only the gap: Luis trabaja los ___.",
    answer: "domingos",
    say: "Luis trabaja los domingos.",
    feedback: inFrameEvery,
    hints: everySunday,
  },
  {
    id: "WD-T07-V10",
    mode: "sentence",
    prompt:
      "Luis works on Sundays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Luis trabaja los domingos.",
    constraints: [
      "Uses los domingos for every Sunday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Luis trabaja los domingos. Other wording can be right too.",
    hints: everySunday,
  },
  {
    id: "WD-T07-V12",
    mode: "sentence",
    prompt:
      "I have class on Sundays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Tengo clase los domingos.",
    constraints: [
      "Uses los domingos for every Sunday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Tengo clase los domingos. Other wording can be right too.",
    hints: everySunday,
  },
];
