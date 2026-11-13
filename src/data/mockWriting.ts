import type { MockTask, MockVariant, Question } from "./types.ts";

// Variant 1 keeps the question id it had before variants, so saved answers still point at it.
const questionId = (task: string, variant: number) =>
  variant === 1 ? `mock-${task}` : `mock-${task}-v${variant}`;

const formChecklist = [
  "I understood and completed every field.",
  "I used 15–25 words across the fields.",
  "My details and simple phrases are understandable.",
];

type Field = [label: string, example: string];

// Task 1: a form of 15–25 words. The model answers every field as "Label: value".
const form = (
  variant: number,
  theme: string,
  fields: Field[],
  fill: Pick<Question, "prompt" | "answer" | "explanation">,
): MockVariant => ({
  id: `w1-v${variant}`,
  theme,
  names: [],
  questions: [
    {
      id: questionId("w1", variant),
      kind: "form",
      skill: "writing",
      task: "Task 1 · A personal form",
      ...fill,
      minWords: 15,
      maxWords: 25,
      fields: fields.map(([label, example]) => ({ label, example })),
      checklist: formChecklist,
    },
  ],
});

// Task 2: a message of 30–40 words. Each checklist point is one thing the prompt asks for, so the
// review can mark it met or missed on its own.
const message = (
  variant: number,
  theme: string,
  names: string[],
  fill: Pick<Question, "task" | "prompt" | "passage" | "answer" | "explanation" | "checklist">,
): MockVariant => ({
  id: `w2-v${variant}`,
  theme,
  names,
  questions: [
    {
      id: questionId("w2", variant),
      kind: "write",
      skill: "writing",
      ...fill,
      minWords: 30,
      maxWords: 40,
    },
  ],
});

const formNote =
  "The model is one possible answer; other details can be just as good. Ask a teacher to assess how understandable the details are.";

const messageNote =
  "Cover each requested point clearly. This is one possible reply; your own details can be equally valid. Ask a teacher to assess task completion and comprehensibility.";

const w1: MockVariant[] = [
  form(
    1,
    "a language club form",
    [
      ["Nombre y apellidos", "Escribe un nombre ficticio"],
      ["Nacionalidad", "Tu nacionalidad"],
      ["Ciudad", "Dónde vives"],
      ["Profesión", "Tu trabajo o estudios"],
      ["Lenguas", "Qué idiomas hablas"],
      ["Aficiones", "Qué te gusta hacer"],
    ],
    {
      prompt:
        "Join a Spanish language club. Complete the form in Spanish using fictional details. Aim for 15–25 words across all fields.",
      answer:
        "Nombre y apellidos: Pedro García. Nacionalidad: polaco. Ciudad: Varsovia. Profesión: profesor de música. Lenguas: polaco, inglés y un poco de español. Aficiones: leer y escuchar música.",
      explanation:
        "Each field must answer its label: Nombre asks for a name, nacionalidad for a nationality adjective and aficiones for hobbies. The model is one possible answer; other details can be just as good.",
    },
  ),
  form(
    2,
    "a hotel check-in form",
    [
      ["Nombre y apellidos", "Escribe un nombre ficticio"],
      ["Nacionalidad", "Tu nacionalidad"],
      ["Fecha de llegada", "Qué día llegas"],
      ["Número de noches", "Cuántas noches te quedas"],
      ["Tipo de habitación", "Individual o doble, con o sin baño"],
      ["Motivo del viaje", "Por qué viajas a Sevilla"],
    ],
    {
      prompt:
        "You arrive at a hotel in Sevilla. Complete the check-in form in Spanish using fictional details. Aim for 15–25 words across all fields.",
      answer:
        "Nombre y apellidos: Gonzalo Ruiz Martín. Nacionalidad: polaco. Fecha de llegada: el 12 de mayo. Número de noches: tres noches. Tipo de habitación: individual con baño. Motivo del viaje: vacaciones, quiero ver la ciudad.",
      explanation: `A date needs a day and a month (el 12 de mayo), and the room type a word like individual or doble. ${formNote}`,
    },
  ),
  form(
    3,
    "a library card application",
    [
      ["Nombre y apellidos", "Escribe un nombre ficticio"],
      ["Dirección", "Calle y número donde vives"],
      ["Teléfono", "Tu número de teléfono"],
      ["Profesión", "Tu trabajo o estudios"],
      ["Libros favoritos", "Qué libros te gusta leer"],
      ["Horario de visita", "Qué días y cuándo vas a venir"],
    ],
    {
      prompt:
        "You want to borrow books from the city library in Málaga. Complete the library card form in Spanish using fictional details. Aim for 15–25 words across all fields.",
      answer:
        "Nombre y apellidos: Rubén Torres Gil. Dirección: calle del Mar, 15. Teléfono: 612 345 789. Profesión: estudiante de historia. Libros favoritos: novelas y libros de viajes. Horario de visita: los sábados por la mañana.",
      explanation: `An address is a street and a number (calle del Mar, 15), and a visiting time says a day and a part of the day. ${formNote}`,
    },
  ),
  form(
    4,
    "a gym membership form",
    [
      ["Nombre y apellidos", "Escribe un nombre ficticio"],
      ["Edad", "Cuántos años tienes"],
      ["Deportes favoritos", "Qué deportes haces"],
      ["Días y horario", "Cuándo quieres ir al gimnasio"],
      ["Objetivo", "Para qué quieres ir al gimnasio"],
    ],
    {
      prompt:
        "You want to join a gym in your neighbourhood in Madrid. Complete the membership form in Spanish using fictional details. Aim for 15–25 words across all fields.",
      answer:
        "Nombre y apellidos: Adrián López Vega. Edad: veintinueve años. Deportes favoritos: nado y juego al tenis. Días y horario: lunes y jueves, de siete a nueve. Objetivo: estar en forma y conocer gente.",
      explanation: `Age takes años (veintinueve años), and a timetable gives days and hours (lunes y jueves, de siete a nueve). ${formNote}`,
    },
  ),
  form(
    5,
    "a cooking class sign-up",
    [
      ["Nombre y apellidos", "Escribe un nombre ficticio"],
      ["Nacionalidad", "Tu nacionalidad"],
      ["Profesión", "Tu trabajo o estudios"],
      ["Comida favorita", "Qué te gusta comer"],
      ["Alergias", "Qué comida no puedes comer"],
      ["Platos que quiere aprender", "Qué platos españoles quieres cocinar"],
    ],
    {
      prompt:
        "A cooking school in Valencia has evening classes. Complete the sign-up form in Spanish using fictional details. Aim for 15–25 words across all fields.",
      answer:
        "Nombre y apellidos: Félix Moreno Sanz. Nacionalidad: alemán. Profesión: camarero en un hotel. Comida favorita: la pasta y el pescado. Alergias: ninguna. Platos que quiere aprender: la paella y la tortilla.",
      explanation: `Every field needs an answer, even Alergias: ninguna says you have none. Dishes take an article (la paella). ${formNote}`,
    },
  ),
  form(
    6,
    "a festival volunteer form",
    [
      ["Nombre y apellidos", "Escribe un nombre ficticio"],
      ["Edad", "Cuántos años tienes"],
      ["Lenguas", "Qué idiomas hablas"],
      ["Profesión", "Tu trabajo o estudios"],
      ["Días libres", "Qué días puedes ayudar"],
      ["Tareas preferidas", "Qué quieres hacer en el festival"],
    ],
    {
      prompt:
        "A music festival in Zaragoza needs volunteers. Complete the volunteer form in Spanish using fictional details. Aim for 15–25 words across all fields.",
      answer:
        "Nombre y apellidos: Ignacio Prieto Ramos. Edad: veinticuatro años. Lenguas: polaco, inglés y español. Profesión: estudiante de música. Días libres: el viernes y el sábado. Tareas preferidas: dar información en la entrada.",
      explanation: `Days take el (el viernes), and a task can be a simple infinitive phrase (dar información). ${formNote}`,
    },
  ),
];

// Practice ("Fill in your story") uses the first form outside the exam, under its own id.
export const formPractice: Question = { ...w1[0].questions[0], id: "form-practice" };

const w2: MockVariant[] = [
  message(1, "a friend's visit", ["Jorge"], {
    task: "Task 2 · Reply to an invitation",
    prompt:
      "Read your friend Jorge's message. Write 30–40 words: greet him, answer the invitation, give a meeting place and time, suggest an activity and say goodbye.",
    passage:
      "Hola. El domingo quiero visitar tu ciudad. ¿Puedes quedar conmigo? ¿Dónde y a qué hora? ¿Qué podemos hacer? Un abrazo, Jorge.",
    answer:
      "Hola, Jorge. Sí, puedo quedar el domingo. Nos vemos a las once en la estación. Podemos visitar el parque y después comer en un restaurante del centro. Me gusta mucho la idea. Un abrazo, Tomás.",
    explanation: messageNote,
    checklist: [
      "I greeted Jorge.",
      "I answered his invitation.",
      "I gave a meeting place and time.",
      "I suggested an activity.",
      "I said goodbye.",
    ],
  }),
  message(2, "a birthday present", ["Víctor"], {
    task: "Task 2 · Thank a friend",
    prompt:
      "Your friend Víctor sends you a book for your birthday. Read his note. Write 30–40 words: greet him, thank him for the book, say which dish you are going to cook first, invite him to eat it with you and say goodbye.",
    passage:
      "¡Feliz cumpleaños! Es un libro de cocina mexicana. ¿Qué plato vas a preparar primero? Un abrazo, Víctor.",
    answer:
      "Hola, Víctor: Muchas gracias por el libro de cocina. Es muy bonito. Primero voy a preparar los tacos de pollo. ¿Quieres venir a mi casa el sábado para comer conmigo? Hasta pronto, Joaquín.",
    explanation: `Ir a + infinitive (voy a preparar) talks about the plan, and ¿Quieres venir…? makes the invitation. ${messageNote}`,
    checklist: [
      "I greeted Víctor.",
      "I thanked him for the book.",
      "I said which dish I am going to cook first.",
      "I invited him to eat it with me.",
      "I said goodbye.",
    ],
  }),
  message(3, "weekend excursions", ["Emilio"], {
    task: "Task 2 · Ask for information",
    prompt:
      "Read the advert for weekend excursions. Write an email of 30–40 words to Emilio: greet him, say who you are, ask how much the excursion costs, ask what time the bus leaves and say goodbye.",
    passage:
      "EXCURSIONES DE FIN DE SEMANA\nVisitamos pueblos y montañas cerca de Granada. Grupos pequeños. Para más información, escriba a Emilio.",
    answer:
      "Hola, Emilio: Me llamo Martín, soy polaco y vivo en Granada. Quiero hacer una excursión el sábado. ¿Cuánto cuesta? ¿A qué hora sale el autobús y de dónde? Muchas gracias. Un saludo, Martín.",
    explanation: `¿Cuánto cuesta? asks the price and ¿A qué hora sale…? the time. Un saludo is a polite farewell to someone you do not know. ${messageNote}`,
    checklist: [
      "I greeted Emilio.",
      "I said who I am.",
      "I asked how much the excursion costs.",
      "I asked what time the bus leaves.",
      "I said goodbye.",
    ],
  }),
  message(4, "a party at a new flat", ["Nicolás"], {
    task: "Task 2 · Invite a friend",
    prompt:
      "You have a new flat and want to have a small party. Write an email of 30–40 words to your friend Nicolás: greet him, invite him to the party, say the day and time, say where your flat is and say goodbye.",
    answer:
      "Hola, Nicolás: Tengo un piso nuevo y el sábado hago una fiesta. ¿Quieres venir? Empieza a las ocho de la tarde. Mi piso está en la calle Sol, 4, cerca de la estación. Un abrazo, Samuel.",
    explanation: `Estar gives the location (mi piso está en…), and a las ocho gives the time. ${messageNote}`,
    checklist: [
      "I greeted Nicolás.",
      "I invited him to the party.",
      "I gave the day and time.",
      "I said where my flat is.",
      "I said goodbye.",
    ],
  }),
  message(5, "a friend's football match", ["Rodrigo"], {
    task: "Task 2 · Say no to a plan",
    prompt:
      "Read your friend Rodrigo's message. You cannot go. Write 30–40 words: greet him, say that you cannot go, explain why, suggest another day to meet and say goodbye.",
    passage:
      "Hola. El viernes por la tarde juego un partido de fútbol con mi equipo. ¿Vienes a verme? Después vamos a cenar todos juntos. Rodrigo.",
    answer:
      "Hola, Rodrigo: Lo siento, pero el viernes no puedo ir al partido. Trabajo hasta las nueve en el restaurante. ¿Quedamos el domingo para tomar un café en la plaza? Suerte en el partido. Un abrazo, Julián.",
    explanation: `Lo siento, pero no puedo… says no politely, and ¿Quedamos el domingo? suggests another day. ${messageNote}`,
    checklist: [
      "I greeted Rodrigo.",
      "I said that I cannot go.",
      "I explained why.",
      "I suggested another day to meet.",
      "I said goodbye.",
    ],
  }),
  message(6, "a postcard from Cádiz", ["Héctor"], {
    task: "Task 2 · Write a postcard",
    prompt:
      "You are on holiday in Cádiz. Write a postcard of 30–40 words to your friend Héctor: greet him, say where you are, describe the weather, say what you do every day and say goodbye.",
    answer:
      "Hola, Héctor: Estoy de vacaciones en Cádiz con mi familia. Hace sol y mucho calor. Por la mañana voy a la playa y por la tarde paseo por el centro. La comida es muy buena. Un abrazo, Ricardo.",
    explanation: `Hacer describes the weather (hace sol, hace calor), and the present tense tells what you do every day. ${messageNote}`,
    checklist: [
      "I greeted Héctor.",
      "I said where I am.",
      "I described the weather.",
      "I said what I do every day.",
      "I said goodbye.",
    ],
  }),
];

export const writingTasks: MockTask[] = [
  { id: "w1", variants: w1 },
  { id: "w2", variants: w2 },
];
