import type { Item } from "../practice-sets/item.ts";

// T13, a veces: sometimes.
const hints: [string, string] = [
  "It happens on some days, not on all of them.",
  "Two words: a and veces.",
];

export const t13Items: Item[] = [
  {
    id: "TM-T13-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "a veces",
    answer: "sometimes",
    choices: ["sometimes", "always", "never"],
    say: "a veces",
    feedback: "a veces means sometimes.",
    hints,
  },
  {
    id: "TM-T13-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "sometimes",
    answer: "a veces",
    say: "a veces",
    feedback: "Sometimes is a veces.",
    hints,
  },
  {
    id: "TM-T13-E04",
    mode: "cloze",
    instruction: "Complete the gap. Pablo eats at home on 2 of the 7 days this week.",
    prompt: "Pablo ___ come en casa.",
    answer: "a veces",
    say: "Pablo a veces come en casa.",
    feedback: "Pablo eats at home on 2 of the 7 days this week. So: Pablo a veces come en casa.",
    hints,
  },
  {
    id: "TM-T13-E05",
    mode: "cloze",
    instruction:
      "Translate into Spanish. Luis has bread for breakfast on 2 of the 7 days this week.",
    prompt: "Luis sometimes has bread for breakfast.",
    answer: "Luis a veces desayuna pan.",
    accepted: ["A veces Luis desayuna pan.", "Luis desayuna pan a veces."],
    say: "Luis a veces desayuna pan.",
    feedback: "One right answer: Luis a veces desayuna pan.",
    hints,
  },
  {
    id: "TM-T13-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Diego a veces trabaja los sábados.",
    answer: "Diego works on 2 of the 4 Saturdays this month.",
    choices: [
      "Diego works on 2 of the 4 Saturdays this month.",
      "Diego works on all 4 Saturdays this month.",
      "Diego works on none of the 4 Saturdays this month.",
    ],
    say: "Diego a veces trabaja los sábados.",
    feedback: "a veces means sometimes: Diego works on 2 of the 4 Saturdays this month.",
    hints,
  },
  {
    id: "TM-T13-V11",
    mode: "choice",
    instruction: "Choose the word for the gap. Tomás works on 2 of the 4 Saturdays this month.",
    prompt: "Tomás ___ trabaja los sábados.",
    answer: "a veces",
    choices: ["a veces", "siempre", "nunca"],
    say: "Tomás a veces trabaja los sábados.",
    feedback:
      "Tomás works on 2 of the 4 Saturdays this month. So: Tomás a veces trabaja los sábados.",
    hints,
  },
];
