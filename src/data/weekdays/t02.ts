import type { Item } from "../practice-sets/item.ts";

// T02, martes: Tuesday, the second day of the Spanish week.
const meaning: [string, string] = [
  "martes comes from Marte, Mars.",
  "It is day 2 of the Spanish week, which starts on Monday.",
];

const spanish: [string, string] = ["Tuesday is named after Marte, Mars.", "It starts with ma-."];

const inFrame =
  "Use martes in this frame. Keep the stated calendar label; do not use the current real date.";

export const t02Items: Item[] = [
  {
    id: "WD-T02-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “martes”.",
    answer: "Tuesday",
    choices: ["Tuesday", "Monday", "Wednesday"],
    say: "martes",
    feedback: "martes means Tuesday.",
    hints: meaning,
  },
  {
    id: "WD-T02-E02",
    mode: "cloze",
    prompt: "Write the English meaning of the Spanish word “martes”.",
    answer: "Tuesday",
    say: "martes",
    feedback: "martes means Tuesday.",
    hints: meaning,
  },
  {
    id: "WD-T02-E03",
    mode: "cloze",
    prompt: "Write the Spanish dictionary form for “Tuesday”. Give one word, not a sentence.",
    answer: "martes",
    say: "martes",
    feedback: "Use martes.",
    hints: spanish,
  },
  {
    id: "WD-T02-E04",
    mode: "cloze",
    prompt:
      "The class date is Tuesday in the displayed plan. Complete only the gap: La clase es el ___.",
    answer: "martes",
    say: "La clase es el martes.",
    feedback: "Use martes; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T02-E05",
    mode: "cloze",
    prompt:
      "The class date is Tuesday in the displayed plan. Write the full Spanish sentence using exactly this frame: La clase es el ___.",
    answer: "La clase es el martes.",
    say: "La clase es el martes.",
    feedback:
      "The complete constrained answer is La clase es el martes. Do not change the referent.",
    hints: spanish,
  },
  {
    id: "WD-T02-E06",
    mode: "sentence",
    prompt:
      "The class date is Tuesday in the displayed plan. Express this fact naturally in Spanish. Use the words you know.",
    answer: "La clase es el martes.",
    constraints: ["Uses martes for Tuesday", "Keeps the fact and the people of the situation"],
    feedback: "Model answer: La clase es el martes. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T02-V01",
    mode: "cloze",
    prompt:
      "Pablo has a meeting on Tuesday. Complete only the gap: Pablo tiene una reunión el ___.",
    answer: "martes",
    say: "Pablo tiene una reunión el martes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T02-V02",
    mode: "cloze",
    prompt:
      "Pablo has a meeting on Tuesday. Write the full Spanish sentence using exactly this frame: Pablo tiene una reunión el ___.",
    answer: "Pablo tiene una reunión el martes.",
    say: "Pablo tiene una reunión el martes.",
    feedback: `${inFrame} Full example: Pablo tiene una reunión el martes.`,
    hints: spanish,
  },
  {
    id: "WD-T02-V03",
    mode: "cloze",
    prompt: "I study on Tuesday. Complete only the gap: Estudio el ___.",
    answer: "martes",
    say: "Estudio el martes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T02-V04",
    mode: "cloze",
    prompt:
      "I study on Tuesday. Write the full Spanish sentence using exactly this frame: Estudio el ___.",
    answer: "Estudio el martes.",
    say: "Estudio el martes.",
    feedback: `${inFrame} Full example: Estudio el martes.`,
    hints: spanish,
  },
  {
    id: "WD-T02-V05",
    mode: "cloze",
    prompt: "Luis comes on Tuesday. Complete only the gap: Luis viene el ___.",
    answer: "martes",
    say: "Luis viene el martes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T02-V10",
    mode: "sentence",
    prompt:
      "I work on Tuesdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Trabajo los martes.",
    constraints: [
      "Uses los martes for every Tuesday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Trabajo los martes. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T02-V11",
    mode: "cloze",
    prompt: "The shop opens on Tuesdays. Complete only the gap: La tienda abre los ___.",
    answer: "martes",
    say: "La tienda abre los martes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T02-V12",
    mode: "sentence",
    prompt:
      "The shop opens on Tuesdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "La tienda abre los martes.",
    constraints: [
      "Uses los martes for every Tuesday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: La tienda abre los martes. Other wording can be right too.",
    hints: spanish,
  },
];
