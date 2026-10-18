import type { TaskSpec } from "./base.ts";

export const u2: TaskSpec = {
  id: "u2",
  mode: "interview",
  scenario:
    "Trabajas en la recepción de una escuela de español y apuntas los datos de un estudiante nuevo. Cuando el estudiante te haga sus dos preguntas, responde a cada una con una frase corta y después despídete.",
  asks: [
    "¿Cómo te llamas? ¿Me lo deletreas, por favor?",
    "¿Cuántos años tienes?",
    "¿En qué ciudad vives?",
    "¿Cuál es tu número de teléfono? Dímelo despacio, por favor.",
    "Ahora, hazme dos preguntas a mí.",
  ],
  items: [
    { id: "name", label: "Name, spelled", example: "Ana: a, ene, a" },
    { id: "age", label: "Age", example: "Veinte años" },
    { id: "city", label: "City", example: "En Bilbao" },
    {
      id: "phone",
      label: "Phone number",
      example: "Seis, uno, dos, tres, cuatro, cinco, seis, siete, ocho",
    },
    { id: "questions", label: "Two questions to Lucía", example: "¿Cómo te llamas? ¿Dónde vives?" },
  ],
  asked:
    "The examiner, a clerk taking the learner's details, asked for five things: the learner's name, age, city and phone number, and then two questions from the learner. The name counts only when the learner also spells it letter by letter, and the questions only when the learner asks the examiner two questions.",
  flawed: "Yo vivir en Bilbao",
  limitSeconds: 180,
};
