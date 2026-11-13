import { type Item, teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// Phone numbers: digit by digit and in groups.
export const m27Items: Item[] = [
  {
    id: "NU-T45-X01",
    mode: "cloze",
    instruction: "Complete the gap with the price in words",
    context: "The bus ticket costs 7,25 €.",
    prompt: "El billete de autobús cuesta ___.",
    answer: "siete euros con veinticinco",
    accepted: [
      "siete euros veinticinco",
      "siete euros con veinticinco céntimos",
      "siete euros veinticinco céntimos",
      "siete con veinticinco",
      "siete veinticinco",
    ],
    say: "El billete de autobús cuesta siete euros con veinticinco.",
    feedback:
      "The bus ticket costs 7,25 €. So: El billete de autobús cuesta siete euros con veinticinco.",
    hints: [
      "Say the euros, then con and the cents: tres euros con cincuenta.",
      "Below one euro, say only the cents: cincuenta céntimos.",
    ],
  },
  {
    id: "NU-T47-E01",
    mode: "choice",
    instruction: "Choose the phone number",
    prompt: "Mi teléfono es seis, cuatro, cinco, uno, dos, tres, siete, ocho, nueve.",
    answer: "645 123 789",
    choices: ["654 123 789", "645 127 389", "645 123 789"],
    say: "Mi teléfono es seis, cuatro, cinco, uno, dos, tres, siete, ocho, nueve.",
    feedback:
      "Read digit by digit, seis, cuatro, cinco, uno, dos, tres, siete, ocho, nueve is 645 123 789.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T48-E01",
    mode: "choice",
    instruction: "Choose the phone number",
    prompt:
      "Mi móvil es seiscientos doce, trescientos cuarenta y cinco, setecientos ochenta y nueve.",
    answer: "612 345 789",
    choices: ["621 345 789", "612 345 789", "612 354 789"],
    say: "Mi móvil es seiscientos doce, trescientos cuarenta y cinco, setecientos ochenta y nueve.",
    feedback:
      "Read in groups of three, seiscientos doce, trescientos cuarenta y cinco, setecientos ochenta y nueve is 612 345 789.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T47-E02",
    mode: "cloze",
    instruction: "Complete the phone number digit by digit in words",
    context: "Pablo's phone number is 638 540 217.",
    prompt: "El teléfono de Pablo es seis, tres, ocho, cinco, cuatro, cero, ___.",
    answer: "dos, uno, siete",
    say: "El teléfono de Pablo es seis, tres, ocho, cinco, cuatro, cero, dos, uno, siete.",
    feedback:
      "Pablo's phone number is 638 540 217. So: El teléfono de Pablo es seis, tres, ocho, cinco, cuatro, cero, dos, uno, siete.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T48-E02",
    mode: "choice",
    instruction: "Choose the phone number",
    prompt: "El teléfono del hotel es novecientos quince, cuarenta y dos, treinta y ocho, setenta.",
    answer: "915 42 38 70",
    choices: ["951 42 38 70", "915 43 28 70", "915 42 38 70"],
    say: "El teléfono del hotel es novecientos quince, cuarenta y dos, treinta y ocho, setenta.",
    feedback:
      "Read in pairs after the first three, novecientos quince, cuarenta y dos, treinta y ocho, setenta is 915 42 38 70.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T47-E03",
    mode: "cloze",
    instruction: "Write the phone number digit by digit in words",
    prompt: "655 284 913",
    answer: "seis, cinco, cinco, dos, ocho, cuatro, nueve, uno, tres",
    accepted: ["seiscientos cincuenta y cinco, doscientos ochenta y cuatro, novecientos trece"],
    say: "seis, cinco, cinco, dos, ocho, cuatro, nueve, uno, tres",
    feedback:
      "Digit by digit, 655 284 913 is seis, cinco, cinco, dos, ocho, cuatro, nueve, uno, tres.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T48-E03",
    mode: "choice",
    instruction: "Choose how to say the phone number",
    prompt: "634 21 57 80",
    answer: "seiscientos treinta y cuatro, veintiuno, cincuenta y siete, ochenta",
    choices: [
      "seiscientos treinta y cuatro, doce, cincuenta y siete, ochenta",
      "seiscientos treinta y cuatro, veintiuno, cincuenta y siete, ochenta",
      "seiscientos cuarenta y tres, veintiuno, cincuenta y siete, ochenta",
    ],
    say: "seiscientos treinta y cuatro, veintiuno, cincuenta y siete, ochenta",
    feedback:
      "In pairs after the first three, 634 21 57 80 is seiscientos treinta y cuatro, veintiuno, cincuenta y siete, ochenta.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T47-E04",
    mode: "cloze",
    instruction: "Complete the phone number digit by digit in words",
    context: "Diego's phone number is 687 902 341.",
    prompt: "El teléfono de Diego es seis, ocho, siete, nueve, cero, dos, ___.",
    answer: "tres, cuatro, uno",
    say: "El teléfono de Diego es seis, ocho, siete, nueve, cero, dos, tres, cuatro, uno.",
    feedback:
      "Diego's phone number is 687 902 341. So: El teléfono de Diego es seis, ocho, siete, nueve, cero, dos, tres, cuatro, uno.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T47-E05",
    mode: "cloze",
    instruction: "Translate into Spanish, with the numbers in words",
    prompt: "My phone number is 678 901 234.",
    answer: "Mi teléfono es seis, siete, ocho, nueve, cero, uno, dos, tres, cuatro.",
    accepted: [
      "Mi número es seis, siete, ocho, nueve, cero, uno, dos, tres, cuatro.",
      "Mi número de teléfono es seis, siete, ocho, nueve, cero, uno, dos, tres, cuatro.",
      "Mi teléfono es seiscientos setenta y ocho, novecientos uno, doscientos treinta y cuatro.",
      "Mi número es seiscientos setenta y ocho, novecientos uno, doscientos treinta y cuatro.",
      "Mi número de teléfono es seiscientos setenta y ocho, novecientos uno, doscientos treinta y cuatro.",
      "Mi teléfono es seiscientos setenta y ocho, noventa, doce, treinta y cuatro.",
      "Mi número es seiscientos setenta y ocho, noventa, doce, treinta y cuatro.",
      "Mi número de teléfono es seiscientos setenta y ocho, noventa, doce, treinta y cuatro.",
    ],
    say: "Mi teléfono es seis, siete, ocho, nueve, cero, uno, dos, tres, cuatro.",
    feedback:
      "One right answer: Mi teléfono es seis, siete, ocho, nueve, cero, uno, dos, tres, cuatro.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T48-E04",
    mode: "choice",
    instruction: "Choose the phone number",
    prompt:
      "El teléfono de Diego es seiscientos cincuenta, setecientos treinta y dos, novecientos dieciocho.",
    answer: "650 732 918",
    choices: ["650 732 918", "605 732 918", "650 723 918"],
    say: "El teléfono de Diego es seiscientos cincuenta, setecientos treinta y dos, novecientos dieciocho.",
    feedback:
      "Read in groups of three, seiscientos cincuenta, setecientos treinta y dos, novecientos dieciocho is 650 732 918.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T47-E06",
    mode: "cloze",
    instruction: "Translate into Spanish, with the numbers in words",
    prompt: "Pablo's phone number is 622 813 745.",
    answer: "El teléfono de Pablo es seis, dos, dos, ocho, uno, tres, siete, cuatro, cinco.",
    accepted: [
      "El número de Pablo es seis, dos, dos, ocho, uno, tres, siete, cuatro, cinco.",
      "El teléfono de Pablo es seiscientos veintidós, ochocientos trece, setecientos cuarenta y cinco.",
      "El número de Pablo es seiscientos veintidós, ochocientos trece, setecientos cuarenta y cinco.",
      "El teléfono de Pablo es seiscientos veintidós, ochenta y uno, treinta y siete, cuarenta y cinco.",
      "El número de Pablo es seiscientos veintidós, ochenta y uno, treinta y siete, cuarenta y cinco.",
    ],
    say: "El teléfono de Pablo es seis, dos, dos, ocho, uno, tres, siete, cuatro, cinco.",
    feedback:
      "One right answer: El teléfono de Pablo es seis, dos, dos, ocho, uno, tres, siete, cuatro, cinco.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T47-V01",
    mode: "choice",
    instruction: "Choose the phone number",
    prompt: "Mi móvil es seis, cero, cero, uno, cinco, cuatro, tres, ocho, siete.",
    answer: "600 154 387",
    choices: ["600 154 387", "600 154 837", "600 514 387"],
    say: "Mi móvil es seis, cero, cero, uno, cinco, cuatro, tres, ocho, siete.",
    feedback:
      "Read digit by digit, seis, cero, cero, uno, cinco, cuatro, tres, ocho, siete is 600 154 387.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T48-V01",
    mode: "choice",
    instruction: "Choose the phone number",
    prompt:
      "El teléfono del hotel es novecientos cincuenta y cuatro, trescientos veinte, ciento ochenta.",
    answer: "954 320 180",
    choices: ["945 320 180", "954 302 180", "954 320 180"],
    say: "El teléfono del hotel es novecientos cincuenta y cuatro, trescientos veinte, ciento ochenta.",
    feedback:
      "Read in groups of three, novecientos cincuenta y cuatro, trescientos veinte, ciento ochenta is 954 320 180.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
  {
    id: "NU-T48-V02",
    mode: "choice",
    instruction: "Choose the phone number",
    prompt: "Mi teléfono es seiscientos noventa y ocho, cuarenta y cinco, veintitrés, diecisiete.",
    answer: "698 45 23 17",
    choices: ["698 45 21 37", "698 45 23 17", "698 54 23 17"],
    say: "Mi teléfono es seiscientos noventa y ocho, cuarenta y cinco, veintitrés, diecisiete.",
    feedback:
      "Read in pairs after the first three, seiscientos noventa y ocho, cuarenta y cinco, veintitrés, diecisiete is 698 45 23 17.",
    hints: [
      "Read the number one digit at a time: seis, cuatro, cinco.",
      "People also read it in groups of three or in pairs: seiscientos cuarenta y cinco, treinta y dos.",
    ],
  },
];

export const m27: SetLesson = {
  id: "nu-m27",
  title: "Phone numbers",
  subtitle: "digit by digit and in groups",
  recalled: [],
  introduction: teachingCard("NU-M27-INTRO", {
    heading: "New words",
    terms: [
      {
        es: "seis, cuatro, cinco",
        meaning: "6 4 5, one digit at a time",
        example: {
          es: "Mi teléfono es seis, cuatro, cinco, nueve, ocho, siete, tres, dos, uno.",
          en: "My phone number is 645 987 321.",
        },
      },
      {
        es: "seiscientos cuarenta y cinco",
        meaning: "645, in a group of three",
        example: {
          es: "Mi móvil es seiscientos cuarenta y cinco, novecientos ochenta y siete, trescientos veintiuno.",
          en: "My mobile number is 645 987 321.",
        },
      },
    ],
  }),
  base: [
    "NU-T47-E01",
    "NU-T48-E01",
    "NU-T47-E02",
    "NU-T48-E02",
    "NU-T47-E03",
    "NU-T48-E03",
    "NU-T47-E04",
    "NU-T47-E05",
    "NU-T48-E04",
    "NU-T47-E06",
  ],
  formCards: [
    {
      before: "NU-T48-E02",
      teach: {
        heading: "In groups",
        rule: "Spaniards also read a phone number in groups: 645 321 780 as three numbers, or 645 32 17 80 as one number and three pairs. Digit by digit is always right.",
        examples: [
          {
            es: "Mi número es seiscientos treinta, doscientos diez, cuatrocientos cincuenta.",
            en: "My number is 630 210 450.",
          },
          {
            es: "El teléfono de Luis es seiscientos treinta, veintiuno, cuarenta y tres, cincuenta.",
            en: "Luis's phone number is 630 21 43 50.",
          },
        ],
      },
    },
  ],
  variations: ["NU-T47-V01", "NU-T48-V01", "NU-T48-V02", "NU-T45-X01"],
};
