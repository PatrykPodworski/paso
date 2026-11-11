import type { Item } from "../practice-sets/item.ts";

// T04, ahora: now.
const hints: [string, string] = [
  "It happens at this very moment, not just some time today.",
  "It starts with ah- and the h is silent.",
];

export const t04Items: Item[] = [
  {
    id: "TM-T04-E01",
    mode: "choice",
    instruction: "Choose the English meaning",
    prompt: "ahora",
    answer: "now",
    choices: ["now", "before, earlier", "after, later"],
    say: "ahora",
    feedback: "ahora means now.",
    hints,
  },
  {
    id: "TM-T04-E03",
    mode: "cloze",
    instruction: "Write it in Spanish",
    prompt: "now",
    answer: "ahora",
    say: "ahora",
    feedback: "Now is ahora.",
    hints,
  },
  {
    id: "TM-T04-E04",
    mode: "cloze",
    instruction: "Complete the gap. It is 12:00 on Tuesday. Luis is at home at this moment.",
    prompt: "Luis está en casa ___.",
    answer: "ahora",
    say: "Luis está en casa ahora.",
    feedback:
      "It is 12:00 on Tuesday. Luis is at home at this moment. So: Luis está en casa ahora.",
    hints,
  },
  {
    id: "TM-T04-E05",
    mode: "cloze",
    instruction: "Translate into Spanish. It is 12:00 on Tuesday. Diego is working at this moment.",
    prompt: "Diego is working now.",
    answer: "Diego trabaja ahora.",
    accepted: [
      "Ahora Diego trabaja.",
      "Diego está trabajando ahora.",
      "Ahora Diego está trabajando.",
    ],
    say: "Diego trabaja ahora.",
    feedback: "One right answer: Diego trabaja ahora.",
    hints,
  },
  {
    id: "TM-T04-E06",
    mode: "choice",
    instruction: "Which situation fits this sentence?",
    prompt: "Tomás está en el autobús ahora.",
    answer: "It is 12:00 on Tuesday. Tomás is on the bus right now.",
    choices: [
      "It is 12:00 on Tuesday. Tomás is on the bus right now.",
      "It is 12:00 on Tuesday. Tomás is on the bus at 18:00 today.",
      "It is 12:00 on Tuesday. Tomás is on the bus on Wednesday.",
    ],
    say: "Tomás está en el autobús ahora.",
    feedback: "ahora means now: It is 12:00 on Tuesday. Tomás is on the bus right now.",
    hints,
  },
  {
    id: "TM-T04-V11",
    mode: "choice",
    instruction:
      "Choose the word for the gap. It is 12:00 on Tuesday. Diego is eating at this moment.",
    prompt: "Diego come ___.",
    answer: "ahora",
    choices: ["ahora", "antes", "después"],
    say: "Diego come ahora.",
    feedback: "It is 12:00 on Tuesday. Diego is eating at this moment. So: Diego come ahora.",
    hints,
  },
  {
    id: "TM-T04-V03",
    mode: "cloze",
    instruction: "Complete the gap. It is 12:00 on Tuesday. Pablo is at home at this moment.",
    prompt: "Pablo está en casa ___.",
    answer: "ahora",
    say: "Pablo está en casa ahora.",
    feedback:
      "It is 12:00 on Tuesday. Pablo is at home at this moment. So: Pablo está en casa ahora.",
    hints,
  },
  {
    id: "TM-T04-V09",
    mode: "cloze",
    instruction: "Complete the gap. It is 12:00 on Tuesday. Pablo is working at this moment.",
    prompt: "Pablo trabaja ___.",
    answer: "ahora",
    say: "Pablo trabaja ahora.",
    feedback: "It is 12:00 on Tuesday. Pablo is working at this moment. So: Pablo trabaja ahora.",
    hints,
  },
  {
    id: "TM-T04-V10",
    mode: "cloze",
    instruction:
      "Translate into Spanish. It is 12:00 on Tuesday. Luis is on the bus at this moment.",
    prompt: "Luis is on the bus now.",
    answer: "Luis está en el autobús ahora.",
    accepted: ["Ahora Luis está en el autobús.", "Luis ahora está en el autobús."],
    say: "Luis está en el autobús ahora.",
    feedback: "One right answer: Luis está en el autobús ahora.",
    hints,
  },
];
