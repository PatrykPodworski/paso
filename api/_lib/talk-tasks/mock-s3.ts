import type { TaskItem, TaskSpec, Topic } from "./base.ts";

type TopicTask = {
  // The topic as Lucía names her own in Spanish ("tu casa"), and as the instructions and the
  // rubric name it ("home").
  hers: string;
  about: string;
  // Lucía's own short answers to the learner's two questions.
  replies: [string, string];
  questions: [string, string];
  // The two follow-ups, as the rubric lists them.
  asked: string;
  items: [TaskItem, TaskItem];
  questionsExample: string;
  flawed: string;
};

const spec = ({
  hers,
  about,
  replies,
  questions,
  asked,
  items,
  questionsExample,
  flawed,
}: TopicTask): TaskSpec => ({
  id: "mock-s3",
  mode: "interview",
  scenario: `You are a friendly interviewer and you talk with the learner about their ${about}. When the learner asks you two questions about your ${about}, answer each question with a short sentence, for example «${replies[0]}» and «${replies[1]}», and then say goodbye.`,
  asks: [...questions, `Ahora, hazme dos preguntas sobre ${hers.replace(/^tu/, "mi")}.`],
  items: [
    ...items,
    { id: "questions", label: "Two questions to Lucía", example: questionsExample },
  ],
  asked: `The examiner, a friendly interviewer, asked two questions about the learner's ${about}, ${asked}, and then asked the learner for two questions about the examiner's ${about}. The questions count only when the learner asks the examiner both questions, not when the examiner gives the answers unasked.`,
  flawed,
  limitSeconds: 270,
});

export const mockS3: Record<Topic, TaskSpec> = {
  home: spec({
    hers: "tu casa",
    about: "home",
    replies: ["Vivo con mi marido", "Cerca de mi casa hay un parque"],
    questions: ["¿Con quién vives?", "¿Qué hay cerca de tu casa?"],
    asked: "who they live with and what there is nearby",
    items: [
      { id: "withWhom", label: "Who you live with", example: "Vivo con mi hermana" },
      {
        id: "nearby",
        label: "What there is nearby",
        example: "Cerca hay una biblioteca y un parque",
      },
    ],
    questionsExample: "¿Dónde vives tú? ¿Cómo es tu casa?",
    flawed: "Cerca de mi casa está un parque y una biblioteca",
  }),
  studies: spec({
    hers: "tus estudios",
    about: "studies",
    replies: ["Estudio inglés porque me gusta viajar", "Mi profesor es muy simpático"],
    questions: ["¿Por qué estudias español?", "¿Cómo es tu profesor o tu profesora?"],
    asked: "why they study Spanish and what their teacher is like",
    items: [
      {
        id: "reason",
        label: "Why you study Spanish",
        example: "Estudio español porque me gusta viajar",
      },
      {
        id: "teacher",
        label: "What your teacher is like",
        example: "Mi profesora es simpática y paciente",
      },
    ],
    questionsExample: "¿Qué estudias tú? ¿Cómo es tu profesor?",
    flawed: "Estudio español porque me gusta el viajar y mi profesor es simpática",
  }),
  freeTime: spec({
    hers: "tu tiempo libre",
    about: "free time",
    replies: ["Los domingos paseo por el parque", "No me gusta cocinar"],
    questions: ["¿Qué haces los domingos?", "¿Qué no te gusta hacer?"],
    asked: "what they do on Sundays and what they do not like doing",
    items: [
      { id: "sundays", label: "What you do on Sundays", example: "Los domingos paseo y leo" },
      { id: "dislikes", label: "What you don't like doing", example: "No me gusta cocinar" },
    ],
    questionsExample: "¿Qué haces tú los domingos? ¿Qué te gusta hacer?",
    flawed: "Los domingos yo paseo en el parque y no me gusta cocino",
  }),
};
