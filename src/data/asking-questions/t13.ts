import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T13, de quién / de quiénes: asks who owns something.
const recall: [string, string] = [
  "Recall the meaning: Ask who owns something.",
  "de quién / de quiénes",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "de quién / de quiénes",
];

export const t13Items: Item[] = [
  {
    id: "AQ-T13-E01",
    mode: "choice",
    prompt: "¿De quién es este libro? What information is requested?",
    answer: "The owner of the book",
    choices: ["The owner of the book", "The book’s price", "The book’s location"],
    say: "¿De quién es este libro?",
    feedback: "De quién asks whose book it is.",
    hints: recall,
  },
  {
    id: "AQ-T13-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ es este móvil? Reply: “Es de Pablo”.",
    answer: "de quién",
    say: "¿De quién es este móvil?",
    feedback: "Es de Pablo identifies an owner.",
    hints: recall,
  },
  {
    id: "AQ-T13-E03",
    mode: "order",
    prompt: "A book has several joint owners. Arrange the words.",
    answer: "¿De quiénes es este libro?",
    chunks: ["¿De quiénes", "es", "este libro", "?"],
    feedback: "Quiénes refers to several owners. Es agrees with the singular book.",
    hints: recall,
  },
  {
    id: "AQ-T13-E04",
    mode: "ask",
    prompt:
      "The reply is “Este libro es de Luis”. Ask who owns it. Use es este libro, in that order.",
    answer: "¿De quién es este libro?",
    feedback: "Keep de before quién to ask ownership.",
    hints: recall,
  },
  {
    id: "AQ-T13-E05",
    mode: "dialogue",
    prompt: "You find one phone on a table. Ask the group who owns it. Use es and este móvil.",
    answer: "¿De quién es este móvil?",
    constraints: [
      "Ask who owns the phone",
      "Use este móvil and es",
      "Do not assume multiple owners",
    ],
    feedback: "Ask ownership, not location or the owner’s name without linking the phone.",
    hints: recall,
  },
  {
    id: "AQ-T13-E06",
    mode: "choice",
    prompt: "The reply is “De Pablo”. Complete: ¿___ es este libro?",
    answer: "De quién",
    choices: ["De quién", "Quién"],
    say: "¿De quién es este libro?",
    feedback:
      "De quién asks for the owner. Quién alone asks for a person’s identity, not ownership of a book.",
    hints: recall,
  },
  {
    id: "AQ-T13-V01",
    mode: "cloze",
    prompt: "A backpack has one owner. Complete: ¿___ es esta mochila? Reply: “De Luis”.",
    answer: "de quién",
    say: "¿De quién es esta mochila?",
    feedback: "Es agrees with mochila; de quién asks the owner.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V02",
    mode: "cloze",
    prompt:
      "Two tickets belong to one person. Complete: ¿___ son estas entradas? Reply: “De Pablo”.",
    answer: "de quién",
    say: "¿De quién son estas entradas?",
    feedback: "Plural objects require son, not automatically quiénes.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V03",
    mode: "order",
    prompt: "Ask the owner of a shirt. Arrange the words.",
    answer: "¿De quién es esta camiseta?",
    chunks: ["¿De quién", "es", "esta camiseta", "?"],
    feedback: "De quién requests ownership rather than identity of the shirt.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V04",
    mode: "ask",
    prompt: "The reply is “Esta mochila es de Pablo”. Ask its owner. Use es esta mochila.",
    answer: "¿De quién es esta mochila?",
    feedback: "Keep singular es for one backpack.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V05",
    mode: "ask",
    prompt: "The reply is “Estos libros son de Luis”. Ask the single owner. Use son estos libros.",
    answer: "¿De quién son estos libros?",
    feedback: "The books control son; a single owner still takes quién.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V06",
    mode: "dialogue",
    prompt:
      "One phone is jointly owned by several people. Ask Luis the owners. Use es este móvil and the plural-owner phrase.",
    answer: "¿De quiénes es este móvil?",
    constraints: ["Ask several owners", "Use es este móvil", "Use de quiénes"],
    feedback: "Es stays singular because the phone is singular.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V07",
    mode: "cloze",
    prompt:
      "Several people jointly own the displayed books. Complete with the plural-owner phrase: ¿___ son estos libros?",
    answer: "de quiénes",
    say: "¿De quiénes son estos libros?",
    feedback: "Both quiénes and son are plural here for different reasons.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V08",
    mode: "cloze",
    prompt: "A ticket belongs to one person. Complete: ¿___ es este billete?",
    answer: "de quién",
    say: "¿De quién es este billete?",
    feedback: "Use the owner phrase de quién.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V09",
    mode: "order",
    prompt: "Two shirts belong to one owner. Arrange the words.",
    answer: "¿De quién son estas camisetas?",
    chunks: ["¿De quién", "son", "estas camisetas", "?"],
    feedback: "Son agrees with camisetas, while quién can remain singular.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V10",
    mode: "ask",
    prompt: "The reply is “Esta bolsa es de Luis”. Ask the owner. Use es esta bolsa.",
    answer: "¿De quién es esta bolsa?",
    feedback: "Ask whose bag it is, with de quién.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V11",
    mode: "ask",
    prompt:
      "The reply is “Este libro es de Pablo y Luis”. Ask its joint owners explicitly. Use es este libro and the plural-owner phrase.",
    answer: "¿De quiénes es este libro?",
    feedback: "Plural owners take quiénes; the one book takes es.",
    hints: fromReply,
  },
  {
    id: "AQ-T13-V12",
    mode: "dialogue",
    prompt:
      "You find two phones that belong to one person. Ask Pablo the owner. Use son estos móviles.",
    answer: "¿De quién son estos móviles?",
    constraints: ["Ask the single owner", "Use son estos móviles"],
    feedback: "Do not make quién plural just because there are two phones.",
    hints: fromReply,
  },
];

const t13Introduction = teachingCard(
  "AQ-T13-INTRO",
  "New question word: de quién / de quiénes",
  "De quién asks who owns something. De quiénes asks about several owners. Es or son agrees with the owned object, not the number of owners.\n\nExample: ¿De quién es este libro?",
);

const variations = t13Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T13-V"));

export const l13: SetLesson = {
  id: "aq-l13",
  title: "Asking whose",
  subtitle: "Learn one new question word",
  recalled: [],
  introduction: t13Introduction,
  base: ["AQ-T13-E01", "AQ-T13-E02", "AQ-T13-E03", "AQ-T13-E04", "AQ-T13-E05", "AQ-T13-E06"],
  formCards: [
    {
      before: "AQ-T13-E03",
      heading: "New form: de quiénes",
      text: "De quién expects one owner. When several people own something, use de quiénes; es still agrees with the one thing they own.\n\nExample: ¿De quiénes es este libro?",
    },
  ],
  variations,
};
