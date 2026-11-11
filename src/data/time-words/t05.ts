import type { Item } from "../practice-sets/item.ts";

// T05, antes: before, earlier.
const hints: [string, string] = [
  "Compare the two times: this one is earlier.",
  "It starts with an-.",
];

export const t05Items: Item[] = [
  {
    id: "TM-T05-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "antes",
    answer: "before, earlier",
    choices: ["before, earlier", "now", "after, later"],
    say: "antes",
    feedback: "antes means before, earlier.",
    hints,
  },
  {
    id: "TM-T05-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "before, earlier",
    answer: "antes",
    say: "antes",
    feedback: "Before, earlier is antes.",
    hints,
  },
  {
    id: "TM-T05-E04",
    mode: "cloze",
    instruction: "Complete the gap. Tomás has breakfast at 8:00. Pablo has breakfast at 7:00.",
    prompt: "Tomás desayuna a las ocho. Pablo desayuna ___.",
    answer: "antes",
    say: "Tomás desayuna a las ocho. Pablo desayuna antes.",
    feedback: "Tomás has breakfast at 8:00. Pablo has breakfast at 7:00. So: Pablo desayuna antes.",
    hints,
  },
  {
    id: "TM-T05-E05",
    mode: "cloze",
    instruction: "Translate into Spanish. Jorge studies at 18:00. Luis studies at 17:00.",
    prompt: "Luis studies earlier.",
    answer: "Luis estudia antes.",
    accepted: ["Luis estudia más temprano.", "Luis estudia más pronto."],
    say: "Jorge estudia a las seis. Luis estudia antes.",
    feedback: "One right answer: Luis estudia antes.",
    hints,
  },
  {
    id: "TM-T05-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Pablo trabaja a las ocho. Diego trabaja antes.",
    answer: "Pablo works at 8:00. Diego works at 7:00.",
    choices: [
      "Pablo works at 8:00. Diego works at 7:00.",
      "Pablo works at 8:00. Diego works at 9:00.",
      "Pablo works at 8:00. Diego works at 8:00 too.",
    ],
    say: "Pablo trabaja a las ocho. Diego trabaja antes.",
    feedback: "antes means before, earlier: Pablo works at 8:00. Diego works at 7:00.",
    hints,
  },
  {
    id: "TM-T05-V11",
    mode: "choice",
    instruction: "Choose the word for the gap. Jorge works at 8:00. Tomás works at 7:00.",
    prompt: "Jorge trabaja a las ocho. Tomás trabaja ___.",
    answer: "antes",
    choices: ["antes", "ahora", "después"],
    say: "Jorge trabaja a las ocho. Tomás trabaja antes.",
    feedback: "Jorge works at 8:00. Tomás works at 7:00. So: Tomás trabaja antes.",
    hints,
  },
];
