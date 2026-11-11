import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T09, a qué hora: asks for a specific clock time.
const recall: [string, string] = [
  "Recall the meaning: Ask for a specific clock time.",
  "a qué hora",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "a qué hora",
];

export const t09Items: Item[] = [
  {
    id: "AQ-T09-E01",
    mode: "choice",
    prompt: "¿A qué hora empieza la clase? What is specifically requested?",
    answer: "A clock time",
    choices: ["A clock time", "A reason", "A location"],
    say: "¿A qué hora empieza la clase?",
    feedback: "A qué hora narrows the request to a clock time.",
    hints: recall,
  },
  {
    id: "AQ-T09-E02",
    mode: "cloze",
    prompt:
      "Complete with the phrase that explicitly requests a clock time: ¿___ empieza la clase?",
    answer: "a qué hora",
    say: "¿A qué hora empieza la clase?",
    feedback: "Include a and hora, not just qué.",
    hints: recall,
  },
  {
    id: "AQ-T09-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿A qué hora sale el tren?",
    chunks: ["¿A qué hora", "sale", "el tren", "?"],
    feedback: "The whole phrase a qué hora precedes sale.",
    hints: recall,
  },
  {
    id: "AQ-T09-E04",
    mode: "ask",
    prompt:
      "The reply is “El tren sale a las ocho”. Ask specifically for the clock time. Use sale el tren, in that order.",
    answer: "¿A qué hora sale el tren?",
    feedback:
      "A qué hora explicitly asks the clock time. Cuándo is meaningful but does not meet this constrained phrase task.",
    hints: recall,
  },
  {
    id: "AQ-T09-E05",
    mode: "dialogue",
    prompt:
      "The meeting day is settled. Ask your friend the exact clock time they are coming. Use vienes.",
    answer: "¿A qué hora vienes?",
    constraints: [
      "Ask for the arrival time",
      "Use vienes",
      "Accept cuándo as meaningful; record target phrase as not demonstrated",
    ],
    feedback:
      "A qué hora is most explicit. Cuándo is also a meaningful timing question in this context.",
    hints: recall,
  },
  {
    id: "AQ-T09-E06",
    mode: "choice",
    prompt:
      "Choose the phrase that explicitly requests clock time, rather than broad timing: ¿___ empieza la clase?",
    answer: "A qué hora",
    choices: ["A qué hora", "Cuándo"],
    say: "¿A qué hora empieza la clase?",
    feedback: "Both questions are grammatical. Only a qué hora explicitly specifies clock time.",
    hints: recall,
  },
  {
    id: "AQ-T09-V01",
    mode: "cloze",
    prompt:
      "The bus day is settled. Complete the explicit clock-time question: ¿___ sale el autobús?",
    answer: "a qué hora",
    say: "¿A qué hora sale el autobús?",
    feedback: "Ask the clock time with the whole phrase a qué hora.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V02",
    mode: "cloze",
    prompt: "Pablo visits today. Complete the explicit clock-time question: ¿___ viene Pablo?",
    answer: "a qué hora",
    say: "¿A qué hora viene Pablo?",
    feedback: "The day is known; request Pablo’s clock time.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V03",
    mode: "order",
    prompt: "Ask the museum’s opening time. Arrange the words.",
    answer: "¿A qué hora abre el museo?",
    chunks: ["¿A qué hora", "abre", "el museo", "?"],
    feedback: "Abre is the glossed opening predicate; the target phrase asks time.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V04",
    mode: "ask",
    prompt:
      "The friend replies “Voy a las seis”. Ask explicitly for their departure clock time. Use vas alone after the phrase.",
    answer: "¿A qué hora vas?",
    feedback: "Voy in the reply becomes vas in the question.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V05",
    mode: "ask",
    prompt:
      "The reply is “Luis trabaja a las ocho”. Ask explicitly at what clock time he works. Use trabaja Luis.",
    answer: "¿A qué hora trabaja Luis?",
    feedback: "Use the explicit clock-time phrase with third-person trabaja.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V06",
    mode: "dialogue",
    prompt:
      "The class is today. Ask Pablo the clock time at which the class starts. Use empieza la clase de español.",
    answer: "¿A qué hora empieza la clase de español?",
    constraints: [
      "Ask the class start time",
      "Use empieza la clase de español",
      "Cuándo may satisfy meaning but not explicit target-form evidence",
    ],
    feedback: "The explicit phrase is best; broad timing can communicate the same need.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V07",
    mode: "cloze",
    prompt:
      "Two classes start together today. Complete the clock-time request: ¿___ empiezan las clases?",
    answer: "a qué hora",
    say: "¿A qué hora empiezan las clases?",
    feedback: "Empiezan agrees with clases; the phrase remains singular hora.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V08",
    mode: "cloze",
    prompt: "The shop opens today. Complete the explicit clock-time request: ¿___ abre la tienda?",
    answer: "a qué hora",
    say: "¿A qué hora abre la tienda?",
    feedback: "Ask a clock time, keeping a in the phrase.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V09",
    mode: "order",
    prompt: "Ask when Pablo and Luis arrive today, as a clock time. Arrange the words.",
    answer: "¿A qué hora vienen Pablo y Luis?",
    chunks: ["¿A qué hora", "vienen", "Pablo y Luis", "?"],
    feedback: "Vienen agrees with the two visitors.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V10",
    mode: "ask",
    prompt:
      "The reply is “La reunión empieza a las seis”. Ask explicitly for the clock time. Use empieza la reunión.",
    answer: "¿A qué hora empieza la reunión?",
    feedback: "The requested information is a clock time, not a meeting date.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V11",
    mode: "ask",
    prompt:
      "The friend replies “Estudio a las ocho”. Ask explicitly for the clock time. Use estudias alone after the phrase.",
    answer: "¿A qué hora estudias?",
    feedback: "Address the friend with estudias.",
    hints: fromReply,
  },
  {
    id: "AQ-T09-V12",
    mode: "dialogue",
    prompt:
      "Luis comes to the hotel today. Ask Pablo his clock-time arrival. Use viene Luis al hotel.",
    answer: "¿A qué hora viene Luis al hotel?",
    constraints: ["Ask arrival time", "Use viene Luis al hotel"],
    feedback: "Ask about Luis, not the interlocutor.",
    hints: fromReply,
  },
];

const t09Introduction = teachingCard(
  "AQ-T09-INTRO",
  "New question word: a qué hora",
  "A qué hora explicitly asks a clock time. Cuándo is broader and can also receive a clock-time answer.\n\nExample: ¿A qué hora empieza la clase?",
);

const variations = t09Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T09-V"));

export const l09: SetLesson = {
  id: "aq-l09",
  title: "Asking what time",
  subtitle: "Learn one new question word",
  recalled: [],
  introduction: t09Introduction,
  base: ["AQ-T09-E01", "AQ-T09-E02", "AQ-T09-E03", "AQ-T09-E04", "AQ-T09-E05", "AQ-T09-E06"],
  formCards: [],
  variations,
};
