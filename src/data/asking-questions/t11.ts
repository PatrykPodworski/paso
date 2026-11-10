import { teachingCard, type Item } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";

// T11, adónde / a dónde: asks for a destination.
const recall: [string, string] = ["Recall the meaning: Ask for a destination.", "adónde / a dónde"];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "adónde / a dónde",
];

export const t11Items: Item[] = [
  {
    id: "AQ-T11-E01",
    mode: "choice",
    prompt: "¿Adónde vas? What information is requested?",
    answer: "The destination of the journey",
    choices: [
      "The destination of the journey",
      "The origin of the journey",
      "A reason for the journey",
    ],
    say: "¿Adónde vas?",
    feedback: "Adónde asks the place someone is going to.",
    hints: recall,
  },
  {
    id: "AQ-T11-E02",
    mode: "cloze",
    prompt: "Complete with an explicit destination form: ¿___ vas? Reply: “Al hotel”.",
    answer: "adónde",
    accepted: ["a dónde"],
    say: "¿Adónde vas?",
    feedback: "Adónde and a dónde are both correct.",
    hints: recall,
  },
  {
    id: "AQ-T11-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Adónde vas?",
    chunks: ["¿Adónde", "vas", "?"],
    feedback: "This ordering task uses the supplied one-word spelling.",
    hints: recall,
  },
  {
    id: "AQ-T11-E04",
    mode: "ask",
    prompt:
      "The reply is “Voy al hotel”. Ask where the friend is going. Use vas and an explicit destination form.",
    answer: "¿Adónde vas?",
    accepted: ["¿A dónde vas?"],
    feedback:
      "Accept both spellings. ¿Dónde vas? conveys destination too, but does not demonstrate the requested explicit form.",
    hints: recall,
  },
  {
    id: "AQ-T11-E05",
    mode: "dialogue",
    prompt: "Your friend is on a bus. Ask their destination using vas en autobús.",
    answer: "¿Adónde vas en autobús?",
    constraints: [
      "Ask for the destination, not origin",
      "Use vas en autobús",
      "Accept dónde semantically without explicit-family evidence",
    ],
    feedback:
      "Ask the destination. Dónde with vas is natural too; record whether the explicit target was used.",
    hints: recall,
  },
  {
    id: "AQ-T11-E06",
    mode: "choice",
    prompt:
      "The reply is “Al centro”, not “Del hotel”. Complete the explicit destination question: ¿___ vas?",
    answer: "Adónde",
    choices: ["Adónde", "De dónde"],
    say: "¿Adónde vas?",
    feedback: "Al centro supplies a destination. De dónde asks origin.",
    hints: recall,
  },
  {
    id: "AQ-T11-V01",
    mode: "cloze",
    prompt: "Pablo is going somewhere. Complete with an explicit destination form: ¿___ va Pablo?",
    answer: "adónde",
    accepted: ["a dónde"],
    say: "¿Adónde va Pablo?",
    feedback: "Va agrees with Pablo. Both destination spellings are correct.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V02",
    mode: "cloze",
    prompt:
      "Two friends are travelling. Complete with an explicit destination form: ¿___ van Pablo y Luis?",
    answer: "adónde",
    accepted: ["a dónde"],
    say: "¿Adónde van Pablo y Luis?",
    feedback: "Van agrees with two travellers.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V03",
    mode: "order",
    prompt: "Ask Luis’s walking destination. Arrange the words.",
    answer: "¿Adónde va Luis a pie?",
    chunks: ["¿Adónde", "va Luis", "a pie", "?"],
    feedback: "This chunk task uses the supplied one-word spelling.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V04",
    mode: "ask",
    prompt:
      "The friend replies “Voy al museo”. Ask the destination, using vas and an explicit destination form.",
    answer: "¿Adónde vas?",
    accepted: ["¿A dónde vas?"],
    feedback: "Address the friend with vas; accept either spelling.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V05",
    mode: "ask",
    prompt: "The reply is “Pablo va a la tienda”. Ask the destination using va Pablo.",
    answer: "¿Adónde va Pablo?",
    accepted: ["¿A dónde va Pablo?"],
    feedback: "Keep Pablo in third person.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V06",
    mode: "dialogue",
    prompt:
      "Luis is driving to an unknown destination. Ask Pablo where Luis is going. Use va Luis.",
    answer: "¿Adónde va Luis?",
    constraints: [
      "Ask Luis’s destination",
      "Use va Luis",
      "Accept dónde semantically without explicit-family evidence",
    ],
    feedback: "Ask destination, not origin; dónde with va is meaningful too.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V07",
    mode: "cloze",
    prompt:
      "The bus destination is missing. Complete with an explicit destination form: ¿___ va el autobús?",
    answer: "adónde",
    accepted: ["a dónde"],
    say: "¿Adónde va el autobús?",
    feedback: "Ask where the bus is going, not where it starts.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V08",
    mode: "cloze",
    prompt: "Luis is on foot. Complete with an explicit destination form: ¿___ va Luis a pie?",
    answer: "adónde",
    accepted: ["a dónde"],
    say: "¿Adónde va Luis a pie?",
    feedback: "A pie changes transport, not the destination phrase.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V09",
    mode: "order",
    prompt: "Ask two friends’ destination. Arrange the words.",
    answer: "¿A dónde van Pablo y Luis?",
    chunks: ["¿A dónde", "van", "Pablo y Luis", "?"],
    feedback: "Use van with the two travellers and the supplied two-word spelling.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V10",
    mode: "ask",
    prompt: "The reply is “El tren va a Madrid”. Ask the train’s destination using va el tren.",
    answer: "¿Adónde va el tren?",
    accepted: ["¿A dónde va el tren?"],
    feedback: "The train is the third-person subject.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V11",
    mode: "ask",
    prompt:
      "The friend replies “Voy en autobús al centro”. Ask the destination, using vas en autobús and an explicit destination form.",
    answer: "¿Adónde vas en autobús?",
    accepted: ["¿A dónde vas en autobús?"],
    feedback: "The bus is the travel mode; ask the place they are going to.",
    hints: fromReply,
  },
  {
    id: "AQ-T11-V12",
    mode: "dialogue",
    prompt:
      "Pablo and Luis are leaving together. Ask a colleague their destination. Use van Pablo y Luis.",
    answer: "¿Adónde van Pablo y Luis?",
    constraints: ["Ask their destination", "Use van Pablo y Luis"],
    feedback: "Use van, not vas, because the two friends are the subject.",
    hints: fromReply,
  },
];

export const t11Introduction = teachingCard(
  "AQ-T11-INTRO",
  "New question word: adónde / a dónde",
  "Adónde asks for a destination. A dónde is an equally correct spelling. Dónde with vas is also natural, but this lesson practises the explicit destination form.\n\nExample: ¿Adónde vas?",
);

const variations = t11Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T11-V"));

export const l11: SetLesson = {
  id: "aq-l11",
  title: "Asking where to",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T10-E04"],
  introduction: t11Introduction,
  base: ["AQ-T11-E01", "AQ-T11-E02", "AQ-T11-E03", "AQ-T11-E04", "AQ-T11-E05", "AQ-T11-E06"],
  formCards: [],
  variations,
};
