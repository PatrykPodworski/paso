import type { Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const review2Items: Item[] = [
  {
    id: "TM-G03",
    mode: "order",
    instruction: "Put the parts of the day in order",
    prompt: "From the earliest to the latest",
    answer: "por la mañana por la tarde por la noche",
    chunks: ["por la noche", "por la mañana", "por la tarde"],
    feedback: "por la mañana (9:00), por la tarde (16:00), por la noche (22:00).",
    hints: ["The day starts in the morning.", "por la noche comes last."],
  },
  {
    id: "TM-G04",
    mode: "order",
    instruction: "Put the words in order",
    prompt: "From the most often to the least often",
    answer: "siempre a veces nunca",
    chunks: ["nunca", "siempre", "a veces"],
    feedback: "siempre (always), a veces (sometimes), nunca (never).",
    hints: ["Start with the word for every time.", "nunca comes last."],
  },
];

export const r02: SetLesson = {
  id: "tm-r02",
  title: "Unit review",
  subtitle: "Review this unit's lessons",
  recalled: [],
  base: [],
  formCards: [],
  variations: [
    "TM-T09-V09",
    "TM-T10-V09",
    "TM-T11-V09",
    "TM-T12-V09",
    "TM-T13-V09",
    "TM-T14-V09",
    "TM-T15-V09",
    "TM-T16-V09",
    "TM-T09-V10",
    "TM-T10-V10",
    "TM-T11-V10",
    "TM-T12-V10",
    "TM-T13-V10",
    "TM-T14-V10",
    "TM-T15-V10",
    "TM-T16-V10",
    "TM-G03",
    "TM-G04",
  ],
};
