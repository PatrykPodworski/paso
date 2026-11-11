import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T01, en: in or on, the most general place word.
const meaning: [string, string] = [
  "en is the most general place word.",
  "It covers a book in a box and a phone on a table.",
];

const phrase: [string, string] = [
  "The phrase for in or on is one short word.",
  "It starts with e and has two letters.",
];

const rule = "en means in or on, and it never joins el: en el armario.";

const gap = `Use en. ${rule}`;

const points = ["Uses en for in or on", "Keeps the things and their places as stated"];

export const t01Items: Item[] = [
  {
    id: "SP-T01-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “en” in: La bolsa está en la maleta.",
    answer: "in or on",
    choices: ["in or on", "outside", "under"],
    say: "La bolsa está en la maleta.",
    feedback: "en means in or on. The bag is in the suitcase.",
    hints: meaning,
  },
  {
    id: "SP-T01-E02",
    mode: "cloze",
    prompt: "Write the Spanish phrase for “in or on”. Give the phrase only, not a sentence.",
    answer: "en",
    say: "en",
    feedback: "in or on is en.",
    hints: phrase,
  },
  {
    id: "SP-T01-E03",
    mode: "cloze",
    prompt: "The phone is on the table. Complete only the gap: El móvil está ___ la mesa.",
    answer: "en",
    say: "El móvil está en la mesa.",
    feedback: gap,
    hints: phrase,
  },
  {
    id: "SP-T01-E04",
    mode: "cloze",
    prompt:
      "The phone is on the table. Write the full Spanish sentence using exactly this frame: El móvil está ___ la mesa.",
    answer: "El móvil está en la mesa.",
    say: "El móvil está en la mesa.",
    feedback: `${rule} Full sentence: El móvil está en la mesa.`,
    hints: phrase,
  },
  {
    id: "SP-T01-E05",
    mode: "cloze",
    prompt:
      "The backpack is in the cupboard. Complete only the gap: La mochila está ___ el armario.",
    answer: "en",
    say: "La mochila está en el armario.",
    feedback: gap,
    hints: phrase,
  },
  {
    id: "SP-T01-E06",
    mode: "sentence",
    prompt:
      "The cup is in the box. Say in one Spanish sentence where the cup is. Words: cup = la taza; box = la caja.",
    answer: "La taza está en la caja.",
    constraints: points,
    feedback: "Model answer: La taza está en la caja. Other wording can be right too.",
    hints: phrase,
  },
  {
    id: "SP-T01-V01",
    mode: "cloze",
    prompt: "The book is in the box. Complete only the gap: El libro está ___ la caja.",
    answer: "en",
    say: "El libro está en la caja.",
    feedback: gap,
    hints: phrase,
  },
  {
    id: "SP-T01-V02",
    mode: "cloze",
    prompt:
      "The book is in the box. Write the full Spanish sentence using exactly this frame: El libro está ___ la caja.",
    answer: "El libro está en la caja.",
    say: "El libro está en la caja.",
    feedback: `${rule} Full sentence: El libro está en la caja.`,
    hints: phrase,
  },
  {
    id: "SP-T01-V03",
    mode: "cloze",
    prompt:
      "The backpack is in the cupboard. Complete only the gap: La mochila está ___ el armario.",
    answer: "en",
    say: "La mochila está en el armario.",
    feedback: gap,
    hints: phrase,
  },
  {
    id: "SP-T01-V04",
    mode: "cloze",
    prompt:
      "The backpack is in the cupboard. Write the full Spanish sentence using exactly this frame: La mochila está ___ el armario.",
    answer: "La mochila está en el armario.",
    say: "La mochila está en el armario.",
    feedback: `${rule} Full sentence: La mochila está en el armario.`,
    hints: phrase,
  },
  {
    id: "SP-T01-V05",
    mode: "cloze",
    prompt: "The cup is in the box. Complete only the gap: La taza está ___ la caja.",
    answer: "en",
    say: "La taza está en la caja.",
    feedback: gap,
    hints: phrase,
  },
  {
    id: "SP-T01-V06",
    mode: "cloze",
    prompt:
      "The cup is in the box. Write the full Spanish sentence using exactly this frame: La taza está ___ la caja.",
    answer: "La taza está en la caja.",
    say: "La taza está en la caja.",
    feedback: `${rule} Full sentence: La taza está en la caja.`,
    hints: phrase,
  },
  {
    id: "SP-T01-V07",
    mode: "cloze",
    prompt: "The bag is in the suitcase. Complete only the gap: La bolsa está ___ la maleta.",
    answer: "en",
    say: "La bolsa está en la maleta.",
    feedback: gap,
    hints: phrase,
  },
  {
    id: "SP-T01-V08",
    mode: "cloze",
    prompt:
      "The bag is in the suitcase. Write the full Spanish sentence using exactly this frame: La bolsa está ___ la maleta.",
    answer: "La bolsa está en la maleta.",
    say: "La bolsa está en la maleta.",
    feedback: `${rule} Full sentence: La bolsa está en la maleta.`,
    hints: phrase,
  },
  {
    id: "SP-T01-V09",
    mode: "cloze",
    prompt: "The ticket is on the bench. Complete only the gap: El billete está ___ el banco.",
    answer: "en",
    say: "El billete está en el banco.",
    feedback: gap,
    hints: phrase,
  },
  {
    id: "SP-T01-V10",
    mode: "cloze",
    prompt:
      "The ticket is on the bench. Write the full Spanish sentence using exactly this frame: El billete está ___ el banco.",
    answer: "El billete está en el banco.",
    say: "El billete está en el banco.",
    feedback: `${rule} Full sentence: El billete está en el banco.`,
    hints: phrase,
  },
  {
    id: "SP-T01-V11",
    mode: "sentence",
    prompt:
      "The bag is in the suitcase. Say in one Spanish sentence where the bag is. Words: bag = la bolsa; suitcase = la maleta.",
    answer: "La bolsa está en la maleta.",
    constraints: points,
    feedback: "Model answer: La bolsa está en la maleta. Other wording can be right too.",
    hints: phrase,
  },
  {
    id: "SP-T01-V12",
    mode: "choice",
    prompt: "Which scene matches this sentence? El billete está en el banco.",
    answer: "The ticket is on the bench.",
    choices: [
      "The ticket is on the bench.",
      "The ticket is under the bench.",
      "The ticket is far from the bench.",
    ],
    say: "El billete está en el banco.",
    feedback: "en means in or on.",
    hints: meaning,
  },
];

const t01Introduction = teachingCard(
  "SP-T01-INTRO",
  "New phrase: en",
  "en means in or on. Example: La bolsa está en la maleta.",
);

const variations = t01Items.map((i) => i.id).filter((id) => id.startsWith("SP-T01-V"));

export const l01: SetLesson = {
  id: "pl-l01",
  title: "In or on",
  subtitle: "Learn one new phrase",
  recalled: [],
  introduction: t01Introduction,
  base: ["SP-T01-E01", "SP-T01-E02", "SP-T01-E03", "SP-T01-E04", "SP-T01-E05", "SP-T01-E06"],
  formCards: [
    {
      before: "SP-T01-E05",
      heading: "en la, en el",
      text: "en never joins the article: El móvil está en la mesa. La mochila está en el armario.",
    },
  ],
  variations,
};
