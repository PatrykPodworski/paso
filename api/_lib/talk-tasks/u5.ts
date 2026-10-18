import type { TaskSpec } from "./base.ts";

export const u5: TaskSpec = {
  id: "u5",
  mode: "interview",
  scenario:
    "Eres una entrevistadora amable y hablas con el estudiante de su día a día. Cuando el estudiante te haga sus dos preguntas sobre tu rutina, responde a cada una con una frase corta y después despídete.",
  asks: [
    "¿Qué haces por la mañana?",
    "¿Trabajas o estudias? ¿Qué haces?",
    "¿Qué haces por la tarde y por la noche?",
    "¿A qué hora te levantas, a qué hora comes y a qué hora te acuestas?",
    "Ahora, hazme dos preguntas sobre mi rutina.",
  ],
  items: [
    { id: "morning", label: "Morning", example: "Me levanto a las siete y desayuno café con pan" },
    { id: "work", label: "Work or studies", example: "Trabajo en una oficina" },
    { id: "evening", label: "Evening", example: "Por la noche estudio español y leo un libro" },
    { id: "times", label: "Times of day", example: "Como a las dos y me acuesto a las once" },
    {
      id: "questions",
      label: "Two questions to Lucía",
      example: "¿A qué hora te levantas? ¿Trabajas por la tarde?",
    },
  ],
  asked:
    "The examiner, a friendly interviewer, asked for five things: what the learner does in the morning, whether they work or study and what they do, what they do in the evening, at what time they do things, and then two questions from the learner about the examiner's routine. The times count only when the learner says at what time they do things, not only what they do, and the questions only when the learner asks the examiner two questions about her routine.",
  flawed: "Yo levanto a las siete",
  limitSeconds: 210,
};
