import type { TaskSpec } from "./base.ts";

export const u12: TaskSpec = {
  id: "u12",
  mode: "interview",
  scenario:
    "Eres una entrevistadora amable y hablas con el estudiante sobre él y sobre sus estudios, su trabajo o su casa, el tema que el estudiante elija. Cuando el estudiante te haga dos preguntas sobre ese tema, responde a cada pregunta con una frase corta, por ejemplo «Vivo en un piso pequeño en Madrid» y «Me gusta mi casa porque es tranquila», y después despídete.",
  asks: [
    "Preséntate brevemente: ¿cómo te llamas, de dónde eres, cuántos años tienes y dónde vives?",
    "Ahora háblame de tus estudios, de tu trabajo o de tu casa. Elige un tema.",
    "¿Con quién estudias, trabajas o vives?",
    "¿Qué te gusta de tus estudios, de tu trabajo o de tu casa?",
    "Ahora, hazme dos preguntas sobre ese tema.",
  ],
  items: [
    {
      id: "intro",
      label: "Short introduction",
      example: "Me llamo Ana, soy polaca, tengo treinta años y vivo en Varsovia",
    },
    {
      id: "topic",
      label: "Chosen topic described",
      example: "Vivo en un piso pequeño con dos dormitorios y un salón",
    },
    {
      id: "answers",
      label: "Answers to the follow-up questions",
      example: "Vivo con mi hermana. Me gusta el salón porque tiene una ventana grande",
    },
    {
      id: "questions",
      label: "Two questions to Lucía",
      example: "¿Dónde vives tú? ¿Cómo es tu casa?",
    },
  ],
  asked:
    "The examiner, a friendly interviewer, asked for four things: a short introduction with the learner's name, nationality, age and where they live; a description of the learner's studies, work or home, whichever the learner chose; answers to two follow-up questions about that topic, who the learner studies, works or lives with and what the learner likes about it; and then two questions from the learner to the examiner about the same topic. The introduction counts only when the learner gives all four details, the answers only when the learner answers both follow-up questions, and the questions only when the learner asks the examiner both questions, not when the examiner gives the answers unasked.",
  flawed: "Yo soy treinta años y vivo en Varsovia",
  limitSeconds: 270,
};
