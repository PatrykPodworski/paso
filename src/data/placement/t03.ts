import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T03, fuera de: outside, and fuera del before el.
const meaning: [string, string] = [
  "fuera de is the opposite of dentro de.",
  "The thing is not in the container.",
];

const startsWith = "The phrase for outside has 2 words and starts with fuera.";

const phrase: [string, string] = [startsWith, "It ends with de."];

const deLa: [string, string] = [startsWith, "la follows, so de stays on its own: de la."];

const del: [string, string] = [
  startsWith,
  "A masculine noun follows without el, so de + el joins into del.",
];

const deLaRule = "fuera de means outside. Before la, de stays on its own.";

const delRule = "fuera del: before el, de + el becomes del.";

const deLaGap = `Use fuera de. ${deLaRule}`;

const delGap = `Use fuera del. ${delRule}`;

const points = ["Uses fuera de for outside", "Keeps the things and their places as stated"];

export const t03Items: Item[] = [
  {
    id: "SP-T03-E01",
    mode: "choice",
    prompt: "Choose the English meaning of “fuera de” in: La bolsa está fuera de la maleta.",
    answer: "outside",
    choices: ["outside", "inside", "on top of or above"],
    say: "La bolsa está fuera de la maleta.",
    feedback: "fuera de means outside. The bag is outside the suitcase.",
    hints: meaning,
  },
  {
    id: "SP-T03-E02",
    mode: "cloze",
    prompt: "Write the Spanish phrase for “outside”. Give the phrase only, not a sentence.",
    answer: "fuera de",
    say: "fuera de",
    feedback: "outside is fuera de. Before el it becomes fuera del.",
    hints: phrase,
  },
  {
    id: "SP-T03-E03",
    mode: "cloze",
    prompt: "The phone is outside the bag. Complete only the gap: El móvil está ___ la bolsa.",
    answer: "fuera de",
    say: "El móvil está fuera de la bolsa.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T03-E04",
    mode: "cloze",
    prompt:
      "The phone is outside the bag. Write the full Spanish sentence using exactly this frame: El móvil está ___ la bolsa.",
    answer: "El móvil está fuera de la bolsa.",
    say: "El móvil está fuera de la bolsa.",
    feedback: `${deLaRule} Full sentence: El móvil está fuera de la bolsa.`,
    hints: deLa,
  },
  {
    id: "SP-T03-E05",
    mode: "cloze",
    prompt:
      "The backpack is outside the cupboard. Complete only the gap: La mochila está ___ armario.",
    answer: "fuera del",
    say: "La mochila está fuera del armario.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T03-E06",
    mode: "sentence",
    prompt:
      "The cup is outside the box. Say in one Spanish sentence where the cup is. Words: cup = la taza; box = la caja.",
    answer: "La taza está fuera de la caja.",
    constraints: points,
    feedback: "Model answer: La taza está fuera de la caja. Other wording can be right too.",
    hints: deLa,
  },
  {
    id: "SP-T03-V01",
    mode: "cloze",
    prompt: "The book is outside the box. Complete only the gap: El libro está ___ la caja.",
    answer: "fuera de",
    say: "El libro está fuera de la caja.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T03-V02",
    mode: "cloze",
    prompt:
      "The book is outside the box. Write the full Spanish sentence using exactly this frame: El libro está ___ la caja.",
    answer: "El libro está fuera de la caja.",
    say: "El libro está fuera de la caja.",
    feedback: `${deLaRule} Full sentence: El libro está fuera de la caja.`,
    hints: deLa,
  },
  {
    id: "SP-T03-V03",
    mode: "cloze",
    prompt: "The cup is outside the cupboard. Complete only the gap: La taza está ___ armario.",
    answer: "fuera del",
    say: "La taza está fuera del armario.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T03-V04",
    mode: "cloze",
    prompt:
      "The cup is outside the cupboard. Write the full Spanish sentence using exactly this frame: La taza está ___ armario.",
    answer: "La taza está fuera del armario.",
    say: "La taza está fuera del armario.",
    feedback: `${delRule} Full sentence: La taza está fuera del armario.`,
    hints: del,
  },
  {
    id: "SP-T03-V05",
    mode: "cloze",
    prompt: "The cup is outside the box. Complete only the gap: La taza está ___ la caja.",
    answer: "fuera de",
    say: "La taza está fuera de la caja.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T03-V06",
    mode: "cloze",
    prompt:
      "The cup is outside the box. Write the full Spanish sentence using exactly this frame: La taza está ___ la caja.",
    answer: "La taza está fuera de la caja.",
    say: "La taza está fuera de la caja.",
    feedback: `${deLaRule} Full sentence: La taza está fuera de la caja.`,
    hints: deLa,
  },
  {
    id: "SP-T03-V07",
    mode: "cloze",
    prompt: "The bag is outside the suitcase. Complete only the gap: La bolsa está ___ la maleta.",
    answer: "fuera de",
    say: "La bolsa está fuera de la maleta.",
    feedback: deLaGap,
    hints: deLa,
  },
  {
    id: "SP-T03-V08",
    mode: "cloze",
    prompt:
      "The bag is outside the suitcase. Write the full Spanish sentence using exactly this frame: La bolsa está ___ la maleta.",
    answer: "La bolsa está fuera de la maleta.",
    say: "La bolsa está fuera de la maleta.",
    feedback: `${deLaRule} Full sentence: La bolsa está fuera de la maleta.`,
    hints: deLa,
  },
  {
    id: "SP-T03-V09",
    mode: "cloze",
    prompt:
      "The ticket is outside the pocket. Complete only the gap: El billete está ___ bolsillo.",
    answer: "fuera del",
    say: "El billete está fuera del bolsillo.",
    feedback: delGap,
    hints: del,
  },
  {
    id: "SP-T03-V10",
    mode: "cloze",
    prompt:
      "The ticket is outside the pocket. Write the full Spanish sentence using exactly this frame: El billete está ___ bolsillo.",
    answer: "El billete está fuera del bolsillo.",
    say: "El billete está fuera del bolsillo.",
    feedback: `${delRule} Full sentence: El billete está fuera del bolsillo.`,
    hints: del,
  },
  {
    id: "SP-T03-V11",
    mode: "sentence",
    prompt:
      "The bag is outside the suitcase. Say in one Spanish sentence where the bag is. Words: bag = la bolsa; suitcase = la maleta.",
    answer: "La bolsa está fuera de la maleta.",
    constraints: points,
    feedback: "Model answer: La bolsa está fuera de la maleta. Other wording can be right too.",
    hints: deLa,
  },
  {
    id: "SP-T03-V12",
    mode: "choice",
    prompt: "Which scene matches this sentence? El billete está fuera del bolsillo.",
    answer: "The ticket is outside the pocket.",
    choices: [
      "The ticket is outside the pocket.",
      "The ticket is inside the pocket.",
      "The ticket is in the pocket.",
    ],
    say: "El billete está fuera del bolsillo.",
    feedback: "fuera del means outside.",
    hints: meaning,
  },
];

const t03Introduction = teachingCard(
  "SP-T03-INTRO",
  "New phrase: fuera de",
  "fuera de means outside. Example: La bolsa está fuera de la maleta.",
);

const variations = t03Items.map((i) => i.id).filter((id) => id.startsWith("SP-T03-V"));

export const l03: SetLesson = {
  id: "pl-l03",
  title: "Outside",
  subtitle: "Learn one new phrase",
  recalled: ["SP-T02-V09"],
  introduction: t03Introduction,
  base: ["SP-T03-E01", "SP-T03-E02", "SP-T03-E03", "SP-T03-E04", "SP-T03-E05", "SP-T03-E06"],
  formCards: [
    {
      before: "SP-T03-E05",
      heading: "fuera de la, fuera del",
      text: "Before la, de stays on its own: El móvil está fuera de la bolsa. Before el, de + el becomes del: La mochila está fuera del armario.",
    },
  ],
  variations,
};
