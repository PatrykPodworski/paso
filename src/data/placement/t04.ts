import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T04, encima de: on top of or above, and encima del before el.
const meaning: [string, string] = [
  "encima de is about height.",
  "The thing is higher than the other one, touching it or not.",
];

const startsWith = "The phrase for on top of or above has 2 words and starts with encima.";

const phrase: [string, string] = [startsWith, "It ends with de."];

const deLa: [string, string] = [startsWith, "la follows, so de stays on its own: de la."];

const del: [string, string] = [
  startsWith,
  "A masculine noun follows without el, so de + el joins into del.",
];

const deLaRule = "encima de means on top of or above. Before la, de stays on its own.";

const delRule = "encima del: before el, de + el becomes del.";

const deLaGap = `Use encima de. ${deLaRule}`;

const delGap = `Use encima del. ${delRule}`;

const points = [
  "Uses encima de for on top of or above",
  "Keeps the things and their places as stated",
];

export const t04Items: Item[] = [
  {
    id: "SP-T04-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “encima de” in: La bolsa está encima de la puerta.",
    answer: "on top of or above",
    choices: ["on top of or above", "under", "inside"],
    say: "La bolsa está encima de la puerta.",
    feedback: "encima de means on top of or above. The bag is above the door, not touching it.",
    hints: meaning,
  },
  {
    id: "SP-T04-E02",
    mode: "cloze",
    prompt:
      "Write the Spanish phrase for “on top of or above”. Give the phrase only, not a sentence.",
    answer: "encima de",
    say: "encima de",
    feedback: "on top of or above is encima de. Before el it becomes encima del.",
    hints: phrase,
  },
  {
    id: "SP-T04-E03",
    mode: "cloze",
    prompt: "The phone is on top of the table. Complete only the gap: El móvil está ___ la mesa.",
    answer: "encima de",
    say: "El móvil está encima de la mesa.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T04-E04",
    mode: "cloze",
    prompt:
      "The phone is on top of the table. Write the full Spanish sentence using exactly this frame: El móvil está ___ la mesa.",
    answer: "El móvil está encima de la mesa.",
    say: "El móvil está encima de la mesa.",
    feedback: `${deLaRule} Full sentence: El móvil está encima de la mesa.`,
    hints: deLa,
  },
  {
    id: "SP-T04-E05",
    mode: "cloze",
    prompt: "The cup is on top of the cupboard. Complete only the gap: La taza está ___ armario.",
    answer: "encima del",
    say: "La taza está encima del armario.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T04-E06",
    mode: "sentence",
    prompt:
      "The backpack is above the chair, not touching it. Say in one Spanish sentence where the backpack is. Words: backpack = la mochila; chair = la silla.",
    answer: "La mochila está encima de la silla.",
    constraints: points,
    feedback: "Model answer: La mochila está encima de la silla. Other wording can be right too.",
    hints: deLa,
  },
  {
    id: "SP-T04-V01",
    mode: "cloze",
    prompt:
      "The book is above the box, not touching it. Complete only the gap: El libro está ___ la caja.",
    answer: "encima de",
    say: "El libro está encima de la caja.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T04-V02",
    mode: "cloze",
    prompt:
      "The book is above the box, not touching it. Write the full Spanish sentence using exactly this frame: El libro está ___ la caja.",
    answer: "El libro está encima de la caja.",
    say: "El libro está encima de la caja.",
    feedback: `${deLaRule} Full sentence: El libro está encima de la caja.`,
    hints: deLa,
  },
  {
    id: "SP-T04-V03",
    mode: "cloze",
    prompt:
      "The backpack is above the chair, not touching it. Complete only the gap: La mochila está ___ la silla.",
    answer: "encima de",
    say: "La mochila está encima de la silla.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T04-V04",
    mode: "cloze",
    prompt:
      "The backpack is above the chair, not touching it. Write the full Spanish sentence using exactly this frame: La mochila está ___ la silla.",
    answer: "La mochila está encima de la silla.",
    say: "La mochila está encima de la silla.",
    feedback: `${deLaRule} Full sentence: La mochila está encima de la silla.`,
    hints: deLa,
  },
  {
    id: "SP-T04-V05",
    mode: "cloze",
    prompt:
      "The backpack is above the cupboard, not touching it. Complete only the gap: La mochila está ___ armario.",
    answer: "encima del",
    say: "La mochila está encima del armario.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T04-V06",
    mode: "cloze",
    prompt:
      "The backpack is above the cupboard, not touching it. Write the full Spanish sentence using exactly this frame: La mochila está ___ armario.",
    answer: "La mochila está encima del armario.",
    say: "La mochila está encima del armario.",
    feedback: `${delRule} Full sentence: La mochila está encima del armario.`,
    hints: del,
  },
  {
    id: "SP-T04-V07",
    mode: "cloze",
    prompt:
      "The bag is above the door, not touching it. Complete only the gap: La bolsa está ___ la puerta.",
    answer: "encima de",
    say: "La bolsa está encima de la puerta.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T04-V08",
    mode: "cloze",
    prompt:
      "The bag is above the door, not touching it. Write the full Spanish sentence using exactly this frame: La bolsa está ___ la puerta.",
    answer: "La bolsa está encima de la puerta.",
    say: "La bolsa está encima de la puerta.",
    feedback: `${deLaRule} Full sentence: La bolsa está encima de la puerta.`,
    hints: deLa,
  },
  {
    id: "SP-T04-V09",
    mode: "cloze",
    prompt: "The ticket is on top of the bench. Complete only the gap: El billete está ___ banco.",
    answer: "encima del",
    say: "El billete está encima del banco.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T04-V10",
    mode: "cloze",
    prompt:
      "The ticket is on top of the bench. Write the full Spanish sentence using exactly this frame: El billete está ___ banco.",
    answer: "El billete está encima del banco.",
    say: "El billete está encima del banco.",
    feedback: `${delRule} Full sentence: El billete está encima del banco.`,
    hints: del,
  },
  {
    id: "SP-T04-V11",
    mode: "sentence",
    prompt:
      "The bag is above the door, not touching it. Say in one Spanish sentence where the bag is. Words: bag = la bolsa; door = la puerta.",
    answer: "La bolsa está encima de la puerta.",
    constraints: points,
    feedback: "Model answer: La bolsa está encima de la puerta. Other wording can be right too.",
    hints: deLa,
  },
  {
    id: "SP-T04-V12",
    mode: "choice",
    prompt: "Which scene matches this sentence? El billete está encima del banco.",
    answer: "The ticket is on top of the bench.",
    choices: [
      "The ticket is on top of the bench.",
      "The ticket is under the bench.",
      "The ticket is far from the bench.",
    ],
    say: "El billete está encima del banco.",
    feedback: "encima del means on top of or above.",
    hints: meaning,
  },
];

const t04Introduction = teachingCard(
  "SP-T04-INTRO",
  "New phrase: encima de",
  "encima de means on top of or above. Example: La bolsa está encima de la puerta.",
);

const variations = t04Items.map((i) => i.id).filter((id) => id.startsWith("SP-T04-V"));

export const l04: SetLesson = {
  id: "pl-l04",
  title: "On top of or above",
  subtitle: "Learn one new phrase",
  recalled: ["SP-T03-V09"],
  introduction: t04Introduction,
  base: ["SP-T04-E01", "SP-T04-E02", "SP-T04-E03", "SP-T04-E04", "SP-T04-E05", "SP-T04-E06"],
  formCards: [
    {
      before: "SP-T04-E05",
      heading: "encima de la, encima del",
      text: "Before la, de stays on its own: El móvil está encima de la mesa. Before el, de + el becomes del: La taza está encima del armario.",
    },
  ],
  variations,
};

// R01 closes unit 1: the four phrases' V09 gaps, then their V10 sentences in reverse, with no cards.
export const r01: SetLesson = {
  id: "pl-r01",
  title: "Unit review",
  subtitle: "Review this unit's lessons",
  recalled: [],
  base: [
    "SP-T01-V09",
    "SP-T02-V09",
    "SP-T03-V09",
    "SP-T04-V09",
    "SP-T04-V10",
    "SP-T03-V10",
    "SP-T02-V10",
    "SP-T01-V10",
  ],
  formCards: [],
  variations: [],
};
