import { teachingCard, type Item } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";

// T01, qué: asks for a thing, an activity or, before a noun, a category.
const recall: [string, string] = [
  "Recall the meaning: Ask for a thing, activity, or category.",
  "qué",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "qué",
];

export const t01Items: Item[] = [
  {
    id: "AQ-T01-E01",
    mode: "choice",
    prompt: "¿Qué quieres? Choose the information the speaker wants.",
    answer: "A thing the listener wants",
    choices: ["A thing the listener wants", "The location of the listener", "The time of an event"],
    say: "¿Qué quieres?",
    feedback: "Qué asks for the wanted thing, not its location.",
    hints: recall,
  },
  {
    id: "AQ-T01-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ quieres? The answer is “Un café”.",
    answer: "qué",
    say: "¿Qué quieres?",
    feedback: "A café is a thing, so use qué.",
    hints: recall,
  },
  {
    id: "AQ-T01-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Qué quieres?",
    chunks: ["¿Qué", "quieres", "?"],
    feedback: "Put qué before quieres.",
    hints: recall,
  },
  {
    id: "AQ-T01-E04",
    mode: "ask",
    prompt:
      "The reply is “Un café”. Ask what the person wants. Use quieres, with no noun after it.",
    answer: "¿Qué quieres?",
    feedback: "Ask for the object of quieres, not a yes-or-no confirmation.",
    hints: recall,
  },
  {
    id: "AQ-T01-E05",
    mode: "dialogue",
    prompt:
      "You are the server. The customer is ready to order a drink. Ask which drink they want. Use bebida and quieres.",
    answer: "¿Qué bebida quieres?",
    constraints: [
      "Ask about the desired drink",
      "Include bebida and quieres",
      "Address one person informally",
    ],
    feedback:
      "Use qué before bebida. Both the drink category and the customer’s choice must be clear.",
    hints: recall,
  },
  {
    id: "AQ-T01-E06",
    mode: "choice",
    prompt:
      "The answer is “Un café”, not a description of its preparation. Complete: ¿___ quieres?",
    answer: "Qué",
    choices: ["Qué", "Cómo"],
    say: "¿Qué quieres?",
    feedback: "Qué asks for the wanted thing. Cómo asks how.",
    hints: recall,
  },
  {
    id: "AQ-T01-V01",
    mode: "cloze",
    prompt: "At a bakery, the reply is “Pan”. Complete: ¿___ quieres comprar?",
    answer: "qué",
    say: "¿Qué quieres comprar?",
    feedback: "Pan is the thing the customer wants to buy.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V02",
    mode: "cloze",
    prompt: "Pablo wants tea. Complete: ¿___ quiere Pablo? Reply: “Té”.",
    answer: "qué",
    say: "¿Qué quiere Pablo?",
    feedback: "Ask for Pablo’s wanted object, with quiere for Pablo.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V03",
    mode: "order",
    prompt: "Luis wants to read something. Arrange the words.",
    answer: "¿Qué lee Luis?",
    chunks: ["¿Qué", "lee", "Luis", "?"],
    feedback: "The question asks what Luis reads, not who reads.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V04",
    mode: "ask",
    prompt:
      "Your friend replies “Quiero zumo”. Ask what drink they want. Use bebida quieres, in that order.",
    answer: "¿Qué bebida quieres?",
    feedback: "Ask the friend with quieres, even though the reply used quiero.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V05",
    mode: "ask",
    prompt:
      "Pablo says “Luis quiere un libro”. Ask what Luis wants. Use quiere Luis, in that order.",
    answer: "¿Qué quiere Luis?",
    feedback: "The subject remains Luis. Use quiere, not quieres.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V06",
    mode: "dialogue",
    prompt:
      "You are helping Pablo at a shop. Ask Pablo directly what he wants to buy. Use quieres comprar.",
    answer: "¿Qué quieres comprar?",
    constraints: ["Ask what Pablo wants to buy", "Address Pablo with quieres comprar"],
    feedback: "Ask for the desired purchase, not a yes-or-no choice.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V07",
    mode: "cloze",
    prompt:
      "Your friend is choosing reading material. Complete: ¿___ libro quieres? Reply: “Este”.",
    answer: "qué",
    say: "¿Qué libro quieres?",
    feedback: "Use qué before the noun libro.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V08",
    mode: "cloze",
    prompt: "Luis wants a drink. Complete: ¿___ bebida quiere Luis?",
    answer: "qué",
    say: "¿Qué bebida quiere Luis?",
    feedback: "Qué before bebida asks for the desired drink category.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V09",
    mode: "order",
    prompt: "Ask about Pablo’s food. Arrange the words.",
    answer: "¿Qué come Pablo?",
    chunks: ["¿Qué", "come", "Pablo", "?"],
    feedback: "Come agrees with Pablo; qué asks for the food.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V10",
    mode: "ask",
    prompt:
      "The friend replies “Leo un libro”. Ask what they read. Use lees, without a noun or subject pronoun.",
    answer: "¿Qué lees?",
    feedback: "Change the reply’s leo to lees when addressing the reader.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V11",
    mode: "ask",
    prompt:
      "A friend replies “Compro pan”. Ask what they buy. Use compras alone after the question word.",
    answer: "¿Qué compras?",
    feedback: "The question addresses the buyer, so use compras.",
    hints: fromReply,
  },
  {
    id: "AQ-T01-V12",
    mode: "dialogue",
    prompt:
      "You and Luis discuss Pablo’s lunch. Ask Luis what Pablo eats. Use come Pablo, in that order.",
    answer: "¿Qué come Pablo?",
    constraints: ["Ask what Pablo eats", "Use come Pablo", "Do not address Luis as the eater"],
    feedback: "Pablo is the eater; Luis is only the person answering.",
    hints: fromReply,
  },
];

export const t01Introduction = teachingCard(
  "AQ-T01-INTRO",
  "New question word: qué",
  "Qué asks for a thing or activity. Before a noun, it asks for a category: ¿Qué bebida quieres?\n\nExample: ¿Qué quieres?",
);

const variations = t01Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T01-V"));

export const l01: SetLesson = {
  id: "aq-l01",
  title: "Asking for things",
  subtitle: "Learn one new question word",
  recalled: [],
  introduction: t01Introduction,
  base: ["AQ-T01-E01", "AQ-T01-E02", "AQ-T01-E03", "AQ-T01-E04", "AQ-T01-E05"],
  formCards: [],
  variations,
};
