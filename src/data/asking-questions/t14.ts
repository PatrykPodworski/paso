import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T14, desde cuándo: asks for the starting point of a continuing situation.
const recall: [string, string] = [
  "Recall the meaning: Ask for the starting point of a continuing situation.",
  "desde cuándo",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "desde cuándo",
];

export const t14Items: Item[] = [
  {
    id: "AQ-T14-E01",
    mode: "choice",
    prompt: "¿Desde cuándo vives aquí? What information is requested?",
    answer: "When the current living situation began",
    choices: [
      "When the current living situation began",
      "When it will end",
      "Where the person lives",
    ],
    say: "¿Desde cuándo vives aquí?",
    feedback: "Desde cuándo requests the starting point of something continuing.",
    hints: recall,
  },
  {
    id: "AQ-T14-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ vives aquí? Reply: “Desde enero”.",
    answer: "desde cuándo",
    say: "¿Desde cuándo vives aquí?",
    feedback: "Desde enero gives the starting point.",
    hints: recall,
  },
  {
    id: "AQ-T14-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Desde cuándo vives aquí?",
    chunks: ["¿Desde cuándo", "vives", "aquí", "?"],
    feedback: "Desde cuándo asks when living here began.",
    hints: recall,
  },
  {
    id: "AQ-T14-E04",
    mode: "ask",
    prompt:
      "The reply is “Trabajo aquí desde enero”. Ask when this ongoing job began. Use trabajas aquí.",
    answer: "¿Desde cuándo trabajas aquí?",
    feedback: "Ask the start of the ongoing situation with desde cuándo.",
    hints: recall,
  },
  {
    id: "AQ-T14-E05",
    mode: "dialogue",
    prompt:
      "Your friend still studies Spanish. Ask when they started. Use estudias español and a continuing-state question.",
    answer: "¿Desde cuándo estudias español?",
    constraints: [
      "Ask the starting point, not a frequency",
      "Use estudias español",
      "The study still continues",
    ],
    feedback: "Keep the present tense and ask its starting point.",
    hints: recall,
  },
  {
    id: "AQ-T14-E06",
    mode: "choice",
    prompt: "Ask explicitly for the starting point of the ongoing situation: ¿___ vives aquí?",
    answer: "Desde cuándo",
    choices: ["Desde cuándo", "Cuándo"],
    say: "¿Desde cuándo vives aquí?",
    feedback:
      "Desde cuándo marks an ongoing start. Cuándo is a broad time word and does not encode desde.",
    hints: recall,
  },
  {
    id: "AQ-T14-V01",
    mode: "cloze",
    prompt:
      "Pablo still lives in Madrid. Complete the start-point question: ¿___ vive Pablo en Madrid?",
    answer: "desde cuándo",
    say: "¿Desde cuándo vive Pablo en Madrid?",
    feedback: "Ask the start of an ongoing situation, not the present location.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V02",
    mode: "cloze",
    prompt:
      "Luis still works at the museum. Complete: ¿___ trabaja Luis en el museo? Reply: “Desde enero”.",
    answer: "desde cuándo",
    say: "¿Desde cuándo trabaja Luis en el museo?",
    feedback: "Desde enero answers the start of the continuing job.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V03",
    mode: "order",
    prompt: "Ask when your friend’s continuing Spanish study began. Arrange the words.",
    answer: "¿Desde cuándo estudias español?",
    chunks: ["¿Desde cuándo", "estudias español", "?"],
    feedback: "Keep the present tense because the situation continues.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V04",
    mode: "ask",
    prompt:
      "The friend replies “Vivo en Madrid desde enero”. Ask the ongoing start point. Use vives en Madrid.",
    answer: "¿Desde cuándo vives en Madrid?",
    feedback: "Vivo becomes vives; retain the continuing-start meaning.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V05",
    mode: "ask",
    prompt:
      "The reply is “Pablo trabaja aquí desde enero”. Ask the start point. Use trabaja Pablo aquí.",
    answer: "¿Desde cuándo trabaja Pablo aquí?",
    feedback: "Trabaja remains third person; ask when it began.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V06",
    mode: "dialogue",
    prompt:
      "Luis still uses this phone. Ask Pablo since when he has been using it. Use usa Luis este móvil in a continuing-state question.",
    answer: "¿Desde cuándo usa Luis este móvil?",
    constraints: ["Ask when the ongoing phone use began", "Use usa Luis este móvil"],
    feedback: "Present usa with desde cuándo asks the continuing start.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V07",
    mode: "cloze",
    prompt:
      "Pablo and Luis still study Spanish. Complete the start-point question: ¿___ estudian Pablo y Luis español?",
    answer: "desde cuándo",
    say: "¿Desde cuándo estudian Pablo y Luis español?",
    feedback: "Estudian agrees with two students.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V08",
    mode: "cloze",
    prompt:
      "Your friend is still working from home. Complete the start-point question: ¿___ trabajas en casa?",
    answer: "desde cuándo",
    say: "¿Desde cuándo trabajas en casa?",
    feedback: "Ask since when it has been true, not the work timetable.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V09",
    mode: "order",
    prompt: "Ask about Luis’s continuing residence here. Arrange the words.",
    answer: "¿Desde cuándo vive Luis aquí?",
    chunks: ["¿Desde cuándo", "vive Luis", "aquí", "?"],
    feedback: "Vive agrees with Luis; aquí is the known place.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V10",
    mode: "ask",
    prompt:
      "The reply is “Luis estudia aquí desde enero”. Ask the start of the ongoing study. Use estudia Luis aquí.",
    answer: "¿Desde cuándo estudia Luis aquí?",
    feedback: "Use present estudia with desde cuándo.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V11",
    mode: "ask",
    prompt:
      "The reply is “Pablo y Luis viven en Madrid desde enero”. Ask the ongoing start point. Use viven Pablo y Luis en Madrid.",
    answer: "¿Desde cuándo viven Pablo y Luis en Madrid?",
    feedback: "Viven agrees with both residents.",
    hints: fromReply,
  },
  {
    id: "AQ-T14-V12",
    mode: "dialogue",
    prompt:
      "Pablo still works in the shop. Ask Pablo directly when that continuing job began. Use trabajas en la tienda.",
    answer: "¿Desde cuándo trabajas en la tienda?",
    constraints: ["Ask the ongoing job’s starting point", "Use trabajas en la tienda"],
    feedback: "Address Pablo with trabajas, not trabaja.",
    hints: fromReply,
  },
];

const t14Introduction = teachingCard(
  "AQ-T14-INTRO",
  "New question word: desde cuándo",
  "Desde cuándo asks for the start of a situation that continues now. Reply with a starting point, such as desde enero.\n\nExample: ¿Desde cuándo vives aquí?",
);

const variations = t14Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T14-V"));

export const l14: SetLesson = {
  id: "aq-l14",
  title: "Asking since when",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T13-E04"],
  introduction: t14Introduction,
  base: ["AQ-T14-E01", "AQ-T14-E02", "AQ-T14-E03", "AQ-T14-E04", "AQ-T14-E05", "AQ-T14-E06"],
  formCards: [],
  variations,
};
