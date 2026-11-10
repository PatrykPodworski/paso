import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T07, cuánto / cuánta / cuántos / cuántas: asks for an amount, a count, or a price.
const recall: [string, string] = [
  "Recall the meaning: Ask for an amount, a count, or a price.",
  "cuánto / cuánta / cuántos / cuántas",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "cuánto / cuánta / cuántos / cuántas",
];

export const t07Items: Item[] = [
  {
    id: "AQ-T07-E01",
    mode: "choice",
    prompt: "¿Cuánto cuesta? What information is requested?",
    answer: "A price",
    choices: ["A price", "A location", "A person’s identity"],
    say: "¿Cuánto cuesta?",
    feedback: "Cuánto without a following noun can ask how much something costs.",
    hints: recall,
  },
  {
    id: "AQ-T07-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ agua quieres? Reply: “Un litro”.",
    answer: "cuánta",
    say: "¿Cuánta agua quieres?",
    feedback: "Agua is feminine, despite el agua. Use cuánta agua, not cuánto agua.",
    hints: recall,
  },
  {
    id: "AQ-T07-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Cuántos libros tienes?",
    chunks: ["¿Cuántos", "libros", "tienes", "?"],
    feedback: "Libros is masculine plural, so use cuántos.",
    hints: recall,
  },
  {
    id: "AQ-T07-E04",
    mode: "ask",
    prompt:
      "The reply is “Quiero dos entradas”. Ask how many tickets the friend wants. Use entradas quieres, in that order.",
    answer: "¿Cuántas entradas quieres?",
    feedback: "Entradas is feminine plural. Use cuántas.",
    hints: recall,
  },
  {
    id: "AQ-T07-E05",
    mode: "dialogue",
    prompt:
      "The price tag is missing from a book you are holding. Ask its price. Use cuesta and este libro.",
    answer: "¿Cuánto cuesta este libro?",
    constraints: ["Ask for the price, not a count", "Identify este libro", "Use cuesta"],
    feedback: "Ask the book’s price. Cuánto does not agree with libro in this price frame.",
    hints: recall,
  },
  {
    id: "AQ-T07-E06",
    mode: "choice",
    prompt: "The reply is “Tres”, not the book titles. Complete: ¿___ libros tienes?",
    answer: "Cuántos",
    choices: ["Cuántos", "Qué"],
    say: "¿Cuántos libros tienes?",
    feedback: "Cuántos asks for a count. Qué libros would ask which books or what kind.",
    hints: recall,
  },
  {
    id: "AQ-T07-V01",
    mode: "cloze",
    prompt: "At the bakery, complete: ¿___ pan quieres? Reply: “Un poco”.",
    answer: "cuánto",
    say: "¿Cuánto pan quieres?",
    feedback: "Pan is masculine singular; use cuánto.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V02",
    mode: "cloze",
    prompt: "Pablo wants milk. Complete: ¿___ leche quiere Pablo?",
    answer: "cuánta",
    say: "¿Cuánta leche quiere Pablo?",
    feedback: "Leche is feminine singular; use cuánta.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V03",
    mode: "order",
    prompt: "Ask Pablo’s phone count. Arrange the words.",
    answer: "¿Cuántos móviles tiene Pablo?",
    chunks: ["¿Cuántos", "móviles", "tiene Pablo", "?"],
    feedback: "Móviles takes cuántos; Pablo takes tiene.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V04",
    mode: "ask",
    prompt: "The friend replies “Quiero dos camisetas”. Ask the count. Use camisetas quieres.",
    answer: "¿Cuántas camisetas quieres?",
    feedback: "Camisetas requires cuántas; address the buyer with quieres.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V05",
    mode: "ask",
    prompt: "The reply is “La entrada cuesta diez euros”. Ask its price. Use cuesta la entrada.",
    answer: "¿Cuánto cuesta la entrada?",
    feedback: "Price cuánto does not become cuánta to agree with entrada.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V06",
    mode: "dialogue",
    prompt:
      "Luis is pouring water for Pablo. Ask him how much water Pablo wants. Use agua quiere Pablo.",
    answer: "¿Cuánta agua quiere Pablo?",
    constraints: ["Ask water amount", "Use agua quiere Pablo", "Ask about Pablo, not Luis"],
    feedback: "Agua is feminine, so use cuánta despite el agua.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V07",
    mode: "cloze",
    prompt:
      "Two tickets have a combined price. Complete the price question: ¿___ cuestan las entradas?",
    answer: "cuánto",
    say: "¿Cuánto cuestan las entradas?",
    feedback: "Cuestan agrees with entradas; price cuánto stays invariant.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V08",
    mode: "cloze",
    prompt: "Your diary has several meetings today. Complete: ¿___ reuniones tienes hoy?",
    answer: "cuántas",
    say: "¿Cuántas reuniones tienes hoy?",
    feedback: "Reuniones is feminine plural; use cuántas.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V09",
    mode: "order",
    prompt: "Ask Luis’s weekly workday count. Arrange the words.",
    answer: "¿Cuántos días trabaja Luis?",
    chunks: ["¿Cuántos", "días", "trabaja Luis", "?"],
    feedback: "Días is masculine despite its ending; use cuántos.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V10",
    mode: "ask",
    prompt:
      "The reply is “Luis quiere un litro de leche”. Ask the amount of milk. Use leche quiere Luis.",
    answer: "¿Cuánta leche quiere Luis?",
    feedback: "Ask with cuánta leche, not the gender of Luis.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V11",
    mode: "ask",
    prompt: "The reply is “Pablo usa tres libros”. Ask the count. Use libros usa Pablo.",
    answer: "¿Cuántos libros usa Pablo?",
    feedback: "Cuántos agrees with libros; usa agrees with Pablo.",
    hints: fromReply,
  },
  {
    id: "AQ-T07-V12",
    mode: "dialogue",
    prompt:
      "Pablo is buying tickets for Luis. Ask Pablo how many tickets Luis wants. Use entradas quiere Luis.",
    answer: "¿Cuántas entradas quiere Luis?",
    constraints: ["Ask ticket count", "Use entradas quiere Luis", "Feminine plural agreement"],
    feedback: "The objects control cuántas; Luis controls quiere.",
    hints: fromReply,
  },
];

const t07Introduction = teachingCard(
  "AQ-T07-INTRO",
  "New question word: cuánto / cuánta / cuántos / cuántas",
  "Cuánto asks an amount or a price. Before a noun, match its gender and number: cuánta agua, cuántos libros, cuántas entradas. Use cuánto cuesta for a price.\n\nExample: ¿Cuánto cuesta? / ¿Cuánta agua quieres? / ¿Cuántos libros tienes? / ¿Cuántas entradas quieres?",
);

const variations = t07Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T07-V"));

export const l07: SetLesson = {
  id: "aq-l07",
  title: "Asking how much and how many",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T06-E04"],
  introduction: t07Introduction,
  base: ["AQ-T07-E01", "AQ-T07-E02", "AQ-T07-E03", "AQ-T07-E04", "AQ-T07-E05", "AQ-T07-E06"],
  formCards: [
    {
      before: "AQ-T07-E02",
      heading: "New form: cuánta",
      text: "Before a noun, cuánto agrees with it in gender and number. With a feminine singular noun, use cuánta.\n\nExample: ¿Cuánta agua quieres?",
    },
    {
      before: "AQ-T07-E03",
      heading: "New form: cuántos",
      text: "To ask for a count of masculine plural things, use cuántos before the noun.\n\nExample: ¿Cuántos libros tienes?",
    },
    {
      before: "AQ-T07-E04",
      heading: "New form: cuántas",
      text: "With a feminine plural noun, use cuántas. The form agrees with the noun, not with the person who answers.\n\nExample: ¿Cuántas entradas quieres?",
    },
  ],
  variations,
};
