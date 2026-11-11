import type { Item } from "../practice-sets/item.ts";

// T05, viernes: Friday, the fifth day of the Spanish week.
const meaning: [string, string] = [
  "viernes comes from Venus.",
  "It is day 5 of the Spanish week, which starts on Monday.",
];

const spanish: [string, string] = ["Friday is named after Venus.", "It starts with vi-."];

const inFrame =
  "Use viernes in this frame. Keep the stated calendar label; do not use the current real date.";

export const t05Items: Item[] = [
  {
    id: "WD-T05-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “viernes”.",
    answer: "Friday",
    choices: ["Friday", "Thursday", "Tuesday"],
    say: "viernes",
    feedback: "viernes means Friday.",
    hints: meaning,
  },
  {
    id: "WD-T05-E02",
    mode: "cloze",
    prompt: "Write the English meaning of the Spanish word “viernes”.",
    answer: "Friday",
    say: "viernes",
    feedback: "viernes means Friday.",
    hints: meaning,
  },
  {
    id: "WD-T05-E03",
    mode: "cloze",
    prompt: "Write the Spanish dictionary form for “Friday”. Give one word, not a sentence.",
    answer: "viernes",
    say: "viernes",
    feedback: "Use viernes.",
    hints: spanish,
  },
  {
    id: "WD-T05-E04",
    mode: "cloze",
    prompt: "An appointment is on Friday. Complete only the gap: La cita es el ___.",
    answer: "viernes",
    say: "La cita es el viernes.",
    feedback: "Use viernes; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T05-E05",
    mode: "cloze",
    prompt:
      "An appointment is on Friday. Write the full Spanish sentence using exactly this frame: La cita es el ___.",
    answer: "La cita es el viernes.",
    say: "La cita es el viernes.",
    feedback:
      "The complete constrained answer is La cita es el viernes. Do not change the referent.",
    hints: spanish,
  },
  {
    id: "WD-T05-E06",
    mode: "sentence",
    prompt:
      "An appointment is on Friday. Express this fact naturally in Spanish. Use the words you know.",
    answer: "La cita es el viernes.",
    constraints: ["Uses viernes for Friday", "Keeps the fact and the people of the situation"],
    feedback: "Model answer: La cita es el viernes. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T05-V01",
    mode: "cloze",
    prompt: "Pablo comes Friday. Complete only the gap: Pablo viene el ___.",
    answer: "viernes",
    say: "Pablo viene el viernes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T05-V03",
    mode: "cloze",
    prompt: "I have a meeting Friday. Complete only the gap: Tengo una reunión el ___.",
    answer: "viernes",
    say: "Tengo una reunión el viernes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T05-V04",
    mode: "cloze",
    prompt:
      "I have a meeting Friday. Write the full Spanish sentence using exactly this frame: Tengo una reunión el ___.",
    answer: "Tengo una reunión el viernes.",
    say: "Tengo una reunión el viernes.",
    feedback: `${inFrame} Full example: Tengo una reunión el viernes.`,
    hints: spanish,
  },
  {
    id: "WD-T05-V06",
    mode: "cloze",
    prompt:
      "Luis’s course starts Friday. Write the full Spanish sentence using exactly this frame: El curso de Luis empieza el ___.",
    answer: "El curso de Luis empieza el viernes.",
    say: "El curso de Luis empieza el viernes.",
    feedback: `${inFrame} Full example: El curso de Luis empieza el viernes.`,
    hints: spanish,
  },
  {
    id: "WD-T05-V09",
    mode: "cloze",
    prompt: "Pablo has class on Fridays. Complete only the gap: Pablo tiene clase los ___.",
    answer: "viernes",
    say: "Pablo tiene clase los viernes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T05-V10",
    mode: "sentence",
    prompt:
      "Pablo has class on Fridays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Pablo tiene clase los viernes.",
    constraints: [
      "Uses los viernes for every Friday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Pablo tiene clase los viernes. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T05-V12",
    mode: "sentence",
    prompt:
      "I study on Fridays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Estudio los viernes.",
    constraints: [
      "Uses los viernes for every Friday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Estudio los viernes. Other wording can be right too.",
    hints: spanish,
  },
];
