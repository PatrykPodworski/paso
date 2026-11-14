import type { Item } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const review1Items: Item[] = [
  {
    id: "TM-G01",
    mode: "order",
    instruction: "Put the words in time order",
    prompt: "From the earliest day to the latest",
    answer: "ayer hoy mañana",
    chunks: ["mañana", "ayer", "hoy"],
    feedback: "ayer (yesterday), hoy (today), mañana (tomorrow).",
    hints: ["Start with the day before today.", "ayer comes first, mañana last."],
  },
  {
    id: "TM-G02",
    mode: "order",
    instruction: "Build the sentence in Spanish",
    prompt: "You have breakfast at 8:00 and you work at 9:00.",
    answer: "Desayuno y luego trabajo",
    chunks: ["luego", "Desayuno", "trabajo", "y"],
    feedback: "Desayuno y luego trabajo: breakfast first, then work.",
    hints: ["Start with the first thing you do.", "luego comes before the second thing."],
  },
];

export const r01: SetLesson = {
  id: "tm-r01",
  title: "Unit review",
  subtitle: "Review this unit's lessons",
  recalled: [],
  base: [],
  formCards: [],
  variations: [
    "TM-T01-V09",
    "TM-T02-V09",
    "TM-T03-V09",
    "TM-T04-V09",
    "TM-T05-V09",
    "TM-T06-V09",
    "TM-T07-V09",
    "TM-T08-V09",
    "TM-T01-V10",
    "TM-T02-V10",
    "TM-T03-V10",
    "TM-T04-V10",
    "TM-T05-V10",
    "TM-T06-V10",
    "TM-T07-V10",
    "TM-T08-V10",
    "TM-G01",
    "TM-G02",
  ],
};
