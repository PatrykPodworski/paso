import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T08, por qué: asks for a reason or cause.
const recall: [string, string] = ["Recall the meaning: Ask for a reason or cause.", "por qué"];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "por qué",
];

export const t08Items: Item[] = [
  {
    id: "AQ-T08-E01",
    mode: "choice",
    prompt: "¿Por qué estás aquí? What information is requested?",
    answer: "A reason for being here",
    choices: ["A reason for being here", "A location", "An event time"],
    say: "¿Por qué estás aquí?",
    feedback: "Por qué asks for a reason.",
    hints: recall,
  },
  {
    id: "AQ-T08-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ estudias español? Reply: “Porque me gusta”.",
    answer: "por qué",
    say: "¿Por qué estudias español?",
    feedback: "Write por qué in the question. Porque introduces the reason in the reply.",
    hints: recall,
  },
  {
    id: "AQ-T08-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Por qué estudias español?",
    chunks: ["¿Por qué", "estudias", "español", "?"],
    feedback: "Keep por qué as two words before the verb.",
    hints: recall,
  },
  {
    id: "AQ-T08-E04",
    mode: "ask",
    prompt: "The reply is “Estoy aquí porque trabajo aquí”. Ask the reason. Use estás aquí.",
    answer: "¿Por qué estás aquí?",
    feedback: "Ask why the person is here, not where they are.",
    hints: recall,
  },
  {
    id: "AQ-T08-E05",
    mode: "dialogue",
    prompt:
      "Your friend takes the bus every day. You want the reason, not the route or timetable. Ask using vas and en autobús.",
    answer: "¿Por qué vas en autobús?",
    constraints: [
      "Ask for the reason for the transport choice",
      "Use vas en autobús",
      "Do not ask about a route or time",
    ],
    feedback: "The reply should explain the choice of transport.",
    hints: recall,
  },
  {
    id: "AQ-T08-E06",
    mode: "choice",
    prompt: "The reply is “Porque trabajo por la mañana”. Complete: ¿___ estudias por la tarde?",
    answer: "Por qué",
    choices: ["Por qué", "Cuándo"],
    say: "¿Por qué estudias por la tarde?",
    feedback: "The answer gives a reason. Cuándo would request a time.",
    hints: recall,
  },
  {
    id: "AQ-T08-V01",
    mode: "cloze",
    prompt:
      "Luis is walking. Complete the reason question: ¿___ va Luis a pie? Reply: “Porque le gusta”.",
    answer: "por qué",
    say: "¿Por qué va Luis a pie?",
    feedback: "Ask the reason using two words, por qué.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V02",
    mode: "cloze",
    prompt: "Pablo studies at home. Complete the reason question: ¿___ estudia Pablo en casa?",
    answer: "por qué",
    say: "¿Por qué estudia Pablo en casa?",
    feedback: "The question asks why Pablo studies there, not where.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V03",
    mode: "order",
    prompt: "Ask why the friend wants tea. Arrange the words.",
    answer: "¿Por qué quieres té?",
    chunks: ["¿Por qué", "quieres té", "?"],
    feedback: "Keep por qué as two words.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V04",
    mode: "ask",
    prompt:
      "The friend replies “Trabajo en casa porque me gusta”. Ask the reason. Use trabajas en casa.",
    answer: "¿Por qué trabajas en casa?",
    feedback: "Trabajo in the reply becomes trabajas in your question.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V05",
    mode: "ask",
    prompt:
      "The reply is “Pablo usa el autobús porque es barato”. Ask the reason. Use usa Pablo el autobús.",
    answer: "¿Por qué usa Pablo el autobús?",
    feedback: "Retain Pablo as the subject; ask the reason for his choice.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V06",
    mode: "dialogue",
    prompt: "Luis reads this book every day. Ask Pablo his reason. Use lee Luis este libro.",
    answer: "¿Por qué lee Luis este libro?",
    constraints: ["Ask for a reason", "Use lee Luis este libro"],
    feedback: "Ask about Luis’s reason, not Pablo’s reading.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V07",
    mode: "cloze",
    prompt:
      "Your friend is buying two tickets. Complete: ¿___ compras dos entradas? The request is for a reason.",
    answer: "por qué",
    say: "¿Por qué compras dos entradas?",
    feedback: "The quantity is known; ask its reason.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V08",
    mode: "cloze",
    prompt: "Pablo and Luis are here. Complete the reason question: ¿___ están aquí Pablo y Luis?",
    answer: "por qué",
    say: "¿Por qué están aquí Pablo y Luis?",
    feedback: "Están agrees with both friends; por qué is unchanged.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V09",
    mode: "order",
    prompt: "Ask why Luis wants a phone. Arrange the words.",
    answer: "¿Por qué quiere Luis el móvil?",
    chunks: ["¿Por qué", "quiere Luis", "el móvil", "?"],
    feedback: "Ask for Luis’s reason with the singular verb quiere.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V10",
    mode: "ask",
    prompt:
      "The friend replies “Estudio español en Madrid porque trabajo aquí”. Ask the reason. Use estudias español en Madrid.",
    answer: "¿Por qué estudias español en Madrid?",
    feedback: "Ask the reason for studying Spanish in that stated location.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V11",
    mode: "ask",
    prompt:
      "The reply is “Luis viene mañana porque trabaja hoy”. Ask why he comes tomorrow. Use viene Luis mañana.",
    answer: "¿Por qué viene Luis mañana?",
    feedback: "The day is known; the missing information is its reason.",
    hints: fromReply,
  },
  {
    id: "AQ-T08-V12",
    mode: "dialogue",
    prompt:
      "Pablo wants milk, but you do not know why. Ask Pablo his reason directly. Use quieres leche.",
    answer: "¿Por qué quieres leche?",
    constraints: ["Ask the reason", "Use quieres leche"],
    feedback: "Quieres addresses Pablo; por qué asks his reason.",
    hints: fromReply,
  },
];

const t08Introduction = teachingCard(
  "AQ-T08-INTRO",
  "New question word: por qué",
  "Por qué asks for a reason. Use two words in a question; porque introduces a reply reason.\n\nExample: ¿Por qué estudias español?",
);

const variations = t08Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T08-V"));

export const l08: SetLesson = {
  id: "aq-l08",
  title: "Asking why",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T07-E04"],
  introduction: t08Introduction,
  base: ["AQ-T08-E01", "AQ-T08-E02", "AQ-T08-E03", "AQ-T08-E04", "AQ-T08-E05", "AQ-T08-E06"],
  formCards: [],
  variations,
};

export const r02: SetLesson = {
  id: "aq-r02",
  title: "Review: unit 2",
  subtitle: "Review lessons 5–8",
  recalled: [],
  base: [
    "AQ-T05-E04",
    "AQ-T06-E04",
    "AQ-T07-E04",
    "AQ-T08-E04",
    "AQ-T05-E06",
    "AQ-T06-E06",
    "AQ-T07-E06",
    "AQ-T08-E06",
  ],
  formCards: [],
  variations: [
    "AQ-T05-V04",
    "AQ-T06-V04",
    "AQ-T07-V04",
    "AQ-T08-V04",
    "AQ-T05-V10",
    "AQ-T06-V10",
    "AQ-T07-V10",
    "AQ-T08-V10",
  ],
};
