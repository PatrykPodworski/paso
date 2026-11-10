import { teachingCard, type Item } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";

// T16, cada cuánto: asks for the interval between recurring events.
const recall: [string, string] = [
  "Recall the meaning: Ask for the interval between recurring events.",
  "cada cuánto",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "cada cuánto",
];

export const t16Items: Item[] = [
  {
    id: "AQ-T16-E01",
    mode: "choice",
    prompt: "¿Cada cuánto vienes? What information is requested?",
    answer: "The interval between visits",
    choices: ["The interval between visits", "The time of one visit", "The place of origin"],
    say: "¿Cada cuánto vienes?",
    feedback: "Cada cuánto asks how often visits recur.",
    hints: recall,
  },
  {
    id: "AQ-T16-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ estudias español? Reply: “Cada dos días”.",
    answer: "cada cuánto",
    accepted: ["cada cuánto tiempo"],
    say: "¿Cada cuánto estudias español?",
    feedback: "Both forms ask a repeat interval.",
    hints: recall,
  },
  {
    id: "AQ-T16-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Cada cuánto vienes?",
    chunks: ["¿Cada cuánto", "vienes", "?"],
    feedback: "Cada cuánto asks about repeated visits.",
    hints: recall,
  },
  {
    id: "AQ-T16-E04",
    mode: "ask",
    prompt: "The reply is “Voy al centro cada semana”. Ask the repeat interval. Use vas al centro.",
    answer: "¿Cada cuánto vas al centro?",
    accepted: ["¿Cada cuánto tiempo vas al centro?"],
    feedback: "Ask recurrence rather than the date of the next trip.",
    hints: recall,
  },
  {
    id: "AQ-T16-E05",
    mode: "dialogue",
    prompt:
      "Your friend takes an ongoing Spanish class. Ask how often they have class. Use tienes clase de español.",
    answer: "¿Cada cuánto tienes clase de español?",
    constraints: [
      "Ask recurring frequency",
      "Use tienes clase de español",
      "Accept the optional word tiempo",
    ],
    feedback: "Ask the interval between classes. The day of just one class is not enough.",
    hints: recall,
  },
  {
    id: "AQ-T16-E06",
    mode: "choice",
    prompt:
      "The reply is “Cada dos días”. Choose the phrase that explicitly asks for recurrence: ¿___ vienes?",
    answer: "Cada cuánto",
    choices: ["Cada cuánto", "Cuándo"],
    say: "¿Cada cuánto vienes?",
    feedback: "Cada cuánto requests an interval. Cuándo could ask about just the next visit.",
    hints: recall,
  },
  {
    id: "AQ-T16-V01",
    mode: "cloze",
    prompt:
      "Pablo goes to the museum regularly. Complete the repeat-interval question: ¿___ va Pablo al museo?",
    answer: "cada cuánto",
    accepted: ["cada cuánto tiempo"],
    say: "¿Cada cuánto va Pablo al museo?",
    feedback: "Ask how often the journey repeats.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V02",
    mode: "cloze",
    prompt:
      "Luis has recurring classes. Complete the repeat-interval question: ¿___ tiene Luis clase?",
    answer: "cada cuánto",
    accepted: ["cada cuánto tiempo"],
    say: "¿Cada cuánto tiene Luis clase?",
    feedback: "Tiene agrees with Luis; ask the recurring interval.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V03",
    mode: "order",
    prompt: "Ask your friend’s recurring shop trips. Arrange the words.",
    answer: "¿Cada cuánto vas a la tienda?",
    chunks: ["¿Cada cuánto", "vas a la tienda", "?"],
    feedback: "Ask the interval between visits.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V04",
    mode: "ask",
    prompt: "The friend replies “Voy al museo cada semana”. Ask how often. Use vas al museo.",
    answer: "¿Cada cuánto vas al museo?",
    accepted: ["¿Cada cuánto tiempo vas al museo?"],
    feedback: "Voy becomes vas; ask recurrence.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V05",
    mode: "ask",
    prompt:
      "The reply is “Pablo estudia español cada dos días”. Ask the interval. Use estudia Pablo español.",
    answer: "¿Cada cuánto estudia Pablo español?",
    accepted: ["¿Cada cuánto tiempo estudia Pablo español?"],
    feedback: "Estudia agrees with Pablo; the answer is a repeat interval.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V06",
    mode: "dialogue",
    prompt:
      "Luis visits Madrid regularly. Ask Pablo how often Luis goes there. Use va Luis a Madrid.",
    answer: "¿Cada cuánto va Luis a Madrid?",
    constraints: ["Ask the interval between trips", "Use va Luis a Madrid"],
    feedback: "Do not turn the recurring question into the date of one trip.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V07",
    mode: "cloze",
    prompt: "Your friend repeatedly buys bread. Complete the frequency question: ¿___ compras pan?",
    answer: "cada cuánto",
    accepted: ["cada cuánto tiempo"],
    say: "¿Cada cuánto compras pan?",
    feedback: "Ask a recurring interval, not the purchased object.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V08",
    mode: "cloze",
    prompt:
      "Pablo and Luis take the bus regularly. Complete the frequency question: ¿___ van Pablo y Luis en autobús?",
    answer: "cada cuánto",
    accepted: ["cada cuánto tiempo"],
    say: "¿Cada cuánto van Pablo y Luis en autobús?",
    feedback: "Van agrees with both travellers.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V09",
    mode: "order",
    prompt: "Ask Luis’s recurring study sessions. Arrange the words.",
    answer: "¿Cada cuánto tiempo estudia Luis aquí?",
    chunks: ["¿Cada cuánto tiempo", "estudia Luis", "aquí", "?"],
    feedback: "The longer phrase means the same recurring interval.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V10",
    mode: "ask",
    prompt:
      "The reply is “Luis compra leche cada dos días”. Ask the interval. Use compra Luis leche.",
    answer: "¿Cada cuánto compra Luis leche?",
    accepted: ["¿Cada cuánto tiempo compra Luis leche?"],
    feedback: "Ask how often Luis buys milk.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V11",
    mode: "ask",
    prompt:
      "The friend replies “Tengo clase cada semana”. Ask the recurring interval. Use tienes clase.",
    answer: "¿Cada cuánto tienes clase?",
    accepted: ["¿Cada cuánto tiempo tienes clase?"],
    feedback: "Tengo becomes tienes when you address the learner.",
    hints: fromReply,
  },
  {
    id: "AQ-T16-V12",
    mode: "dialogue",
    prompt:
      "Pablo and Luis regularly work from home. Ask a colleague how often. Use trabajan Pablo y Luis en casa.",
    answer: "¿Cada cuánto trabajan Pablo y Luis en casa?",
    constraints: ["Ask the recurring interval", "Use trabajan Pablo y Luis en casa"],
    feedback: "Use trabajan for the two people.",
    hints: fromReply,
  },
];

const t16Introduction = teachingCard(
  "AQ-T16-INTRO",
  "New question word: cada cuánto",
  "Cada cuánto asks the interval between repeated events. Cada cuánto tiempo is also accepted. Cuándo alone does not explicitly ask recurrence.\n\nExample: ¿Cada cuánto vienes?",
);

const variations = t16Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T16-V"));

export const l16: SetLesson = {
  id: "aq-l16",
  title: "Asking how often",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T15-E04"],
  introduction: t16Introduction,
  base: ["AQ-T16-E01", "AQ-T16-E02", "AQ-T16-E03", "AQ-T16-E04", "AQ-T16-E05", "AQ-T16-E06"],
  formCards: [
    {
      before: "AQ-T16-E02",
      heading: "New form: cada cuánto tiempo",
      text: "Cada cuánto tiempo is a longer form of cada cuánto. It asks the same repeat interval, so tiempo is optional.\n\nExample: ¿Cada cuánto tiempo vienes?",
    },
  ],
  variations,
};
