import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T17, para qué: asks for purpose or intended use.
const recall: [string, string] = [
  "Recall the meaning: Ask for purpose or intended use.",
  "para qué",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "para qué",
];

export const t17Items: Item[] = [
  {
    id: "AQ-T17-E01",
    mode: "choice",
    prompt: "¿Para qué usas el móvil? What information is requested?",
    answer: "The purpose of using the phone",
    choices: ["The purpose of using the phone", "The phone’s price", "The phone’s owner"],
    say: "¿Para qué usas el móvil?",
    feedback: "Para qué asks what the phone is used for.",
    hints: recall,
  },
  {
    id: "AQ-T17-E02",
    mode: "cloze",
    prompt:
      "Complete with the explicit purpose phrase: ¿___ usas el móvil? Reply: “Para trabajar”.",
    answer: "para qué",
    say: "¿Para qué usas el móvil?",
    feedback: "Para qué explicitly requests purpose.",
    hints: recall,
  },
  {
    id: "AQ-T17-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Para qué usas el móvil?",
    chunks: ["¿Para qué", "usas", "el móvil", "?"],
    feedback: "Keep para qué together to ask intended use.",
    hints: recall,
  },
  {
    id: "AQ-T17-E04",
    mode: "ask",
    prompt:
      "The reply is “Uso este libro para estudiar español”. Ask explicitly about its purpose. Use usas este libro.",
    answer: "¿Para qué usas este libro?",
    feedback:
      "Para qué asks intended use. Por qué is meaningful more broadly, but does not meet this explicit-form task.",
    hints: recall,
  },
  {
    id: "AQ-T17-E05",
    mode: "dialogue",
    prompt:
      "A friend wants a new phone. Ask what they need the phone for, using quieres and el móvil.",
    answer: "¿Para qué quieres el móvil?",
    constraints: [
      "Ask about the intended use or goal",
      "Use quieres el móvil",
      "A reason phrased as a goal may overlap; do not force a false binary",
    ],
    feedback:
      "Para qué focuses on use. Por qué may elicit the same goal, so accept its meaning but do not award target-form evidence.",
    hints: recall,
  },
  {
    id: "AQ-T17-E06",
    mode: "choice",
    prompt:
      "Choose the phrase that explicitly marks purpose rather than a general reason: ¿___ usas este libro?",
    answer: "Para qué",
    choices: ["Para qué", "Por qué"],
    say: "¿Para qué usas este libro?",
    feedback: "This is a focus choice, not a claim that por qué would be ungrammatical.",
    hints: recall,
  },
  {
    id: "AQ-T17-V01",
    mode: "cloze",
    prompt:
      "Pablo uses a book for study. Complete the explicit purpose question: ¿___ usa Pablo este libro?",
    answer: "para qué",
    say: "¿Para qué usa Pablo este libro?",
    feedback: "Para qué explicitly asks intended use.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V02",
    mode: "cloze",
    prompt:
      "Luis wants two tickets. Complete the explicit purpose question: ¿___ quiere Luis dos entradas?",
    answer: "para qué",
    say: "¿Para qué quiere Luis dos entradas?",
    feedback: "The number is known; request intended use or goal.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V03",
    mode: "order",
    prompt: "Ask your friend’s backpack use. Arrange the words.",
    answer: "¿Para qué usas la mochila?",
    chunks: ["¿Para qué", "usas", "la mochila", "?"],
    feedback: "Usas addresses the friend and para qué asks purpose.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V04",
    mode: "ask",
    prompt:
      "The friend replies “Uso el móvil para trabajar”. Ask explicitly about intended use. Use usas el móvil.",
    answer: "¿Para qué usas el móvil?",
    feedback: "Uso becomes usas; request purpose explicitly.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V05",
    mode: "ask",
    prompt:
      "The reply is “Pablo quiere este libro para estudiar”. Ask explicit purpose using quiere Pablo este libro.",
    answer: "¿Para qué quiere Pablo este libro?",
    feedback: "Keep quiere with Pablo; ask what he wants it for.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V06",
    mode: "dialogue",
    prompt:
      "Luis wants a new bag. Ask Pablo what Luis wants the bag for. Use quiere Luis la bolsa.",
    answer: "¿Para qué quiere Luis la bolsa?",
    constraints: [
      "Ask intended use or goal",
      "Use quiere Luis la bolsa",
      "A reason formulation may communicate the goal without explicit target-form evidence",
    ],
    feedback: "Purpose is the focus; a broad reason question may elicit it too.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V07",
    mode: "cloze",
    prompt:
      "Your friend uses this phone at work. Complete the explicit purpose question: ¿___ usas este móvil?",
    answer: "para qué",
    say: "¿Para qué usas este móvil?",
    feedback: "Request the purpose, not ownership or location.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V08",
    mode: "cloze",
    prompt:
      "Pablo and Luis use the room together. Complete the explicit purpose question: ¿___ usan Pablo y Luis esta sala?",
    answer: "para qué",
    say: "¿Para qué usan Pablo y Luis esta sala?",
    feedback: "Usan agrees with both users; para qué stays unchanged.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V09",
    mode: "order",
    prompt: "Ask Luis’s book use. Arrange the words.",
    answer: "¿Para qué usa Luis el libro?",
    chunks: ["¿Para qué", "usa Luis", "el libro", "?"],
    feedback: "The user is Luis, not the addressee.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V10",
    mode: "ask",
    prompt:
      "The reply is “Luis usa la mochila para trabajar”. Ask explicit intended use. Use usa Luis la mochila.",
    answer: "¿Para qué usa Luis la mochila?",
    feedback: "Use usa for Luis, and the explicit purpose phrase.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V11",
    mode: "ask",
    prompt:
      "The friend replies “Quiero la bolsa para los libros”. Ask explicit purpose. Use quieres la bolsa.",
    answer: "¿Para qué quieres la bolsa?",
    feedback: "The reply’s quiero becomes quieres.",
    hints: fromReply,
  },
  {
    id: "AQ-T17-V12",
    mode: "dialogue",
    prompt:
      "Pablo and Luis want this room. Ask a colleague their intended use. Use quieren Pablo y Luis esta sala.",
    answer: "¿Para qué quieren Pablo y Luis esta sala?",
    constraints: ["Ask intended use or goal", "Use quieren Pablo y Luis esta sala"],
    feedback: "Quieren agrees with the two people.",
    hints: fromReply,
  },
];

const t17Introduction = teachingCard(
  "AQ-T17-INTRO",
  "New question word: para qué",
  "Para qué asks about purpose or intended use. Por qué asks a broader reason and may also elicit a goal. The two can overlap in real conversations.\n\nExample: ¿Para qué usas el móvil?",
);

const variations = t17Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T17-V"));

export const l17: SetLesson = {
  id: "aq-l17",
  title: "Asking what for",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T16-E04"],
  introduction: t17Introduction,
  base: ["AQ-T17-E01", "AQ-T17-E02", "AQ-T17-E03", "AQ-T17-E04", "AQ-T17-E05", "AQ-T17-E06"],
  formCards: [],
  variations,
};
