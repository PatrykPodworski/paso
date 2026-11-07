import type { TaskSpec } from "./base.ts";

export const u4: TaskSpec = {
  id: "u4",
  mode: "interview",
  scenario:
    "You are a friendly interviewer and you talk with the learner about their home. When the learner asks you a question about your home, answer it in one short sentence before you continue or say goodbye.",
  asks: [
    "¿Dónde está tu casa?",
    "¿Qué habitaciones hay en tu casa?",
    "¿Cuál es tu habitación favorita?",
    "Why that room, if they have not said. «¿Por qué te gusta?»",
    "One thing they have not placed yet, until three places are given. «¿Dónde está el sofá?»",
    { learner: "Two questions about your home." },
  ],
  items: [
    { id: "location", label: "Where it is", example: "Vivo en un piso en el centro" },
    { id: "rooms", label: "Rooms", example: "Tiene dos habitaciones, una cocina y un salón" },
    { id: "favorite", label: "Favorite room", example: "Me gusta el salón porque es grande" },
    {
      id: "objects",
      label: "Where three objects are",
      example:
        "La mesa está junto a la ventana, el sofá está en el salón y la cama está en mi habitación",
    },
    {
      id: "questions",
      label: "Two questions to Lucía",
      example: "¿Dónde vives? ¿Cómo es tu casa?",
    },
  ],
  asked:
    "The examiner, a friendly interviewer, asked for five things: where the learner's home is, which rooms it has, which room the learner likes most, where three things in it are, and then two questions from the learner about the examiner's home. The objects count only when the learner says where three things are, not only names them, and the questions only when the learner asks the examiner two questions about her home.",
  flawed: "La mesa es en la cocina",
  limitSeconds: 210,
};
