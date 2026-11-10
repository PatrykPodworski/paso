import { teachingCard, type Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// T15, hasta cuándo: asks for an ending point or limit.
const recall: [string, string] = [
  "Recall the meaning: Ask for an ending point or limit.",
  "hasta cuándo",
];

const fromReply: [string, string] = [
  "Recall the requested information, not the words in the reply.",
  "hasta cuándo",
];

export const t15Items: Item[] = [
  {
    id: "AQ-T15-E01",
    mode: "choice",
    prompt: "¿Hasta cuándo estás en Madrid? What information is requested?",
    answer: "The end of the planned stay",
    choices: ["The end of the planned stay", "The start of the stay", "The place of origin"],
    say: "¿Hasta cuándo estás en Madrid?",
    feedback: "Hasta cuándo asks how long the stay continues, expressed as an end point.",
    hints: recall,
  },
  {
    id: "AQ-T15-E02",
    mode: "cloze",
    prompt: "Complete: ¿___ estás aquí? Reply: “Hasta el lunes”.",
    answer: "hasta cuándo",
    say: "¿Hasta cuándo estás aquí?",
    feedback: "Hasta el lunes supplies the end boundary.",
    hints: recall,
  },
  {
    id: "AQ-T15-E03",
    mode: "order",
    prompt: "Arrange the words.",
    answer: "¿Hasta cuándo estás en Madrid?",
    chunks: ["¿Hasta cuándo", "estás", "en Madrid", "?"],
    feedback: "Keep hasta cuándo together.",
    hints: recall,
  },
  {
    id: "AQ-T15-E04",
    mode: "ask",
    prompt:
      "The reply is “Trabajo hoy hasta las seis”. Ask the end time of today’s work. Use trabajas hoy and the end-boundary phrase.",
    answer: "¿Hasta cuándo trabajas hoy?",
    feedback:
      "Hasta cuándo asks the end boundary. Keep the requested phrase and present-tense frame.",
    hints: recall,
  },
  {
    id: "AQ-T15-E05",
    mode: "dialogue",
    prompt:
      "Your friend is staying here for several days. Ask the last day of their stay. Use estás aquí.",
    answer: "¿Hasta cuándo estás aquí?",
    constraints: [
      "Ask the end day of the stay",
      "Use estás aquí",
      "Accept equivalent end-day meaning on human review",
    ],
    feedback: "Hasta cuándo requests the end boundary. The subject pronoun tú is optional.",
    hints: recall,
  },
  {
    id: "AQ-T15-E06",
    mode: "choice",
    prompt: "The reply is “Hasta el viernes”, not “Desde enero”. Complete: ¿___ estás aquí?",
    answer: "Hasta cuándo",
    choices: ["Hasta cuándo", "Desde cuándo"],
    say: "¿Hasta cuándo estás aquí?",
    feedback: "Hasta gives the end point; desde gives the starting point.",
    hints: recall,
  },
  {
    id: "AQ-T15-V01",
    mode: "cloze",
    prompt:
      "Pablo is staying in Madrid temporarily. Complete the end-point question: ¿___ está Pablo en Madrid?",
    answer: "hasta cuándo",
    say: "¿Hasta cuándo está Pablo en Madrid?",
    feedback: "Ask when the stay ends.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V02",
    mode: "cloze",
    prompt:
      "Luis works today, ending at six. Complete the end-point question: ¿___ trabaja Luis hoy?",
    answer: "hasta cuándo",
    say: "¿Hasta cuándo trabaja Luis hoy?",
    feedback: "The requested information is the end boundary, not its start.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V03",
    mode: "order",
    prompt: "Ask when your friend’s current time at the museum ends. Arrange the words.",
    answer: "¿Hasta cuándo estás en el museo?",
    chunks: ["¿Hasta cuándo", "estás en el museo", "?"],
    feedback: "Hasta cuándo requests the end of the stay.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V04",
    mode: "ask",
    prompt:
      "The friend replies “Estoy en Madrid hasta el viernes”. Ask the stay’s end point. Use estás en Madrid.",
    answer: "¿Hasta cuándo estás en Madrid?",
    feedback: "Estoy becomes estás in the question.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V05",
    mode: "ask",
    prompt:
      "The reply is “Pablo trabaja hoy hasta las seis”. Ask the end boundary. Use trabaja Pablo hoy.",
    answer: "¿Hasta cuándo trabaja Pablo hoy?",
    feedback: "Keep third-person trabaja and ask the ending time.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V06",
    mode: "dialogue",
    prompt:
      "Luis is in the office for a limited period. Ask Pablo the end of Luis’s stay. Use está Luis en la oficina.",
    answer: "¿Hasta cuándo está Luis en la oficina?",
    constraints: ["Ask when Luis’s office stay ends", "Use está Luis en la oficina"],
    feedback: "Ask about Luis, not Pablo’s stay.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V07",
    mode: "cloze",
    prompt:
      "Two friends are in Madrid for a week. Complete the end-point question: ¿___ están Pablo y Luis en Madrid?",
    answer: "hasta cuándo",
    say: "¿Hasta cuándo están Pablo y Luis en Madrid?",
    feedback: "Use están for two people; the end phrase is unchanged.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V08",
    mode: "cloze",
    prompt: "You are asking the friend’s work finish today. Complete: ¿___ trabajas hoy?",
    answer: "hasta cuándo",
    say: "¿Hasta cuándo trabajas hoy?",
    feedback: "Trabajas addresses the friend; hasta marks the end.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V09",
    mode: "order",
    prompt: "Ask the end of Pablo’s time here. Arrange the words.",
    answer: "¿Hasta cuándo está Pablo aquí?",
    chunks: ["¿Hasta cuándo", "está Pablo", "aquí", "?"],
    feedback: "Ask for the end boundary of Pablo’s presence.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V10",
    mode: "ask",
    prompt: "The reply is “Luis está aquí hasta el lunes”. Ask the end point. Use está Luis aquí.",
    answer: "¿Hasta cuándo está Luis aquí?",
    feedback: "Keep Luis in third person.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V11",
    mode: "ask",
    prompt:
      "The reply is “Pablo y Luis trabajan hoy hasta las seis”. Ask the end point. Use trabajan Pablo y Luis hoy.",
    answer: "¿Hasta cuándo trabajan Pablo y Luis hoy?",
    feedback: "Trabajan agrees with both workers.",
    hints: fromReply,
  },
  {
    id: "AQ-T15-V12",
    mode: "dialogue",
    prompt:
      "Pablo is staying at the hotel temporarily. Ask him the last day of his stay. Use estás en el hotel.",
    answer: "¿Hasta cuándo estás en el hotel?",
    constraints: ["Ask the hotel stay’s end point", "Use estás en el hotel"],
    feedback: "Use estás when addressing Pablo directly.",
    hints: fromReply,
  },
];

const t15Introduction = teachingCard(
  "AQ-T15-INTRO",
  "New question word: hasta cuándo",
  "Hasta cuándo asks for the end point. Contrast hasta el lunes with desde enero for a starting point.\n\nExample: ¿Hasta cuándo estás en Madrid?",
);

const variations = t15Items.map((i) => i.id).filter((id) => id.startsWith("AQ-T15-V"));

export const l15: SetLesson = {
  id: "aq-l15",
  title: "Asking until when",
  subtitle: "Learn one new question word",
  recalled: ["AQ-T14-E04"],
  introduction: t15Introduction,
  base: ["AQ-T15-E01", "AQ-T15-E02", "AQ-T15-E03", "AQ-T15-E04", "AQ-T15-E05", "AQ-T15-E06"],
  formCards: [],
  variations,
};
