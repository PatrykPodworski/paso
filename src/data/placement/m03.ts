import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// M03: delante de (T06), detrás de (T07) and enfrente de (T14), with three items on unit 1's phrases (X01–X03).
export const m03Items: Item[] = [
  {
    id: "SP-T06-N01",
    mode: "choice",
    instruction: "Choose the English meaning of “delante de”.",
    prompt: "La mochila está delante de la ventana.",
    answer: "in front of",
    choices: ["in front of", "behind", "next to"],
    say: "La mochila está delante de la ventana.",
    feedback:
      "delante de means in front of. You are looking at the window. The backpack is in front of the window.",
    hints: [
      "delante de depends on where you stand.",
      "The thing is closer to you than the other one.",
    ],
  },
  {
    id: "SP-T07-N01",
    mode: "choice",
    instruction: "Choose the English meaning of “detrás de”.",
    prompt: "El billete está detrás de la cama.",
    answer: "behind",
    choices: ["behind", "in front of", "next to"],
    say: "El billete está detrás de la cama.",
    feedback: "detrás de means behind. You are looking at the bed. The ticket is behind the bed.",
    hints: [
      "detrás de is the opposite of delante de.",
      "The thing is farther from you than the other one.",
    ],
  },
  {
    id: "SP-T14-N01",
    mode: "choice",
    instruction: "Choose the English meaning of “enfrente de”.",
    prompt: "La biblioteca está enfrente de la escuela.",
    answer: "opposite",
    choices: ["opposite", "next to", "behind"],
    say: "La biblioteca está enfrente de la escuela.",
    feedback:
      "enfrente de means opposite. The library is opposite the school. They face each other across the street.",
    hints: ["enfrente de is used for buildings across a street.", "The two face each other."],
  },
  {
    id: "SP-T06-N02",
    mode: "cloze",
    instruction: "Write the Spanish phrase. Give the phrase only, not a sentence.",
    prompt: "in front of",
    answer: "delante de",
    say: "delante de",
    feedback: "in front of is delante de. Before el it becomes delante del.",
    hints: ["The phrase for in front of has 2 words and starts with delante.", "It ends with de."],
  },
  {
    id: "SP-T07-N02",
    mode: "cloze",
    instruction: "Write the Spanish phrase. Give the phrase only, not a sentence.",
    prompt: "behind",
    answer: "detrás de",
    say: "detrás de",
    feedback: "behind is detrás de. Before el it becomes detrás del.",
    hints: ["The phrase for behind has 2 words and starts with detrás.", "It ends with de."],
  },
  {
    id: "SP-T14-N02",
    mode: "cloze",
    instruction: "Write the Spanish phrase. Give the phrase only, not a sentence.",
    prompt: "opposite",
    answer: "enfrente de",
    accepted: ["frente a"],
    say: "enfrente de",
    feedback: "opposite is enfrente de. Before el it becomes enfrente del.",
    hints: ["The phrase for opposite has 2 words and starts with enfrente.", "It ends with de."],
  },
  {
    id: "SP-T06-N03",
    mode: "cloze",
    instruction: "Complete the gap. You are looking at the lamp. The cup is in front of the lamp.",
    prompt: "La taza está ___ la lámpara.",
    answer: "delante de",
    say: "La taza está delante de la lámpara.",
    feedback: "Use delante de. delante de means in front of. Before la, de stays on its own.",
    hints: [
      "The phrase for in front of has 2 words and starts with delante.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T07-N03",
    mode: "cloze",
    instruction: "Complete the gap. You are looking at the lamp. The backpack is behind the lamp.",
    prompt: "La mochila está ___ la lámpara.",
    answer: "detrás de",
    say: "La mochila está detrás de la lámpara.",
    feedback: "Use detrás de. detrás de means behind. Before la, de stays on its own.",
    hints: [
      "The phrase for behind has 2 words and starts with detrás.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T14-N03",
    mode: "cloze",
    instruction:
      "Complete the gap. The museum is opposite the office. They face each other across the street.",
    prompt: "El museo está ___ la oficina.",
    answer: "enfrente de",
    accepted: ["frente a"],
    say: "El museo está enfrente de la oficina.",
    feedback: "Use enfrente de. enfrente de means opposite. Before la, de stays on its own.",
    hints: [
      "The phrase for opposite has 2 words and starts with enfrente.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T06-N04",
    mode: "cloze",
    instruction: "Complete the gap. You are looking at the sofa. The book is in front of the sofa.",
    prompt: "El libro está ___ sofá.",
    answer: "delante del",
    say: "El libro está delante del sofá.",
    feedback: "Use delante del. delante del: before el, de + el becomes del.",
    hints: [
      "The phrase for in front of has 2 words and starts with delante.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T07-N04",
    mode: "cloze",
    instruction: "Complete the gap. You are looking at the sofa. The cup is behind the sofa.",
    prompt: "La taza está ___ sofá.",
    answer: "detrás del",
    say: "La taza está detrás del sofá.",
    feedback: "Use detrás del. detrás del: before el, de + el becomes del.",
    hints: [
      "The phrase for behind has 2 words and starts with detrás.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T14-N04",
    mode: "cloze",
    instruction:
      "Complete the gap. The park is opposite the hotel. They face each other across the street.",
    prompt: "El parque está ___ hotel.",
    answer: "enfrente del",
    accepted: ["frente al"],
    say: "El parque está enfrente del hotel.",
    feedback: "Use enfrente del. enfrente del: before el, de + el becomes del.",
    hints: [
      "The phrase for opposite has 2 words and starts with enfrente.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T06-N05",
    mode: "cloze",
    instruction: "Translate into Spanish. You are looking at the door.",
    prompt: "The phone is in front of the door.",
    answer: "El móvil está delante de la puerta.",
    accepted: [
      "El teléfono está delante de la puerta.",
      "El teléfono móvil está delante de la puerta.",
    ],
    say: "El móvil está delante de la puerta.",
    feedback:
      "delante de means in front of. Before la, de stays on its own. Model answer: El móvil está delante de la puerta. Also right: El teléfono está delante de la puerta.",
    hints: [
      "Start with “El móvil está”, then the phrase for in front of.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T07-N05",
    mode: "cloze",
    instruction: "Translate into Spanish. You are looking at the table.",
    prompt: "The book is behind the table.",
    answer: "El libro está detrás de la mesa.",
    say: "El libro está detrás de la mesa.",
    feedback:
      "detrás de means behind. Before la, de stays on its own. Model answer: El libro está detrás de la mesa.",
    hints: [
      "Start with “El libro está”, then the phrase for behind.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T14-N05",
    mode: "cloze",
    instruction:
      "Translate into Spanish. They face each other across the street. Words: theatre = el teatro.",
    prompt: "The theatre is opposite the station.",
    answer: "El teatro está enfrente de la estación.",
    accepted: ["El teatro está frente a la estación."],
    say: "El teatro está enfrente de la estación.",
    feedback:
      "enfrente de means opposite. Before la, de stays on its own. Model answer: El teatro está enfrente de la estación. Also right: El teatro está frente a la estación.",
    hints: [
      "Start with “El teatro está”, then the phrase for opposite.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T06-N06",
    mode: "cloze",
    instruction:
      "Translate into Spanish. You are looking at the cupboard. Words: cupboard = el armario.",
    prompt: "The phone is in front of the cupboard.",
    answer: "El móvil está delante del armario.",
    accepted: [
      "El teléfono está delante del armario.",
      "El teléfono móvil está delante del armario.",
    ],
    say: "El móvil está delante del armario.",
    feedback:
      "delante del: before el, de + el becomes del. Model answer: El móvil está delante del armario. Also right: El teléfono está delante del armario.",
    hints: [
      "Start with “El móvil está”, then the phrase for in front of.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T07-N06",
    mode: "cloze",
    instruction:
      "Translate into Spanish. You are looking at the bench. Words: cup = la taza; bench = el banco.",
    prompt: "The cup is behind the bench.",
    answer: "La taza está detrás del banco.",
    say: "La taza está detrás del banco.",
    feedback:
      "detrás del: before el, de + el becomes del. Model answer: La taza está detrás del banco.",
    hints: [
      "Start with “La taza está”, then the phrase for behind.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T14-N06",
    mode: "cloze",
    instruction:
      "Translate into Spanish. They face each other across the street. Words: pharmacy = la farmacia; bank = el banco.",
    prompt: "The pharmacy is opposite the bank.",
    answer: "La farmacia está enfrente del banco.",
    accepted: ["La farmacia está frente al banco."],
    say: "La farmacia está enfrente del banco.",
    feedback:
      "enfrente del: before el, de + el becomes del. Model answer: La farmacia está enfrente del banco. Also right: La farmacia está frente al banco.",
    hints: [
      "Start with “La farmacia está”, then the phrase for opposite.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T06-N07",
    mode: "choice",
    instruction: "Choose the scene this sentence describes.",
    prompt: "La bolsa está delante de la ventana.",
    answer: "You are looking at the window. The bag is in front of the window.",
    choices: [
      "You are looking at the window. The bag is in front of the window.",
      "You are looking at the window. The bag is behind the window.",
      "The bag is far from the window.",
    ],
    say: "La bolsa está delante de la ventana.",
    feedback: "delante de means in front of.",
    hints: [
      "delante de depends on where you stand.",
      "The thing is closer to you than the other one.",
    ],
  },
  {
    id: "SP-T07-N07",
    mode: "choice",
    instruction: "Choose the scene this sentence describes.",
    prompt: "La bolsa está detrás de la puerta.",
    answer: "You are looking at the door. The bag is behind the door.",
    choices: [
      "You are looking at the door. The bag is behind the door.",
      "You are looking at the door. The bag is in front of the door.",
      "The bag is far from the door.",
    ],
    say: "La bolsa está detrás de la puerta.",
    feedback: "detrás de means behind.",
    hints: [
      "detrás de is the opposite of delante de.",
      "The thing is farther from you than the other one.",
    ],
  },
  {
    id: "SP-T14-N07",
    mode: "choice",
    instruction: "Choose the scene this sentence describes.",
    prompt: "El café está enfrente de la tienda.",
    answer: "The café is opposite the shop. They face each other across the street.",
    choices: [
      "The café is opposite the shop. They face each other across the street.",
      "You are looking at the shop. The café is behind the shop.",
      "The café is right next to the shop.",
    ],
    say: "El café está enfrente de la tienda.",
    feedback: "enfrente de means opposite.",
    hints: ["enfrente de is used for buildings across a street.", "The two face each other."],
  },
  {
    id: "SP-M03-X01",
    mode: "cloze",
    instruction: "Translate into Spanish. Words: ticket = el billete.",
    prompt: "The ticket is on top of the sofa.",
    answer: "El billete está encima del sofá.",
    accepted: ["El billete está sobre el sofá.", "El billete está en el sofá."],
    say: "El billete está encima del sofá.",
    feedback:
      "encima del: before el, de + el becomes del. Model answer: El billete está encima del sofá. Also right: El billete está sobre el sofá.",
    hints: [
      "Start with “El billete está”, then the phrase for on top of or above.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-M03-X02",
    mode: "cloze",
    instruction: "Complete the gap. The book is under the chair.",
    prompt: "El libro está ___ la silla.",
    answer: "debajo de",
    say: "El libro está debajo de la silla.",
    feedback: "Use debajo de. debajo de means under. Before la, de stays on its own.",
    hints: [
      "The phrase for under has 2 words and starts with debajo.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-M03-X03",
    mode: "cloze",
    instruction: "Translate into Spanish. Words: suitcase = la maleta.",
    prompt: "The phone is outside the suitcase.",
    answer: "El móvil está fuera de la maleta.",
    accepted: [
      "El teléfono está fuera de la maleta.",
      "El teléfono móvil está fuera de la maleta.",
    ],
    say: "El móvil está fuera de la maleta.",
    feedback:
      "fuera de means outside. Before la, de stays on its own. Model answer: El móvil está fuera de la maleta. Also right: El teléfono está fuera de la maleta.",
    hints: [
      "Start with “El móvil está”, then the phrase for outside.",
      "la follows, so de stays on its own: de la.",
    ],
  },
];

export const m03: SetLesson = {
  id: "pl-m03",
  title: "In front, behind and opposite",
  subtitle: "delante de, detrás de and enfrente de",
  recalled: [],
  introduction: teachingCard("SP-M03-INTRO", {
    heading: "New phrases",
    terms: [
      {
        es: "delante de",
        meaning: "in front of",
        example: {
          es: "El libro está delante de la lámpara.",
          en: "The book is in front of the lamp.",
        },
      },
      {
        es: "detrás de",
        meaning: "behind",
        example: { es: "El móvil está detrás de la lámpara.", en: "The phone is behind the lamp." },
        note: "Front and behind depend on where you stand: the instructions always say it.",
      },
      {
        es: "enfrente de",
        meaning: "opposite",
        example: {
          es: "La farmacia está enfrente de la tienda.",
          en: "The pharmacy is opposite the shop.",
        },
      },
    ],
  }),
  base: [
    "SP-T06-N01",
    "SP-T07-N01",
    "SP-T14-N01",
    "SP-T06-N02",
    "SP-T07-N02",
    "SP-T14-N02",
    "SP-T06-N03",
    "SP-T07-N03",
    "SP-T14-N03",
    "SP-T06-N04",
    "SP-T07-N04",
    "SP-T14-N04",
  ],
  formCards: [
    {
      before: "SP-T06-N04",
      teach: {
        heading: "delante del, detrás del, enfrente del",
        rule: "de + el becomes del, and de + la stays as it is.",
        examples: [
          { es: "La taza está delante de la puerta.", en: "The cup is in front of the door." },
          { es: "La bolsa está delante del banco.", en: "The bag is in front of the bench." },
          { es: "El billete está detrás del armario.", en: "The ticket is behind the cupboard." },
          { es: "El banco está enfrente del café.", en: "The bank is opposite the café." },
        ],
      },
    },
  ],
  variations: [
    "SP-T06-N05",
    "SP-T07-N05",
    "SP-T14-N05",
    "SP-T06-N06",
    "SP-T07-N06",
    "SP-T14-N06",
    "SP-T06-N07",
    "SP-T07-N07",
    "SP-T14-N07",
    "SP-M03-X01",
    "SP-M03-X02",
    "SP-M03-X03",
  ],
};
