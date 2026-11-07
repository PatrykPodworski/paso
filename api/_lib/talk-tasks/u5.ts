import type { TaskSpec } from "./base.ts";

export const u5: TaskSpec = {
  id: "u5",
  mode: "interview",
  scenario:
    "You are a friendly interviewer and you talk with the learner about their everyday life. When the learner asks you a question about your routine, answer it in one short sentence before you continue or say goodbye.",
  asks: [
    "¿Qué haces por la mañana?",
    "¿Trabajas o estudias?",
    "What they do there, if they have not said. «¿Qué haces allí?»",
    "¿Qué haces por la noche?",
    "A time they have not already said, among getting up, a meal and bedtime, until each of those three is covered. «¿A qué hora te acuestas?»",
    { learner: "Two questions about your routine." },
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
