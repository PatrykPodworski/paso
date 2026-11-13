import { type Item, teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// A hundred and more: cien, ciento.
export const m16Items: Item[] = [
  {
    id: "NU-T32-E01",
    mode: "choice",
    instruction: "Choose the number",
    prompt: "ciento uno",
    answer: "101",
    choices: ["11", "110", "101"],
    say: "ciento uno",
    feedback: "ciento uno is 101.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-E02",
    mode: "choice",
    instruction: "Choose the Spanish word",
    prompt: "150",
    answer: "ciento cincuenta",
    choices: ["ciento cincuenta", "cincuenta", "ciento quince"],
    say: "ciento cincuenta",
    feedback: "150 is ciento cincuenta.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-E03",
    mode: "cloze",
    instruction: "Write the number in Spanish words",
    prompt: "120",
    answer: "ciento veinte",
    say: "ciento veinte",
    feedback: "120 is ciento veinte.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-E04",
    mode: "choice",
    instruction: "Choose the number",
    prompt: "ciento noventa y nueve",
    answer: "199",
    choices: ["919", "109", "199"],
    say: "ciento noventa y nueve",
    feedback: "ciento noventa y nueve is 199.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-E05",
    mode: "cloze",
    instruction: "Write the number in Spanish words",
    prompt: "101",
    answer: "ciento uno",
    accepted: ["ciento una"],
    say: "ciento uno",
    feedback: "101 is ciento uno.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-E06",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "The room costs 130 euros a month.",
    prompt: "La habitación cuesta ___ euros al mes.",
    answer: "ciento treinta",
    say: "La habitación cuesta ciento treinta euros al mes.",
    feedback:
      "The room costs 130 euros a month. So: La habitación cuesta ciento treinta euros al mes.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-E07",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "There are 101 houses in the neighbourhood.",
    prompt: "En el barrio hay ___ casas.",
    answer: "ciento una",
    say: "En el barrio hay ciento una casas.",
    feedback: "Before a feminine noun, the hundreds end in -as: En el barrio hay ciento una casas.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-E08",
    mode: "cloze",
    instruction: "Translate into Spanish, with the numbers in words",
    prompt: "The phone costs 199 euros.",
    answer: "El móvil cuesta ciento noventa y nueve euros.",
    accepted: ["El teléfono cuesta ciento noventa y nueve euros."],
    say: "El móvil cuesta ciento noventa y nueve euros.",
    feedback: "One right answer: El móvil cuesta ciento noventa y nueve euros.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-E09",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "The school has 120 chairs.",
    prompt: "La escuela tiene ___ sillas.",
    answer: "ciento veinte",
    say: "La escuela tiene ciento veinte sillas.",
    feedback: "The school has 120 chairs. So: La escuela tiene ciento veinte sillas.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-V01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "La biblioteca tiene ciento quince libros.",
    answer: "The library has 115 books.",
    choices: [
      "The library has 115 books.",
      "The library has 150 books.",
      "The library has 105 books.",
    ],
    say: "La biblioteca tiene ciento quince libros.",
    feedback: "ciento quince is 115: The library has 115 books.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-V02",
    mode: "cloze",
    instruction: "Complete the sequence in words",
    prompt: "cien, ciento uno, ciento dos, ___",
    answer: "ciento tres",
    say: "cien, ciento uno, ciento dos, ciento tres",
    feedback: "Count up by one: cien, ciento uno, ciento dos, ciento tres.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
  {
    id: "NU-T32-V03",
    mode: "cloze",
    instruction: "Complete the sum with the number in words",
    prompt: "Cien más cincuenta son ___.",
    answer: "ciento cincuenta",
    say: "Cien más cincuenta son ciento cincuenta.",
    feedback: "100 + 50 = 150. So: Cien más cincuenta son ciento cincuenta.",
    hints: [
      "cien is exactly 100; from 101 on, say ciento.",
      "Say ciento, then the rest: ciento veinte.",
    ],
  },
];

export const m16: SetLesson = {
  id: "nu-m16",
  title: "A hundred and more",
  subtitle: "cien, ciento",
  recalled: [],
  introduction: teachingCard("NU-M16-INTRO", {
    heading: "New numbers",
    terms: [
      {
        es: "ciento uno",
        meaning: "101",
        example: {
          es: "La habitación cuesta ciento un euros al mes.",
          en: "The room costs 101 euros a month.",
        },
      },
      {
        es: "ciento cincuenta",
        meaning: "150",
        example: {
          es: "La escuela tiene ciento cincuenta sillas.",
          en: "The school has 150 chairs.",
        },
      },
    ],
  }),
  base: [
    "NU-T32-E01",
    "NU-T32-E02",
    "NU-T32-E03",
    "NU-T32-E04",
    "NU-T32-E05",
    "NU-T32-E06",
    "NU-T32-E07",
    "NU-T32-E08",
    "NU-T32-E09",
  ],
  formCards: [
    {
      before: "NU-T32-E07",
      teach: {
        heading: "ciento un, ciento una",
        rule: "From 101 to 199, say ciento and the rest. Before a noun, uno becomes un or una: ciento un euros, ciento una casas.",
        examples: [
          { es: "El móvil cuesta ciento un euros.", en: "The phone costs 101 euros." },
          { es: "La escuela tiene ciento una sillas.", en: "The school has 101 chairs." },
        ],
      },
    },
  ],
  variations: ["NU-T32-V01", "NU-T32-V02", "NU-T32-V03"],
};
