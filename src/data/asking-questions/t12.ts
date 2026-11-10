import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T12, con quién / con quiénes: asks for a companion or companions.
const recall: [string, string] = [
  "Recall the meaning: Ask for a companion or companions.",
  "con quién / con quiénes",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "con quién / con quiénes",
];

export const t12Items: Item[] = [
  {
    id: "AQ-T12-E01",
    mode: "choice",
    prompt: "¿Con quién vas? What information is requested?",
    answer: "The person accompanying the listener",
    choices: [
      "The person accompanying the listener",
      "The destination",
      "The reason for travelling",
    ],
    say: "¿Con quién vas?",
    feedback: "Con quién asks who goes with the listener.",
    hints: recall,
  },
  {
    id: "AQ-T12-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ vas? Reply: “Con Pablo”.",
    answer: "con quién",
    say: "¿Con quién vas?",
    feedback: "Con Pablo answers con quién.",
    hints: recall,
  },
  {
    id: "AQ-T12-E03",
    mode: "order",
    prompt: "Several companions are expected. Arrange the words.",
    answer: "¿Con quiénes vas?",
    chunks: ["¿Con quiénes", "vas", "?"],
    feedback: "Quiénes is plural for the companions. Vas still addresses one listener.",
    hints: recall,
  },
  {
    id: "AQ-T12-E04",
    mode: "ask",
    prompt: "The reply is “Voy con Pablo”. Ask who is accompanying the friend. Use vas.",
    answer: "¿Con quién vas?",
    feedback: "Include con to request the companion, not simply the identity of a traveller.",
    hints: recall,
  },
  {
    id: "AQ-T12-E05",
    mode: "dialogue",
    prompt:
      "Your friend studies Spanish with one other person. Ask who that person is. Use estudias español.",
    answer: "¿Con quién estudias español?",
    constraints: ["Ask for the companion", "Use estudias español", "Assume one companion"],
    feedback: "Ask for the study companion and retain con.",
    hints: recall,
  },
  {
    id: "AQ-T12-E06",
    mode: "choice",
    prompt:
      "Ask for the companion of the person addressed, not the identity of the person coming: ¿___ vienes?",
    answer: "Con quién",
    choices: ["Con quién", "De dónde"],
    say: "¿Con quién vienes?",
    feedback:
      "Con quién vienes asks who comes with you. Quién viene would identify the person coming.",
    hints: recall,
  },
  {
    id: "AQ-T12-V01",
    mode: "cloze",
    prompt: "Pablo travels with Luis. Complete: ¿___ va Pablo? Reply: “Con Luis”.",
    answer: "con quién",
    say: "¿Con quién va Pablo?",
    feedback: "Con quién asks Pablo’s companion; va agrees with Pablo.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V02",
    mode: "cloze",
    prompt: "Luis studies with two people. Complete the plural-companion form: ¿___ estudia Luis?",
    answer: "con quiénes",
    say: "¿Con quiénes estudia Luis?",
    feedback: "Quiénes counts companions; estudia still agrees with Luis.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V03",
    mode: "order",
    prompt: "Ask Pablo’s work companion. Arrange the words.",
    answer: "¿Con quién trabaja Pablo?",
    chunks: ["¿Con quién", "trabaja Pablo", "?"],
    feedback: "Retain con to request a companion.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V04",
    mode: "ask",
    prompt: "The friend replies “Voy al museo con Luis”. Ask the companion. Use vas al museo.",
    answer: "¿Con quién vas al museo?",
    feedback: "Voy becomes vas; con asks who accompanies the friend.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V05",
    mode: "ask",
    prompt: "The reply is “Pablo estudia con Luis”. Ask the companion using estudia Pablo.",
    answer: "¿Con quién estudia Pablo?",
    feedback: "Keep estudia for Pablo; Luis is the unknown companion.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V06",
    mode: "dialogue",
    prompt:
      "Luis is going to Madrid with several friends. Ask Pablo which people go with Luis. Use va Luis a Madrid and the plural-companion phrase.",
    answer: "¿Con quiénes va Luis a Madrid?",
    constraints: [
      "Ask Luis’s companions",
      "Use va Luis a Madrid",
      "Plural companion form required",
    ],
    feedback: "Plural companions do not turn va into van when Luis is the subject.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V07",
    mode: "cloze",
    prompt: "Your friend works with Pablo. Complete: ¿___ trabajas? Reply: “Con Pablo”.",
    answer: "con quién",
    say: "¿Con quién trabajas?",
    feedback: "Trabajas addresses the friend, not Pablo.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V08",
    mode: "cloze",
    prompt:
      "Pablo comes with two people. Complete the explicit plural-companion form: ¿___ viene Pablo?",
    answer: "con quiénes",
    say: "¿Con quiénes viene Pablo?",
    feedback: "Use viene for Pablo while asking several companions.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V09",
    mode: "order",
    prompt: "Ask who accompanies Luis to the centre. Arrange the words.",
    answer: "¿Con quién va Luis al centro?",
    chunks: ["¿Con quién", "va Luis", "al centro", "?"],
    feedback: "The known destination stays al centro.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V10",
    mode: "ask",
    prompt:
      "The friend replies “Estudio español con Pablo”. Ask their study companion. Use estudias español.",
    answer: "¿Con quién estudias español?",
    feedback: "Change estudio to estudias and retain con.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V11",
    mode: "ask",
    prompt:
      "The reply is “Luis viene con Pablo y otra persona”. Ask his several companions explicitly. Use viene Luis.",
    answer: "¿Con quiénes viene Luis?",
    feedback: "Quiénes refers to the companions, not the singular arriving subject.",
    hints: fromReply,
  },
  {
    id: "AQ-T12-V12",
    mode: "dialogue",
    prompt:
      "Pablo is going to the shop with someone. Ask Pablo directly who he is going with. Use vas a la tienda.",
    answer: "¿Con quién vas a la tienda?",
    constraints: ["Ask who accompanies Pablo", "Use vas a la tienda"],
    feedback: "Address Pablo with vas and ask the companion.",
    hints: fromReply,
  },
];

const t12Introduction = teachingCard(
  "AQ-T12-INTRO",
  "New question word: con quién / con quiénes",
  "Con quién asks for a companion. Con quiénes asks for several companions. With one listener, vas stays singular even when there are several companions.\n\nExample: ¿Con quién vas?",
);

const variations = t12Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T12-V"));

export const l12: SetLesson = {
  id: "aq-l12",
  title: "Asking who with",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T11-E04"],
  introduction: t12Introduction,
  base: ["AQ-T12-E01", "AQ-T12-E02", "AQ-T12-E03", "AQ-T12-E04", "AQ-T12-E05", "AQ-T12-E06"],
  formCards: [
    {
      before: "AQ-T12-E03",
      heading: "New form: con quiénes",
      text: "Con quién expects one companion. When several companions are expected, use con quiénes; the verb still agrees with the person you ask, so vas stays.\n\nExample: ¿Con quiénes vas?",
    },
  ],
  variations,
};

export const r03: SetLesson = {
  id: "aq-r03",
  title: "Review: unit 3",
  subtitle: "Review lessons 9–12",
  recalled: [],
  base: [
    "AQ-T09-E04",
    "AQ-T10-E04",
    "AQ-T11-E04",
    "AQ-T12-E04",
    "AQ-T09-E06",
    "AQ-T10-E06",
    "AQ-T11-E06",
    "AQ-T12-E06",
  ],
  formCards: [],
  variations: [
    "AQ-T09-V04",
    "AQ-T10-V04",
    "AQ-T11-V04",
    "AQ-T12-V04",
    "AQ-T09-V10",
    "AQ-T10-V10",
    "AQ-T11-V10",
    "AQ-T12-V10",
  ],
};
