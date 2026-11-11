import type { Item } from "../practice-sets/item.ts";

// T12, siempre: always.
const hints: [string, string] = [
  "It happens every time: on all of the days.",
  "It starts with si-.",
];

export const t12Items: Item[] = [
  {
    id: "TM-T12-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "siempre",
    answer: "always",
    choices: ["always", "sometimes", "never"],
    say: "siempre",
    feedback: "siempre means always.",
    hints,
  },
  {
    id: "TM-T12-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "always",
    answer: "siempre",
    say: "siempre",
    feedback: "Always is siempre.",
    hints,
  },
  {
    id: "TM-T12-E04",
    mode: "cloze",
    instruction: "Complete the gap. Luis eats at home on all 7 days this week.",
    prompt: "Luis ___ come en casa.",
    answer: "siempre",
    say: "Luis siempre come en casa.",
    feedback: "Luis eats at home on all 7 days this week. So: Luis siempre come en casa.",
    hints,
  },
  {
    id: "TM-T12-E05",
    mode: "cloze",
    instruction: "Translate into Spanish. Diego has bread for breakfast on all 7 days this week.",
    prompt: "Diego always has bread for breakfast.",
    answer: "Diego siempre desayuna pan.",
    accepted: ["Diego desayuna siempre pan.", "Diego desayuna pan siempre."],
    say: "Diego siempre desayuna pan.",
    feedback: "One right answer: Diego siempre desayuna pan.",
    hints,
  },
  {
    id: "TM-T12-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Tomás siempre trabaja los sábados.",
    answer: "Tomás works on all 4 Saturdays this month.",
    choices: [
      "Tomás works on all 4 Saturdays this month.",
      "Tomás works on 2 of the 4 Saturdays this month.",
      "Tomás works on none of the 4 Saturdays this month.",
    ],
    say: "Tomás siempre trabaja los sábados.",
    feedback: "siempre means always: Tomás works on all 4 Saturdays this month.",
    hints,
  },
  {
    id: "TM-T12-V11",
    mode: "choice",
    instruction: "Choose the word for the gap. Diego goes by bus on all 7 days this week.",
    prompt: "Diego ___ va en autobús.",
    answer: "siempre",
    choices: ["siempre", "a veces", "nunca"],
    say: "Diego siempre va en autobús.",
    feedback: "Diego goes by bus on all 7 days this week. So: Diego siempre va en autobús.",
    hints,
  },
];
