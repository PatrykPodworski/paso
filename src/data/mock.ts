import type {
  ExamVariants,
  MockRun,
  MockSection,
  MockTask,
  MockVariant,
  Question,
} from "./types.ts";
import { readingTasks } from "./mockReading.ts";

const choices = (items: string[], i: number) => [
  ...items.slice(i % items.length),
  ...items.slice(0, i % items.length),
];

const make = (
  id: string,
  skill: "reading" | "listening",
  task: string,
  prompt: string,
  answer: string,
  options: string[],
  explanation: string,
  content: string,
): Question => ({
  id,
  skill,
  task,
  kind: skill === "listening" ? "listen" : "choice",
  prompt,
  answer,
  options,
  explanation,
  ...(skill === "listening" ? { audio: content } : { passage: content }),
});

const listening1Data = [
  [
    "¿Qué quiere beber la mujer?",
    "☕ Café.",
    "🍵 Té.",
    "🧃 Zumo.",
    "Buenos días. ¿Qué quiere tomar? Quiero un café con leche y una tostada, por favor. ¿Quiere también un zumo de naranja? No, gracias. Solo el café y la tostada.",
    "She orders café con leche and explicitly declines juice.",
  ],
  [
    "¿Cómo va el hombre al trabajo?",
    "🚌 En autobús.",
    "🚆 En tren.",
    "🚶 A pie.",
    "¿Cómo vas al trabajo, Daniel? Normalmente voy en autobús. ¿No tienes coche? Sí, pero no hay aparcamiento cerca de mi oficina. El autobús para justo delante del edificio.",
    "He normally travels by bus, even though he owns a car.",
  ],
  [
    "¿Qué compra la mujer?",
    "👗 Un vestido.",
    "👞 Unos zapatos.",
    "👔 Una camisa.",
    "Buenas tardes. Busco un vestido azul para una fiesta. Tenemos este en su talla. ¿Le gusta? Sí, es muy bonito. Me llevo el vestido, pero no necesito zapatos.",
    "She requests and buys a blue dress. She says she does not need shoes.",
  ],
  [
    "¿Dónde quedan los amigos?",
    "📚 En la biblioteca.",
    "🎬 En el cine.",
    "🌳 En el parque.",
    "¿Estudiamos juntos esta tarde? Sí, pero en mi casa hay mucho ruido. Podemos ir a la biblioteca. Buena idea. Nos vemos en la biblioteca a las cinco, después de comer.",
    "They agree to meet at the library because home is noisy.",
  ],
  [
    "¿Qué tiempo hace hoy?",
    "🌧️ Llueve.",
    "☀️ Hace sol.",
    "❄️ Nieva.",
    "¿Vamos al parque esta mañana? No, hoy llueve mucho y hace frío. Es mejor estar en casa. Mañana hace sol. Vale, hoy podemos ver una película y mañana salimos.",
    "Today is rainy. Tomorrow’s sun is a distractor.",
  ],
];

const listening1 = listening1Data.map((r, i) =>
  make(
    `mock-l1-${i}`,
    "listening",
    "Task 1 · Short conversations",
    r[0],
    r[1],
    choices(r.slice(1, 4), i),
    r[5],
    r[4],
  ),
);

const imageOptions = [
  "🚆 Estación",
  "💊 Farmacia",
  "📚 Biblioteca",
  "🛒 Supermercado",
  "🏨 Hotel",
  "🏊 Piscina",
  "🎬 Cine",
  "✈️ Aeropuerto",
];

const listening2Data = [
  [
    "Atención, viajeros. El tren con destino a Málaga sale dentro de diez minutos de la vía número tres. Tengan preparados sus billetes, por favor.",
    "🚆 Estación",
    "Tren, vía and billetes point to a railway station.",
  ],
  [
    "Buenos días. Su habitación está en la segunda planta. El desayuno se sirve de siete a diez. Aquí tiene la llave. Disfrute de su estancia.",
    "🏨 Hotel",
    "A room key and breakfast information indicate a hotel.",
  ],
  [
    "Atención, clientes. Hoy tenemos manzanas a un euro el kilo y leche en oferta. Pueden encontrar estos productos junto a la entrada de la tienda.",
    "🛒 Supermercado",
    "Fruit by the kilo and milk offers indicate a supermarket.",
  ],
  [
    "La película empieza en cinco minutos. Por favor, entren en la sala dos, busquen su asiento y apaguen sus teléfonos durante la película.",
    "🎬 Cine",
    "A film, numbered screening room and seats indicate a cinema.",
  ],
  [
    "Por favor, recuerden que no se puede hablar por teléfono en esta sala. Para llevar libros a casa, presenten su tarjeta en el mostrador.",
    "📚 Biblioteca",
    "Borrowing books with a card identifies a library.",
  ],
];

const listening2 = listening2Data.map((r, i) =>
  make(
    `mock-l2-${i}`,
    "listening",
    "Task 2 · Match messages to places",
    "¿Dónde se escucha este mensaje?",
    r[1],
    imageOptions,
    r[2],
    r[0],
  ),
);

const endings = [
  "es profesora.",
  "vive cerca del centro.",
  "tiene dos hermanos.",
  "va al trabajo en bicicleta.",
  "come a las dos.",
  "estudia francés.",
  "juega al tenis.",
  "lee antes de dormir.",
  "trabaja en un hospital.",
  "tiene un perro.",
  "vive en Italia.",
];

const statements = [
  [
    "Su profesión…",
    "es profesora.",
    "Soy Elena y soy profesora de español en una escuela pequeña. Me gusta mi trabajo porque conozco a mucha gente.",
  ],
  [
    "Su casa…",
    "vive cerca del centro.",
    "Mi piso no es muy grande, pero está cerca del centro. Puedo ir andando a las tiendas y al mercado.",
  ],
  [
    "Su familia…",
    "tiene dos hermanos.",
    "Tengo dos hermanos. Mi hermano mayor se llama Pablo y el pequeño se llama Luis. Los dos son estudiantes.",
  ],
  [
    "Su transporte…",
    "va al trabajo en bicicleta.",
    "Todas las mañanas voy al trabajo en bicicleta. La escuela está cerca de mi casa y el viaje dura diez minutos.",
  ],
  [
    "Su comida…",
    "come a las dos.",
    "Normalmente como a las dos de la tarde con mis compañeros. Comemos en un pequeño restaurante junto a la escuela.",
  ],
  [
    "Sus estudios…",
    "estudia francés.",
    "Los lunes y miércoles estudio francés por la tarde. Mi profesora es de París y en clase hablamos mucho.",
  ],
  [
    "Su deporte…",
    "juega al tenis.",
    "Los sábados juego al tenis con mi amiga Sara. Nos gusta mucho el deporte y después tomamos un café juntas.",
  ],
  [
    "Su noche…",
    "lee antes de dormir.",
    "Por la noche leo un poco antes de dormir. Me gustan los libros de viajes y las historias sobre otros países.",
  ],
];

const listening3 = statements.map((r, i) =>
  make(
    `mock-l3-${i}`,
    "listening",
    "Task 3 · Match eight statements",
    `Choose the statement that matches what Elena says about ${["her job", "her home", "her family", "transport", "lunch", "her studies", "sport", "her evening"][i]}.`,
    r[1],
    endings,
    `The speaker says: “${r[2]}” This supports “${r[1]}”; the other endings describe different or unmentioned details.`,
    r[2],
  ),
);

const conversation =
  "Hola, Pablo. ¿Tienes planes para el sábado? Sí, quiero ir a Segovia con mi hermana. ¿Quieres venir? Me encantaría. ¿Cómo vamos? Podemos ir en tren. El tren sale de Madrid a las nueve de la mañana y llega a las diez. Muy bien. ¿Cuánto cuesta el billete? Cuesta doce euros por persona. Mi hermana compra los billetes esta tarde. Perfecto. ¿Y qué hacemos en Segovia? Primero podemos visitar el centro. Hay una plaza muy bonita y una iglesia antigua. Después comemos en un restaurante cerca de la estación. ¿A qué hora comemos? A las dos. El restaurante tiene un menú de quince euros con bebida y postre. Me parece bien. ¿Volvemos por la tarde? Sí, el tren de vuelta sale a las seis. Llegamos a Madrid a las siete. Entonces nos vemos el sábado en la estación. ¿A las ocho y media? Sí, a las ocho y media, junto a la entrada principal. No olvides llevar agua. Hace mucho calor. De acuerdo, hasta el sábado.";

const details = [
  "Segovia",
  "en tren",
  "a las nueve",
  "doce euros",
  "la hermana de Pablo",
  "a las dos",
  "a las ocho y media",
  "quince euros",
];

const listening4Data = [
  ["El destino es…", "Segovia", "The plan is a visit to Segovia; Madrid is the starting city."],
  ["Van…", "en tren", "They choose the train as transport."],
  [
    "El tren de ida sale…",
    "a las nueve",
    "Nine is the departure time, while eight thirty is the meeting time.",
  ],
  [
    "El billete cuesta…",
    "doce euros",
    "Twelve euros is the ticket; fifteen euros is the restaurant menu.",
  ],
  [
    "Compra los billetes…",
    "la hermana de Pablo",
    "Pablo says his sister buys the tickets this afternoon.",
  ],
  [
    "Comen…",
    "a las dos",
    "They agree to eat at two: a las dos. Nine is the train departure time and eight thirty is the meeting time.",
  ],
  [
    "Quedan en la estación…",
    "a las ocho y media",
    "They meet at eight thirty before the nine o’clock train.",
  ],
];

const listening4 = listening4Data.map((r, i) =>
  make(
    `mock-l4-${i}`,
    "listening",
    "Task 4 · Complete a conversation",
    r[0],
    r[1],
    details,
    r[2],
    conversation,
  ),
);

export const formPractice: Question = {
  id: "form-practice",
  kind: "form",
  skill: "writing",
  task: "Task 1 · A personal form",
  prompt:
    "Join a Spanish language club. Complete the form in Spanish using fictional details. Aim for 15–25 words across all fields.",
  answer:
    "Nombre: Elena García. Nacionalidad: polaca. Ciudad: Varsovia. Profesión: profesora de música. Lenguas: polaco e inglés. Aficiones: leer y escuchar música.",
  explanation:
    "Each field must answer its label: Nombre asks for a name, nacionalidad for a nationality adjective and aficiones for hobbies. The model is one possible answer; other details can be just as good.",
  minWords: 15,
  maxWords: 25,
  fields: [
    { label: "Nombre y apellidos", example: "Escribe un nombre ficticio" },
    { label: "Nacionalidad", example: "Tu nacionalidad" },
    { label: "Ciudad", example: "Dónde vives" },
    { label: "Profesión", example: "Tu trabajo o estudios" },
    { label: "Lenguas", example: "Qué idiomas hablas" },
    { label: "Aficiones", example: "Qué te gusta hacer" },
  ],
  checklist: [
    "I understood and completed every field.",
    "I used 15–25 words across the fields.",
    "My details and simple phrases are understandable.",
  ],
};

const [writing1, writing2]: Question[] = [
  { ...formPractice, id: "mock-w1" },
  {
    id: "mock-w2",
    kind: "write",
    skill: "writing",
    task: "Task 2 · Reply to an invitation",
    prompt:
      "Your friend Ana writes: “Hola. El domingo quiero visitar tu ciudad. ¿Puedes quedar conmigo? ¿Dónde y a qué hora? ¿Qué podemos hacer? Un abrazo, Ana.” Write 30–40 words: greet her, answer the invitation, give a meeting place and time, suggest an activity and say goodbye.",
    passage:
      "Hola. El domingo quiero visitar tu ciudad. ¿Puedes quedar conmigo? ¿Dónde y a qué hora? ¿Qué podemos hacer? Un abrazo, Ana.",
    answer:
      "Hola, Ana. Sí, puedo quedar el domingo. Nos vemos a las once en la estación. Podemos visitar el parque y después comer en un restaurante del centro. Me gusta mucho la idea. Un abrazo, Elena.",
    explanation:
      "Cover each requested point clearly. This is one possible reply; your own details can be equally valid. Ask a teacher to assess task completion and comprehensibility.",
    minWords: 30,
    maxWords: 40,
    checklist: [
      "I greeted Ana and answered the invitation.",
      "I gave a place, time and activity.",
      "I wrote 30–40 words and included a farewell.",
    ],
  },
];

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
    tasks: [
      { id: "l1", variants: [variant("l1-v1", "everyday choices", ["Daniel"], listening1)] },
      { id: "l2", variants: [variant("l2-v1", "public announcements", [], listening2)] },
      {
        id: "l3",
        variants: [
          variant(
            "l3-v1",
            "a teacher's daily life",
            ["Elena", "Pablo", "Luis", "Sara"],
            listening3,
          ),
        ],
      },
      { id: "l4", variants: [variant("l4-v1", "a day trip to Segovia", ["Pablo"], listening4)] },
    ],
  },
  {
    title: "Writing",
    spanish: "Expresión e interacción escritas",
    minutes: 25,
    tasks: [
      { id: "w1", variants: [variant("w1-v1", "a language club form", [], [writing1])] },
      { id: "w2", variants: [variant("w2-v1", "a friend's visit", ["Ana"], [writing2])] },
    ],
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
});
