import type { MockTask, MockVariant, Question } from "./types.ts";

// A reference voice of the ai repo's audio/spanish: the male or the female teacher.
type Voice = "male" | "female";

type Turn = [speaker: string, text: string];

// A clip that scripts/make-dialogue.mjs makes: each turn spoken in its speaker's voice. Its
// turns joined with spaces are the question's audio text, which is the clip's lookup key.
export type ListeningClip = { id: string; voices: Record<string, Voice>; turns: Turn[] };

// What a question plays: a clip to make, or the text of a clip made earlier by make-sentences.
type Audio = Omit<ListeningClip, "id"> | string;

// A one-speaker clip: an announcement, a message or a statement.
const say = (voice: Voice, text: string): Audio => ({
  voices: { speaker: voice },
  turns: [["speaker", text]],
});

const audioText = (audio: Audio) =>
  typeof audio === "string" ? audio : audio.turns.map(([, text]) => text).join(" ");

const clips: ListeningClip[] = [];

// Registers the clip a question plays and returns its audio text.
const play = (id: string, audio: Audio) => {
  if (typeof audio !== "string") {
    clips.push({ id, ...audio });
  }

  return audioText(audio);
};

// Variant 1 keeps the question ids it had before variants, so saved answers still point at them.
const questionId = (task: string, variant: number, item: number) =>
  variant === 1 ? `mock-${task}-${item}` : `mock-${task}-v${variant}-${item}`;

const listening = (
  id: string,
  fields: Pick<Question, "task" | "prompt" | "answer" | "options" | "explanation" | "audio">,
): Question => ({ id, kind: "listen", skill: "listening", ...fields });

const variant = (
  task: string,
  number: number,
  theme: string,
  names: string[],
  questions: Question[],
): MockVariant => ({ id: `${task}-v${number}`, theme, names, questions });

// Task 1: five short conversations, each with a question and three pictured answers.
type PictureItem = {
  prompt: string;
  answer: string;
  wrong: [string, string];
  explanation: string;
  audio: Audio;
};

const conversations = (number: number, theme: string, names: string[], items: PictureItem[]) =>
  variant(
    "l1",
    number,
    theme,
    names,
    items.map((item, i) => {
      const id = questionId("l1", number, i);

      return listening(id, {
        task: "Task 1 · Short conversations",
        prompt: item.prompt,
        answer: item.answer,
        options: [item.answer, ...item.wrong],
        explanation: item.explanation,
        audio: play(id, item.audio),
      });
    }),
  );

// Task 2: five messages, each matched to one of eight pictures.
type MessageItem = { answer: string; explanation: string; audio: Audio };

const messages = (
  number: number,
  theme: string,
  names: string[],
  [title, prompt]: [string, string],
  pictures: string[],
  items: MessageItem[],
) =>
  variant(
    "l2",
    number,
    theme,
    names,
    items.map((item, i) => {
      const id = questionId("l2", number, i);

      return listening(id, {
        task: title,
        prompt,
        answer: item.answer,
        options: pictures,
        explanation: item.explanation,
        audio: play(id, item.audio),
      });
    }),
  );

// Task 3: one person says eight things; each matches one of eleven endings.
type StatementItem = { about: string; answer: string; audio: Audio };

const statements = (
  number: number,
  theme: string,
  names: string[],
  speaker: string,
  endings: string[],
  items: StatementItem[],
) =>
  variant(
    "l3",
    number,
    theme,
    names,
    items.map((item, i) => {
      const id = questionId("l3", number, i);
      const audio = play(id, item.audio);

      return listening(id, {
        task: "Task 3 · Match eight statements",
        prompt: `Choose the statement that matches what ${speaker} says about ${item.about}.`,
        answer: item.answer,
        options: endings,
        explanation: `The speaker says: “${audio}” This supports “${item.answer}”; the other endings describe different or unmentioned details.`,
        audio,
      });
    }),
  );

// Task 4: one conversation and seven sentences to complete from a list of details.
type GapItem = [prompt: string, answer: string, explanation: string];

const conversation = (
  number: number,
  theme: string,
  names: string[],
  audio: Audio,
  details: string[],
  items: GapItem[],
) => {
  const text = play(number === 1 ? "mock-l4" : `mock-l4-v${number}`, audio);

  return variant(
    "l4",
    number,
    theme,
    names,
    items.map(([prompt, answer, explanation], i) =>
      listening(questionId("l4", number, i), {
        task: "Task 4 · Complete a conversation",
        prompt,
        answer,
        options: details,
        explanation,
        audio: text,
      }),
    ),
  );
};

const task1 = [
  conversations(
    1,
    "everyday choices",
    ["Daniel"],
    [
      {
        prompt: "¿Qué quiere beber la mujer?",
        answer: "☕ Café.",
        wrong: ["🍵 Té.", "🧃 Zumo."],
        explanation: "She orders café con leche and explicitly declines juice.",
        audio: {
          voices: { waiter: "male", customer: "female" },
          turns: [
            ["waiter", "Buenos días. ¿Qué quiere tomar?"],
            ["customer", "Quiero un café con leche y una tostada, por favor."],
            ["waiter", "¿Quiere también un zumo de naranja?"],
            ["customer", "No, gracias. Solo el café y la tostada."],
          ],
        },
      },
      {
        prompt: "¿Cómo va el hombre al trabajo?",
        answer: "🚌 En autobús.",
        wrong: ["🚆 En tren.", "🚶 A pie."],
        explanation: "He normally travels by bus, even though he owns a car.",
        audio: {
          voices: { friend: "female", daniel: "male" },
          turns: [
            ["friend", "¿Cómo vas al trabajo, Daniel?"],
            ["daniel", "Normalmente voy en autobús."],
            ["friend", "¿No tienes coche?"],
            [
              "daniel",
              "Sí, pero no hay aparcamiento cerca de mi oficina. El autobús para justo delante del edificio.",
            ],
          ],
        },
      },
      {
        prompt: "¿Qué compra la mujer?",
        answer: "👗 Un vestido.",
        wrong: ["👞 Unos zapatos.", "👔 Una camisa."],
        explanation: "She requests and buys a blue dress. She says she does not need shoes.",
        audio: {
          voices: { customer: "female", assistant: "male" },
          turns: [
            ["customer", "Buenas tardes. Busco un vestido azul para una fiesta."],
            ["assistant", "Tenemos este en su talla. ¿Le gusta?"],
            ["customer", "Sí, es muy bonito. Me llevo el vestido, pero no necesito zapatos."],
          ],
        },
      },
      {
        prompt: "¿Dónde quedan los amigos?",
        answer: "📚 En la biblioteca.",
        wrong: ["🎬 En el cine.", "🌳 En el parque."],
        explanation: "They agree to meet at the library because home is noisy.",
        audio: {
          voices: { first: "male", second: "female" },
          turns: [
            ["first", "¿Estudiamos juntos esta tarde?"],
            ["second", "Sí, pero en mi casa hay mucho ruido. Podemos ir a la biblioteca."],
            ["first", "Buena idea. Nos vemos en la biblioteca a las cinco, después de comer."],
          ],
        },
      },
      {
        prompt: "¿Qué tiempo hace hoy?",
        answer: "🌧️ Llueve.",
        wrong: ["☀️ Hace sol.", "❄️ Nieva."],
        explanation: "Today is rainy. Tomorrow’s sun is a distractor.",
        audio: {
          voices: { first: "male", second: "female" },
          turns: [
            ["first", "¿Vamos al parque esta mañana?"],
            [
              "second",
              "No, hoy llueve mucho y hace frío. Es mejor estar en casa. Mañana hace sol.",
            ],
            ["first", "Vale, hoy podemos ver una película y mañana salimos."],
          ],
        },
      },
    ],
  ),
  conversations(
    2,
    "errands and plans",
    ["Marcos"],
    [
      {
        prompt: "¿Qué compra el hombre?",
        answer: "🍞 Pan.",
        wrong: ["🥛 Leche.", "🍎 Manzanas."],
        explanation:
          "He asks for a loaf of bread and turns down the milk because he has some at home.",
        audio: {
          voices: { baker: "female", customer: "male" },
          turns: [
            ["baker", "Hola, buenos días. ¿Qué necesita?"],
            ["customer", "Una barra de pan, por favor."],
            ["baker", "¿Algo más? Hoy tenemos leche fresca."],
            ["customer", "No, gracias. Leche tengo en casa. Solo el pan."],
          ],
        },
      },
      {
        prompt: "¿A qué hora empieza la clase mañana?",
        answer: "🕙 A las diez.",
        wrong: ["🕘 A las nueve.", "🕚 A las once."],
        explanation:
          "The class usually starts at nine, but tomorrow it starts at ten. Eleven is when it ends.",
        audio: {
          voices: { friend: "female", marcos: "male" },
          turns: [
            ["friend", "Marcos, ¿a qué hora empieza la clase de inglés?"],
            ["marcos", "Normalmente empieza a las nueve, pero mañana empieza a las diez."],
            ["friend", "¿A las diez? ¿Y termina a las once?"],
            ["marcos", "Sí, termina a las once, como siempre."],
          ],
        },
      },
      {
        prompt: "¿Qué hace Marcos el domingo?",
        answer: "🏊 Nada.",
        wrong: ["⚽ Juega al fútbol.", "🚴 Monta en bici."],
        explanation: "On Sunday he goes to the swimming pool. Football is on Saturdays.",
        audio: {
          voices: { friend: "female", marcos: "male" },
          turns: [
            ["friend", "¿Qué haces el domingo, Marcos?"],
            ["marcos", "Por la mañana voy a la piscina con mi hermano. Nadamos una hora."],
            ["friend", "¿No juegas al fútbol?"],
            ["marcos", "No, el fútbol es los sábados."],
          ],
        },
      },
      {
        prompt: "¿Dónde está el móvil?",
        answer: "🛋️ En el sofá.",
        wrong: ["🎒 En la mochila.", "🚗 En el coche."],
        explanation: "It is not in the car or the backpack; she finds it on the sofa.",
        audio: {
          voices: { owner: "male", friend: "female" },
          turns: [
            ["owner", "¿Dónde está mi móvil? No está en el coche."],
            ["friend", "¿Está en tu mochila?"],
            ["owner", "No, en la mochila solo hay libros."],
            ["friend", "Mira, está aquí, en el sofá."],
          ],
        },
      },
      {
        prompt: "¿Qué le duele a Marcos?",
        answer: "🤕 La cabeza.",
        wrong: ["🦷 Los dientes.", "🦶 El pie."],
        explanation: "He has a bad headache. He says his teeth do not hurt.",
        audio: {
          voices: { friend: "female", marcos: "male" },
          turns: [
            ["friend", "¿Qué te pasa, Marcos? ¿Estás enfermo?"],
            ["marcos", "Me duele mucho la cabeza."],
            ["friend", "¿Te duelen también los dientes?"],
            ["marcos", "No, los dientes no. Solo la cabeza. Voy a tomar una pastilla."],
          ],
        },
      },
    ],
  ),
  conversations(
    3,
    "home, food and travel",
    ["Matías"],
    [
      {
        prompt: "¿Qué pide el hombre?",
        answer: "🐟 Pescado.",
        wrong: ["🥩 Carne.", "🥗 Ensalada."],
        explanation:
          "The waitress offers meat or fish; he orders fish because he does not eat meat.",
        audio: {
          voices: { waitress: "female", customer: "male" },
          turns: [
            ["waitress", "¿Qué va a tomar de segundo?"],
            ["customer", "¿Qué hay hoy?"],
            ["waitress", "Tenemos carne con patatas o pescado."],
            ["customer", "Pescado, por favor. No como carne."],
          ],
        },
      },
      {
        prompt: "¿Qué animal tiene Matías?",
        answer: "🐱 Un gato.",
        wrong: ["🐶 Un perro.", "🐦 Un pájaro."],
        explanation: "Matías has a black cat. The woman is the one who wants a dog.",
        audio: {
          voices: { friend: "female", matias: "male" },
          turns: [
            ["friend", "Matías, ¿tienes animales en casa?"],
            ["matias", "Sí, tengo un gato negro. Es muy tranquilo."],
            ["friend", "¡Qué bonito! Yo quiero un perro, pero mi piso es pequeño."],
          ],
        },
      },
      {
        prompt: "¿Qué hace Matías esta tarde?",
        answer: "📖 Estudia.",
        wrong: ["🎬 Va al cine.", "⚽ Juega al fútbol."],
        explanation:
          "He cannot go to the cinema this afternoon because he has to study for an exam.",
        audio: {
          voices: { friend: "female", matias: "male" },
          turns: [
            ["friend", "¿Vamos al cine esta tarde?"],
            ["matias", "Lo siento, esta tarde no puedo. Tengo que estudiar para un examen."],
            ["friend", "¿Y mañana?"],
            ["matias", "Mañana sí. Mañana vamos al cine."],
          ],
        },
      },
      {
        prompt: "¿Dónde vive el hermano de Matías?",
        answer: "🏔️ En la montaña.",
        wrong: ["🏖️ En la playa.", "🏙️ En la ciudad."],
        explanation: "His brother lives in a mountain village. The beach is far away.",
        audio: {
          voices: { friend: "female", matias: "male" },
          turns: [
            ["friend", "¿Dónde vive tu hermano?"],
            ["matias", "Vive en un pueblo en la montaña. Es muy tranquilo."],
            ["friend", "¿Está cerca de la playa?"],
            ["matias", "No, la playa está lejos. Pero en invierno hay mucha nieve."],
          ],
        },
      },
      {
        prompt: "¿A qué hora sale el autobús?",
        answer: "🕔 A las cinco.",
        wrong: ["🕒 A las tres.", "🕓 A las cuatro."],
        explanation: "On Sundays the bus to Toledo leaves at five, not at three.",
        audio: {
          voices: { traveller: "male", clerk: "female" },
          turns: [
            ["traveller", "Perdone, ¿el autobús para Toledo sale a las tres?"],
            ["clerk", "No, hoy es domingo. Los domingos sale a las cinco."],
            ["traveller", "¿A las cinco? Bueno, entonces tomo un café y espero."],
          ],
        },
      },
    ],
  ),
  conversations(
    4,
    "shopping and the weekend",
    ["Felipe"],
    [
      {
        prompt: "¿Qué fruta compra el hombre?",
        answer: "🍓 Fresas.",
        wrong: ["🍊 Naranjas.", "🍌 Plátanos."],
        explanation: "He asks for oranges, but there are none today, so he buys strawberries.",
        audio: {
          voices: { seller: "female", customer: "male" },
          turns: [
            ["seller", "Buenos días. ¿Qué le pongo?"],
            ["customer", "Un kilo de naranjas, por favor."],
            ["seller", "Lo siento, hoy no hay naranjas. Tenemos plátanos y fresas."],
            ["customer", "Pues un kilo de fresas."],
          ],
        },
      },
      {
        prompt: "¿Qué lleva Felipe a la fiesta?",
        answer: "🍰 Una tarta.",
        wrong: ["🧃 Zumo.", "🎁 Un regalo."],
        explanation: "Felipe brings a chocolate cake. The woman brings the water and juice.",
        audio: {
          voices: { friend: "female", felipe: "male" },
          turns: [
            ["friend", "Felipe, ¿qué llevas a la fiesta del sábado?"],
            ["felipe", "Yo llevo una tarta de chocolate. Y tú, ¿llevas bebidas?"],
            ["friend", "Sí, yo llevo agua y zumo."],
          ],
        },
      },
      {
        prompt: "¿Qué compra el hombre?",
        answer: "👟 Unas zapatillas.",
        wrong: ["🧥 Un abrigo.", "🧢 Una gorra."],
        explanation: "He is looking for running shoes and takes the black ones.",
        audio: {
          voices: { assistant: "female", customer: "male" },
          turns: [
            ["assistant", "Hola, ¿le puedo ayudar?"],
            ["customer", "Sí, busco unas zapatillas para correr."],
            ["assistant", "Tenemos estas blancas y estas negras."],
            ["customer", "Las negras, por favor. Son muy cómodas."],
          ],
        },
      },
      {
        prompt: "¿Dónde trabaja Felipe?",
        answer: "🏫 En un colegio.",
        wrong: ["🏥 En un hospital.", "🏦 En un banco."],
        explanation: "He teaches music at a school. The hospital is only next to it.",
        audio: {
          voices: { friend: "female", felipe: "male" },
          turns: [
            ["friend", "¿Dónde trabajas ahora, Felipe?"],
            ["felipe", "Trabajo en un colegio. Soy profesor de música."],
            ["friend", "¿En el colegio de tu barrio?"],
            ["felipe", "No, está en el centro, al lado del hospital."],
          ],
        },
      },
      {
        prompt: "¿Cómo paga el hombre?",
        answer: "💶 En efectivo.",
        wrong: ["💳 Con tarjeta.", "📱 Con el móvil."],
        explanation: "The cashier asks about a card, but he pays in cash.",
        audio: {
          voices: { cashier: "female", customer: "male" },
          turns: [
            ["cashier", "Son veinte euros. ¿Paga con tarjeta?"],
            ["customer", "No, con tarjeta no. Pago en efectivo."],
            ["cashier", "Perfecto, gracias. Aquí tiene su tique."],
          ],
        },
      },
    ],
  ),
];

const places = [
  "🚆 Estación",
  "💊 Farmacia",
  "📚 Biblioteca",
  "🛒 Supermercado",
  "🏨 Hotel",
  "🏊 Piscina",
  "🎬 Cine",
  "✈️ Aeropuerto",
];

const toPlaces: [string, string] = [
  "Task 2 · Match messages to places",
  "¿Dónde se escucha este mensaje?",
];

const task2 = [
  messages(1, "public announcements", [], toPlaces, places, [
    {
      answer: "🚆 Estación",
      explanation: "Tren, vía and billetes point to a railway station.",
      audio:
        "Atención, viajeros. El tren con destino a Málaga sale dentro de diez minutos de la vía número tres. Tengan preparados sus billetes, por favor.",
    },
    {
      answer: "🏨 Hotel",
      explanation: "A room key and breakfast information indicate a hotel.",
      audio:
        "Buenos días. Su habitación está en la segunda planta. El desayuno se sirve de siete a diez. Aquí tiene la llave. Disfrute de su estancia.",
    },
    {
      answer: "🛒 Supermercado",
      explanation: "Fruit by the kilo and milk offers indicate a supermarket.",
      audio:
        "Atención, clientes. Hoy tenemos manzanas a un euro el kilo y leche en oferta. Pueden encontrar estos productos junto a la entrada de la tienda.",
    },
    {
      answer: "🎬 Cine",
      explanation: "A film, numbered screening room and seats indicate a cinema.",
      audio:
        "La película empieza en cinco minutos. Por favor, entren en la sala dos, busquen su asiento y apaguen sus teléfonos durante la película.",
    },
    {
      answer: "📚 Biblioteca",
      explanation: "Borrowing books with a card identifies a library.",
      audio:
        "Por favor, recuerden que no se puede hablar por teléfono en esta sala. Para llevar libros a casa, presenten su tarjeta en el mostrador.",
    },
  ]),
  messages(
    2,
    "phone messages",
    ["Sergio"],
    ["Task 2 · Match messages to topics", "¿De qué habla el mensaje?"],
    [
      "🦷 Dentista",
      "🍕 Pizzería",
      "📦 Paquete",
      "🏋️ Gimnasio",
      "🔑 Llaves",
      "🎂 Cumpleaños",
      "🚗 Taller",
      "📚 Clase",
    ],
    [
      {
        answer: "🦷 Dentista",
        explanation: "A dental clinic confirms an appointment with the dentist.",
        audio: say(
          "female",
          "Hola, buenas tardes. Le llamo de la clínica dental. Su cita con el dentista es mañana a las cinco. Si no puede venir, llame a este número, por favor.",
        ),
      },
      {
        answer: "🎂 Cumpleaños",
        explanation: "Sergio invites a friend to the party for his birthday on Saturday.",
        audio: say(
          "male",
          "Hola, soy Sergio. El sábado es mi cumpleaños y hago una fiesta en mi casa a las ocho. ¿Vienes? Llámame, por favor.",
        ),
      },
      {
        answer: "📦 Paquete",
        explanation: "A shop says a parcel is ready to collect.",
        audio: say(
          "female",
          "Buenos días. Su paquete está en nuestra tienda de la calle Mayor. Puede recogerlo de lunes a viernes, de nueve a dos.",
        ),
      },
      {
        answer: "🚗 Taller",
        explanation: "A garage says the car is repaired and ready.",
        audio: say(
          "male",
          "Hola, le llamamos del taller. Su coche ya está listo. Puede venir esta tarde a buscarlo. Cerramos a las siete.",
        ),
      },
      {
        answer: "📚 Clase",
        explanation: "The teacher cancels tomorrow’s Spanish class because he is ill.",
        audio: say(
          "male",
          "Hola, soy tu profesor de español. Mañana no hay clase porque estoy enfermo. Nos vemos el jueves a la misma hora.",
        ),
      },
    ],
  ),
  messages(
    3,
    "announcements on a journey",
    [],
    toPlaces,
    [
      "✈️ Aeropuerto",
      "🚌 Autobús",
      "🚢 Barco",
      "🚇 Metro",
      "🚕 Taxi",
      "🏨 Hotel",
      "⛽ Gasolinera",
      "🚆 Tren",
    ],
    [
      {
        answer: "✈️ Aeropuerto",
        explanation: "A delayed flight and a gate number point to an airport.",
        audio: say(
          "female",
          "Señores pasajeros, el vuelo a París sale con una hora de retraso. Por favor, esperen en la puerta doce.",
        ),
      },
      {
        answer: "🚇 Metro",
        explanation: "The next station and a change to line two point to the underground.",
        audio: say(
          "male",
          "Próxima estación: Sol. Pueden cambiar a la línea dos. Por favor, dejen salir antes de entrar.",
        ),
      },
      {
        answer: "🚢 Barco",
        explanation: "Arriving at an island and a café on the first deck point to a ship.",
        audio: say(
          "female",
          "Bienvenidos a bordo. Llegamos a la isla en media hora. La cafetería está en la primera planta del barco.",
        ),
      },
      {
        answer: "🚌 Autobús",
        explanation: "Stops along the way and the driver point to a bus.",
        audio: say(
          "male",
          "Atención, señores viajeros. Este autobús para en todas las paradas hasta la plaza de España. Por favor, no hablen con el conductor.",
        ),
      },
      {
        answer: "🏨 Hotel",
        explanation: "The hotel restaurant, the pool and a room point to a hotel.",
        audio: say(
          "female",
          "Buenas noches. El restaurante del hotel está abierto hasta las once y la piscina cierra a las nueve. Su habitación está en la tercera planta.",
        ),
      },
    ],
  ),
  messages(
    4,
    "announcements in shops and public places",
    [],
    toPlaces,
    [
      "👕 Tienda de ropa",
      "🥖 Panadería",
      "📮 Correos",
      "🏦 Banco",
      "💇 Peluquería",
      "🐾 Veterinario",
      "🖼️ Museo",
      "🏟️ Estadio",
    ],
    [
      {
        answer: "👕 Tienda de ropa",
        explanation: "T-shirts on offer and fitting rooms point to a clothes shop.",
        audio: say(
          "female",
          "Atención, señores clientes. Hoy, si compran dos camisetas, la tercera es gratis. Los probadores están al fondo de la tienda.",
        ),
      },
      {
        answer: "🖼️ Museo",
        explanation: "Painting rooms, no photos and a visit point to a museum.",
        audio: say(
          "male",
          "Bienvenidos. Las salas de pintura están en la primera planta. No se pueden hacer fotos. La visita termina a las seis.",
        ),
      },
      {
        answer: "🏟️ Estadio",
        explanation: "A match, fans and seats point to a stadium.",
        audio: say(
          "male",
          "Atención, aficionados. El partido empieza en quince minutos. Por favor, busquen su asiento. No se puede bajar al campo.",
        ),
      },
      {
        answer: "📮 Correos",
        explanation: "Sending letters and parcels and buying stamps point to the post office.",
        audio: say(
          "female",
          "Hola, buenos días. Para enviar una carta o un paquete, tomen un número y esperen, por favor. Los sellos se compran en la ventanilla tres.",
        ),
      },
      {
        answer: "🥖 Panadería",
        explanation: "Bread from the oven and cakes point to a bakery.",
        audio: say(
          "female",
          "Recuerden: el pan sale del horno a las ocho y a las doce. Hoy tenemos también pasteles de chocolate.",
        ),
      },
    ],
  ),
];

const task3 = [
  statements(
    1,
    "a teacher's daily life",
    ["Fernando", "Pablo", "Luis", "Diego"],
    "Fernando",
    [
      "es profesor.",
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
    ],
    [
      {
        about: "his job",
        answer: "es profesor.",
        audio:
          "Soy Fernando y soy profesor de español en una escuela pequeña. Me gusta mi trabajo porque conozco a mucha gente.",
      },
      {
        about: "his home",
        answer: "vive cerca del centro.",
        audio:
          "Mi piso no es muy grande, pero está cerca del centro. Puedo ir andando a las tiendas y al mercado.",
      },
      {
        about: "his family",
        answer: "tiene dos hermanos.",
        audio:
          "Tengo dos hermanos. Mi hermano mayor se llama Pablo y el pequeño se llama Luis. Los dos son estudiantes.",
      },
      {
        about: "transport",
        answer: "va al trabajo en bicicleta.",
        audio:
          "Todas las mañanas voy al trabajo en bicicleta. La escuela está cerca de mi casa y el viaje dura diez minutos.",
      },
      {
        about: "lunch",
        answer: "come a las dos.",
        audio:
          "Normalmente como a las dos de la tarde con mis compañeros. Comemos en un pequeño restaurante junto a la escuela.",
      },
      {
        about: "his studies",
        answer: "estudia francés.",
        audio:
          "Los lunes y miércoles estudio francés por la tarde. Mi profesora es de París y en clase hablamos mucho.",
      },
      {
        about: "sport",
        answer: "juega al tenis.",
        audio:
          "Los sábados juego al tenis con mi amigo Diego. Nos gusta mucho el deporte y después tomamos un café juntos.",
      },
      {
        about: "his evening",
        answer: "lee antes de dormir.",
        audio:
          "Por la noche leo un poco antes de dormir. Me gustan los libros de viajes y las historias sobre otros países.",
      },
    ],
  ),
  statements(
    2,
    "a cook's week",
    ["Vicente"],
    "Vicente",
    [
      "trabaja en un restaurante.",
      "vive con su hermano.",
      "se levanta muy temprano.",
      "va al trabajo en metro.",
      "cena en casa.",
      "aprende inglés.",
      "nada en la piscina.",
      "ve la televisión.",
      "tiene dos hijos.",
      "vive en el campo.",
      "juega al baloncesto.",
    ],
    [
      {
        about: "his job",
        answer: "trabaja en un restaurante.",
        audio: say(
          "male",
          "Me llamo Vicente y soy cocinero. Trabajo en un restaurante pequeño del centro. Me gusta mucho cocinar para la gente.",
        ),
      },
      {
        about: "his home",
        answer: "vive con su hermano.",
        audio: say(
          "male",
          "Vivo en un piso con mi hermano mayor. Él es médico y trabaja en un hospital. Nos llevamos muy bien.",
        ),
      },
      {
        about: "his mornings",
        answer: "se levanta muy temprano.",
        audio: say(
          "male",
          "Todos los días me levanto a las seis de la mañana. Desayuno un café y una tostada y salgo de casa.",
        ),
      },
      {
        about: "transport",
        answer: "va al trabajo en metro.",
        audio: say(
          "male",
          "Para ir al restaurante tomo el metro. El viaje es corto, solo quince minutos, y puedo leer un poco.",
        ),
      },
      {
        about: "dinner",
        answer: "cena en casa.",
        audio: say(
          "male",
          "Por la noche no ceno en el restaurante. Prefiero cenar en casa, tranquilo, con mi hermano.",
        ),
      },
      {
        about: "his studies",
        answer: "aprende inglés.",
        audio: say(
          "male",
          "Los martes y jueves voy a clase de inglés. Muchos clientes del restaurante son turistas y quiero hablar con ellos.",
        ),
      },
      {
        about: "sport",
        answer: "nada en la piscina.",
        audio: say(
          "male",
          "Los domingos voy a la piscina de mi barrio. Nado una hora y después estoy muy contento.",
        ),
      },
      {
        about: "his free time at home",
        answer: "ve la televisión.",
        audio: say(
          "male",
          "Antes de dormir veo un poco la televisión. Me gustan las películas y los programas de viajes.",
        ),
      },
    ],
  ),
  statements(
    3,
    "a student in Salamanca",
    ["Iván"],
    "Iván",
    [
      "estudia medicina.",
      "vive en una residencia.",
      "tiene un hermano pequeño.",
      "come en la cafetería.",
      "tiene amigos de muchos países.",
      "viaja los fines de semana.",
      "toca la guitarra.",
      "habla con su madre todos los días.",
      "trabaja en una tienda.",
      "vive con sus padres.",
      "juega al fútbol.",
    ],
    [
      {
        about: "his studies",
        answer: "estudia medicina.",
        audio: say(
          "male",
          "Me llamo Iván y estudio medicina en la universidad de Salamanca. Es una carrera difícil, pero me gusta mucho.",
        ),
      },
      {
        about: "his home",
        answer: "vive en una residencia.",
        audio: say(
          "male",
          "No vivo con mi familia. Vivo en una residencia de estudiantes cerca de la universidad. Mi habitación es pequeña.",
        ),
      },
      {
        about: "his family",
        answer: "tiene un hermano pequeño.",
        audio: say(
          "male",
          "Mi familia vive en Valencia. Tengo un hermano pequeño. Tiene doce años y va al colegio.",
        ),
      },
      {
        about: "lunch",
        answer: "come en la cafetería.",
        audio: say(
          "male",
          "Normalmente como en la cafetería de la universidad. La comida es barata y bastante buena.",
        ),
      },
      {
        about: "his friends",
        answer: "tiene amigos de muchos países.",
        audio: say(
          "male",
          "En la residencia tengo amigos de Francia, de Alemania y de Japón. Siempre hablamos en español.",
        ),
      },
      {
        about: "his weekends",
        answer: "viaja los fines de semana.",
        audio: say(
          "male",
          "Algunos fines de semana viajo con mis amigos. Ya conocemos Madrid, Segovia y Ávila.",
        ),
      },
      {
        about: "music",
        answer: "toca la guitarra.",
        audio: say(
          "male",
          "Por las tardes toco la guitarra en mi habitación. Mis compañeros dicen que toco muy bien.",
        ),
      },
      {
        about: "his mother",
        answer: "habla con su madre todos los días.",
        audio: say(
          "male",
          "Llamo a mi madre por teléfono todos los días. Ella siempre pregunta si como bien.",
        ),
      },
    ],
  ),
  statements(
    4,
    "a bus driver's day",
    ["Ernesto"],
    "Ernesto",
    [
      "es conductor de autobús.",
      "trabaja por la tarde.",
      "vive en un pueblo.",
      "tiene dos hijos.",
      "cocina por la mañana.",
      "pasea con su perro.",
      "va a la playa en verano.",
      "lee el periódico.",
      "trabaja en un hospital.",
      "vive solo.",
      "estudia alemán.",
    ],
    [
      {
        about: "his job",
        answer: "es conductor de autobús.",
        audio: say(
          "male",
          "Soy Ernesto y soy conductor de autobús. Trabajo en la línea cinco, que va del centro al hospital.",
        ),
      },
      {
        about: "his timetable",
        answer: "trabaja por la tarde.",
        audio: say(
          "male",
          "Tengo horario de tarde. Empiezo a las tres y termino a las once de la noche.",
        ),
      },
      {
        about: "his home",
        answer: "vive en un pueblo.",
        audio: say(
          "male",
          "Vivo en un pueblo pequeño, a veinte minutos de la ciudad. Mi casa tiene un jardín con muchas flores.",
        ),
      },
      {
        about: "his family",
        answer: "tiene dos hijos.",
        audio: say(
          "male",
          "Estoy casado y tengo dos hijos. El mayor tiene diez años y el pequeño tiene siete.",
        ),
      },
      {
        about: "his mornings",
        answer: "cocina por la mañana.",
        audio: say(
          "male",
          "Por la mañana estoy en casa. Hago la compra y preparo la comida para toda la familia.",
        ),
      },
      {
        about: "his dog",
        answer: "pasea con su perro.",
        audio: say(
          "male",
          "Tengo un perro grande y muy simpático. Todas las mañanas paseamos juntos por el campo.",
        ),
      },
      {
        about: "his holidays",
        answer: "va a la playa en verano.",
        audio: say(
          "male",
          "En agosto tengo vacaciones. Vamos siempre a la playa, a un apartamento en Alicante.",
        ),
      },
      {
        about: "reading",
        answer: "lee el periódico.",
        audio: say(
          "male",
          "En el autobús no puedo leer, claro. Pero en casa leo el periódico todos los días después de comer.",
        ),
      },
    ],
  ),
];

const task4 = [
  conversation(
    1,
    "a day trip to Segovia",
    ["Pablo"],
    {
      voices: { friend: "female", pablo: "male" },
      turns: [
        ["friend", "Hola, Pablo. ¿Tienes planes para el sábado?"],
        ["pablo", "Sí, quiero ir a Segovia con mi hermana. ¿Quieres venir?"],
        ["friend", "Me encantaría. ¿Cómo vamos?"],
        [
          "pablo",
          "Podemos ir en tren. El tren sale de Madrid a las nueve de la mañana y llega a las diez.",
        ],
        ["friend", "Muy bien. ¿Cuánto cuesta el billete?"],
        ["pablo", "Cuesta doce euros por persona. Mi hermana compra los billetes esta tarde."],
        ["friend", "Perfecto. ¿Y qué hacemos en Segovia?"],
        [
          "pablo",
          "Primero podemos visitar el centro. Hay una plaza muy bonita y una iglesia antigua. Después comemos en un restaurante cerca de la estación.",
        ],
        ["friend", "¿A qué hora comemos?"],
        ["pablo", "A las dos. El restaurante tiene un menú de quince euros con bebida y postre."],
        ["friend", "Me parece bien. ¿Volvemos por la tarde?"],
        ["pablo", "Sí, el tren de vuelta sale a las seis. Llegamos a Madrid a las siete."],
        ["friend", "Entonces nos vemos el sábado en la estación. ¿A las ocho y media?"],
        [
          "pablo",
          "Sí, a las ocho y media, junto a la entrada principal. No olvides llevar agua. Hace mucho calor.",
        ],
        ["friend", "De acuerdo, hasta el sábado."],
      ],
    },
    [
      "Segovia",
      "en tren",
      "a las nueve",
      "doce euros",
      "la hermana de Pablo",
      "a las dos",
      "a las ocho y media",
      "quince euros",
    ],
    [
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
    ],
  ),
  conversation(
    2,
    "a cooking class",
    ["Rubén"],
    {
      voices: { friend: "female", ruben: "male" },
      turns: [
        ["friend", "Rubén, ¿qué haces este fin de semana?"],
        ["ruben", "El domingo voy a una clase de cocina. Aprendemos a hacer paella."],
        ["friend", "¡Qué bien! ¿Dónde es la clase?"],
        ["ruben", "En una escuela de cocina de la calle Mayor, al lado del mercado."],
        ["friend", "¿A qué hora empieza?"],
        [
          "ruben",
          "Empieza a las once de la mañana y termina a las dos. Después comemos la paella todos juntos.",
        ],
        ["friend", "¿Y cuánto cuesta?"],
        ["ruben", "Veinticinco euros, con la comida y una bebida."],
        ["friend", "No es caro. ¿Puedo ir contigo?"],
        ["ruben", "Claro. Pero tienes que llamar antes, porque solo hay diez plazas."],
        ["friend", "¿Tengo que llevar algo?"],
        ["ruben", "No, la escuela tiene todo. Solo tienes que llevar ropa cómoda."],
        ["friend", "Perfecto. Llamo esta tarde."],
        ["ruben", "Muy bien. Nos vemos el domingo en la puerta de la escuela."],
      ],
    },
    [
      "veinticinco euros",
      "ropa cómoda",
      "paella",
      "a las dos",
      "diez plazas",
      "cocina",
      "a las once",
      "mercado",
    ],
    [
      ["Rubén va a una clase de…", "cocina", "Rubén says he is going to a cooking class."],
      ["En la clase preparan…", "paella", "They learn to make paella and eat it together."],
      [
        "La escuela está al lado del…",
        "mercado",
        "The cooking school is on calle Mayor, next to the market.",
      ],
      [
        "La clase empieza…",
        "a las once",
        "The class starts at eleven; two o’clock is when it ends.",
      ],
      [
        "La clase cuesta…",
        "veinticinco euros",
        "It costs twenty-five euros, with the meal and a drink.",
      ],
      [
        "En la clase hay…",
        "diez plazas",
        "His friend has to call first because there are only ten places.",
      ],
      [
        "Hay que llevar…",
        "ropa cómoda",
        "The school has everything; you only bring comfortable clothes.",
      ],
    ],
  ),
  conversation(
    3,
    "a surprise birthday dinner",
    ["Lorenzo", "Esteban"],
    {
      voices: { friend: "female", lorenzo: "male" },
      turns: [
        ["friend", "Hola, Lorenzo. El viernes es el cumpleaños de Esteban. ¿Hacemos una cena?"],
        ["lorenzo", "¡Buena idea! ¿Dónde? ¿En tu casa o en un restaurante?"],
        ["friend", "En un restaurante. Conozco uno mexicano muy bueno en la plaza Mayor."],
        ["lorenzo", "Perfecto. A Esteban le encanta la comida mexicana. ¿A qué hora?"],
        ["friend", "A las nueve. ¿Está bien?"],
        ["lorenzo", "Sí. ¿Cuántas personas vamos?"],
        ["friend", "Somos ocho: los compañeros de trabajo y su hermano."],
        ["lorenzo", "¿Y el regalo? Podemos comprar un libro."],
        ["friend", "Mejor unas entradas para un concierto. Le gusta mucho la música."],
        ["lorenzo", "Vale. ¿Cuánto pagamos cada uno?"],
        ["friend", "Unos quince euros por persona. Yo compro las entradas mañana."],
        ["lorenzo", "Muy bien. Y yo llamo al restaurante para reservar la mesa."],
        ["friend", "Genial. Pero es una sorpresa. No le digas nada a Esteban."],
        ["lorenzo", "Tranquila, no digo nada."],
      ],
    },
    [
      "ocho personas",
      "viernes",
      "un libro",
      "a las nueve",
      "restaurante",
      "unas entradas",
      "quince euros",
      "mexicano",
    ],
    [
      ["La cena es el…", "viernes", "Esteban’s birthday is on Friday, so the dinner is then."],
      ["El restaurante es…", "mexicano", "She knows a very good Mexican restaurant."],
      ["La cena empieza…", "a las nueve", "They agree to start the dinner at nine o’clock."],
      ["En la cena son…", "ocho personas", "Eight people: his work colleagues and his brother."],
      [
        "El regalo es…",
        "unas entradas",
        "Lorenzo suggests a book, but they choose concert tickets.",
      ],
      ["Cada persona paga…", "quince euros", "About fifteen euros per person."],
      ["Lorenzo llama al…", "restaurante", "Lorenzo calls the restaurant to book the table."],
    ],
  ),
  conversation(
    4,
    "a doctor's appointment",
    ["Adrián"],
    {
      voices: { receptionist: "female", adrian: "male" },
      turns: [
        ["receptionist", "Centro de salud, buenos días. ¿Dígame?"],
        [
          "adrian",
          "Buenos días. Me llamo Adrián Gómez. Quiero una cita con la doctora Ruiz, por favor.",
        ],
        ["receptionist", "¿Qué le pasa?"],
        ["adrian", "Tengo fiebre y me duele mucho la garganta."],
        ["receptionist", "La doctora no tiene citas hoy. ¿Puede venir mañana?"],
        ["adrian", "Sí, mañana puedo. ¿A qué hora?"],
        ["receptionist", "A las diez y media o a las cuatro de la tarde."],
        ["adrian", "Mejor a las cuatro. Por la mañana trabajo."],
        ["receptionist", "Muy bien. Tiene que traer su tarjeta sanitaria."],
        ["adrian", "Sí, claro. ¿Dónde está la consulta?"],
        ["receptionist", "Es la consulta siete, en la segunda planta."],
        ["adrian", "¿Hay ascensor?"],
        ["receptionist", "Sí, el ascensor está al lado de la farmacia."],
        ["adrian", "Muchas gracias. Hasta mañana."],
      ],
    },
    [
      "la farmacia",
      "mañana",
      "la garganta",
      "a las diez y media",
      "la tarjeta sanitaria",
      "trabaja",
      "a las cuatro",
      "la segunda planta",
    ],
    [
      ["Adrián tiene fiebre y le duele…", "la garganta", "He has a fever and a very sore throat."],
      ["La cita es…", "mañana", "The doctor has no appointments today, so he comes tomorrow."],
      [
        "La hora de la cita es…",
        "a las cuatro",
        "He is offered half past ten or four and picks four. Half past ten is a distractor.",
      ],
      ["Por la mañana Adrián…", "trabaja", "He cannot come in the morning because he works."],
      ["Tiene que traer…", "la tarjeta sanitaria", "The receptionist asks for his health card."],
      ["La consulta está en…", "la segunda planta", "Room seven is on the second floor."],
      ["El ascensor está al lado de…", "la farmacia", "The lift is next to the pharmacy."],
    ],
  ),
];

export const listeningTasks: MockTask[] = [
  { id: "l1", variants: task1 },
  { id: "l2", variants: task2 },
  { id: "l3", variants: task3 },
  { id: "l4", variants: task4 },
];

// Every clip scripts/make-dialogue.mjs makes for the mock exam listening, by dialogue id.
export const listeningClips: readonly ListeningClip[] = clips;
