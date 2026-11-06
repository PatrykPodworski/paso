import type {
  ExamVariants,
  MockRun,
  MockSection,
  MockTask,
  MockVariant,
  Question,
} from "./types.ts";
import { listeningTasks } from "./mockListening.ts";
import { readingTasks } from "./mockReading.ts";
import { writingTasks } from "./mockWriting.ts";

export { formPractice } from "./mockWriting.ts";

// The topic the learner picks before Task 2; Tasks 2 and 3 both run on it.
export const mockTopics = [
  { id: "home", label: "Your home", points: "location, rooms, favourite room" },
  { id: "studies", label: "Your studies", points: "school, teachers, timetable" },
  { id: "freeTime", label: "Your free time", points: "activities, when, with whom" },
] as const;

export type MockTopic = (typeof mockTopics)[number]["id"];

// The talks that need the topic.
export const topicTalks = ["mock-s2", "mock-s3"];

const [speaking1, speaking2, speaking3]: Question[] = [
  {
    id: "mock-s1",
    kind: "live",
    skill: "speaking",
    task: "Task 1 · Personal presentation · 1–2 min",
    prompt:
      "Talk to Lucía. Present yourself: name, nationality, age, where you live, occupation, languages and personality. She gives you the task, then listens for 1–2 minutes; add a simple detail to each point.",
    answer:
      "Me llamo Elena. Soy polaca y tengo veintiséis años. Vivo en Varsovia. Soy profesora de música. Hablo polaco e inglés y estudio español. Soy tranquila y simpática.",
    explanation:
      "This short model provides a starting structure. Expand it naturally to the task time. All seven requested points matter.",
    talk: "mock-s1",
  },
  {
    id: "mock-s2",
    kind: "live",
    skill: "speaking",
    task: "Task 2 · A familiar topic · 2–3 min",
    prompt:
      "Pick ONE topic before you start: your home (location, rooms, favourite room), your studies (school, teachers, timetable) or your free time (activities, when, with whom). Lucía gives you the task, then listens for 2–3 minutes while you cover all three points.",
    answer:
      "Mi casa está cerca del centro. Es un piso pequeño con dos dormitorios, un salón y una cocina. Me gusta el salón porque tiene una ventana grande. Hay una mesa y dos sillas.",
    explanation:
      "Use the model as a starting example, not a full-length speech. Cover all three points in your chosen topic and add details.",
    talk: "mock-s2",
  },
  {
    id: "mock-s3",
    kind: "live",
    skill: "speaking",
    task: "Task 3 · Conversation · 3–4 min",
    prompt:
      "Lucía asks you two questions about your Task 2 topic. Answer each one, then ask her TWO questions on the same topic; she answers them briefly.",
    answer:
      "Vivo con mi hermana. Cerca de mi casa hay una biblioteca y un parque. Me gusta mi barrio porque es tranquilo. ¿Dónde vives tú? ¿Cómo es tu casa?",
    explanation:
      "The two questions to Lucía are part of the task. Lucía grades the transcript only; a person must assess pronunciation and how the conversation flows.",
    talk: "mock-s3",
  },
];

const variant = (
  id: string,
  theme: string,
  names: string[],
  questions: Question[],
): MockVariant => ({ id, theme, names, questions });

// Variant 1 of each task is the single exam Paso had before variants. Its questions keep their
// ids, so saved answers and attempts still point at them. A variant id never changes, because
// saved runs refer to it.
export const mockExam: MockSection[] = [
  {
    title: "Reading",
    spanish: "Comprensión de lectura",
    minutes: 45,
    tasks: readingTasks,
  },
  {
    title: "Listening",
    spanish: "Comprensión auditiva",
    minutes: 25,
    tasks: listeningTasks,
  },
  {
    title: "Writing",
    spanish: "Expresión e interacción escritas",
    minutes: 25,
    tasks: writingTasks,
  },
  {
    title: "Speaking",
    spanish: "Expresión e interacción orales",
    minutes: 10,
    tasks: [
      { id: "s1", variants: [variant("s1-v1", "a personal presentation", [], [speaking1])] },
      // Speaking tasks 2 and 3 share one topic sheet: task 3 is the conversation about the
      // topic of task 2, so they vary together.
      {
        id: "s2",
        variants: [variant("s2-v1", "home, studies or free time", [], [speaking2, speaking3])],
      },
    ],
  },
];

export const mockTasks = mockExam.flatMap((s) => s.tasks);

// Every question of every variant.
export const mockQuestions = mockTasks.flatMap((t) => t.variants.flatMap((v) => v.questions));

// Variant 1 of each task: the exam as it was before it had variants.
export const firstVariants: ExamVariants = Object.fromEntries(
  mockTasks.map((t) => [t.id, t.variants[0].id]),
);

const variantOf = (task: MockTask, id: string | undefined) => {
  const found = task.variants.find((v) => v.id === id);

  if (!found) {
    throw new Error(`Task ${task.id} has no variant ${id}`);
  }

  return found;
};

// The sections of the exam made of the given variants, with their questions in order.
export const examSections = (variants: ExamVariants) =>
  mockExam.map(({ tasks, ...section }) => ({
    ...section,
    questions: tasks.flatMap((t) => variantOf(t, variants[t.id]).questions),
  }));

// The variants the exam takes for the tasks of one section.
export const sectionVariants = (variants: ExamVariants, section: number) =>
  mockExam[section].tasks.map((t) => variants[t.id]);

// The sections of the whole exam, by index.
export const fullExam = mockExam.map((_, i) => i);

// The number of questions in each section. Every variant of a task has as many items as
// variant 1, so the sizes are the same whichever variants an exam takes.
export const sectionSizes = examSections(firstVariants).map((s) => s.questions.length);

// A run that has not started: variant 1 of each task until the learner starts an exam.
export const freshMockRun = (): MockRun => ({
  section: 0,
  index: 0,
  stage: "intro",
  answers: {},
  deadline: 0,
  started: "",
  drafts: {},
  scores: {},
  talks: {},
  seed: 0,
  variants: firstVariants,
  sections: fullExam,
});
