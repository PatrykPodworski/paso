import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T02, dentro de: inside, and dentro del before el.
const meaning: [string, string] = [
  "dentro de puts a thing within a closed space.",
  "Think of a cup in a closed box.",
];

const startsWith = "The phrase for inside has 2 words and starts with dentro.";

const phrase: [string, string] = [startsWith, "It ends with de."];

const deLa: [string, string] = [startsWith, "la follows, so de stays on its own: de la."];

const del: [string, string] = [
  startsWith,
  "A masculine noun follows without el, so de + el joins into del.",
];

const deLaRule = "dentro de means inside. Before la, de stays on its own.";

const delRule = "dentro del: before el, de + el becomes del.";

const deLaGap = `Use dentro de. ${deLaRule}`;

const delGap = `Use dentro del. ${delRule}`;

const points = ["Uses dentro de for inside", "Keeps the things and their places as stated"];

export const t02Items: Item[] = [
  {
    id: "SP-T02-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “dentro de” in: La bolsa está dentro de la maleta.",
    answer: "inside",
    choices: ["inside", "outside", "under"],
    say: "La bolsa está dentro de la maleta.",
    feedback: "dentro de means inside. The bag is inside the suitcase.",
    hints: meaning,
  },
  {
    id: "SP-T02-E02",
    mode: "cloze",
    prompt: "Write the Spanish phrase for “inside”. Give the phrase only, not a sentence.",
    answer: "dentro de",
    say: "dentro de",
    feedback: "inside is dentro de. Before el it becomes dentro del.",
    hints: phrase,
  },
  {
    id: "SP-T02-E03",
    mode: "cloze",
    prompt: "The phone is inside the bag. Complete only the gap: El móvil está ___ la bolsa.",
    answer: "dentro de",
    say: "El móvil está dentro de la bolsa.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T02-E04",
    mode: "cloze",
    prompt:
      "The phone is inside the bag. Write the full Spanish sentence using exactly this frame: El móvil está ___ la bolsa.",
    answer: "El móvil está dentro de la bolsa.",
    say: "El móvil está dentro de la bolsa.",
    feedback: `${deLaRule} Full sentence: El móvil está dentro de la bolsa.`,
    hints: deLa,
  },
  {
    id: "SP-T02-E05",
    mode: "cloze",
    prompt:
      "The backpack is inside the cupboard. Complete only the gap: La mochila está ___ armario.",
    answer: "dentro del",
    say: "La mochila está dentro del armario.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T02-E06",
    mode: "sentence",
    prompt:
      "The cup is inside the box. Say in one Spanish sentence where the cup is. Words: cup = la taza; box = la caja.",
    answer: "La taza está dentro de la caja.",
    constraints: points,
    feedback: "Model answer: La taza está dentro de la caja. Other wording can be right too.",
    hints: deLa,
  },
  {
    id: "SP-T02-V01",
    mode: "cloze",
    prompt: "The book is inside the box. Complete only the gap: El libro está ___ la caja.",
    answer: "dentro de",
    say: "El libro está dentro de la caja.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T02-V02",
    mode: "cloze",
    prompt:
      "The book is inside the box. Write the full Spanish sentence using exactly this frame: El libro está ___ la caja.",
    answer: "El libro está dentro de la caja.",
    say: "El libro está dentro de la caja.",
    feedback: `${deLaRule} Full sentence: El libro está dentro de la caja.`,
    hints: deLa,
  },
  {
    id: "SP-T02-V03",
    mode: "cloze",
    prompt: "The cup is inside the cupboard. Complete only the gap: La taza está ___ armario.",
    answer: "dentro del",
    say: "La taza está dentro del armario.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T02-V04",
    mode: "cloze",
    prompt:
      "The cup is inside the cupboard. Write the full Spanish sentence using exactly this frame: La taza está ___ armario.",
    answer: "La taza está dentro del armario.",
    say: "La taza está dentro del armario.",
    feedback: `${delRule} Full sentence: La taza está dentro del armario.`,
    hints: del,
  },
  {
    id: "SP-T02-V05",
    mode: "cloze",
    prompt: "The cup is inside the box. Complete only the gap: La taza está ___ la caja.",
    answer: "dentro de",
    say: "La taza está dentro de la caja.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T02-V06",
    mode: "cloze",
    prompt:
      "The cup is inside the box. Write the full Spanish sentence using exactly this frame: La taza está ___ la caja.",
    answer: "La taza está dentro de la caja.",
    say: "La taza está dentro de la caja.",
    feedback: `${deLaRule} Full sentence: La taza está dentro de la caja.`,
    hints: deLa,
  },
  {
    id: "SP-T02-V07",
    mode: "cloze",
    prompt: "The bag is inside the suitcase. Complete only the gap: La bolsa está ___ la maleta.",
    answer: "dentro de",
    say: "La bolsa está dentro de la maleta.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T02-V08",
    mode: "cloze",
    prompt:
      "The bag is inside the suitcase. Write the full Spanish sentence using exactly this frame: La bolsa está ___ la maleta.",
    answer: "La bolsa está dentro de la maleta.",
    say: "La bolsa está dentro de la maleta.",
    feedback: `${deLaRule} Full sentence: La bolsa está dentro de la maleta.`,
    hints: deLa,
  },
  {
    id: "SP-T02-V09",
    mode: "cloze",
    prompt: "The ticket is inside the pocket. Complete only the gap: El billete está ___ bolsillo.",
    answer: "dentro del",
    say: "El billete está dentro del bolsillo.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T02-V10",
    mode: "cloze",
    prompt:
      "The ticket is inside the pocket. Write the full Spanish sentence using exactly this frame: El billete está ___ bolsillo.",
    answer: "El billete está dentro del bolsillo.",
    say: "El billete está dentro del bolsillo.",
    feedback: `${delRule} Full sentence: El billete está dentro del bolsillo.`,
    hints: del,
  },
  {
    id: "SP-T02-V11",
    mode: "sentence",
    prompt:
      "The bag is inside the suitcase. Say in one Spanish sentence where the bag is. Words: bag = la bolsa; suitcase = la maleta.",
    answer: "La bolsa está dentro de la maleta.",
    constraints: points,
    feedback: "Model answer: La bolsa está dentro de la maleta. Other wording can be right too.",
    hints: deLa,
  },
  {
    id: "SP-T02-V12",
    mode: "choice",
    prompt: "Which scene matches this sentence? El billete está dentro del bolsillo.",
    answer: "The ticket is inside the pocket.",
    choices: [
      "The ticket is inside the pocket.",
      "The ticket is outside the pocket.",
      "The ticket is far from the pocket.",
    ],
    say: "El billete está dentro del bolsillo.",
    feedback: "dentro del means inside.",
    hints: meaning,
  },
];

const t02Introduction = teachingCard(
  "SP-T02-INTRO",
  "New phrase: dentro de",
  "dentro de means inside. Example: La bolsa está dentro de la maleta.",
);

const variations = t02Items.map((i) => i.id).filter((id) => id.startsWith("SP-T02-V"));

export const l02: SetLesson = {
  id: "pl-l02",
  title: "Inside",
  subtitle: "Learn one new phrase",
  recalled: ["SP-T01-V09"],
  introduction: t02Introduction,
  base: ["SP-T02-E01", "SP-T02-E02", "SP-T02-E03", "SP-T02-E04", "SP-T02-E05", "SP-T02-E06"],
  formCards: [
    {
      before: "SP-T02-E05",
      heading: "dentro de la, dentro del",
      text: "Before la, de stays on its own: El móvil está dentro de la bolsa. Before el, de + el becomes del: La mochila está dentro del armario.",
    },
  ],
  variations,
};
