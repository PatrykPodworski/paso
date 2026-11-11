import type { Item } from "../practice-sets/item.ts";

// T07, temprano: early.
const hints: [string, string] = [
  "Compare with the usual time: this is earlier than usual.",
  "It starts with tem-.",
];

export const t07Items: Item[] = [
  {
    id: "TM-T07-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "temprano",
    answer: "early",
    choices: ["early", "late", "after, later"],
    say: "temprano",
    feedback: "temprano means early.",
    hints,
  },
  {
    id: "TM-T07-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "early",
    answer: "temprano",
    say: "temprano",
    feedback: "Early is temprano.",
    hints,
  },
  {
    id: "TM-T07-E04",
    mode: "cloze",
    instruction:
      "Complete the gap. Luis usually has breakfast at 9:00. Today he has breakfast at 7:00.",
    prompt: "Hoy Luis desayuna ___.",
    answer: "temprano",
    say: "Hoy Luis desayuna temprano.",
    feedback:
      "Luis usually has breakfast at 9:00. Today he has breakfast at 7:00. So: Hoy Luis desayuna temprano.",
    hints,
  },
  {
    id: "TM-T07-E05",
    mode: "cloze",
    instruction:
      "Translate into Spanish. Diego usually goes to bed at 23:00. Today he goes to bed at 21:00.",
    prompt: "Today Diego goes to bed early.",
    answer: "Hoy Diego se acuesta temprano.",
    accepted: [
      "Diego se acuesta temprano hoy.",
      "Hoy Diego se acuesta pronto.",
      "Diego se acuesta pronto hoy.",
      "Hoy Diego se acuesta más temprano.",
      "Diego se acuesta más temprano hoy.",
      "Hoy Diego se acuesta más pronto.",
      "Diego se acuesta más pronto hoy.",
    ],
    say: "Hoy Diego se acuesta temprano.",
    feedback: "One right answer: Hoy Diego se acuesta temprano.",
    hints,
  },
  {
    id: "TM-T07-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Hoy Tomás come temprano.",
    answer: "Tomás usually eats at 14:00. Today he eats at 12:00.",
    choices: [
      "Tomás usually eats at 14:00. Today he eats at 12:00.",
      "Tomás usually eats at 14:00. Today he eats at 16:00.",
      "Tomás usually eats at 14:00. Today he eats at 14:00.",
    ],
    say: "Hoy Tomás come temprano.",
    feedback: "temprano means early: Tomás usually eats at 14:00. Today he eats at 12:00.",
    hints,
  },
  {
    id: "TM-T07-V11",
    mode: "choice",
    instruction:
      "Choose the word for the gap. Diego usually studies at 18:00. Today he studies at 7:00.",
    prompt: "Hoy Diego estudia ___.",
    answer: "temprano",
    choices: ["temprano", "tarde", "después"],
    say: "Hoy Diego estudia temprano.",
    feedback:
      "Diego usually studies at 18:00. Today he studies at 7:00. So: Hoy Diego estudia temprano.",
    hints,
  },
  {
    id: "TM-T07-V03",
    mode: "cloze",
    instruction:
      "Complete the gap. Pablo usually has breakfast at 9:00. Today he has breakfast at 7:00.",
    prompt: "Hoy Pablo desayuna ___.",
    answer: "temprano",
    say: "Hoy Pablo desayuna temprano.",
    feedback:
      "Pablo usually has breakfast at 9:00. Today he has breakfast at 7:00. So: Hoy Pablo desayuna temprano.",
    hints,
  },
  {
    id: "TM-T07-V09",
    mode: "cloze",
    instruction:
      "Complete the gap. Pablo usually goes to bed at 23:00. Today he goes to bed at 21:00.",
    prompt: "Hoy Pablo se acuesta ___.",
    answer: "temprano",
    say: "Hoy Pablo se acuesta temprano.",
    feedback:
      "Pablo usually goes to bed at 23:00. Today he goes to bed at 21:00. So: Hoy Pablo se acuesta temprano.",
    hints,
  },
  {
    id: "TM-T07-V10",
    mode: "cloze",
    instruction: "Translate into Spanish. Luis usually eats at 14:00. Today he eats at 12:00.",
    prompt: "Today Luis eats early.",
    answer: "Hoy Luis come temprano.",
    accepted: [
      "Luis come temprano hoy.",
      "Hoy Luis come pronto.",
      "Luis come pronto hoy.",
      "Hoy Luis come más temprano.",
      "Luis come más temprano hoy.",
      "Hoy Luis come más pronto.",
      "Luis come más pronto hoy.",
    ],
    say: "Hoy Luis come temprano.",
    feedback: "One right answer: Hoy Luis come temprano.",
    hints,
  },
];
