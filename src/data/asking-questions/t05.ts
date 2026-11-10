import { teachingCard, type Item } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";

// T05, quién / quiénes: asks who one person or several people are.
const recall: [string, string] = [
  "Recall the meaning: Ask about the identity of one person or several people.",
  "quién / quiénes",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "quién / quiénes",
];

export const t05Items: Item[] = [
  {
    id: "AQ-T05-E01",
    mode: "choice",
    prompt: "¿Quién es? What kind of reply fits?",
    answer: "A person’s identity",
    choices: ["A person’s identity", "An event time", "A place"],
    say: "¿Quién es?",
    feedback: "Quién asks for a person.",
    hints: recall,
  },
  {
    id: "AQ-T05-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ es? Reply: “Es Pablo”.",
    answer: "quién",
    say: "¿Quién es?",
    feedback: "Es is singular. Use quién.",
    hints: recall,
  },
  {
    id: "AQ-T05-E03",
    mode: "order",
    prompt: "Two people are at the door. Arrange the words.",
    answer: "¿Quiénes son?",
    chunks: ["¿Quiénes", "son", "?"],
    feedback: "Several people and son take quiénes here.",
    hints: recall,
  },
  {
    id: "AQ-T05-E04",
    mode: "ask",
    prompt:
      "The reply is “Son Pablo y Luis”. Ask their identities. Use son alone after the question word.",
    answer: "¿Quiénes son?",
    feedback: "The requested identities are plural. Use quiénes son.",
    hints: recall,
  },
  {
    id: "AQ-T05-E05",
    mode: "dialogue",
    prompt:
      "You answer a call from an unknown number. Ask the caller’s identity directly. Use eres, not a name guess.",
    answer: "¿Quién eres?",
    constraints: ["Ask for the caller’s identity", "Use eres", "Do not guess a name"],
    feedback: "Ask the caller’s identity. Eres addresses one caller.",
    hints: recall,
  },
  {
    id: "AQ-T05-E06",
    mode: "choice",
    prompt: "The reply is “Pablo”. Complete: ¿___ viene?",
    answer: "Quién",
    choices: ["Quién", "Qué"],
    say: "¿Quién viene?",
    feedback: "Pablo is a person. Qué asks for a thing or category.",
    hints: recall,
  },
  {
    id: "AQ-T05-V01",
    mode: "cloze",
    prompt: "One person is coming. Complete: ¿___ viene hoy? Reply: “Pablo”.",
    answer: "quién",
    say: "¿Quién viene hoy?",
    feedback: "Quién identifies the person who comes.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V02",
    mode: "cloze",
    prompt: "Several people work here. Complete: ¿___ trabajan aquí? Reply: “Pablo y Luis”.",
    answer: "quiénes",
    say: "¿Quiénes trabajan aquí?",
    feedback: "Trabajan in this frame requires plural quiénes.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V03",
    mode: "order",
    prompt: "Ask who studies here. Arrange the words.",
    answer: "¿Quién estudia aquí?",
    chunks: ["¿Quién", "estudia", "aquí", "?"],
    feedback: "The unknown person is the subject of estudia.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V04",
    mode: "ask",
    prompt:
      "The reply is “Luis usa este móvil”. Ask who uses it. Use usa este móvil, with the person omitted.",
    answer: "¿Quién usa este móvil?",
    feedback: "Replace the named subject with quién, not with a second-person verb.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V05",
    mode: "ask",
    prompt:
      "The reply is “Pablo y Luis vienen mañana”. Ask which people come tomorrow. Use vienen mañana, without names.",
    answer: "¿Quiénes vienen mañana?",
    feedback: "Several named visitors become quiénes with vienen.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V06",
    mode: "dialogue",
    prompt: "Someone is reading your book. Ask Pablo who is reading it. Use lee mi libro.",
    answer: "¿Quién lee mi libro?",
    constraints: ["Ask who reads your book", "Use lee mi libro"],
    feedback: "Ask for the reader’s identity, not the book.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V07",
    mode: "cloze",
    prompt: "One customer wants tea. Complete: ¿___ quiere té? Reply: “Luis”.",
    answer: "quién",
    say: "¿Quién quiere té?",
    feedback: "Use quién to identify the customer.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V08",
    mode: "cloze",
    prompt: "Two people study Spanish. Complete: ¿___ estudian español?",
    answer: "quiénes",
    say: "¿Quiénes estudian español?",
    feedback: "Estudian agrees with a plural unknown subject here.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V09",
    mode: "order",
    prompt: "Ask which people are here. Arrange the words.",
    answer: "¿Quiénes están aquí?",
    chunks: ["¿Quiénes", "están", "aquí", "?"],
    feedback: "Plural quiénes goes with están.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V10",
    mode: "ask",
    prompt:
      "The reply is “Pablo trabaja en el museo”. Ask who works there. Use trabaja en el museo.",
    answer: "¿Quién trabaja en el museo?",
    feedback: "The question word replaces Pablo as subject.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V11",
    mode: "ask",
    prompt: "The reply is “Luis compra pan”. Ask who buys bread. Use compra pan.",
    answer: "¿Quién compra pan?",
    feedback: "Use the third-person predicate compra because quién is its subject.",
    hints: fromReply,
  },
  {
    id: "AQ-T05-V12",
    mode: "dialogue",
    prompt:
      "You see several people with books. Ask Luis which people want the books. Use quieren los libros.",
    answer: "¿Quiénes quieren los libros?",
    constraints: [
      "Ask for the people’s identities",
      "Use quieren los libros",
      "Plural identities expected",
    ],
    feedback: "Identify several people with quiénes and quieren.",
    hints: fromReply,
  },
];

const t05Introduction = teachingCard(
  "AQ-T05-INTRO",
  "New question word: quién / quiénes",
  "Quién asks for one person’s identity. Quiénes asks for several identities. Use quién es and quiénes son in these frames.\n\nExample: ¿Quién es? / ¿Quiénes son?",
);

const variations = t05Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T05-V"));

export const l05: SetLesson = {
  id: "aq-l05",
  title: "Asking who",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T04-E04"],
  introduction: t05Introduction,
  base: ["AQ-T05-E01", "AQ-T05-E02", "AQ-T05-E03", "AQ-T05-E04", "AQ-T05-E05", "AQ-T05-E06"],
  formCards: [
    {
      before: "AQ-T05-E03",
      heading: "New form: quiénes",
      text: "Quién goes with a singular verb, like es. For several people, use quiénes with a plural verb, like son.\n\nExample: ¿Quiénes son?",
    },
  ],
  variations,
};
