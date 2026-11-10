import type { TaskSpec } from "./base.ts";

export const u7: TaskSpec = {
  id: "u7",
  mode: "interview",
  scenario:
    "You are a neighbour and you talk with the learner in a street in their neighbourhood. When the learner asks where the bank is, or whether it is far from the station, answer that question with one short sentence, for example «El banco está enfrente de la farmacia» or «Está cerca, a cinco minutos a pie», before you continue or say goodbye.",
  asks: [
    "¿Dónde está tu barrio?",
    "¿Qué hay en tu barrio?",
    "¿Qué te gusta de tu barrio?",
    { learner: "Where the bank is." },
    { learner: "Whether the bank is far from the station." },
  ],
  items: [
    { id: "location", label: "Where the neighborhood is", example: "Mi barrio está en el centro" },
    {
      id: "places",
      label: "Places in it",
      example: "Hay un parque, una farmacia y dos supermercados",
    },
    { id: "likes", label: "What they like", example: "Me gusta porque es tranquilo" },
    { id: "bank", label: "Asked where the bank is", example: "¿Dónde está el banco?" },
    {
      id: "distance",
      label: "Asked how far from the station",
      example: "¿Está lejos de la estación?",
    },
  ],
  asked:
    "The examiner, a neighbour on the street, asked for five things: where the learner's neighborhood is, which places it has, what the learner likes about it, and then two questions from the learner: where the bank is and how far it is from the station. The bank and the distance count only when the learner asks the examiner, not when the examiner gives the answer unasked.",
  flawed: "En mi barrio está un parque",
  limitSeconds: 180,
};
