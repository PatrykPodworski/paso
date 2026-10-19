import type { TaskItem, TaskSpec, Topic } from "./base.ts";

type TopicTask = {
  // The topic as Lucía names it ("su casa") and as the rubric names it ("their home").
  about: string;
  their: string;
  ask: string;
  nudge: string;
  // The three points, as the rubric lists them.
  points: string;
  items: TaskItem[];
  flawed: string;
};

const spec = ({ about, their, ask, nudge, points, items, flawed }: TopicTask): TaskSpec => ({
  id: "mock-s2",
  mode: "monologue",
  scenario: `Eres una entrevistadora amable. El estudiante habla de ${about} y tú escuchas.`,
  asks: [ask],
  nudge,
  items,
  asked: `The examiner asked the learner to talk about ${their} for two to three minutes: ${points}.`,
  flawed,
  limitSeconds: 210,
});

export const mockS2: Record<Topic, TaskSpec> = {
  home: spec({
    about: "su casa",
    their: "their home",
    ask: "Háblame de tu casa: dónde está, qué habitaciones hay y cuál es tu habitación favorita.",
    nudge: "¿Y cuál es tu habitación favorita?",
    points: "where it is, which rooms it has and which room is their favourite",
    items: [
      { id: "location", label: "Where your home is", example: "Mi casa está cerca del centro" },
      { id: "rooms", label: "The rooms", example: "Tiene dos dormitorios, un salón y una cocina" },
      {
        id: "favorite",
        label: "Your favourite room",
        example: "Me gusta el salón porque tiene una ventana grande",
      },
    ],
    flawed: "Mi casa es en el centro y tiene dos dormitorio",
  }),
  studies: spec({
    about: "sus estudios",
    their: "their studies",
    ask: "Háblame de tus estudios: tu escuela, tus profesores y tu horario.",
    nudge: "¿Y cómo es tu horario?",
    points: "their school, their teachers and their timetable",
    items: [
      { id: "school", label: "Your school", example: "Estudio español en una escuela de idiomas" },
      {
        id: "teachers",
        label: "Your teachers",
        example: "Mi profesora es simpática y habla despacio",
      },
      {
        id: "timetable",
        label: "Your timetable",
        example: "Tengo clase los lunes y los miércoles por la tarde",
      },
    ],
    flawed: "Mi profesor es simpática y la clase es en lunes",
  }),
  freeTime: spec({
    about: "su tiempo libre",
    their: "their free time",
    ask: "Háblame de tu tiempo libre: qué actividades haces, cuándo las haces y con quién.",
    nudge: "¿Y con quién haces esas actividades?",
    points: "which activities they do, when they do them and with whom",
    items: [
      { id: "activities", label: "Your activities", example: "Me gusta leer y nadar" },
      { id: "when", label: "When you do them", example: "Los sábados por la mañana" },
      { id: "withWhom", label: "With whom", example: "Con mi amiga Marta" },
    ],
    flawed: "Me gusta leo libros en el sábado",
  }),
};
