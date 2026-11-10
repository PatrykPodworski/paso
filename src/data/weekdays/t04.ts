import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T04, jueves: Thursday, the fourth day of the Spanish week.
const meaning: [string, string] = [
  "jueves comes from Júpiter, Jupiter.",
  "It is day 4 of the Spanish week, which starts on Monday.",
];

const spanish: [string, string] = [
  "Thursday is named after Júpiter, Jupiter.",
  "It starts with ju-.",
];

const inFrame =
  "Use jueves in this frame. Keep the stated calendar label; do not use the current real date.";

export const t04Items: Item[] = [
  {
    id: "WD-T04-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “jueves”.",
    answer: "Thursday",
    choices: ["Thursday", "Wednesday", "Friday"],
    say: "jueves",
    feedback: "jueves means Thursday.",
    hints: meaning,
  },
  {
    id: "WD-T04-E02",
    mode: "cloze",
    prompt: "Write the English meaning of the Spanish word “jueves”.",
    answer: "Thursday",
    say: "jueves",
    feedback: "jueves means Thursday.",
    hints: meaning,
  },
  {
    id: "WD-T04-E03",
    mode: "cloze",
    prompt: "Write the Spanish dictionary form for “Thursday”. Give one word, not a sentence.",
    answer: "jueves",
    say: "jueves",
    feedback: "Use jueves.",
    hints: spanish,
  },
  {
    id: "WD-T04-E04",
    mode: "cloze",
    prompt: "A visit is scheduled for Thursday. Complete only the gap: La visita es el ___.",
    answer: "jueves",
    say: "La visita es el jueves.",
    feedback: "Use jueves; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T04-E05",
    mode: "cloze",
    prompt:
      "A visit is scheduled for Thursday. Write the full Spanish sentence using exactly this frame: La visita es el ___.",
    answer: "La visita es el jueves.",
    say: "La visita es el jueves.",
    feedback:
      "The complete constrained answer is La visita es el jueves. Do not change the referent.",
    hints: spanish,
  },
  {
    id: "WD-T04-E06",
    mode: "sentence",
    prompt:
      "A visit is scheduled for Thursday. Express this fact naturally in Spanish. Use the words you know.",
    answer: "La visita es el jueves.",
    constraints: ["Uses jueves for Thursday", "Keeps the fact and the people of the situation"],
    feedback: "Model answer: La visita es el jueves. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T04-V01",
    mode: "cloze",
    prompt: "Pablo’s appointment is Thursday. Complete only the gap: La cita de Pablo es el ___.",
    answer: "jueves",
    say: "La cita de Pablo es el jueves.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T04-V02",
    mode: "cloze",
    prompt:
      "Pablo’s appointment is Thursday. Write the full Spanish sentence using exactly this frame: La cita de Pablo es el ___.",
    answer: "La cita de Pablo es el jueves.",
    say: "La cita de Pablo es el jueves.",
    feedback: `${inFrame} Full example: La cita de Pablo es el jueves.`,
    hints: spanish,
  },
  {
    id: "WD-T04-V03",
    mode: "cloze",
    prompt: "I have class Thursday. Complete only the gap: Tengo clase el ___.",
    answer: "jueves",
    say: "Tengo clase el jueves.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T04-V04",
    mode: "cloze",
    prompt:
      "I have class Thursday. Write the full Spanish sentence using exactly this frame: Tengo clase el ___.",
    answer: "Tengo clase el jueves.",
    say: "Tengo clase el jueves.",
    feedback: `${inFrame} Full example: Tengo clase el jueves.`,
    hints: spanish,
  },
  {
    id: "WD-T04-V05",
    mode: "cloze",
    prompt: "Luis has a meeting Thursday. Complete only the gap: Luis tiene una reunión el ___.",
    answer: "jueves",
    say: "Luis tiene una reunión el jueves.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T04-V06",
    mode: "cloze",
    prompt:
      "Luis has a meeting Thursday. Write the full Spanish sentence using exactly this frame: Luis tiene una reunión el ___.",
    answer: "Luis tiene una reunión el jueves.",
    say: "Luis tiene una reunión el jueves.",
    feedback: `${inFrame} Full example: Luis tiene una reunión el jueves.`,
    hints: spanish,
  },
  {
    id: "WD-T04-V07",
    mode: "cloze",
    prompt: "Your course starts Thursday. Complete only the gap: Tu curso empieza el ___.",
    answer: "jueves",
    say: "Tu curso empieza el jueves.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T04-V08",
    mode: "cloze",
    prompt:
      "Your course starts Thursday. Write the full Spanish sentence using exactly this frame: Tu curso empieza el ___.",
    answer: "Tu curso empieza el jueves.",
    say: "Tu curso empieza el jueves.",
    feedback: `${inFrame} Full example: Tu curso empieza el jueves.`,
    hints: spanish,
  },
  {
    id: "WD-T04-V09",
    mode: "cloze",
    prompt: "Pablo works on Thursdays. Complete only the gap: Pablo trabaja los ___.",
    answer: "jueves",
    say: "Pablo trabaja los jueves.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T04-V10",
    mode: "sentence",
    prompt:
      "Pablo works on Thursdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "Pablo trabaja los jueves.",
    constraints: [
      "Uses los jueves for every Thursday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: Pablo trabaja los jueves. Other wording can be right too.",
    hints: spanish,
  },
  {
    id: "WD-T04-V11",
    mode: "cloze",
    prompt: "The museum opens on Thursdays. Complete only the gap: El museo abre los ___.",
    answer: "jueves",
    say: "El museo abre los jueves.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T04-V12",
    mode: "sentence",
    prompt:
      "The museum opens on Thursdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
    answer: "El museo abre los jueves.",
    constraints: [
      "Uses los jueves for every Thursday",
      "Keeps the fact and the people of the situation",
    ],
    feedback: "Model answer: El museo abre los jueves. Other wording can be right too.",
    hints: spanish,
  },
];

const t04Introduction = teachingCard(
  "WD-T04-INTRO",
  "New day: jueves",
  "jueves means Thursday. It comes from Júpiter, Jupiter. Example: La visita es el jueves.",
);

const variations = t04Items.map((i) => i.id).filter((id) => id.startsWith("WD-T04-V"));

export const l04: SetLesson = {
  id: "wd-l04",
  title: "Thursday",
  subtitle: "Learn one new day",
  recalled: ["WD-T03-V04"],
  introduction: t04Introduction,
  base: ["WD-T04-E01", "WD-T04-E02", "WD-T04-E03", "WD-T04-E04", "WD-T04-E05", "WD-T04-E06"],
  formCards: [
    {
      before: "WD-T04-E04",
      heading: "el jueves, los jueves",
      text: "el jueves is one Thursday. los jueves is every Thursday: the word stays the same. Days are written in lowercase.",
    },
  ],
  variations,
};
