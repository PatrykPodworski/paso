import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T18, por dónde: asks for the route or place passed through.
const recall: [string, string] = [
  "Recall the meaning: Ask for the route or place passed through.",
  "por dónde",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "por dónde",
];

export const t18Items: Item[] = [
  {
    id: "AQ-T18-E01",
    mode: "choice",
    prompt: "¿Por dónde vas al centro? What information is requested?",
    answer: "The route taken to the centre",
    choices: [
      "The route taken to the centre",
      "The destination already named",
      "The journey’s purpose",
    ],
    say: "¿Por dónde vas al centro?",
    feedback: "Por dónde asks the path, not the destination already named.",
    hints: recall,
  },
  {
    id: "AQ-T18-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ vas al centro? Reply: “Por la calle Mayor”.",
    answer: "por dónde",
    say: "¿Por dónde vas al centro?",
    feedback: "Por la calle Mayor describes the route.",
    hints: recall,
  },
  {
    id: "AQ-T18-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Por dónde vas al centro?",
    chunks: ["¿Por dónde", "vas", "al centro", "?"],
    feedback: "The question asks the route to a known destination.",
    hints: recall,
  },
  {
    id: "AQ-T18-E04",
    mode: "ask",
    prompt: "The reply is “Voy al hotel por la calle Mayor”. Ask the route. Use vas al hotel.",
    answer: "¿Por dónde vas al hotel?",
    feedback: "Ask for the path with por dónde, not just the hotel as a destination.",
    hints: recall,
  },
  {
    id: "AQ-T18-E05",
    mode: "dialogue",
    prompt:
      "The destination is the hotel. Ask your friend the walking route. Use vas al hotel a pie.",
    answer: "¿Por dónde vas al hotel a pie?",
    constraints: ["Ask the route", "Keep al hotel as destination", "Specify a pie and use vas"],
    feedback: "Both word orders request the walking route. The hotel is already known.",
    hints: recall,
  },
  {
    id: "AQ-T18-E06",
    mode: "choice",
    prompt:
      "The reply is “Por la calle Mayor”, not “Al hotel”. Complete the route question: ¿___ vas?",
    answer: "Por dónde",
    choices: ["Por dónde", "Adónde"],
    say: "¿Por dónde vas?",
    feedback: "Por dónde requests the path. Adónde requests the destination.",
    hints: recall,
  },
  {
    id: "AQ-T18-V01",
    mode: "cloze",
    prompt:
      "Pablo’s destination is the museum. Complete the route question: ¿___ va Pablo al museo?",
    answer: "por dónde",
    say: "¿Por dónde va Pablo al museo?",
    feedback: "Ask the path; the destination is already named.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V02",
    mode: "cloze",
    prompt:
      "Luis is going to the station. Complete the route question: ¿___ va Luis a la estación?",
    answer: "por dónde",
    say: "¿Por dónde va Luis a la estación?",
    feedback: "Por dónde asks which route Luis takes.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V03",
    mode: "order",
    prompt: "Ask your friend’s walking route to the shop. Arrange the words.",
    answer: "¿Por dónde vas a la tienda a pie?",
    chunks: ["¿Por dónde", "vas", "a la tienda", "a pie", "?"],
    feedback: "The shop is the destination; ask the path on foot.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V04",
    mode: "ask",
    prompt:
      "The friend replies “Voy al museo por la calle Mayor”. Ask the route. Use vas al museo.",
    answer: "¿Por dónde vas al museo?",
    feedback: "Change voy to vas while asking for the route.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V05",
    mode: "ask",
    prompt:
      "The reply is “Pablo va a la estación por el centro”. Ask the route. Use va Pablo a la estación.",
    answer: "¿Por dónde va Pablo a la estación?",
    feedback: "The centre is a path element, not a replacement destination.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V06",
    mode: "dialogue",
    prompt:
      "Luis walks to the office by a route you do not know. Ask Pablo his walking route. Use va Luis a la oficina a pie.",
    answer: "¿Por dónde va Luis a la oficina a pie?",
    constraints: ["Ask the path", "Use va Luis a la oficina a pie"],
    feedback: "Ask the route and retain the known destination.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V07",
    mode: "cloze",
    prompt:
      "Two friends are heading to the hotel. Complete the route question: ¿___ van Pablo y Luis al hotel?",
    answer: "por dónde",
    say: "¿Por dónde van Pablo y Luis al hotel?",
    feedback: "Van agrees with both people; por dónde asks their route.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V08",
    mode: "cloze",
    prompt:
      "The bus is going to the centre. Complete the route question: ¿___ va el autobús al centro?",
    answer: "por dónde",
    say: "¿Por dónde va el autobús al centro?",
    feedback: "Ask the route, not the known destination.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V09",
    mode: "order",
    prompt: "Ask the train route to Madrid. Arrange the words.",
    answer: "¿Por dónde va el tren a Madrid?",
    chunks: ["¿Por dónde", "va el tren", "a Madrid", "?"],
    feedback: "The train is the subject and Madrid the destination.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V10",
    mode: "ask",
    prompt: "The reply is “Luis va al museo por el centro”. Ask the route. Use va Luis al museo.",
    answer: "¿Por dónde va Luis al museo?",
    feedback: "Keep Luis as subject; ask the way he takes.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V11",
    mode: "ask",
    prompt:
      "The reply is “Pablo y Luis van al hotel por la calle Mayor”. Ask their route. Use van Pablo y Luis al hotel.",
    answer: "¿Por dónde van Pablo y Luis al hotel?",
    feedback: "Use van for two travellers.",
    hints: fromReply,
  },
  {
    id: "AQ-T18-V12",
    mode: "dialogue",
    prompt:
      "Pablo is going to the station on foot. Ask Pablo directly which route he takes. Use vas a la estación a pie.",
    answer: "¿Por dónde vas a la estación a pie?",
    constraints: ["Ask the walking path", "Use vas a la estación a pie"],
    feedback: "Ask Pablo with vas, not third-person va.",
    hints: fromReply,
  },
];

const t18Introduction = teachingCard(
  "AQ-T18-INTRO",
  "New question word: por dónde",
  "Por dónde asks the route. Contrast por la calle Mayor, a route, with al hotel, a destination.\n\nExample: ¿Por dónde vas al centro?",
);

const variations = t18Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T18-V"));

export const l18: SetLesson = {
  id: "aq-l18",
  title: "Asking which way",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T17-E04"],
  introduction: t18Introduction,
  base: ["AQ-T18-E01", "AQ-T18-E02", "AQ-T18-E03", "AQ-T18-E04", "AQ-T18-E05", "AQ-T18-E06"],
  formCards: [],
  variations,
};

export const r04: SetLesson = {
  id: "aq-r04",
  title: "Unit review",
  subtitle: "Review this unit's lessons",
  recalled: [],
  base: [
    "AQ-T13-E04",
    "AQ-T14-E04",
    "AQ-T15-E04",
    "AQ-T16-E04",
    "AQ-T17-E04",
    "AQ-T18-E04",
    "AQ-T13-E06",
    "AQ-T14-E06",
    "AQ-T15-E06",
    "AQ-T16-E06",
    "AQ-T17-E06",
    "AQ-T18-E06",
  ],
  formCards: [],
  variations: [
    "AQ-T13-V04",
    "AQ-T14-V04",
    "AQ-T15-V04",
    "AQ-T16-V04",
    "AQ-T17-V04",
    "AQ-T18-V04",
    "AQ-T13-V10",
    "AQ-T14-V10",
    "AQ-T15-V10",
    "AQ-T16-V10",
    "AQ-T17-V10",
    "AQ-T18-V10",
  ],
};
