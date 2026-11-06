import type { TaskSpec } from "./base.ts";

export const u11: TaskSpec = {
  id: "u11",
  mode: "interview",
  scenario:
    "You are a friendly interviewer and you talk with the learner about the weather and the seasons of the year. When the learner asks you what your favourite season is and what the weather is like in your city, answer each question with a short sentence, for example «Mi estación favorita es la primavera» and «En mi ciudad hoy hace sol», and then say goodbye.",
  asks: [
    "¿Qué tiempo hace hoy?",
    "¿Qué estación del año te gusta más?",
    "Con este tiempo, ¿cómo estás y qué necesitas?",
    "Ahora, pregúntame cuál es mi estación favorita y qué tiempo hace en mi ciudad.",
  ],
  items: [
    { id: "weather", label: "Today's weather", example: "Hoy hace sol y calor" },
    { id: "season", label: "Favourite season", example: "Me gusta el verano" },
    {
      id: "feeling",
      label: "How they feel and what they need",
      example: "Tengo calor y necesito agua",
    },
    {
      id: "questions",
      label: "Two questions to Lucía",
      example: "¿Cuál es tu estación favorita? ¿Qué tiempo hace en tu ciudad?",
    },
  ],
  asked:
    "The examiner, a friendly interviewer, asked for four things: today's weather, the learner's favourite season, how the learner feels and what they need in that weather, and then two questions from the learner about the examiner's favourite season and the weather in the examiner's city. The feeling counts only when the learner says both how they feel and what they need, and the questions only when the learner asks the examiner both questions, not when the examiner gives the answers unasked.",
  flawed: "Hoy es frío y tengo cansado",
  limitSeconds: 180,
};
