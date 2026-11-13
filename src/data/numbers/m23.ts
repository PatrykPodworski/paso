import { type Item, teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// Years: mil novecientos noventa, dos mil veinticinco.
export const m23Items: Item[] = [
  {
    id: "NU-T39-E01",
    mode: "choice",
    instruction: "Choose the year",
    prompt: "mil novecientos noventa",
    answer: "1990",
    choices: ["1909", "1980", "1990"],
    say: "mil novecientos noventa",
    feedback: "mil novecientos noventa is 1990.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T40-E01",
    mode: "choice",
    instruction: "Choose the Spanish words",
    prompt: "2025",
    answer: "dos mil veinticinco",
    choices: ["dos mil veinte", "dos mil quince", "dos mil veinticinco"],
    say: "dos mil veinticinco",
    feedback: "2025 is dos mil veinticinco.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T39-E02",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "Pablo has lived in Madrid since 1985.",
    prompt: "Pablo vive en Madrid desde ___.",
    answer: "mil novecientos ochenta y cinco",
    say: "Pablo vive en Madrid desde mil novecientos ochenta y cinco.",
    feedback:
      "Pablo has lived in Madrid since 1985. So: Pablo vive en Madrid desde mil novecientos ochenta y cinco.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T40-E02",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "The hotel opens in 2027.",
    prompt: "El hotel abre en ___.",
    answer: "dos mil veintisiete",
    say: "El hotel abre en dos mil veintisiete.",
    feedback: "The hotel opens in 2027. So: El hotel abre en dos mil veintisiete.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T39-E03",
    mode: "cloze",
    instruction: "Write the year in Spanish words",
    prompt: "1975",
    answer: "mil novecientos setenta y cinco",
    say: "mil novecientos setenta y cinco",
    feedback: "1975 is mil novecientos setenta y cinco.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T40-E03",
    mode: "cloze",
    instruction: "Write the year in Spanish words",
    prompt: "2010",
    answer: "dos mil diez",
    say: "dos mil diez",
    feedback: "2010 is dos mil diez.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T39-E04",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "The house is from 1960.",
    prompt: "La casa es de ___.",
    answer: "mil novecientos sesenta",
    say: "La casa es de mil novecientos sesenta.",
    feedback: "The house is from 1960. So: La casa es de mil novecientos sesenta.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T40-E04",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "I have had the phone since 2019.",
    prompt: "Tengo el móvil desde ___.",
    answer: "dos mil diecinueve",
    say: "Tengo el móvil desde dos mil diecinueve.",
    feedback: "I have had the phone since 2019. So: Tengo el móvil desde dos mil diecinueve.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T39-E05",
    mode: "cloze",
    instruction: "Translate into Spanish, with the numbers in words",
    prompt: "My father has lived in Bilbao since 1998.",
    answer: "Mi padre vive en Bilbao desde mil novecientos noventa y ocho.",
    say: "Mi padre vive en Bilbao desde mil novecientos noventa y ocho.",
    feedback: "One right answer: Mi padre vive en Bilbao desde mil novecientos noventa y ocho.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T40-E05",
    mode: "cloze",
    instruction: "Translate into Spanish, with the numbers in words",
    prompt: "The trip is in 2026.",
    answer: "El viaje es en dos mil veintiséis.",
    say: "El viaje es en dos mil veintiséis.",
    feedback: "One right answer: El viaje es en dos mil veintiséis.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T40-E06",
    mode: "choice",
    instruction: "Choose the year",
    prompt: "dos mil dieciocho",
    answer: "2018",
    choices: ["2018", "2080", "2008"],
    say: "dos mil dieciocho",
    feedback: "dos mil dieciocho is 2018.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T39-E06",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "My grandmother has lived in Valencia since 1972.",
    prompt: "Mi abuela vive en Valencia desde ___.",
    answer: "mil novecientos setenta y dos",
    say: "Mi abuela vive en Valencia desde mil novecientos setenta y dos.",
    feedback:
      "My grandmother has lived in Valencia since 1972. So: Mi abuela vive en Valencia desde mil novecientos setenta y dos.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T39-V01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "La casa es de mil novecientos cincuenta.",
    answer: "The house is from 1950.",
    choices: ["The house is from 1950.", "The house is from 1915.", "The house is from 1905."],
    say: "La casa es de mil novecientos cincuenta.",
    feedback: "mil novecientos cincuenta is 1950.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T40-V01",
    mode: "cloze",
    instruction: "Complete the sequence in words",
    prompt: "dos mil veintidós, dos mil veintitrés, dos mil veinticuatro, ___",
    answer: "dos mil veinticinco",
    say: "dos mil veintidós, dos mil veintitrés, dos mil veinticuatro, dos mil veinticinco",
    feedback:
      "Count up by one year: dos mil veintidós, dos mil veintitrés, dos mil veinticuatro, dos mil veinticinco.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
  {
    id: "NU-T40-V02",
    mode: "cloze",
    instruction: "Complete the gap with the number in words",
    context: "My brother is 12 and has lived in Bilbao since 2020.",
    prompt: "Mi hermano tiene doce años y vive en Bilbao desde ___.",
    answer: "dos mil veinte",
    say: "Mi hermano tiene doce años y vive en Bilbao desde dos mil veinte.",
    feedback:
      "My brother is 12 and has lived in Bilbao since 2020. So: Mi hermano tiene doce años y vive en Bilbao desde dos mil veinte.",
    hints: [
      "Read a year as one number: 1990 is mil novecientos noventa.",
      "From 2000 on, say dos mil and the rest: dos mil veinticinco.",
    ],
  },
];

export const m23: SetLesson = {
  id: "nu-m23",
  title: "Years",
  subtitle: "mil novecientos noventa, dos mil veinticinco",
  recalled: [],
  introduction: teachingCard("NU-M23-INTRO", {
    heading: "New numbers",
    terms: [
      {
        es: "mil novecientos noventa",
        meaning: "1990",
        example: {
          es: "Mi abuelo vive en Sevilla desde mil novecientos noventa.",
          en: "My grandfather has lived in Sevilla since 1990.",
        },
      },
      {
        es: "dos mil veinticinco",
        meaning: "2025",
        example: { es: "El hotel abre en dos mil veinticinco.", en: "The hotel opens in 2025." },
      },
    ],
  }),
  base: [
    "NU-T39-E01",
    "NU-T40-E01",
    "NU-T39-E02",
    "NU-T40-E02",
    "NU-T39-E03",
    "NU-T40-E03",
    "NU-T39-E04",
    "NU-T40-E04",
    "NU-T39-E05",
    "NU-T40-E05",
    "NU-T40-E06",
    "NU-T39-E06",
  ],
  formCards: [
    {
      before: "NU-T39-E03",
      teach: {
        heading: "mil novecientos",
        rule: "Read a year as one big number: 1990 is mil novecientos noventa, 2025 is dos mil veinticinco. Never split it in two, as English does.",
        examples: [
          { es: "La casa es de mil novecientos ochenta.", en: "The house is from 1980." },
          { es: "El viaje es en dos mil treinta.", en: "The trip is in 2030." },
        ],
      },
    },
  ],
  variations: ["NU-T39-V01", "NU-T40-V01", "NU-T40-V02"],
};
