import type { Question } from "./types.ts";
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
const email =
  "Hola, Elena:\nMe llamo Laura y soy tu nueva compañera de español. Tengo veintiséis años y soy italiana, pero ahora vivo en Salamanca con mi hermana. Nuestro piso está en una calle tranquila, cerca de la universidad. Mi hermana trabaja en una farmacia y yo soy profesora de música en una escuela pequeña. Trabajo por la mañana, de nueve a dos, y por la tarde estudio español.\nLa clase empieza el martes a las seis. Nuestra profesora se llama Carmen y es muy simpática. Hay diez estudiantes en el grupo. Después de clase quiero tomar un café contigo en el bar de la plaza. El café está al lado de la biblioteca.\nLos fines de semana me gusta pasear por el parque y leer en casa. No me gusta mucho el fútbol, pero a mi hermana sí. También me gusta cocinar pasta para mis amigos. ¿Qué te gusta hacer a ti? ¿Quieres venir a mi casa el domingo para comer?\nUn abrazo,\nLaura";
const reading1 = [
  [
    "¿De dónde es Laura?",
    "De Italia.",
    "De España.",
    "De Polonia.",
    "Soy italiana gives nationality; Salamanca is her current home.",
  ],
  [
    "¿Con quién vive Laura?",
    "Con su hermana.",
    "Con Elena.",
    "Con sus padres.",
    "Vivo… con mi hermana answers who she lives with.",
  ],
  [
    "¿Dónde trabaja Laura?",
    "En una escuela.",
    "En una farmacia.",
    "En una biblioteca.",
    "Laura teaches music in a school. The pharmacy is her sister’s workplace.",
  ],
  [
    "¿A qué hora empieza la clase?",
    "A las seis.",
    "A las nueve.",
    "A las dos.",
    "La clase empieza… a las seis. Nine to two are Laura’s working hours.",
  ],
  [
    "¿Qué le gusta hacer a Laura?",
    "📖 Leer.",
    "⚽ Jugar al fútbol.",
    "🎮 Jugar a videojuegos.",
    "Laura explicitly likes reading. Her sister, not Laura, likes football.",
  ],
].map((r, i) =>
  make(
    `mock-r1-${i}`,
    "reading",
    "Task 1 · A personal email",
    r[0],
    r[1],
    choices(r.slice(1, 4), i),
    r[4],
    email,
  ),
);
const signs = [
  [
    "A",
    "BIBLIOTECA: Para llevar libros a casa necesita una tarjeta de lector. Puede pedirla aquí con su documento de identidad. La tarjeta es gratuita.",
  ],
  [
    "B",
    "PISCINA: Abierta de martes a domingo, de diez a ocho. Los lunes está cerrada. Los niños pequeños tienen que entrar con una persona adulta.",
  ],
  [
    "C",
    "CAFETERÍA: Desayuno con café, zumo y tostada por cinco euros. Esta oferta está disponible de ocho a once de la mañana, de lunes a viernes.",
  ],
  [
    "D",
    "MUSEO: Los domingos la entrada es gratuita para todos los visitantes. El resto de la semana cuesta seis euros. Cerramos todos los días a las seis.",
  ],
  [
    "E",
    "CENTRO DE SALUD: Si tiene cita, espere en la sala junto a la entrada. El personal va a llamar a cada persona por su nombre.",
  ],
  [
    "F",
    "TIENDA DE ROPA: Puede pagar en efectivo o con tarjeta. Para cambiar una camisa o un pantalón necesita presentar el recibo de la compra.",
  ],
  [
    "G",
    "ESTACIÓN: Los billetes de autobús se venden en la máquina de la entrada. Para pagar, use monedas o una tarjeta. La oficina está cerrada.",
  ],
  [
    "H",
    "HOTEL: El desayuno está incluido en el precio de la habitación. Se sirve en el comedor de la primera planta, de siete a diez.",
  ],
  [
    "I",
    "PARQUE: No se puede entrar con bicicletas. Los perros deben ir con su dueño. El parque abre a las ocho y cierra a las nueve.",
  ],
];
const signsText = signs.map(([a, b]) => `${a}. ${b}`).join("\n\n");
const reading2 = [
  ["Necesita desayunar por cinco euros.", "C", "The café advertises breakfast for five euros."],
  [
    "Quiere visitar un museo sin pagar.",
    "D",
    "The museum notice says entrance is free on Sundays; the six-euro price applies on other days.",
  ],
  [
    "Tiene que esperar al médico.",
    "E",
    "The health centre asks patients to wait until their name is called.",
  ],
  [
    "Quiere llevar libros a su casa.",
    "A",
    "A reader card is needed to borrow books from the library.",
  ],
  [
    "Quiere comprar un billete sin ir a una oficina.",
    "G",
    "The station notice directs passengers to the ticket machine.",
  ],
  [
    "Quiere saber si el desayuno cuesta más en el hotel.",
    "H",
    "The hotel notice says breakfast is included in the room price.",
  ],
].map((r, i) =>
  make(
    `mock-r2-${i}`,
    "reading",
    "Task 2 · Match notices",
    `Choose the notice (A–I): ${r[0]}`,
    r[1],
    signs.map((s) => s[0]),
    r[2],
    signsText,
  ),
);
const ads = [
  [
    "A",
    "CLASES DE GUITARRA. Profesor con experiencia. Clases individuales para adultos los martes y jueves por la tarde. No necesita tener una guitarra para empezar.",
  ],
  [
    "B",
    "HABITACIÓN EN EL CENTRO. Piso compartido con dos estudiantes. Cerca de la universidad. Trescientos euros al mes, con internet incluido. Disponible desde el lunes.",
  ],
  [
    "C",
    "PASEOS POR LA CIUDAD. Visitas a pie con guía en español. Salimos de la plaza los sábados a las diez. Dos horas. Precio: ocho euros.",
  ],
  [
    "D",
    "RESTAURANTE VERDE. Comida vegetariana todos los días. Menú con sopa, ensalada, plato principal y fruta. Abierto para comer de una a cuatro. Precio: doce euros.",
  ],
  [
    "E",
    "CLUB DE NATACIÓN. Clases para niños de seis a doce años. Lunes y miércoles después del colegio. Piscina cubierta y profesores con experiencia.",
  ],
  [
    "F",
    "ESPAÑOL POR LA MAÑANA. Cursos para adultos de todos los países. Grupos pequeños. Clases de lunes a viernes, de nueve a once, en nuestra escuela.",
  ],
  [
    "G",
    "TIENDA DE BICICLETAS. Tenemos bicicletas nuevas para adultos y niños. También reparamos su bicicleta. Abrimos todos los días excepto el domingo. Estamos junto al parque.",
  ],
  [
    "H",
    "CINE EN FAMILIA. Películas para niños los domingos por la tarde. Entrada de adultos: seis euros. Niños menores de siete años: gratis. Al lado del teatro.",
  ],
  [
    "I",
    "TRABAJO EN CAFETERÍA. Buscamos una persona para trabajar los fines de semana por la mañana. Es necesario hablar español. Pregunte en la cafetería de la estación.",
  ],
];
const adsText = ads.map(([a, b]) => `${a}. ${b}`).join("\n\n");
const reading3 = [
  [
    "Trabajo por la tarde y quiero estudiar español antes de comer.",
    "F",
    "The Spanish course runs in the morning, 9–11.",
  ],
  [
    "Mi hija tiene ocho años y quiere aprender a nadar.",
    "E",
    "Swimming classes are for children aged six to twelve.",
  ],
  [
    "Soy estudiante y busco dónde vivir cerca de la universidad.",
    "B",
    "The shared room is near the university and available to students.",
  ],
  [
    "No como carne y quiero comer en un restaurante.",
    "D",
    "The vegetarian restaurant fits someone who does not eat meat.",
  ],
  [
    "Quiero aprender a tocar un instrumento, pero no tengo ninguno.",
    "A",
    "The guitar lessons do not require you to own a guitar.",
  ],
  [
    "Tengo tiempo libre los sábados y domingos y necesito trabajar.",
    "I",
    "The café is hiring for weekend mornings.",
  ],
].map((r, i) =>
  make(
    `mock-r3-${i}`,
    "reading",
    "Task 3 · Match people to advertisements",
    `Choose the advertisement (A–I): ${r[0]}`,
    r[1],
    ads.map((a) => a[0]),
    r[2],
    adsText,
  ),
);
const info =
  "CENTRO CULTURAL LA LUNA\nEl centro cultural La Luna está en la calle Mayor, número catorce, al lado del mercado municipal. Es un lugar para estudiar, leer y conocer gente del barrio. Abrimos de lunes a viernes de nueve de la mañana a ocho de la tarde. Los sábados abrimos a las diez y cerramos a las dos. Los domingos no abrimos.\nEn la primera planta hay una biblioteca con libros en español, inglés y francés. Para llevar libros a casa es necesario tener una tarjeta del centro. La tarjeta es gratuita y puede pedirla en la recepción con su documento de identidad.\nEn la segunda planta hay tres aulas. Ofrecemos clases de español los martes y jueves, de seis a siete de la tarde. El curso cuesta treinta euros al mes. Las clases de dibujo son los miércoles a las cinco y cuestan veinte euros al mes.\nTambién tenemos un café en la planta baja. Allí puede tomar café, zumo y bocadillos. No se puede comer en las aulas. Para más información, puede llamar al centro por la mañana o escribir un correo electrónico.";
const reading4 = [
  [
    "¿Dónde está el centro?",
    "Junto al mercado.",
    "Dentro de la estación.",
    "En la universidad.",
    "Al lado del mercado municipal means next to the market.",
  ],
  [
    "¿A qué hora abre los sábados?",
    "A las diez.",
    "A las nueve.",
    "A las dos.",
    "The Saturday opening time is ten; two is closing time.",
  ],
  [
    "¿Qué día está cerrado?",
    "El domingo.",
    "El lunes.",
    "El viernes.",
    "Los domingos no abrimos explicitly states the closed day.",
  ],
  [
    "¿En qué planta está la biblioteca?",
    "En la primera.",
    "En la segunda.",
    "En la planta baja.",
    "The library is on the first floor. Classrooms are on the second; the café is on the ground floor.",
  ],
  [
    "¿Cuánto cuesta la tarjeta?",
    "Es gratuita.",
    "Veinte euros.",
    "Treinta euros.",
    "La tarjeta es gratuita means the card is free. The amounts are course prices.",
  ],
  [
    "¿Cuándo son las clases de español?",
    "Los martes y jueves.",
    "Los lunes y viernes.",
    "Los miércoles.",
    "Spanish runs Tuesdays and Thursdays; Wednesday is drawing class.",
  ],
  [
    "¿Cuánto cuesta el curso de dibujo?",
    "Veinte euros al mes.",
    "Treinta euros al mes.",
    "Catorce euros al mes.",
    "The drawing course costs twenty per month. Spanish costs thirty.",
  ],
  [
    "¿Dónde se puede comer?",
    "En el café.",
    "En las aulas.",
    "En la biblioteca.",
    "The café sells food. The text explicitly prohibits eating in classrooms.",
  ],
].map((r, i) =>
  make(
    `mock-r4-${i}`,
    "reading",
    "Task 4 · Practical information",
    r[0],
    r[1],
    choices(r.slice(1, 4), i),
    r[4],
    info,
  ),
);
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
    "Each field must answer the label. Nombre asks for a name, nacionalidad for a nationality adjective, and aficiones for hobbies. The model is one possible response, not an answer key.",
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
const writing: Question[] = [
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
const speaking: Question[] = [
  {
    id: "mock-s1",
    kind: "speak",
    skill: "speaking",
    task: "Task 1 · Personal presentation · 1–2 min",
    prompt:
      "Present yourself. Cover: name, nationality, age, where you live, occupation, languages and personality. Add a simple detail to each point. Aim for 1–2 minutes.",
    answer:
      "Me llamo Elena. Soy polaca y tengo veintiséis años. Vivo en Varsovia. Soy profesora de música. Hablo polaco e inglés y estudio español. Soy tranquila y simpática.",
    explanation:
      "This short model provides a starting structure. Expand it naturally to the task time. All seven requested points matter.",
    checklist: ["I covered all seven points.", "I added simple details.", "I was understandable."],
  },
  {
    id: "mock-s2",
    kind: "speak",
    skill: "speaking",
    task: "Task 2 · A familiar topic · 2–3 min",
    prompt:
      "Choose ONE topic: your home (location, rooms, favorite room), your studies (school, teachers, timetable) or your free time (activities, when, with whom). Talk about all three points for 2–3 minutes.",
    answer:
      "Mi casa está cerca del centro. Es un piso pequeño con dos dormitorios, un salón y una cocina. Me gusta el salón porque tiene una ventana grande. Hay una mesa y dos sillas.",
    explanation:
      "Use the model as a starting example, not a full-length speech. Cover all three points in your chosen topic and add details.",
    checklist: [
      "I chose one topic and covered its three points.",
      "I linked simple ideas with y, pero or porque.",
      "I added enough detail for 2–3 minutes.",
    ],
  },
  {
    id: "mock-s3",
    kind: "speak",
    skill: "speaking",
    task: "Task 3 · Conversation · 3–4 min",
    prompt:
      "For 3–4 minutes, answer these follow-up questions on your chosen topic. Home: ¿Con quién vives? ¿Qué hay cerca? Studies: ¿Por qué estudias español? ¿Cómo es tu profesor? Free time: ¿Qué haces los domingos? ¿Qué no te gusta hacer? Then ask the interviewer TWO questions on the same topic. Use a partner if possible.",
    audio:
      "Ahora vamos a conversar. Si habla de su casa, ¿con quién vive y qué hay cerca? Si habla de sus estudios, ¿por qué estudia español y cómo es su profesor? Si habla del tiempo libre, ¿qué hace los domingos y qué no le gusta hacer? Ahora, hágame dos preguntas sobre el mismo tema.",
    answer:
      "Vivo con mi hermana. Cerca de mi casa hay una biblioteca y un parque. Me gusta mi barrio porque es tranquilo. ¿Dónde vives tú? ¿Cómo es tu casa?",
    explanation:
      "The two questions to the interviewer are part of the task. Without a live partner, these fixed prompts are only a rehearsal of interaction; a person must assess spontaneous conversation.",
    checklist: [
      "I answered follow-up questions on my chosen topic.",
      "I asked two clear questions on that topic.",
      "I could ask for repetition and keep the exchange going.",
    ],
  },
];
export const mockSections = [
  {
    title: "Reading",
    spanish: "Comprensión de lectura",
    minutes: 45,
    questions: [...reading1, ...reading2, ...reading3, ...reading4],
  },
  {
    title: "Listening",
    spanish: "Comprensión auditiva",
    minutes: 25,
    questions: [...listening1, ...listening2, ...listening3, ...listening4],
  },
  {
    title: "Writing",
    spanish: "Expresión e interacción escritas",
    minutes: 25,
    questions: writing,
  },
  {
    title: "Speaking",
    spanish: "Expresión e interacción orales",
    minutes: 10,
    questions: speaking,
  },
];
export const mockQuestions = mockSections.flatMap((s) => s.questions);
