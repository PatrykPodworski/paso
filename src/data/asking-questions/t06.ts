import { teachingCard, type Item } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";

// T06, cuál / cuáles: selects one option or several within a stated set.
const recall: [string, string] = [
  "Recall the meaning: Select or identify an option within a stated set.",
  "cuál / cuáles",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "cuál / cuáles",
];

export const t06Items: Item[] = [
  {
    id: "AQ-T06-E01",
    mode: "choice",
    prompt: "¿Cuál de estos dos quieres? What is requested?",
    answer: "One choice from these two",
    choices: ["One choice from these two", "A location", "A time"],
    say: "¿Cuál de estos dos quieres?",
    feedback: "Cuál de estos dos selects from an explicit set.",
    hints: recall,
  },
  {
    id: "AQ-T06-E02",
    mode: "cloze",
    prompt: "Two coffees are on the tray. You want one. Complete: ¿___ de estos dos quieres?",
    answer: "cuál",
    say: "¿Cuál de estos dos quieres?",
    feedback: "One selected coffee takes cuál.",
    hints: recall,
  },
  {
    id: "AQ-T06-E03",
    mode: "order",
    prompt: "You want several of three books. Arrange the words.",
    answer: "¿Cuáles de estos tres quieres?",
    chunks: ["¿Cuáles", "de estos tres", "quieres", "?"],
    feedback: "Cuáles refers to several chosen books. Quieres still addresses one person.",
    hints: recall,
  },
  {
    id: "AQ-T06-E04",
    mode: "ask",
    prompt:
      "Two books are visible. Ask the friend which one they want. Use de estos dos quieres, in that order.",
    answer: "¿Cuál de estos dos quieres?",
    feedback: "The set is explicit and the requested selection is singular.",
    hints: recall,
  },
  {
    id: "AQ-T06-E05",
    mode: "dialogue",
    prompt:
      "Three shirts are visible. The customer wants two. Ask which ones they want. Use de estas tres and quieres.",
    answer: "¿Cuáles de estas tres quieres?",
    constraints: [
      "Request a plural selection",
      "Refer to these three shirts with de estas tres",
      "Use quieres",
    ],
    feedback: "Cuáles refers to the two selected shirts. Estas agrees with camisetas.",
    hints: recall,
  },
  {
    id: "AQ-T06-E06",
    mode: "choice",
    prompt: "There is no displayed set. Ask about a drink category: ¿___ bebida quieres?",
    answer: "Qué",
    choices: ["Qué", "Cuál"],
    say: "¿Qué bebida quieres?",
    feedback: "Use qué + bebida in this Spain-oriented frame. Cuál de… needs a stated set.",
    hints: recall,
  },
  {
    id: "AQ-T06-V01",
    mode: "cloze",
    prompt:
      "Three books are displayed. Pablo wants one. Complete: ¿___ de estos tres quiere Pablo?",
    answer: "cuál",
    say: "¿Cuál de estos tres quiere Pablo?",
    feedback: "One selected book takes cuál; Pablo takes quiere.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V02",
    mode: "cloze",
    prompt:
      "Three shirts are displayed. Your friend wants two. Complete: ¿___ de estas tres quieres?",
    answer: "cuáles",
    say: "¿Cuáles de estas tres quieres?",
    feedback: "Cuáles refers to the chosen shirts, not the singular listener.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V03",
    mode: "order",
    prompt: "Luis wants one of two tickets. Arrange the words.",
    answer: "¿Cuál de estas dos quiere Luis?",
    chunks: ["¿Cuál", "de estas dos", "quiere Luis", "?"],
    feedback: "Cuál selects one; estas refers to feminine entradas.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V04",
    mode: "ask",
    prompt:
      "Three phones are displayed. The friend replies “Quiero este”. Ask which one they want. Use de estos tres quieres.",
    answer: "¿Cuál de estos tres quieres?",
    feedback: "The explicit three-phone set supports cuál de.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V05",
    mode: "ask",
    prompt:
      "Three books are displayed. The reply is “Pablo quiere estos dos”. Ask which ones he wants. Use de estos tres quiere Pablo.",
    answer: "¿Cuáles de estos tres quiere Pablo?",
    feedback: "Cuáles is plural, while quiere agrees with Pablo.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V06",
    mode: "dialogue",
    prompt:
      "Luis is choosing one of two backpacks. Ask him which one he wants. Use de estas dos quieres.",
    answer: "¿Cuál de estas dos quieres?",
    constraints: [
      "Explicit set of two backpacks",
      "Ask for one selection",
      "Use de estas dos quieres",
    ],
    feedback: "Estas refers to feminine mochilas; cuál selects just one.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V07",
    mode: "cloze",
    prompt: "Three drinks are visible. Luis wants one. Complete: ¿___ de estas tres quiere Luis?",
    answer: "cuál",
    say: "¿Cuál de estas tres quiere Luis?",
    feedback: "Use cuál for one selected drink.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V08",
    mode: "cloze",
    prompt:
      "Three tickets are displayed. Pablo wants two. Complete: ¿___ de estas tres quiere Pablo?",
    answer: "cuáles",
    say: "¿Cuáles de estas tres quiere Pablo?",
    feedback: "The selected tickets are plural, but Pablo still takes quiere.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V09",
    mode: "order",
    prompt: "Ask the friend to choose several phones from three. Arrange the words.",
    answer: "¿Cuáles de estos tres quieres?",
    chunks: ["¿Cuáles", "de estos tres", "quieres", "?"],
    feedback: "Cuáles marks multiple choices; quieres addresses one friend.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V10",
    mode: "ask",
    prompt:
      "Two shirts are shown. The reply is “Luis quiere esta”. Ask which one. Use de estas dos quiere Luis.",
    answer: "¿Cuál de estas dos quiere Luis?",
    feedback: "Use the singular choice form and feminine set reference.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V11",
    mode: "ask",
    prompt:
      "Three phones are shown. The friend replies “Quiero estos dos”. Ask which ones. Use de estos tres quieres.",
    answer: "¿Cuáles de estos tres quieres?",
    feedback: "Plural choice uses cuáles, not a plural form of quieres.",
    hints: fromReply,
  },
  {
    id: "AQ-T06-V12",
    mode: "dialogue",
    prompt:
      "Pablo wants two of three shirts. Ask Luis which shirts Pablo wants. Use de estas tres quiere Pablo.",
    answer: "¿Cuáles de estas tres quiere Pablo?",
    constraints: [
      "Ask for multiple selected shirts",
      "Keep the explicit set de estas tres",
      "Use quiere Pablo",
    ],
    feedback: "The chooser is Pablo, not Luis.",
    hints: fromReply,
  },
];

const t06Introduction = teachingCard(
  "AQ-T06-INTRO",
  "New question word: cuál / cuáles",
  "Cuál de… selects one option in a stated set; cuáles de… selects several. Use qué before a noun for an unrestricted category. The person addressed still controls quieres.\n\nExample: ¿Cuál de estos dos quieres?",
);

const variations = t06Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T06-V"));

export const l06: SetLesson = {
  id: "aq-l06",
  title: "Asking which one",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T05-E04"],
  introduction: t06Introduction,
  base: ["AQ-T06-E01", "AQ-T06-E02", "AQ-T06-E03", "AQ-T06-E04", "AQ-T06-E05", "AQ-T06-E06"],
  formCards: [
    {
      before: "AQ-T06-E03",
      heading: "New form: cuáles",
      text: "Cuál de… picks one option from a stated set. To pick several, use cuáles de…; the verb still agrees with the person who chooses, so quieres stays.\n\nExample: ¿Cuáles de estos tres quieres?",
    },
  ],
  variations,
};
