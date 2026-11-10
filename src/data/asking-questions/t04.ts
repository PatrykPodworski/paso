import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T04, cuándo: asks for the time or date of an event, broadly; a qué hora narrows it from L09.
const recall: [string, string] = [
  "Recall the meaning: Ask for the time or date of an event, broadly.",
  "cuándo",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "cuándo",
];

export const t04Items: Item[] = [
  {
    id: "AQ-T04-E01",
    mode: "choice",
    prompt: "¿Cuándo empieza la clase? What information is requested?",
    answer: "The time or day the class starts",
    choices: ["The time or day the class starts", "The location of the class", "A desired object"],
    say: "¿Cuándo empieza la clase?",
    feedback: "Cuándo asks when an event occurs.",
    hints: recall,
  },
  {
    id: "AQ-T04-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ empieza la clase? Reply: “Mañana”.",
    answer: "cuándo",
    say: "¿Cuándo empieza la clase?",
    feedback: "Mañana answers a broad time question.",
    hints: recall,
  },
  {
    id: "AQ-T04-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Cuándo empieza la clase?",
    chunks: ["¿Cuándo", "empieza", "la clase", "?"],
    feedback: "Keep cuándo at the start of this neutral question.",
    hints: recall,
  },
  {
    id: "AQ-T04-E04",
    mode: "ask",
    prompt:
      "The reply is “La reunión es el lunes”. Ask when it is. Use es la reunión, in that order.",
    answer: "¿Cuándo es la reunión?",
    feedback: "A day answers cuándo.",
    hints: recall,
  },
  {
    id: "AQ-T04-E05",
    mode: "dialogue",
    prompt: "A friend says they can visit, but gives no day. Ask when they are coming. Use vienes.",
    answer: "¿Cuándo vienes?",
    constraints: ["Ask when the visit happens", "Address the friend with vienes"],
    feedback: "Ask for visit timing. Do not ask where the friend is.",
    hints: recall,
  },
  {
    id: "AQ-T04-E06",
    mode: "choice",
    prompt: "The answer is “Mañana”, not “En el centro”. Complete: ¿___ empieza la clase?",
    answer: "Cuándo",
    choices: ["Cuándo", "Dónde"],
    say: "¿Cuándo empieza la clase?",
    feedback: "Mañana is a time. Dónde asks for a place.",
    hints: recall,
  },
  {
    id: "AQ-T04-V01",
    mode: "cloze",
    prompt: "A bus journey is planned. Complete: ¿___ sale el autobús? Reply: “Mañana”.",
    answer: "cuándo",
    say: "¿Cuándo sale el autobús?",
    feedback: "Mañana supplies broad event timing.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V02",
    mode: "cloze",
    prompt: "Pablo’s visit day is missing. Complete: ¿___ viene Pablo?",
    answer: "cuándo",
    say: "¿Cuándo viene Pablo?",
    feedback: "Cuándo asks when Pablo comes.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V03",
    mode: "order",
    prompt: "Ask about the class day. Arrange the words.",
    answer: "¿Cuándo es la clase?",
    chunks: ["¿Cuándo", "es", "la clase", "?"],
    feedback: "Es locates the class in time here.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V04",
    mode: "ask",
    prompt: "Your friend replies “Voy el lunes”. Ask when they go to Madrid. Use vas a Madrid.",
    answer: "¿Cuándo vas a Madrid?",
    feedback: "Address the traveller with vas, not voy.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V05",
    mode: "ask",
    prompt: "The reply is “Luis viene mañana”. Ask when he comes. Use viene Luis.",
    answer: "¿Cuándo viene Luis?",
    feedback: "Keep viene for Luis.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V06",
    mode: "dialogue",
    prompt:
      "A museum visit is agreed but not its day. Ask your friend when they are going to the museum. Use vas al museo.",
    answer: "¿Cuándo vas al museo?",
    constraints: ["Ask when the visit happens", "Use vas al museo"],
    feedback: "Ask timing while keeping the museum as a known destination.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V07",
    mode: "cloze",
    prompt: "Two classes start together. Complete: ¿___ empiezan las clases? Reply: “El lunes”.",
    answer: "cuándo",
    say: "¿Cuándo empiezan las clases?",
    feedback: "The question word is invariant; empiezan agrees with clases.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V08",
    mode: "cloze",
    prompt:
      "Luis works today and tomorrow, but the meeting date is missing. Complete: ¿___ es la reunión?",
    answer: "cuándo",
    say: "¿Cuándo es la reunión?",
    feedback: "Ask the event’s date, not Luis’s state.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V09",
    mode: "order",
    prompt: "Ask the friends’ arrival day. Arrange the words.",
    answer: "¿Cuándo vienen Pablo y Luis?",
    chunks: ["¿Cuándo", "vienen", "Pablo y Luis", "?"],
    feedback: "Use vienen for two visitors.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V10",
    mode: "ask",
    prompt:
      "The reply is “La visita empieza el viernes”. Ask when it starts. Use empieza la visita.",
    answer: "¿Cuándo empieza la visita?",
    feedback: "Ask broad start timing.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V11",
    mode: "ask",
    prompt:
      "Your friend replies “Estudio el lunes”. Ask when they study. Use estudias alone after the question word.",
    answer: "¿Cuándo estudias?",
    feedback: "Switch estudio to estudias.",
    hints: fromReply,
  },
  {
    id: "AQ-T04-V12",
    mode: "dialogue",
    prompt:
      "Pablo and Luis are visiting on an unknown day. Ask a colleague when they come. Use vienen Pablo y Luis.",
    answer: "¿Cuándo vienen Pablo y Luis?",
    constraints: ["Ask visit timing", "Use vienen Pablo y Luis"],
    feedback: "The two visitors require vienen.",
    hints: fromReply,
  },
];

const t04Introduction = teachingCard(
  "AQ-T04-INTRO",
  "New question word: cuándo",
  "Cuándo asks when something happens. A day, date, or clock time can answer it.\n\nExample: ¿Cuándo empieza la clase?",
);

const variations = t04Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T04-V"));

export const l04: SetLesson = {
  id: "aq-l04",
  title: "Asking when",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T03-E04"],
  introduction: t04Introduction,
  base: ["AQ-T04-E01", "AQ-T04-E02", "AQ-T04-E03", "AQ-T04-E04", "AQ-T04-E05", "AQ-T04-E06"],
  formCards: [],
  variations,
};

export const r01: SetLesson = {
  id: "aq-r01",
  title: "Unit review",
  subtitle: "Review this unit's lessons",
  recalled: [],
  base: [
    "AQ-T01-E04",
    "AQ-T02-E04",
    "AQ-T03-E04",
    "AQ-T04-E04",
    "AQ-T01-E06",
    "AQ-T02-E06",
    "AQ-T03-E06",
    "AQ-T04-E06",
  ],
  formCards: [],
  variations: [
    "AQ-T01-V04",
    "AQ-T02-V04",
    "AQ-T03-V04",
    "AQ-T04-V04",
    "AQ-T01-V10",
    "AQ-T02-V10",
    "AQ-T03-V10",
    "AQ-T04-V10",
  ],
};
