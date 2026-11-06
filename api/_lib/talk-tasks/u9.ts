import type { TaskSpec } from "./base.ts";

export const u9: TaskSpec = {
  id: "u9",
  mode: "interview",
  scenario:
    "You are a friendly interviewer and you talk with the learner about their free time. When the learner invites you to an activity, accept with a short sentence, for example «Sí, gracias. Buena idea». When they ask you what you like to do, answer with a short sentence, for example «Me gusta leer y pasear», and then say goodbye.",
  asks: [
    "¿Qué te gusta hacer en tu tiempo libre?",
    "¿Cuándo haces esas actividades y con quién?",
    "Ahora, invítame a una actividad.",
    "Y ahora, pregúntame qué me gusta hacer a mí.",
  ],
  items: [
    { id: "activities", label: "Activities", example: "Me gusta leer y nadar" },
    {
      id: "whenWith",
      label: "When and with whom",
      example: "Los sábados voy a la piscina con mi amiga",
    },
    { id: "invitation", label: "Invitation to Lucía", example: "¿Quieres ir al cine el domingo?" },
    { id: "hobbies", label: "Question about her hobbies", example: "¿Qué te gusta hacer?" },
  ],
  asked:
    "The examiner, a friendly interviewer, asked for four things: what the learner likes doing in their free time, when and with whom they do it, and then an invitation from the learner to an activity and a question from the learner about the examiner's hobbies. The when and with whom counts only when the learner says both when and with whom, and the invitation and the question only when the learner asks the examiner, not when the examiner suggests them.",
  flawed: "Me gusta leo libros",
  limitSeconds: 210,
};
