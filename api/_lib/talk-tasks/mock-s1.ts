import type { TaskSpec } from "./base.ts";

export const mockS1: TaskSpec = {
  id: "mock-s1",
  mode: "monologue",
  scenario:
    "You are a friendly interviewer. The learner introduces themselves and you listen to their introduction.",
  asks: [
    "Preséntate, por favor: dime cómo te llamas, tu nacionalidad, cuántos años tienes, dónde vives, en qué trabajas o qué estudias, qué lenguas hablas y cómo eres.",
  ],
  nudge: "¿Y qué lenguas hablas?",
  items: [
    { id: "name", label: "Name", example: "Me llamo Pedro" },
    { id: "nationality", label: "Nationality", example: "Soy polaco" },
    { id: "age", label: "Age", example: "Tengo treinta años" },
    { id: "residence", label: "Where you live", example: "Vivo en Varsovia" },
    { id: "occupation", label: "Occupation", example: "Soy profesor de música" },
    { id: "languages", label: "Languages", example: "Hablo polaco e inglés" },
    { id: "personality", label: "Personality", example: "Soy tranquilo y simpático" },
  ],
  asked:
    "The examiner asked the learner to present themselves for one to two minutes: their name, nationality, age, where they live, their occupation, the languages they speak and what they are like.",
  flawed: "Soy treinta años y soy profesor de la música",
  limitSeconds: 150,
};
