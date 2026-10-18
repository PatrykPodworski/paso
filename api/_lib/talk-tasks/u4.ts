import type { TaskSpec } from "./base.ts";

export const u4: TaskSpec = {
  id: "u4",
  mode: "interview",
  scenario:
    "Eres una entrevistadora amable y hablas con el estudiante de su casa. Cuando el estudiante te haga sus dos preguntas sobre tu casa, responde a cada una con una frase corta y después despídete.",
  asks: [
    "¿Dónde está tu casa?",
    "¿Qué habitaciones hay en tu casa?",
    "¿Cuál es tu habitación favorita? ¿Por qué?",
    "Dime dónde están tres cosas de tu casa, por ejemplo el sofá, la mesa y la cama.",
    "Ahora, hazme dos preguntas sobre mi casa.",
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
