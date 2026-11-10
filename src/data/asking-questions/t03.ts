import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T03, dónde: asks where something or someone is, not where it comes from or goes to.
const recall: [string, string] = ["Recall the meaning: Ask for a stationary location.", "dónde"];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "dónde",
];

export const t03Items: Item[] = [
  {
    id: "AQ-T03-E01",
    mode: "choice",
    prompt: "¿Dónde está el baño? What is missing?",
    answer: "The location of the bathroom",
    choices: ["The location of the bathroom", "The name of a person", "The time of an event"],
    say: "¿Dónde está el baño?",
    feedback: "Dónde asks for a place.",
    hints: recall,
  },
  {
    id: "AQ-T03-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ está el hotel? Reply: “En el centro”.",
    answer: "dónde",
    say: "¿Dónde está el hotel?",
    feedback: "En el centro supplies a location.",
    hints: recall,
  },
  {
    id: "AQ-T03-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Dónde está el baño?",
    chunks: ["¿Dónde", "está", "el baño", "?"],
    feedback: "The neutral order is dónde + está + el baño.",
    hints: recall,
  },
  {
    id: "AQ-T03-E04",
    mode: "ask",
    prompt:
      "The reply is “El hotel está en el centro”. Ask its location. Use está el hotel, with that order.",
    answer: "¿Dónde está el hotel?",
    feedback: "Ask for the hotel’s location with dónde.",
    hints: recall,
  },
  {
    id: "AQ-T03-E05",
    mode: "dialogue",
    prompt: "You cannot find your phone. Ask your friend its location. Use está and mi móvil.",
    answer: "¿Dónde está mi móvil?",
    constraints: ["Ask for the phone’s current location", "Identify mi móvil", "Use está"],
    feedback: "Ask where the phone is, not what it is. A fronted topic is also natural.",
    hints: recall,
  },
  {
    id: "AQ-T03-E06",
    mode: "choice",
    prompt: "The reply is “En la mesa”. Complete: ¿___ está mi móvil?",
    answer: "Dónde",
    choices: ["Dónde", "Qué"],
    say: "¿Dónde está mi móvil?",
    feedback: "En la mesa is a place. Qué does not ask for location.",
    hints: recall,
  },
  {
    id: "AQ-T03-V01",
    mode: "cloze",
    prompt: "At the station, complete: ¿___ está la entrada? Reply: “Aquí”.",
    answer: "dónde",
    say: "¿Dónde está la entrada?",
    feedback: "Ask where the entrance is.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V02",
    mode: "cloze",
    prompt: "Pablo’s location is unknown. Complete: ¿___ está Pablo?",
    answer: "dónde",
    say: "¿Dónde está Pablo?",
    feedback: "Está locates Pablo now, not his origin.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V03",
    mode: "order",
    prompt: "You need your ticket. Arrange the words.",
    answer: "¿Dónde está mi billete?",
    chunks: ["¿Dónde", "está", "mi billete", "?"],
    feedback: "Use está with the singular billete.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V04",
    mode: "ask",
    prompt:
      "Your friend replies “Estoy en casa”. Ask their current location. Use estás alone after the question word.",
    answer: "¿Dónde estás?",
    feedback: "Estoy becomes estás when you address the friend.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V05",
    mode: "ask",
    prompt:
      "The reply is “Luis está en la tienda”. Ask his location. Use está Luis, in that order.",
    answer: "¿Dónde está Luis?",
    feedback: "The question keeps Luis as a third-person subject.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V06",
    mode: "dialogue",
    prompt: "You cannot find two books. Ask Pablo where the books are. Use están los libros.",
    answer: "¿Dónde están los libros?",
    constraints: ["Ask the books’ location", "Use están los libros"],
    feedback: "Están agrees with plural libros.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V07",
    mode: "cloze",
    prompt: "Two tickets are missing. Complete: ¿___ están las entradas?",
    answer: "dónde",
    say: "¿Dónde están las entradas?",
    feedback: "The question word is unchanged; están agrees with entradas.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V08",
    mode: "cloze",
    prompt: "You are looking for the museum. Complete: ¿___ está el museo?",
    answer: "dónde",
    say: "¿Dónde está el museo?",
    feedback: "Ask the museum’s stationary location.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V09",
    mode: "order",
    prompt: "Ask where Pablo and Luis are. Arrange the words.",
    answer: "¿Dónde están Pablo y Luis?",
    chunks: ["¿Dónde", "están", "Pablo y Luis", "?"],
    feedback: "Two people take están.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V10",
    mode: "ask",
    prompt: "The reply is “La mochila está en la mesa”. Ask its location. Use está la mochila.",
    answer: "¿Dónde está la mochila?",
    feedback: "The backpack is the subject of está.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V11",
    mode: "ask",
    prompt: "The reply is “Las camisetas están aquí”. Ask their location. Use están las camisetas.",
    answer: "¿Dónde están las camisetas?",
    feedback: "Keep plural agreement with camisetas.",
    hints: fromReply,
  },
  {
    id: "AQ-T03-V12",
    mode: "dialogue",
    prompt:
      "Luis is helping you find Pablo’s phone. Ask him where Pablo’s phone is. Use está el móvil de Pablo.",
    answer: "¿Dónde está el móvil de Pablo?",
    constraints: ["Ask the current location", "Use está el móvil de Pablo"],
    feedback: "De Pablo identifies the phone, but the missing information is location.",
    hints: fromReply,
  },
];

const t03Introduction = teachingCard(
  "AQ-T03-INTRO",
  "New question word: dónde",
  "Dónde asks for a location: a place, a thing or a person. Use ¿Dónde está…? to find it.\n\nExample: ¿Dónde está el baño?",
);

const variations = t03Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T03-V"));

export const l03: SetLesson = {
  id: "aq-l03",
  title: "Asking where",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T02-E04"],
  introduction: t03Introduction,
  base: ["AQ-T03-E01", "AQ-T03-E02", "AQ-T03-E03", "AQ-T03-E04", "AQ-T03-E05", "AQ-T03-E06"],
  formCards: [],
  variations,
};
