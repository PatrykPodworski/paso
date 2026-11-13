import { type Item, teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// A million: un millón, dos millones.
export const m22Items: Item[] = [
  {
    id: "NU-T37-X01",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "The phone costs 1300 euros.",
    prompt: "El móvil cuesta ___ euros.",
    answer: "mil trescientos",
    say: "El móvil cuesta mil trescientos euros.",
    feedback: "The phone costs 1300 euros. So: El móvil cuesta mil trescientos euros.",
    hints: [
      "Say mil, then the hundreds, then the rest.",
      "The hundreds agree with a feminine noun: dos mil doscientas casas.",
    ],
  },
  {
    id: "NU-T38-E01",
    mode: "choice",
    instruction: "Choose the number",
    prompt: "un millón",
    answer: "1 000 000",
    choices: ["100 000", "1 000 000", "10 000"],
    say: "un millón",
    feedback: "un millón is 1 000 000.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-E02",
    mode: "choice",
    instruction: "Choose the Spanish word",
    prompt: "2 000 000",
    answer: "dos millones",
    choices: ["dos millones", "dos mil", "doscientos mil"],
    say: "dos millones",
    feedback: "2 000 000 is dos millones.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-E03",
    mode: "choice",
    instruction: "Choose the number",
    prompt: "dos millones",
    answer: "2 000 000",
    choices: ["2 000 000", "200 000", "20 000"],
    say: "dos millones",
    feedback: "dos millones is 2 000 000.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-E04",
    mode: "cloze",
    instruction: "Write the number in Spanish words",
    prompt: "1 000 000",
    answer: "un millón",
    say: "un millón",
    feedback: "1 000 000 is un millón.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-E05",
    mode: "cloze",
    instruction: "Write the number in Spanish words",
    prompt: "3 000 000",
    answer: "tres millones",
    say: "tres millones",
    feedback: "3 000 000 is tres millones.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-E06",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "The house costs 1 000 000 euros.",
    prompt: "La casa cuesta ___ de euros.",
    answer: "un millón",
    say: "La casa cuesta un millón de euros.",
    feedback: "The house costs 1 000 000 euros. So: La casa cuesta un millón de euros.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-E07",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "The library has 2 000 000 books.",
    prompt: "La biblioteca tiene ___ de libros.",
    answer: "dos millones",
    say: "La biblioteca tiene dos millones de libros.",
    feedback: "The library has 2 000 000 books. So: La biblioteca tiene dos millones de libros.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-E08",
    mode: "cloze",
    instruction: "Translate into Spanish, with the numbers in words",
    prompt: "The flat costs 1 500 000 euros.",
    answer: "El piso cuesta un millón quinientos mil euros.",
    say: "El piso cuesta un millón quinientos mil euros.",
    feedback: "One right answer: El piso cuesta un millón quinientos mil euros.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-E09",
    mode: "cloze",
    instruction: "Translate into Spanish, with the numbers in words",
    prompt: "The house costs 3 000 000 euros.",
    answer: "La casa cuesta tres millones de euros.",
    say: "La casa cuesta tres millones de euros.",
    feedback: "One right answer: La casa cuesta tres millones de euros.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-V01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "La biblioteca tiene un millón de libros.",
    answer: "The library has 1 000 000 books.",
    choices: [
      "The library has 1000 books.",
      "The library has 1 000 000 books.",
      "The library has 100 000 books.",
    ],
    say: "La biblioteca tiene un millón de libros.",
    feedback: "un millón is 1 000 000: The library has 1 000 000 books.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-V02",
    mode: "cloze",
    instruction: "Complete the sum with the number in words",
    prompt: "Quinientos mil más quinientos mil son ___.",
    answer: "un millón",
    say: "Quinientos mil más quinientos mil son un millón.",
    feedback: "500 000 + 500 000 = 1 000 000. So: Quinientos mil más quinientos mil son un millón.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
  {
    id: "NU-T38-V03",
    mode: "cloze",
    instruction: "Complete the sequence in words",
    prompt: "un millón, dos millones, tres millones, ___",
    answer: "cuatro millones",
    say: "un millón, dos millones, tres millones, cuatro millones",
    feedback: "Count up by a million: un millón, dos millones, tres millones, cuatro millones.",
    hints: [
      "1 000 000 is un millón; 2 000 000 is dos millones.",
      "Before a noun, millón takes de: un millón de euros.",
    ],
  },
];

export const m22: SetLesson = {
  id: "nu-m22",
  title: "A million",
  subtitle: "un millón, dos millones",
  recalled: [],
  introduction: teachingCard("NU-M22-INTRO", {
    heading: "New numbers",
    terms: [
      {
        es: "un millón",
        meaning: "1 000 000",
        example: {
          es: "El piso cuesta un millón de euros.",
          en: "The flat costs 1 000 000 euros.",
        },
      },
      {
        es: "dos millones",
        meaning: "2 000 000",
        example: {
          es: "La casa cuesta dos millones de euros.",
          en: "The house costs 2 000 000 euros.",
        },
      },
    ],
  }),
  base: [
    "NU-T38-E01",
    "NU-T38-E02",
    "NU-T38-E03",
    "NU-T38-E04",
    "NU-T38-E05",
    "NU-T38-E06",
    "NU-T38-E07",
    "NU-T38-E08",
    "NU-T38-E09",
  ],
  formCards: [
    {
      before: "NU-T38-E06",
      teach: {
        heading: "un millón de",
        rule: "Before a noun, millón and millones take de: un millón de euros. With more numbers after them, no de: un millón quinientos mil euros.",
        examples: [
          { es: "El piso cuesta dos millones de euros.", en: "The flat costs 2 000 000 euros." },
          {
            es: "La casa cuesta un millón doscientos mil euros.",
            en: "The house costs 1 200 000 euros.",
          },
        ],
      },
    },
  ],
  variations: ["NU-T38-V01", "NU-T38-V02", "NU-T38-V03", "NU-T37-X01"],
};
