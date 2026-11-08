import { teachingCard, type Item } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";

// T02, cómo: asks about manner or state, and forms the everyday name question.
const recall: [string, string] = [
  "Recall the meaning: Ask about manner or state; use the common name formula.",
  "cómo",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "cómo",
];

export const t02Items: Item[] = [
  {
    id: "AQ-T02-E01",
    mode: "choice",
    prompt: "¿Cómo te llamas? What information is requested?",
    answer: "The listener’s name",
    choices: ["The listener’s name", "A desired drink", "A place"],
    say: "¿Cómo te llamas?",
    feedback: "Te llamas makes this the everyday name question.",
    hints: recall,
  },
  {
    id: "AQ-T02-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ te llamas? Reply: “Me llamo Pablo”.",
    answer: "cómo",
    say: "¿Cómo te llamas?",
    feedback: "Use cómo in the fixed name formula.",
    hints: recall,
  },
  {
    id: "AQ-T02-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Cómo te llamas?",
    chunks: ["¿Cómo", "te", "llamas", "?"],
    feedback: "Keep te immediately before llamas.",
    hints: recall,
  },
  {
    id: "AQ-T02-E04",
    mode: "ask",
    prompt:
      "The reply is “Estoy bien”. Ask one friend about their state. Use estás, without a subject pronoun.",
    answer: "¿Cómo estás?",
    feedback: "Cómo + estás asks how the friend is.",
    hints: recall,
  },
  {
    id: "AQ-T02-E05",
    mode: "dialogue",
    prompt:
      "You ordered coffee. The server needs to know your preferred preparation. Ask the customer how they want the coffee. Use quieres and el café.",
    answer: "¿Cómo quieres el café?",
    constraints: [
      "Ask about the manner or preparation",
      "Keep el café as the chosen drink",
      "Use quieres",
    ],
    feedback: "Ask about preparation, not which drink. The coffee is already chosen.",
    hints: recall,
  },
  {
    id: "AQ-T02-E06",
    mode: "choice",
    prompt: "The answer is “Con leche”. Complete: ¿___ quieres el café?",
    answer: "Cómo",
    choices: ["Cómo", "Qué"],
    say: "¿Cómo quieres el café?",
    feedback: "Con leche describes preparation. Qué would ask for a thing or category.",
    hints: recall,
  },
  {
    id: "AQ-T02-V01",
    mode: "cloze",
    prompt: "You meet Luis. Complete: ¿___ te llamas? Reply: “Me llamo Luis”.",
    answer: "cómo",
    say: "¿Cómo te llamas?",
    feedback: "Use the everyday name formula with te llamas.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V02",
    mode: "cloze",
    prompt: "Pablo says “Luis está bien”. Complete the state question: ¿___ está Luis?",
    answer: "cómo",
    say: "¿Cómo está Luis?",
    feedback: "Estar plus cómo asks about Luis’s state.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V03",
    mode: "order",
    prompt: "Ask Pablo about himself today. Arrange the words.",
    answer: "¿Cómo estás hoy?",
    chunks: ["¿Cómo", "estás", "hoy", "?"],
    feedback: "Estás addresses Pablo; hoy adds today’s context.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V04",
    mode: "ask",
    prompt: "Your friend replies “Me llamo Luis”. Ask their name. Use te llamas.",
    answer: "¿Cómo te llamas?",
    feedback: "The reply’s me becomes te when you ask the friend.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V05",
    mode: "ask",
    prompt: "The reply is “Pablo está bien”. Ask about his state. Use está Pablo, in that order.",
    answer: "¿Cómo está Pablo?",
    feedback: "Keep Pablo in third person with está.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V06",
    mode: "dialogue",
    prompt:
      "The drink is already tea. Ask your friend how they want the tea prepared. Use quieres el té.",
    answer: "¿Cómo quieres el té?",
    constraints: ["Ask manner or preparation", "Use quieres el té"],
    feedback: "The drink is chosen; ask about its preparation.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V07",
    mode: "cloze",
    prompt: "A friend’s name is unknown. Complete: ¿___ se llama tu amigo? Reply: “Luis”.",
    answer: "cómo",
    say: "¿Cómo se llama tu amigo?",
    feedback: "Se llama is the third-person name frame, not te llamas.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V08",
    mode: "cloze",
    prompt:
      "Luis chooses transport to the centre. Complete the manner question: ¿___ va Luis al centro? Reply: “En autobús”.",
    answer: "cómo",
    say: "¿Cómo va Luis al centro?",
    feedback: "En autobús describes how Luis travels.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V09",
    mode: "order",
    prompt: "Ask about Pablo’s drink preparation. Arrange the words.",
    answer: "¿Cómo quiere Pablo el café?",
    chunks: ["¿Cómo", "quiere", "Pablo", "el café", "?"],
    feedback: "Quiere agrees with Pablo, and cómo asks preparation.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V10",
    mode: "ask",
    prompt: "The friend replies “Voy a pie”. Ask how they go to the hotel. Use vas al hotel.",
    answer: "¿Cómo vas al hotel?",
    feedback: "Switch voy to vas and ask manner, not destination.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V11",
    mode: "ask",
    prompt:
      "Your friend replies “Mi amigo se llama Luis”. Ask the name of their friend using se llama tu amigo.",
    answer: "¿Cómo se llama tu amigo?",
    feedback: "The third-person name formula uses se llama.",
    hints: fromReply,
  },
  {
    id: "AQ-T02-V12",
    mode: "dialogue",
    prompt: "You are checking on Pablo and Luis. Ask Pablo how Luis is today. Use está Luis hoy.",
    answer: "¿Cómo está Luis hoy?",
    constraints: ["Ask about Luis’s state today", "Use está Luis hoy"],
    feedback: "Ask about Luis, not the person you address.",
    hints: fromReply,
  },
];

export const t02Introduction = teachingCard(
  "AQ-T02-INTRO",
  "New question word: cómo",
  "Cómo asks how. Learn the everyday name formula ¿Cómo te llamas? and the state question ¿Cómo estás? Contrast with qué for a thing.\n\nExample: ¿Cómo te llamas?",
);

const variations = t02Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T02-V"));

export const l02: SetLesson = {
  id: "aq-l02",
  title: "Asking how",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T01-E04"],
  introduction: t02Introduction,
  base: [
    "AQ-T02-E01",
    "AQ-T02-E02",
    "AQ-T02-E03",
    "AQ-T02-E04",
    "AQ-T02-E05",
    "AQ-T01-E06",
    "AQ-T02-E06",
  ],
  formCards: [],
  variations,
};
