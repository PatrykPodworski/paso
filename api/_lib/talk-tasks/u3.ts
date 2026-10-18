import type { TaskSpec } from "./base.ts";

export const u3: TaskSpec = {
  id: "u3",
  mode: "interview",
  scenario:
    "Eres una entrevistadora amable y hablas con el estudiante de su familia. Cuando el estudiante te haga sus dos preguntas sobre tu familia, responde a cada una con una frase corta y después despídete.",
  asks: [
    "¿Quién hay en tu familia?",
    "Describe a una persona de tu familia, por favor. ¿Cómo es?",
    "¿Qué hacéis juntos?",
    "Ahora, hazme dos preguntas sobre mi familia.",
  ],
  items: [
    { id: "members", label: "Family members", example: "Vivo con mi madre y mi hermano" },
    { id: "person", label: "One person described", example: "Mi madre es alta y simpática" },
    { id: "together", label: "What you do together", example: "Los domingos vamos al parque" },
    {
      id: "questions",
      label: "Two questions to Lucía",
      example: "¿Tienes hermanos? ¿Dónde vive tu familia?",
    },
  ],
  asked:
    "The examiner, a friendly interviewer, asked for four things: who is in the learner's family, a description of one of them, what the learner does with their family, and then two questions from the learner about the examiner's family. The description counts only when the learner says what one person is like, not only who they are, and the questions only when the learner asks the examiner two questions about her family.",
  flawed: "Mi madre es simpático",
  limitSeconds: 210,
};
