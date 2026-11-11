import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// M06: a la izquierda de (T12) and a la derecha de (T13), with three items on pl-m04's and pl-m05's phrases (X01–X03).
export const m06Items: Item[] = [
  {
    id: "SP-T12-N01",
    mode: "choice",
    instruction: "Choose the English meaning of “a la izquierda de”.",
    prompt: "El billete está a la izquierda de la mesa.",
    answer: "to the left of",
    choices: ["to the left of", "to the right of", "behind"],
    say: "El billete está a la izquierda de la mesa.",
    feedback:
      "a la izquierda de means to the left of. You are looking at the ticket and the table. The ticket is to the left of the table.",
    hints: ["a la izquierda de depends on where you stand.", "izquierda means left."],
  },
  {
    id: "SP-T13-N01",
    mode: "choice",
    instruction: "Choose the English meaning of “a la derecha de”.",
    prompt: "La bolsa está a la derecha de la puerta.",
    answer: "to the right of",
    choices: ["to the right of", "to the left of", "in front of"],
    say: "La bolsa está a la derecha de la puerta.",
    feedback:
      "a la derecha de means to the right of. You are looking at the bag and the door. The bag is to the right of the door.",
    hints: ["a la derecha de is the opposite of a la izquierda de.", "derecha means right."],
  },
  {
    id: "SP-T12-N02",
    mode: "cloze",
    instruction: "Write the Spanish phrase. Give the phrase only, not a sentence.",
    prompt: "to the left of",
    answer: "a la izquierda de",
    say: "a la izquierda de",
    feedback: "to the left of is a la izquierda de. Before el it becomes a la izquierda del.",
    hints: ["The phrase for to the left of has 4 words and starts with a.", "It ends with de."],
  },
  {
    id: "SP-T13-N02",
    mode: "cloze",
    instruction: "Write the Spanish phrase. Give the phrase only, not a sentence.",
    prompt: "to the right of",
    answer: "a la derecha de",
    say: "a la derecha de",
    feedback: "to the right of is a la derecha de. Before el it becomes a la derecha del.",
    hints: ["The phrase for to the right of has 4 words and starts with a.", "It ends with de."],
  },
  {
    id: "SP-T12-N03",
    mode: "cloze",
    instruction:
      "Complete the gap. You are looking at the book and the bed. The book is to the left of the bed.",
    prompt: "El libro está ___ la cama.",
    answer: "a la izquierda de",
    say: "El libro está a la izquierda de la cama.",
    feedback:
      "Use a la izquierda de. a la izquierda de means to the left of. Before la, de stays on its own.",
    hints: [
      "The phrase for to the left of has 4 words and starts with a.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T13-N03",
    mode: "cloze",
    instruction:
      "Complete the gap. You are looking at the book and the box. The book is to the right of the box.",
    prompt: "El libro está ___ la caja.",
    answer: "a la derecha de",
    say: "El libro está a la derecha de la caja.",
    feedback:
      "Use a la derecha de. a la derecha de means to the right of. Before la, de stays on its own.",
    hints: [
      "The phrase for to the right of has 4 words and starts with a.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T12-N04",
    mode: "cloze",
    instruction:
      "Complete the gap. You are looking at the ticket and the bench. The ticket is to the left of the bench.",
    prompt: "El billete está ___ banco.",
    answer: "a la izquierda del",
    say: "El billete está a la izquierda del banco.",
    feedback: "Use a la izquierda del. a la izquierda del: before el, de + el becomes del.",
    hints: [
      "The phrase for to the left of has 4 words and starts with a.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T13-N04",
    mode: "cloze",
    instruction:
      "Complete the gap. You are looking at the phone and the cupboard. The phone is to the right of the cupboard.",
    prompt: "El móvil está ___ armario.",
    answer: "a la derecha del",
    say: "El móvil está a la derecha del armario.",
    feedback: "Use a la derecha del. a la derecha del: before el, de + el becomes del.",
    hints: [
      "The phrase for to the right of has 4 words and starts with a.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T12-N05",
    mode: "cloze",
    instruction: "Translate into Spanish. You are looking at the phone and the chair.",
    prompt: "The phone is to the left of the chair.",
    answer: "El móvil está a la izquierda de la silla.",
    accepted: [
      "El teléfono está a la izquierda de la silla.",
      "El teléfono móvil está a la izquierda de la silla.",
    ],
    say: "El móvil está a la izquierda de la silla.",
    feedback:
      "a la izquierda de means to the left of. Before la, de stays on its own. Model answer: El móvil está a la izquierda de la silla. Also right: El teléfono está a la izquierda de la silla.",
    hints: [
      "Start with “El móvil está”, then the phrase for to the left of.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T13-N05",
    mode: "cloze",
    instruction:
      "Translate into Spanish. You are looking at the backpack and the lamp. Words: backpack = la mochila.",
    prompt: "The backpack is to the right of the lamp.",
    answer: "La mochila está a la derecha de la lámpara.",
    say: "La mochila está a la derecha de la lámpara.",
    feedback:
      "a la derecha de means to the right of. Before la, de stays on its own. Model answer: La mochila está a la derecha de la lámpara.",
    hints: [
      "Start with “La mochila está”, then the phrase for to the right of.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-T12-N06",
    mode: "cloze",
    instruction:
      "Translate into Spanish. You are looking at the backpack and the sofa. Words: backpack = la mochila.",
    prompt: "The backpack is to the left of the sofa.",
    answer: "La mochila está a la izquierda del sofá.",
    say: "La mochila está a la izquierda del sofá.",
    feedback:
      "a la izquierda del: before el, de + el becomes del. Model answer: La mochila está a la izquierda del sofá.",
    hints: [
      "Start with “La mochila está”, then the phrase for to the left of.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T13-N06",
    mode: "cloze",
    instruction:
      "Translate into Spanish. You are looking at the bag and the cupboard. Words: bag = la bolsa; cupboard = el armario.",
    prompt: "The bag is to the right of the cupboard.",
    answer: "La bolsa está a la derecha del armario.",
    say: "La bolsa está a la derecha del armario.",
    feedback:
      "a la derecha del: before el, de + el becomes del. Model answer: La bolsa está a la derecha del armario.",
    hints: [
      "Start with “La bolsa está”, then the phrase for to the right of.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-T12-N07",
    mode: "choice",
    instruction: "Choose the scene this sentence describes.",
    prompt: "La taza está a la izquierda de la ventana.",
    answer: "You are looking at the cup and the window. The cup is to the left of the window.",
    choices: [
      "You are looking at the cup and the window. The cup is to the left of the window.",
      "You are looking at the cup and the window. The cup is to the right of the window.",
      "You are looking at the window. The cup is in front of the window.",
    ],
    say: "La taza está a la izquierda de la ventana.",
    feedback: "a la izquierda de means to the left of.",
    hints: ["a la izquierda de depends on where you stand.", "izquierda means left."],
  },
  {
    id: "SP-T13-N07",
    mode: "choice",
    instruction: "Choose the scene this sentence describes.",
    prompt: "La taza está a la derecha de la maleta.",
    answer: "You are looking at the cup and the suitcase. The cup is to the right of the suitcase.",
    choices: [
      "You are looking at the cup and the suitcase. The cup is to the right of the suitcase.",
      "You are looking at the cup and the suitcase. The cup is to the left of the suitcase.",
      "You are looking at the suitcase. The cup is in front of the suitcase.",
    ],
    say: "La taza está a la derecha de la maleta.",
    feedback: "a la derecha de means to the right of.",
    hints: ["a la derecha de is the opposite of a la izquierda de.", "derecha means right."],
  },
  {
    id: "SP-M06-X01",
    mode: "cloze",
    instruction: "Translate into Spanish. Words: ticket = el billete.",
    prompt: "The ticket is near the sofa.",
    answer: "El billete está cerca del sofá.",
    say: "El billete está cerca del sofá.",
    feedback:
      "cerca del: before el, de + el becomes del. Model answer: El billete está cerca del sofá.",
    hints: [
      "Start with “El billete está”, then the phrase for near.",
      "A masculine noun follows, so de + el joins into del.",
    ],
  },
  {
    id: "SP-M06-X02",
    mode: "cloze",
    instruction: "Complete the gap. The book is far from the door.",
    prompt: "El libro está ___ la puerta.",
    answer: "lejos de",
    say: "El libro está lejos de la puerta.",
    feedback: "Use lejos de. lejos de means far from. Before la, de stays on its own.",
    hints: [
      "The phrase for far from has 2 words and starts with lejos.",
      "la follows, so de stays on its own: de la.",
    ],
  },
  {
    id: "SP-M06-X03",
    mode: "cloze",
    instruction: "Translate into Spanish.",
    prompt: "The phone is right next to the table.",
    answer: "El móvil está al lado de la mesa.",
    accepted: [
      "El teléfono está al lado de la mesa.",
      "El teléfono móvil está al lado de la mesa.",
      "El móvil está junto a la mesa.",
      "El teléfono está junto a la mesa.",
      "El teléfono móvil está junto a la mesa.",
    ],
    say: "El móvil está al lado de la mesa.",
    feedback:
      "al lado de means next to. Before la, de stays on its own. Model answer: El móvil está al lado de la mesa. Also right: El teléfono está al lado de la mesa.",
    hints: [
      "Start with “El móvil está”, then the phrase for next to.",
      "la follows, so de stays on its own: de la.",
    ],
  },
];

export const m06: SetLesson = {
  id: "pl-m06",
  title: "Left and right",
  subtitle: "a la izquierda de and a la derecha de",
  recalled: [],
  introduction: teachingCard(
    "SP-M06-INTRO",
    "New phrases: a la izquierda de and a la derecha de",
    "a la izquierda de means to the left of: El libro está a la izquierda de la lámpara. a la derecha de means to the right of: El móvil está a la derecha de la caja. Front, behind, left and right depend on where you stand: the instructions always say it.",
  ),
  base: [
    "SP-T12-N01",
    "SP-T13-N01",
    "SP-T12-N02",
    "SP-T13-N02",
    "SP-T12-N03",
    "SP-T13-N03",
    "SP-T12-N04",
    "SP-T13-N04",
  ],
  formCards: [
    {
      before: "SP-T12-N04",
      heading: "a la izquierda del, a la derecha del",
      text: "Before la, de stays on its own: La mochila está a la izquierda de la maleta. Before el, de + el becomes del: La taza está a la izquierda del armario. La bolsa está a la derecha del sofá.",
    },
  ],
  variations: [
    "SP-T12-N05",
    "SP-T13-N05",
    "SP-T12-N06",
    "SP-T13-N06",
    "SP-T12-N07",
    "SP-T13-N07",
    "SP-M06-X01",
    "SP-M06-X02",
    "SP-M06-X03",
  ],
};

export const mr03: SetLesson = {
  id: "pl-mr03",
  title: "Unit review",
  subtitle: "Review this unit's lessons",
  recalled: [],
  base: [
    "SP-T10-N04",
    "SP-T11-N04",
    "SP-T12-N04",
    "SP-T13-N04",
    "SP-T10-N05",
    "SP-T11-N05",
    "SP-T12-N05",
    "SP-T13-N05",
  ],
  formCards: [],
  variations: [],
};
