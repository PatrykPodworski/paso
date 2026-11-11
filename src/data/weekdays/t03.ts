import type { Item } from "../practice-sets/item.ts";

// T03, miércoles: Wednesday, the third day of the Spanish week.
const meaning: [string, string] = [
  "miércoles comes from Mercurio, Mercury.",
  "It is day 3 of the Spanish week, which starts on Monday.",
];

const spanish: [string, string] = [
  "Wednesday is named after Mercurio, Mercury.",
  "It starts with mi- and has an accent on the é.",
];

const inFrame =
  "Use miércoles in this frame. Keep the stated calendar label; do not use the current real date.";

export const t03Items: Item[] = [
  {
    id: "WD-T03-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “miércoles”.",
    answer: "Wednesday",
    choices: ["Wednesday", "Monday", "Tuesday"],
    say: "miércoles",
    feedback: "miércoles means Wednesday.",
    hints: meaning,
  },
  {
    id: "WD-T03-E02",
    mode: "cloze",
    prompt: "Write the English meaning of the Spanish word “miércoles”.",
    answer: "Wednesday",
    say: "miércoles",
    feedback: "miércoles means Wednesday.",
    hints: meaning,
  },
  {
    id: "WD-T03-E03",
    mode: "cloze",
    prompt: "Write the Spanish dictionary form for “Wednesday”. Give one word, not a sentence.",
    answer: "miércoles",
    say: "miércoles",
    feedback: "Use miércoles.",
    hints: spanish,
  },
  {
    id: "WD-T03-E04",
    mode: "cloze",
    prompt: "A meeting is scheduled for Wednesday. Complete only the gap: La reunión es el ___.",
    answer: "miércoles",
    say: "La reunión es el miércoles.",
    feedback: "Use miércoles; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T03-E05",
    mode: "cloze",
    prompt:
      "A meeting is scheduled for Wednesday. Write the full Spanish sentence using exactly this frame: La reunión es el ___.",
    answer: "La reunión es el miércoles.",
    say: "La reunión es el miércoles.",
    feedback:
      "The complete constrained answer is La reunión es el miércoles. Do not change the referent.",
    hints: spanish,
  },
  {
    id: "WD-T03-E06",
    mode: "sentence",
    prompt:
      "A meeting is scheduled for Wednesday. Express this fact naturally in Spanish. Use the words you know.",
    answer: "La reunión es el miércoles.",
    constraints: ["Uses miércoles for Wednesday", "Keeps the fact and the people of the situation"],
    feedback: "Model answer: La reunión es el miércoles. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T03-V01",
    mode: "cloze",
    prompt:
      "Pablo’s course starts Wednesday. Complete only the gap: El curso de Pablo empieza el ___.",
    answer: "miércoles",
    say: "El curso de Pablo empieza el miércoles.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T03-V02",
    mode: "cloze",
    prompt:
      "Pablo’s course starts Wednesday. Write the full Spanish sentence using exactly this frame: El curso de Pablo empieza el ___.",
    answer: "El curso de Pablo empieza el miércoles.",
    say: "El curso de Pablo empieza el miércoles.",
    feedback: `${inFrame} Full example: El curso de Pablo empieza el miércoles.`,
    hints: spanish,
  },
  {
    id: "WD-T03-V03",
    mode: "cloze",
    prompt: "I have an appointment Wednesday. Complete only the gap: Tengo una cita el ___.",
    answer: "miércoles",
    say: "Tengo una cita el miércoles.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T03-V04",
    mode: "cloze",
    prompt:
      "I have an appointment Wednesday. Write the full Spanish sentence using exactly this frame: Tengo una cita el ___.",
    answer: "Tengo una cita el miércoles.",
    say: "Tengo una cita el miércoles.",
    feedback: `${inFrame} Full example: Tengo una cita el miércoles.`,
    hints: spanish,
  },
  {
    id: "WD-T03-V05",
    mode: "cloze",
    prompt: "Luis has class Wednesday. Complete only the gap: Luis tiene clase el ___.",
    answer: "miércoles",
    say: "Luis tiene clase el miércoles.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T03-V10",
    mode: "sentence",
    prompt:
      "I study on Wednesdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Estudio los miércoles.",
    constraints: [
      "Uses los miércoles for every Wednesday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Estudio los miércoles. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T03-V11",
    mode: "cloze",
    prompt:
      "Pablo goes to the museum on Wednesdays. Complete only the gap: Pablo va al museo los ___.",
    answer: "miércoles",
    say: "Pablo va al museo los miércoles.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T03-V12",
    mode: "sentence",
    prompt:
      "Pablo goes to the museum on Wednesdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Pablo va al museo los miércoles.",
    constraints: [
      "Uses los miércoles for every Wednesday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Pablo va al museo los miércoles. Other wording can be right too.",
    hints: spanish,
  },
];
