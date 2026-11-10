import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T01, lunes: Monday, the first day of the Spanish week.
const meaning: [string, string] = [
  "lunes comes from la Luna, the Moon.",
  "It is day 1 of the Spanish week, which starts on Monday.",
];

const spanish: [string, string] = [
  "Monday is named after la Luna, the Moon.",
  "It starts with lu-.",
];

const inFrame =
  "Use lunes in this frame. Keep the stated calendar label; do not use the current real date.";

export const t01Items: Item[] = [
  {
    id: "WD-T01-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “lunes”.",
    answer: "Monday",
    choices: ["Monday", "Sunday", "Tuesday"],
    say: "lunes",
    feedback: "lunes means Monday.",
    hints: meaning,
  },
  {
    id: "WD-T01-E02",
    mode: "cloze",
    prompt: "Write the English meaning of the Spanish word “lunes”.",
    answer: "Monday",
    say: "lunes",
    feedback: "lunes means Monday.",
    hints: meaning,
  },
  {
    id: "WD-T01-E03",
    mode: "cloze",
    prompt: "Write the Spanish dictionary form for “Monday”. Give one word, not a sentence.",
    answer: "lunes",
    say: "lunes",
    feedback: "Use lunes.",
    hints: spanish,
  },
  {
    id: "WD-T01-E04",
    mode: "cloze",
    prompt:
      "A displayed calendar says Monday, not the actual date. Complete only the gap: Hoy es ___.",
    answer: "lunes",
    say: "Hoy es lunes.",
    feedback: "Use lunes; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T01-E05",
    mode: "cloze",
    prompt:
      "A displayed calendar says Monday, not the actual date. Write the full Spanish sentence using exactly this frame: Hoy es ___.",
    answer: "Hoy es lunes.",
    say: "Hoy es lunes.",
    feedback: "The complete constrained answer is Hoy es lunes. Do not change the referent.",
    hints: spanish,
  },
  {
    id: "WD-T01-E06",
    mode: "sentence",
    prompt:
      "A displayed calendar says Monday, not the actual date. Express this fact naturally in Spanish. Use the words you know.",
    answer: "Hoy es lunes.",
    constraints: ["Uses lunes for Monday", "Keeps the fact and the people of the situation"],
    feedback: "Model answer: Hoy es lunes. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T01-V01",
    mode: "cloze",
    prompt: "Pablo has class on Monday. Complete only the gap: Pablo tiene clase el ___.",
    answer: "lunes",
    say: "Pablo tiene clase el lunes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T01-V02",
    mode: "cloze",
    prompt:
      "Pablo has class on Monday. Write the full Spanish sentence using exactly this frame: Pablo tiene clase el ___.",
    answer: "Pablo tiene clase el lunes.",
    say: "Pablo tiene clase el lunes.",
    feedback: `${inFrame} Full example: Pablo tiene clase el lunes.`,
    hints: spanish,
  },
  {
    id: "WD-T01-V03",
    mode: "cloze",
    prompt: "I work on Monday this week. Complete only the gap: Trabajo el ___.",
    answer: "lunes",
    say: "Trabajo el lunes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T01-V04",
    mode: "cloze",
    prompt:
      "I work on Monday this week. Write the full Spanish sentence using exactly this frame: Trabajo el ___.",
    answer: "Trabajo el lunes.",
    say: "Trabajo el lunes.",
    feedback: `${inFrame} Full example: Trabajo el lunes.`,
    hints: spanish,
  },
  {
    id: "WD-T01-V05",
    mode: "cloze",
    prompt: "Luis has an appointment on Monday. Complete only the gap: Luis tiene una cita el ___.",
    answer: "lunes",
    say: "Luis tiene una cita el lunes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T01-V06",
    mode: "cloze",
    prompt:
      "Luis has an appointment on Monday. Write the full Spanish sentence using exactly this frame: Luis tiene una cita el ___.",
    answer: "Luis tiene una cita el lunes.",
    say: "Luis tiene una cita el lunes.",
    feedback: `${inFrame} Full example: Luis tiene una cita el lunes.`,
    hints: spanish,
  },
  {
    id: "WD-T01-V07",
    mode: "cloze",
    prompt: "You visit on Monday. Complete only the gap: Tu visita es el ___.",
    answer: "lunes",
    say: "Tu visita es el lunes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T01-V08",
    mode: "cloze",
    prompt:
      "You visit on Monday. Write the full Spanish sentence using exactly this frame: Tu visita es el ___.",
    answer: "Tu visita es el lunes.",
    say: "Tu visita es el lunes.",
    feedback: `${inFrame} Full example: Tu visita es el lunes.`,
    hints: spanish,
  },
  {
    id: "WD-T01-V09",
    mode: "cloze",
    prompt: "The course starts on Mondays. Complete only the gap: El curso empieza los ___.",
    answer: "lunes",
    say: "El curso empieza los lunes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T01-V10",
    mode: "sentence",
    prompt:
      "The course starts on Mondays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "El curso empieza los lunes.",
    constraints: [
      "Uses los lunes for every Monday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: El curso empieza los lunes. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T01-V11",
    mode: "cloze",
    prompt: "The museum opens on Mondays. Complete only the gap: El museo abre los ___.",
    answer: "lunes",
    say: "El museo abre los lunes.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T01-V12",
    mode: "sentence",
    prompt:
      "The museum opens on Mondays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "El museo abre los lunes.",
    constraints: [
      "Uses los lunes for every Monday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: El museo abre los lunes. Other wording can be right too.",
    hints: spanish,
  },
];

const t01Introduction = teachingCard(
  "WD-T01-INTRO",
  "New day: lunes",
  "lunes means Monday. It comes from la Luna, the Moon. Example: Hoy es lunes.",
);

const variations = t01Items.map((i) => i.id).filter((id) => id.startsWith("WD-T01-V"));

export const l01: SetLesson = {
  id: "wd-l01",
  title: "Monday",
  subtitle: "Learn one new day",
  recalled: [],
  introduction: t01Introduction,
  base: ["WD-T01-E01", "WD-T01-E02", "WD-T01-E03", "WD-T01-E04", "WD-T01-E05", "WD-T01-E06"],
  formCards: [
    {
      before: "WD-T01-E04",
      heading: "el lunes, los lunes",
      text: "el lunes is one Monday. los lunes is every Monday: the word stays the same. Days are written in lowercase.",
    },
  ],
  variations,
};
