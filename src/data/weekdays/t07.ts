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
    instruction: "Choose the English meaning",
    prompt: "domingo",
    answer: "Sunday",
    choices: ["Sunday", "Saturday", "Monday"],
    say: "domingo",
    feedback: "domingo means Sunday.",
    hints: meaning,
  },
  {
    id: "WD-T07-E02",
    mode: "cloze",
    instruction: "Write the English meaning",
    prompt: "domingo",
    answer: "Sunday",
    say: "domingo",
    feedback: "domingo means Sunday.",
    hints: meaning,
  },
  {
    id: "WD-T07-E03",
    mode: "cloze",
    instruction: "Write the Spanish word. One word, not a sentence.",
    prompt: "Sunday",
    answer: "domingo",
    say: "domingo",
    feedback: "Use domingo.",
    hints: spanish,
  },
  {
    id: "WD-T07-E04",
    mode: "cloze",
    instruction: "Complete the gap. The displayed calendar says Sunday.",
    prompt: "Hoy es ___.",
    answer: "domingo",
    say: "Hoy es domingo.",
    feedback: "Use domingo; keep the stated person, object, date, and grammatical frame.",
    hints: spanish,
  },
  {
    id: "WD-T07-N01",
    mode: "cloze",
    instruction: "Translate into Spanish",
    prompt: "My father works on Sunday.",
    answer: "Mi padre trabaja el domingo.",
    accepted: ["El domingo mi padre trabaja."],
    say: "Mi padre trabaja el domingo.",
    feedback: "Mi padre trabaja el domingo. Use el domingo for one Sunday.",
    hints: spanish,
  },
  {
    id: "WD-T07-N02",
    mode: "cloze",
    instruction: "Translate into Spanish",
    prompt: "My family has breakfast at home every Sunday.",
    answer: "Mi familia desayuna en casa los domingos.",
    accepted: [
      "Mi familia desayuna los domingos en casa.",
      "Los domingos mi familia desayuna en casa.",
      "Mi familia desayuna en casa todos los domingos.",
      "Mi familia desayuna todos los domingos en casa.",
      "Todos los domingos mi familia desayuna en casa.",
      "Mi familia desayuna en casa cada domingo.",
      "Mi familia desayuna cada domingo en casa.",
      "Cada domingo mi familia desayuna en casa.",
    ],
    say: "Mi familia desayuna en casa los domingos.",
    feedback:
      "Mi familia desayuna en casa los domingos. Use los domingos for every Sunday; todos los domingos and cada domingo are right too.",
    hints: everySunday,
  },
  {
    id: "WD-T07-V01",
    mode: "cloze",
    instruction: "Complete the gap. Pablo’s visit is Sunday.",
    prompt: "La visita de Pablo es el ___.",
    answer: "domingo",
    say: "La visita de Pablo es el domingo.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T07-N04",
    mode: "cloze",
    instruction: "Translate into Spanish",
    prompt: "Pablo has class on Sunday.",
    answer: "Pablo tiene clase el domingo.",
    accepted: [
      "El domingo Pablo tiene clase.",
      "Pablo tiene una clase el domingo.",
      "El domingo Pablo tiene una clase.",
    ],
    say: "Pablo tiene clase el domingo.",
    feedback: "Pablo tiene clase el domingo. Use el domingo for one Sunday.",
    hints: spanish,
  },
  {
    id: "WD-T07-V07",
    mode: "cloze",
    instruction: "Complete the gap. Your appointment is Sunday.",
    prompt: "Tu cita es el ___.",
    answer: "domingo",
    say: "Tu cita es el domingo.",
    feedback: inFrame,
    hints: spanish,
  },
  {
    id: "WD-T07-V09",
    mode: "cloze",
    instruction: "Complete the gap. Luis works on Sundays.",
    prompt: "Luis trabaja los ___.",
    answer: "domingos",
    say: "Luis trabaja los domingos.",
    feedback: inFrameEvery,
    hints: everySunday,
  },
  {
    id: "WD-T07-N07",
    mode: "cloze",
    instruction: "Translate into Spanish",
    prompt: "My grandmother is at home every Sunday.",
    answer: "Mi abuela está en casa los domingos.",
    accepted: [
      "Mi abuela está los domingos en casa.",
      "Los domingos mi abuela está en casa.",
      "Mi abuela está en casa todos los domingos.",
      "Mi abuela está todos los domingos en casa.",
      "Todos los domingos mi abuela está en casa.",
      "Mi abuela está en casa cada domingo.",
      "Mi abuela está cada domingo en casa.",
      "Cada domingo mi abuela está en casa.",
    ],
    say: "Mi abuela está en casa los domingos.",
    feedback:
      "Mi abuela está en casa los domingos. Use los domingos for every Sunday; todos los domingos and cada domingo are right too.",
    hints: everySunday,
  },
  {
    id: "WD-T07-N08",
    mode: "cloze",
    instruction: "Translate into Spanish. You are speaking to a friend.",
    prompt: "You work every Sunday.",
    answer: "Trabajas los domingos.",
    accepted: [
      "Los domingos trabajas.",
      "Trabajas todos los domingos.",
      "Todos los domingos trabajas.",
      "Trabajas cada domingo.",
      "Cada domingo trabajas.",
      "Tú trabajas los domingos.",
      "Los domingos tú trabajas.",
      "Tú trabajas todos los domingos.",
      "Todos los domingos tú trabajas.",
      "Tú trabajas cada domingo.",
      "Cada domingo tú trabajas.",
    ],
    say: "Trabajas los domingos.",
    feedback:
      "Trabajas los domingos. Use los domingos for every Sunday; todos los domingos and cada domingo are right too.",
    hints: everySunday,
  },
];
