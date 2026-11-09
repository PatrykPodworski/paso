import { teachingCard, type Item } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";

// T10, de dónde: asks for origin.
const recall: [string, string] = ["Recall the meaning: Ask for origin.", "de dónde"];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "de dónde",
];

export const t10Items: Item[] = [
  {
    id: "AQ-T10-E01",
    mode: "choice",
    prompt: "¿De dónde eres? What information is requested?",
    answer: "The place the listener is from",
    choices: [
      "The place the listener is from",
      "The listener’s current location",
      "The time of a visit",
    ],
    say: "¿De dónde eres?",
    feedback: "De marks origin, not current location.",
    hints: recall,
  },
  {
    id: "AQ-T10-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ eres? Reply: “Soy de Polonia”.",
    answer: "de dónde",
    say: "¿De dónde eres?",
    feedback: "Soy de Polonia answers de dónde eres.",
    hints: recall,
  },
  {
    id: "AQ-T10-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿De dónde eres?",
    chunks: ["¿De dónde", "eres", "?"],
    feedback: "Keep de with dónde.",
    hints: recall,
  },
  {
    id: "AQ-T10-E04",
    mode: "ask",
    prompt:
      "The reply is “Soy de Madrid”. Ask the friend’s origin. Use eres without a subject pronoun.",
    answer: "¿De dónde eres?",
    feedback: "Ask origin with de dónde, not present location with dónde.",
    hints: recall,
  },
  {
    id: "AQ-T10-E05",
    mode: "dialogue",
    prompt:
      "Your friend has just arrived after a trip. Ask where they are coming from, using vienes.",
    answer: "¿De dónde vienes?",
    constraints: ["Ask for the origin of this journey", "Use vienes", "Do not substitute eres"],
    feedback: "The question requests the journey’s origin, not the friend’s nationality.",
    hints: recall,
  },
  {
    id: "AQ-T10-E06",
    mode: "choice",
    prompt: "The reply is “De Polonia”, not “En Madrid”. Complete: ¿___ eres?",
    answer: "De dónde",
    choices: ["De dónde", "Dónde"],
    say: "¿De dónde eres?",
    feedback: "Origin uses de dónde. Dónde estás asks current location.",
    hints: recall,
  },
  {
    id: "AQ-T10-V01",
    mode: "cloze",
    prompt: "Pablo’s origin is unknown. Complete: ¿___ es Pablo? Reply: “De Madrid”.",
    answer: "de dónde",
    say: "¿De dónde es Pablo?",
    feedback: "Es Pablo is third-person origin, not Pablo’s current location.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V02",
    mode: "cloze",
    prompt: "A bus arrives from Madrid. Complete the origin question: ¿___ viene el autobús?",
    answer: "de dónde",
    say: "¿De dónde viene el autobús?",
    feedback: "De marks the starting place of this journey.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V03",
    mode: "order",
    prompt: "Ask Luis’s origin. Arrange the words.",
    answer: "¿De dónde es Luis?",
    chunks: ["¿De dónde", "es", "Luis", "?"],
    feedback: "Use es for Luis, not eres.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V04",
    mode: "ask",
    prompt:
      "The friend replies “Vengo de la tienda”. Ask the origin of their journey. Use vienes alone after the phrase.",
    answer: "¿De dónde vienes?",
    feedback: "Vengo becomes vienes when you address the traveller.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V05",
    mode: "ask",
    prompt: "The reply is “El tren sale de Madrid”. Ask its departure origin. Use sale el tren.",
    answer: "¿De dónde sale el tren?",
    feedback: "Ask where the train departs from, not its departure time.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V06",
    mode: "dialogue",
    prompt:
      "Pablo and Luis are new colleagues. Ask another colleague where they are from. Use son Pablo y Luis.",
    answer: "¿De dónde son Pablo y Luis?",
    constraints: ["Ask their origin", "Use son Pablo y Luis"],
    feedback: "Son agrees with both people; de dónde asks origin.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V07",
    mode: "cloze",
    prompt: "Luis is arriving from work. Complete the origin question: ¿___ viene Luis?",
    answer: "de dónde",
    say: "¿De dónde viene Luis?",
    feedback: "Viene asks about this arrival’s origin, not necessarily birthplace.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V08",
    mode: "cloze",
    prompt:
      "Two trains depart from the same station. Complete the origin question: ¿___ salen los trenes?",
    answer: "de dónde",
    say: "¿De dónde salen los trenes?",
    feedback: "Salen agrees with trenes; de dónde is unchanged.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V09",
    mode: "order",
    prompt: "Ask Pablo’s journey origin. Arrange the words.",
    answer: "¿De dónde viene Pablo?",
    chunks: ["¿De dónde", "viene", "Pablo", "?"],
    feedback: "Use viene with Pablo and retain de.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V10",
    mode: "ask",
    prompt:
      "The reply is “Pablo es de Polonia”. Ask Pablo’s origin, speaking to Luis. Use es Pablo.",
    answer: "¿De dónde es Pablo?",
    feedback: "The question is about Pablo, so use es, not eres.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V11",
    mode: "ask",
    prompt: "The reply is “El autobús sale del centro”. Ask its origin. Use sale el autobús.",
    answer: "¿De dónde sale el autobús?",
    feedback: "Del centro answers de dónde.",
    hints: fromReply,
  },
  {
    id: "AQ-T10-V12",
    mode: "dialogue",
    prompt: "You meet Luis during a trip. Ask Luis directly where he is from. Use eres.",
    answer: "¿De dónde eres?",
    constraints: ["Ask Luis’s personal origin", "Use eres"],
    feedback: "Origin uses eres here, not a journey predicate.",
    hints: fromReply,
  },
];

export const t10Introduction = teachingCard(
  "AQ-T10-INTRO",
  "New question word: de dónde",
  "De dónde asks for origin. Contrast ¿De dónde eres? with ¿Dónde estás? for current location.\n\nExample: ¿De dónde eres?",
);

const variations = t10Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T10-V"));

export const l10: SetLesson = {
  id: "aq-l10",
  title: "Asking where from",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T09-E04"],
  introduction: t10Introduction,
  base: ["AQ-T10-E01", "AQ-T10-E02", "AQ-T10-E03", "AQ-T10-E04", "AQ-T10-E05", "AQ-T10-E06"],
  formCards: [],
  variations,
};
