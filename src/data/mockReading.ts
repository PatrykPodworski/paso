import type { MockTask, MockVariant, Question } from "./types.ts";

// A three-option item: the prompt, the answer, two wrong options and the explanation.
type ChoiceItem = [string, string, string, string, string];

// A matching item: the situation, the letter of the text it matches and the explanation.
type MatchItem = [string, string, string];

const LETTERS = "ABCDEFGHI".split("");

// FNV-1a: a fixed number for a string, the same on every device.
const hash = (text: string) => {
  let h = 0x811c9dc5;

  for (const char of text) {
    h = Math.imul(h ^ char.codePointAt(0)!, 0x01000193);
  }

  return h >>> 0;
};

// Puts the answer at a position fixed by the item's key, so the position differs between items
// and between variants and never gives the answer away.
const placeAnswer = (answer: string, wrong: string[], key: string) => {
  const options = [...wrong];

  options.splice(hash(key) % (wrong.length + 1), 0, answer);

  return options;
};

// Variant 1 keeps the question ids it had before variants, so saved answers still point at them.
const questionId = (task: string, variant: number, item: number) =>
  variant === 1 ? `mock-${task}-${item}` : `mock-${task}-v${variant}-${item}`;

const reading = (
  task: string,
  variant: number,
  item: number,
  fields: Pick<Question, "task" | "prompt" | "answer" | "options" | "explanation" | "passage">,
): Question => ({
  id: questionId(task, variant, item),
  kind: "choice",
  skill: "reading",
  ...fields,
});

// Tasks 1 and 4: one text and three-option questions about it.
const textTask =
  (task: string, title: string) =>
  (variant: number, theme: string, names: string[], text: string, items: ChoiceItem[]) =>
    ({
      id: `${task}-v${variant}`,
      theme,
      names,
      questions: items.map(([prompt, answer, a, b, explanation], i) =>
        reading(task, variant, i, {
          task: title,
          prompt,
          answer,
          options: placeAnswer(answer, [a, b], questionId(task, variant, i)),
          explanation,
          passage: text,
        }),
      ),
    }) satisfies MockVariant;

// Tasks 2 and 3: nine short texts lettered A–I and six situations, each matching one text.
const matchTask =
  (task: string, title: string, ask: string) =>
  (variant: number, theme: string, texts: string[], items: MatchItem[]) =>
    ({
      id: `${task}-v${variant}`,
      theme,
      names: [],
      questions: items.map(([situation, answer, explanation], i) =>
        reading(task, variant, i, {
          task: title,
          prompt: `${ask} (A–I): ${situation}`,
          answer,
          options: LETTERS,
          explanation,
          passage: texts.map((text, j) => `${LETTERS[j]}. ${text}`).join("\n\n"),
        }),
      ),
    }) satisfies MockVariant;

const email = textTask("r1", "Task 1 · A personal email");
const notices = matchTask("r2", "Task 2 · Match notices", "Choose the notice");
const ads = matchTask("r3", "Task 3 · Match people to advertisements", "Choose the advertisement");
const info = textTask("r4", "Task 4 · Practical information");

const r1: MockVariant[] = [
  email(
    1,
    "a new classmate",
    ["Laura", "Silvia", "Carmen"],
    "Hola, Silvia:\nMe llamo Laura y soy tu nueva compañera de español. Tengo veintiséis años y soy italiana, pero ahora vivo en Salamanca con mi hermana. Nuestro piso está en una calle tranquila, cerca de la universidad. Mi hermana trabaja en una farmacia y yo soy profesora de música en una escuela pequeña. Trabajo por la mañana, de nueve a dos, y por la tarde estudio español.\nLa clase empieza el martes a las seis. Nuestra profesora se llama Carmen y es muy simpática. Hay diez estudiantes en el grupo. Después de clase quiero tomar un café contigo en el bar de la plaza. El bar está al lado de la biblioteca.\nLos fines de semana me gusta pasear por el parque y leer en casa. No me gusta mucho el fútbol, pero a mi hermana sí. También me gusta cocinar pasta para mis amigos. ¿Qué te gusta hacer a ti? ¿Quieres venir a mi casa el domingo para comer?\nUn abrazo,\nLaura",
    [
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
        "Con Silvia.",
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
    ],
  ),
  email(
    2,
    "a new job in Bilbao",
    ["Tomás", "Inés"],
    "Hola, Inés:\n¿Qué tal estás? Te escribo desde Bilbao. Ahora vivo aquí porque tengo un trabajo nuevo en una empresa de informática. De lunes a jueves trabajo en la oficina y los viernes trabajo en casa. Mis compañeros son muy amables y comemos juntos a la una y media.\nVivo en un apartamento pequeño en el centro. Tiene un dormitorio, un salón, una cocina y un balcón. Desde el balcón veo el río. No tengo coche: voy a la oficina en metro y el viaje dura veinte minutos.\nBilbao me gusta mucho. Llueve bastante, pero hay muchos museos y la comida es muy buena. Los sábados por la mañana voy al mercado y por la tarde juego al baloncesto con unos amigos nuevos.\nEn julio vienen mis padres a Bilbao, pero en agosto tengo vacaciones y estoy solo. ¿Por qué no vienes a visitarme? Puedes dormir en el sofá del salón.\nUn beso,\nTomás",
    [
      [
        "¿Dónde trabaja Tomás los viernes?",
        "En casa.",
        "En la oficina.",
        "En el mercado.",
        "Los viernes trabajo en casa. He works in the office from Monday to Thursday.",
      ],
      [
        "¿Cómo va Tomás al trabajo?",
        "En metro.",
        "En coche.",
        "A pie.",
        "Voy a la oficina en metro. He says he has no car.",
      ],
      [
        "¿Qué tiene el apartamento de Tomás?",
        "Un balcón.",
        "Un jardín.",
        "Dos dormitorios.",
        "The flat has a balcony with a view of the river. It has only one bedroom.",
      ],
      [
        "¿Qué hace Tomás los sábados por la tarde?",
        "Juega al baloncesto.",
        "Va al mercado.",
        "Visita museos.",
        "He plays basketball on Saturday afternoons. The market is his Saturday morning.",
      ],
      [
        "¿Cuándo puede Inés visitar a Tomás?",
        "En agosto.",
        "En julio.",
        "En septiembre.",
        "Tomás is on holiday and alone in August. His parents visit in July.",
      ],
    ],
  ),
  email(
    3,
    "a host family",
    ["Nuria", "Hugo", "Ramón"],
    "Hola, Hugo:\nSoy Nuria, la madre de tu familia en España. Estamos muy contentos porque llegas el próximo domingo. Mi marido, Ramón, va a esperarte en el aeropuerto a las cuatro de la tarde. Tiene el pelo corto y gafas, y va a llevar un papel con tu nombre.\nVivimos en una casa con jardín, a quince minutos de la escuela de idiomas. Tu habitación está en el segundo piso. Es pequeña, pero tiene una mesa para estudiar y una ventana grande. El baño está al lado.\nEn casa somos cuatro: Ramón, yo y nuestros dos hijos. El chico tiene doce años y le gusta mucho el fútbol. La chica tiene ocho años y toca el piano. También tenemos un gato muy tranquilo.\nNormalmente desayunamos a las ocho y cenamos a las nueve. Si no comes carne o pescado, por favor, escríbeme. ¿Necesitas algo más?\nHasta pronto,\nNuria",
    [
      [
        "¿Quién espera a Hugo en el aeropuerto?",
        "El marido de Nuria.",
        "Nuria.",
        "Los hijos de Nuria.",
        "Mi marido, Ramón, va a esperarte: Nuria’s husband meets Hugo.",
      ],
      [
        "¿A qué hora tiene que estar Hugo en el aeropuerto?",
        "A las cuatro.",
        "A las ocho.",
        "A las nueve.",
        "Ramón waits for Hugo at the airport at four in the afternoon. Eight and nine are breakfast and dinner times.",
      ],
      [
        "¿Qué hay en la habitación de Hugo?",
        "Una mesa.",
        "Un baño.",
        "Un piano.",
        "The room has a desk and a big window. The bathroom is next to it, not in it.",
      ],
      [
        "¿Cuántas personas viven en la casa?",
        "Cuatro.",
        "Dos.",
        "Ocho.",
        "Somos cuatro: the parents and their two children.",
      ],
      [
        "¿Qué le gusta al hijo de Nuria?",
        "⚽ El fútbol.",
        "🎹 El piano.",
        "🐱 Los gatos.",
        "The boy likes football. The girl plays the piano.",
      ],
    ],
  ),
  email(
    4,
    "a birthday party",
    ["Beatriz", "Javier"],
    "Hola, Javier:\nEl sábado 14 es mi cumpleaños y quiero hacer una fiesta en mi casa. ¿Puedes venir? La fiesta empieza a las ocho de la tarde. Vienen mis compañeros de trabajo, mi hermano y algunos vecinos. Somos unas quince personas.\nMi casa está en la calle Olivo, número siete. Puedes venir en autobús: el número 21 para delante de la panadería, a cinco minutos de mi casa. En coche es difícil, porque en mi calle no hay sitio para aparcar.\nVoy a preparar tortilla, ensalada y una tarta de chocolate. No necesitas traer comida, pero, si quieres, puedes traer bebidas. Después de cenar vamos a bailar en el salón. Mi hermano pone la música.\nNo quiero regalos caros. Me gustan mucho las plantas y los libros de cocina.\nContesta antes del jueves, por favor.\nBesos,\nBeatriz",
    [
      [
        "¿Dónde es la fiesta?",
        "En casa de Beatriz.",
        "En una panadería.",
        "En el trabajo de Beatriz.",
        "Quiero hacer una fiesta en mi casa. The bakery is only the bus stop.",
      ],
      [
        "¿A qué hora empieza la fiesta?",
        "A las ocho.",
        "A las siete.",
        "A las cinco.",
        "La fiesta empieza a las ocho. Seven is the house number; five is minutes on foot.",
      ],
      [
        "¿Cómo es mejor ir a la fiesta?",
        "En autobús.",
        "En coche.",
        "En bicicleta.",
        "Beatriz suggests the bus, because there is nowhere to park in her street.",
      ],
      [
        "¿Qué puede llevar Javier?",
        "Bebidas.",
        "Una tarta.",
        "Tortilla.",
        "Puedes traer bebidas. Beatriz makes the tortilla and the cake herself.",
      ],
      [
        "¿Qué regalo le gusta a Beatriz?",
        "🪴 Una planta.",
        "🎂 Una tarta.",
        "💍 Algo caro.",
        "She likes plants and cookbooks and asks for no expensive presents.",
      ],
    ],
  ),
  email(
    5,
    "a holiday in the mountains",
    ["Alicia", "Raúl", "Olga"],
    "Hola, Raúl:\n¿Qué tal? Te escribo desde un pueblo pequeño en las montañas. Estoy aquí una semana con mi prima Olga. Dormimos en un hotel antiguo al lado del río. La habitación es bonita, pero no hay televisión ni internet. ¡Por eso te escribo desde la biblioteca del pueblo!\nHace buen tiempo: por la mañana hace sol y calor, pero por la noche hace frío. Todos los días caminamos tres o cuatro horas por la montaña. Mi prima siempre hace fotos de los animales y yo llevo el mapa.\nLa comida es muy buena. Para cenar normalmente tomamos sopa de verduras y carne. Mi plato favorito es el queso de la región. ¡Es fantástico!\nVolvemos a Zaragoza el viernes. ¿Quieres comer conmigo el domingo? Te voy a llevar un queso.\nUn abrazo,\nAlicia",
    [
      [
        "¿Con quién está Alicia de vacaciones?",
        "Con su prima.",
        "Con Raúl.",
        "Con su hermana.",
        "Estoy aquí… con mi prima Olga. Raúl is the friend she writes to.",
      ],
      [
        "¿Desde dónde escribe Alicia?",
        "Desde la biblioteca.",
        "Desde el hotel.",
        "Desde su casa.",
        "The hotel has no internet, so she writes from the village library.",
      ],
      [
        "¿Qué tiempo hace por la noche?",
        "Hace frío.",
        "Hace calor.",
        "Hace sol.",
        "Por la noche hace frío. Sun and heat are the mornings.",
      ],
      [
        "¿Qué hace Olga en la montaña?",
        "Hace fotos.",
        "Lleva el mapa.",
        "Cocina.",
        "Olga takes photos of the animals; Alicia carries the map.",
      ],
      [
        "¿Qué va a llevar Alicia a Raúl?",
        "🧀 Un queso.",
        "🍲 Una sopa.",
        "🗺️ Un mapa.",
        "Te voy a llevar un queso: she brings him the local cheese.",
      ],
    ],
  ),
  email(
    6,
    "a favour for a neighbour",
    ["Clara", "Andrés", "Bruno"],
    "Hola, Andrés:\nSoy Clara, tu vecina del tercero B. Te escribo porque la próxima semana voy a Lisboa por trabajo. Salgo el lunes temprano y vuelvo el jueves por la noche. ¿Puedes ayudarme con mi perro, Bruno?\nBruno es grande y negro, pero es muy bueno. Come dos veces al día, a las ocho de la mañana y a las siete de la tarde. Su comida está en la cocina, debajo de la ventana. Por la tarde necesita salir a pasear media hora. Le gusta mucho el parque de enfrente.\nEl domingo por la tarde te dejo las llaves de mi piso en tu buzón. Mi hermana viene el miércoles para regar las plantas.\nMuchas gracias. El viernes te invito a cenar en el restaurante portugués de la esquina.\nUn saludo,\nClara",
    [
      [
        "¿Por qué va Clara a Lisboa?",
        "Por trabajo.",
        "De vacaciones.",
        "Para visitar a su hermana.",
        "Voy a Lisboa por trabajo. Her sister stays in town to water the plants.",
      ],
      [
        "¿Cuándo vuelve Clara?",
        "El jueves.",
        "El lunes.",
        "El miércoles.",
        "Vuelvo el jueves por la noche. She leaves on Monday.",
      ],
      [
        "¿A qué hora come Bruno por la tarde?",
        "A las siete.",
        "A las ocho.",
        "A las dos.",
        "Bruno eats at eight in the morning and at seven in the evening.",
      ],
      [
        "¿Dónde está la comida del perro?",
        "En la cocina.",
        "En el buzón.",
        "En el parque.",
        "Su comida está en la cocina, under the window. The keys go in the letterbox.",
      ],
      [
        "¿Qué hace la hermana de Clara el miércoles?",
        "Riega las plantas.",
        "Pasea al perro.",
        "Deja las llaves.",
        "Her sister comes on Wednesday to water the plants; Andrés walks the dog.",
      ],
    ],
  ),
];

const r2: MockVariant[] = [
  notices(
    1,
    "notices in town",
    [
      "BIBLIOTECA: Hoy, a las cinco, hay un club de lectura en la sala 2. Hablamos de una novela española. Puede participar sin pagar.",
      "PISCINA: Abierta de martes a domingo, de diez a ocho. Los lunes está cerrada. Los niños pequeños tienen que entrar con una persona adulta.",
      "CAFETERÍA: Desayuno con café, zumo y tostada por cinco euros. Esta oferta está disponible de ocho a once de la mañana, de lunes a viernes.",
      "MUSEO: Los domingos la entrada es gratuita para todos los visitantes. El resto de la semana cuesta seis euros. Cerramos todos los días a las seis.",
      "CENTRO DE SALUD: Si tiene cita, espere en la sala junto a la entrada. El personal va a llamar a cada persona por su nombre.",
      "TIENDA DE ROPA: Puede pagar en efectivo o con tarjeta. Para cambiar una camisa o un pantalón necesita presentar el recibo de la compra.",
      "ESTACIÓN: Los billetes de autobús se venden en la máquina de la entrada. Para pagar, use monedas o una tarjeta. La oficina está cerrada.",
      "HOTEL: El desayuno está incluido en el precio de la habitación. Se sirve en el comedor de la primera planta, de siete a diez.",
      "PARQUE: No se puede entrar con bicicletas. Los perros deben ir con su dueño. El parque abre a las ocho y cierra a las nueve.",
    ],
    [
      [
        "Quiere desayunar barato antes de ir a trabajar.",
        "C",
        "The café has a five-euro breakfast on weekday mornings.",
      ],
      [
        "Quiere ver cuadros el domingo, pero no tiene dinero.",
        "D",
        "The museum notice says entrance is free on Sundays; the six-euro price applies on other days.",
      ],
      [
        "Tiene que esperar al médico.",
        "E",
        "The health centre asks patients to wait until their name is called.",
      ],
      [
        "Quiere hablar de libros con otras personas.",
        "A",
        "The library has a free reading club today, where people talk about a novel.",
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
    ],
  ),
  notices(
    2,
    "notices at a language school",
    [
      "SECRETARÍA: Si quiere cambiar de grupo o de horario, hable con la secretaria. Estamos aquí de lunes a jueves, de diez a una.",
      "AULA 3: Hoy no hay clase de francés porque la profesora está enferma. La clase es el próximo martes a la misma hora.",
      "EXCURSIÓN: El sábado visitamos Toledo. El autobús sale de la puerta de la escuela a las nueve. Precio: quince euros.",
      "SALA 5: Los estudiantes pueden usar los ordenadores de esta sala gratis. Máximo una hora por persona.",
      "INTERCAMBIO: Soy alemán y busco a un estudiante de español para hablar una hora en alemán y una hora en español. Llame al 600 112 233.",
      "EXAMEN FINAL: Es el viernes 20 a las diez. Lleve su pasaporte y un bolígrafo azul o negro.",
      "COCINA: Los estudiantes pueden usar el microondas y el frigorífico. Por favor, limpien la mesa después de comer.",
      "OBJETOS PERDIDOS: ¿Busca algo que no encuentra? Pregunte en recepción. Tenemos libros, gafas, paraguas y ropa.",
      "ESCUELA CERRADA: El 12 de octubre es fiesta. Ese día no hay clases y la escuela está cerrada.",
    ],
    [
      [
        "Quiere practicar español con otra persona.",
        "E",
        "The exchange notice offers conversation in German and Spanish.",
      ],
      [
        "No encuentra su libro de español.",
        "H",
        "Lost property is kept at reception, and it includes books.",
      ],
      [
        "Trae comida de casa y quiere calentarla en la escuela.",
        "G",
        "The kitchen has a microwave that students can use.",
      ],
      [
        "Quiere escribir un correo electrónico sin pagar.",
        "D",
        "The computers in room 5 are free for students.",
      ],
      [
        "Estudia por la mañana, pero prefiere las clases de la tarde.",
        "A",
        "The office is where students change group or timetable.",
      ],
      [
        "Quiere conocer otra ciudad con sus compañeros.",
        "C",
        "The school trip goes to Toledo on Saturday.",
      ],
    ],
  ),
  notices(
    3,
    "notices in a block of flats",
    [
      "ASCENSOR: Hoy el ascensor no funciona. Un técnico viene mañana por la mañana. Perdonen las molestias.",
      "BASURA: Bajen la basura después de las ocho de la tarde. Los contenedores están en la calle, a la derecha del portal.",
      "PISCINA: La piscina del edificio abre el 15 de junio. Solo para vecinos. Horario: de once de la mañana a nueve de la noche.",
      "REUNIÓN: Reunión de vecinos el jueves a las siete en el portal. Vamos a hablar del jardín. Todos los vecinos pueden participar.",
      "SE VENDE: Sofá azul de tres plazas, en buen estado. Ochenta euros. Piso cuarto A.",
      "PAQUETES: Si no está en casa, el portero guarda sus paquetes. Puede recogerlos de lunes a viernes, de nueve a dos.",
      "GARAJE: Las bicicletas tienen que estar en el garaje, al lado de la puerta. No se pueden dejar en la escalera.",
      "LIMPIEZA: Mañana limpiamos la escalera. Por favor, no usen la escalera de diez a doce.",
      "GATO PERDIDO: Busco a mi gato. Es blanco y tiene un collar rojo. Si lo ve, llame al segundo C.",
    ],
    [
      [
        "Vive en el sexto piso y hoy tiene que subir por la escalera.",
        "A",
        "The lift is out of order today, so the stairs are the only way up.",
      ],
      ["Necesita un mueble para su salón.", "E", "A second-hand sofa is for sale in flat 4A."],
      [
        "Quiere bañarse en verano sin salir del edificio.",
        "C",
        "The building’s pool opens in June and is only for residents.",
      ],
      [
        "No está en casa cuando llega su paquete.",
        "F",
        "The porter keeps parcels for residents who are not at home.",
      ],
      [
        "Tiene una bicicleta nueva y no sabe dónde dejarla.",
        "G",
        "Bicycles go in the garage, not on the stairs.",
      ],
      [
        "Quiere dar su opinión sobre el jardín.",
        "D",
        "The residents’ meeting on Thursday is about the garden.",
      ],
    ],
  ),
  notices(
    4,
    "notices in shops",
    [
      "FRUTERÍA: Hoy, naranjas a un euro el kilo. Fresas en oferta: dos cajas por tres euros.",
      "PANADERÍA: Pan del día por la mañana y por la tarde. Los domingos abrimos de ocho a dos.",
      "FARMACIA: Hoy abrimos las veinticuatro horas. Por la noche, llame al timbre y espere en la puerta.",
      "ZAPATERÍA: Zapatos de hombre y de mujer a mitad de precio. Solo esta semana.",
      "LIBRERÍA: Hoy a las seis leemos cuentos para niños de tres a seis años. La entrada es gratis.",
      "PELUQUERÍA: No es necesario pedir cita. Cortamos el pelo a hombres, mujeres y niños. Cerrado los lunes.",
      "SUPERMERCADO: Si su compra cuesta más de cuarenta euros, la llevamos a su casa gratis.",
      "FLORISTERÍA: Flores para regalar en cumpleaños, bodas y otras fiestas. Puede pedirlas por teléfono.",
      "MERCADO: El lunes el mercado está cerrado. Abrimos otra vez el martes a las ocho.",
    ],
    [
      [
        "Necesita una medicina a las tres de la mañana.",
        "C",
        "The pharmacy is open all night today; you ring the bell.",
      ],
      [
        "Quiere cortarse el pelo hoy, pero no quiere llamar antes.",
        "F",
        "No es necesario pedir cita: the hairdresser needs no appointment.",
      ],
      [
        "No quiere llevar las bolsas de la compra a casa.",
        "G",
        "The supermarket delivers big shops for free.",
      ],
      [
        "Necesita zapatos nuevos y tiene poco dinero.",
        "D",
        "The shoe shop sells everything at half price this week.",
      ],
      [
        "Quiere un regalo bonito para el cumpleaños de su madre.",
        "H",
        "The florist makes flowers for birthdays.",
      ],
      [
        "Tiene un hijo de cuatro años y busca una actividad gratis.",
        "E",
        "The bookshop reads stories to children aged three to six for free.",
      ],
    ],
  ),
  notices(
    5,
    "notices at a campsite",
    [
      "RECEPCIÓN: Abierta de ocho de la mañana a diez de la noche. Aquí puede alquilar bicicletas por horas.",
      "AUTOBÚS: El autobús a la playa sale de la entrada del camping cada hora, de nueve a siete. Para los clientes del camping es gratis.",
      "SILENCIO: De doce de la noche a ocho de la mañana no se puede poner música ni hacer ruido.",
      "TIENDA: Pan, leche, fruta y periódicos. Abrimos todos los días a las ocho. El pan llega a las ocho y media.",
      "LAVADORAS: Están en el edificio B. Cada lavado cuesta cuatro euros. Pague con monedas de un euro.",
      "FUEGO: No se puede hacer fuego al lado de las tiendas de campaña. Para hacer una barbacoa, vaya a la zona junto al río.",
      "NIÑOS: Todas las tardes, a las cinco, hay juegos para niños en la plaza del camping.",
      "DUCHAS: Hay agua caliente de siete a once de la mañana y de seis a diez de la tarde.",
      "BARCO: Excursión en barco a las islas los sábados y domingos. Precio: veinte euros. Compre los billetes en recepción.",
    ],
    [
      ["Quiere cocinar carne con fuego.", "F", "Fires are allowed only in the barbecue area."],
      [
        "Quiere ir a la playa, pero no tiene coche.",
        "B",
        "A free bus goes to the beach every hour.",
      ],
      ["Necesita lavar su ropa.", "E", "The washing machines are in building B."],
      [
        "Quiere pasear en bicicleta, pero no tiene una.",
        "A",
        "Reception rents bicycles by the hour.",
      ],
      [
        "Su hijo quiere jugar con otros niños.",
        "G",
        "There are games for children every afternoon at five.",
      ],
      ["Quiere desayunar pan del día.", "D", "The campsite shop sells bread every morning."],
    ],
  ),
  notices(
    6,
    "notices at a sports centre",
    [
      "GIMNASIO: Nuevo horario: de lunes a sábado, de siete de la mañana a once de la noche.",
      "YOGA: Clases para personas de más de sesenta años. Martes y jueves a las diez de la mañana.",
      "ARMARIOS: Para cerrar su armario necesita una moneda de un euro. Al abrir el armario, la moneda vuelve.",
      "PISTAS DE TENIS: Para reservar una pista, llame al centro o use nuestra página web. Una hora: ocho euros.",
      "FÚTBOL: Buscamos jugadoras para un equipo de mujeres. Entrenamos los miércoles por la noche.",
      "CAFETERÍA: Cerrada por vacaciones hasta el 1 de septiembre. Hay una máquina de bebidas en la entrada.",
      "BAILE: Clases de salsa para principiantes. Viernes de ocho a nueve. No necesita venir con pareja.",
      "APARCAMIENTO: Los socios aparcan gratis durante dos horas. Enseñe su tarjeta en la entrada.",
      "SOCIOS: Para ser socio, traiga una foto y su documento de identidad. Precio: veinticinco euros al mes.",
    ],
    [
      [
        "Quiere hacer ejercicio a las siete y media, antes de ir a la oficina.",
        "A",
        "The gym opens at seven in the morning.",
      ],
      [
        "Tiene sesenta y cinco años y busca una actividad tranquila.",
        "B",
        "The yoga classes are for people over sixty.",
      ],
      [
        "Es una mujer y quiere jugar en un equipo.",
        "E",
        "The football club is looking for women players.",
      ],
      [
        "Quiere jugar con un amigo y tiene dos raquetas.",
        "D",
        "Rackets mean tennis, and the courts can be booked.",
      ],
      [
        "Quiere aprender a bailar, pero va sola.",
        "G",
        "The salsa class says you do not need a partner.",
      ],
      [
        "Quiere una tarjeta del centro y no sabe qué documentos necesita.",
        "I",
        "To become a member you bring a photo and an ID document.",
      ],
    ],
  ),
];

const r3: MockVariant[] = [
  ads(
    1,
    "local advertisements",
    [
      "CLASES DE GUITARRA. Profesor con experiencia. Clases individuales para adultos los martes y jueves por la tarde. No necesita tener una guitarra para empezar.",
      "HABITACIÓN EN EL CENTRO. Piso compartido con dos estudiantes. Cerca de la universidad. Trescientos euros al mes, con internet incluido. Disponible desde el lunes.",
      "PASEOS POR LA CIUDAD. Visitas a pie con guía en español. Salimos de la plaza los sábados a las diez. Dos horas. Precio: ocho euros.",
      "RESTAURANTE VERDE. Comida vegetariana todos los días. Menú con sopa, ensalada, plato principal y fruta. Abierto para comer de una a cuatro. Precio: doce euros.",
      "CLUB DE NATACIÓN. Clases para niños de seis a doce años. Lunes y miércoles después del colegio. Piscina cubierta y profesores con experiencia.",
      "ESPAÑOL POR LA MAÑANA. Cursos para adultos de todos los países. Grupos pequeños. Clases de lunes a viernes, de nueve a once, en nuestra escuela.",
      "TIENDA DE BICICLETAS. Tenemos bicicletas nuevas para adultos y niños. También reparamos su bicicleta. Abrimos todos los días excepto el domingo. Estamos junto al parque.",
      "CINE EN FAMILIA. Películas para niños los domingos por la tarde. Entrada de adultos: seis euros. Niños menores de siete años: gratis. Al lado del teatro.",
      "TRABAJO EN CAFETERÍA. Buscamos una persona para trabajar los fines de semana por la mañana. Es necesario hablar español. Pregunte en la cafetería de la estación.",
    ],
    [
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
    ],
  ),
  ads(
    2,
    "holiday offers",
    [
      "FIN DE SEMANA EN LA PLAYA. Hotel a cien metros del mar. Dos noches con desayuno: ciento veinte euros por persona.",
      "EL NORTE EN BICICLETA. Viaje de cinco días por el norte de España. El precio incluye la bicicleta, el hotel y la cena. Solo para personas con experiencia.",
      "PARÍS PARA ESTUDIANTES. Cuatro días en París. Viaje en autobús y hotel en el centro. Con carné de estudiante, un treinta por ciento más barato.",
      "CASA EN LA MONTAÑA. Casa para seis personas con un jardín grande. Puede venir con su perro o su gato.",
      "UNA SEMANA EN BARCO. Siete días por el mar Mediterráneo. Visitamos Italia, Francia y Grecia.",
      "NIEVE EN LA SIERRA. Clases de esquí para principiantes y esquís para alquilar. Enero y febrero.",
      "ALBERGUE EN SEVILLA. Habitaciones compartidas desde quince euros la noche. Cocina para los clientes. En el centro de la ciudad.",
      "VUELOS A LONDRES. Salidas desde Madrid todos los días. Ida y vuelta desde ochenta euros.",
      "RUTA DE LA COMIDA. Tres horas por los mercados y bares de San Sebastián con un cocinero. Las tapas están incluidas.",
    ],
    [
      [
        "Vamos de vacaciones con nuestro perro y dos amigos.",
        "D",
        "The mountain house sleeps six and accepts pets.",
      ],
      [
        "Este invierno quiero aprender un deporte de nieve.",
        "F",
        "The ski school offers beginners’ classes in January and February.",
      ],
      [
        "Soy estudiante y quiero pasar unos días en París.",
        "C",
        "The Paris trip is cheaper with a student card.",
      ],
      [
        "Quiero conocer tres países en una semana, sin ir en avión.",
        "E",
        "The one-week boat trip visits Italy, France and Greece.",
      ],
      [
        "Me encanta comer y quiero probar la comida típica de una ciudad.",
        "I",
        "The food route visits markets and bars, with tapas included.",
      ],
      [
        "Viajo sola, tengo poco dinero y quiero cocinar mi comida.",
        "G",
        "The hostel is cheap and has a kitchen for guests.",
      ],
    ],
  ),
  ads(
    3,
    "job advertisements",
    [
      "CAMARERO O CAMARERA para un restaurante en la playa. Julio y agosto. Es necesario hablar inglés.",
      "CUIDAR NIÑOS. Familia busca una persona para estar con sus dos hijos pequeños de lunes a viernes, de cinco a ocho de la tarde.",
      "PROFESOR DE INGLÉS para una academia. Clases por la tarde para chicos de catorce a dieciocho años.",
      "REPARTIDOR CON MOTO. Trabajo por la noche y los fines de semana. Es necesario tener moto.",
      "RECEPCIONISTA DE HOTEL. Trabajo de noche. Es necesario hablar español, inglés y alemán.",
      "JARDINERO. Trabajo en los jardines de casas particulares. Dos días a la semana.",
      "DEPENDIENTE PARA UNA LIBRERÍA. Cuatro horas al día, por la tarde. Es importante saber mucho de libros.",
      "COCINERO PARA UNA ESCUELA INFANTIL. De lunes a viernes, de ocho a tres. Comida sana para niños.",
      "PASEAR PERROS. Buscamos personas para pasear perros por la mañana, de nueve a doce. Pagamos por horas.",
    ],
    [
      [
        "Me encantan los animales y solo puedo trabajar antes de comer.",
        "I",
        "The dog-walking job is in the morning, from nine to twelve.",
      ],
      [
        "Estudio por la mañana y me gustan mucho los niños pequeños.",
        "B",
        "The family needs someone in the afternoon for their small children.",
      ],
      [
        "Hablo tres idiomas y prefiero trabajar de noche.",
        "E",
        "The hotel needs a night receptionist who speaks three languages.",
      ],
      [
        "Me gusta mucho leer y no quiero trabajar todo el día.",
        "G",
        "The bookshop job is four hours a day for a book lover.",
      ],
      [
        "Quiero trabajar en verano cerca del mar.",
        "A",
        "The beach restaurant hires for July and August.",
      ],
      [
        "Me gusta trabajar al aire libre, con flores y plantas.",
        "F",
        "The gardener works outdoors in private gardens.",
      ],
    ],
  ),
  ads(
    4,
    "places to eat",
    [
      "PIZZERÍA NÁPOLES. Pizzas al horno. Llevamos su pizza a casa de siete a doce de la noche.",
      "RESTAURANTE EL PUERTO. Pescado fresco todos los días. Mesas en la terraza con vistas a la playa. Cerrado los lunes.",
      "CAFÉ DULCE. Tartas de la casa y chocolate con churros. Abierto desde las cuatro de la tarde.",
      "CASA PEPE. Menú del día: primer plato, segundo plato, pan, bebida y postre por once euros. De lunes a viernes, de una a cuatro.",
      "RESTAURANTE SAKURA. Comida japonesa. Los sábados, clases de cocina japonesa para adultos.",
      "ASADOR CASTILLA. Carne a la brasa y verduras de la región. Abierto todos los días para comer y cenar.",
      "BAR LA ESQUINA. Partidos de fútbol en una pantalla grande. Una tapa gratis con cada bebida.",
      "HELADERÍA POLAR. Más de treinta sabores de helado. Abierta de mayo a octubre.",
      "SALÓN LOS OLIVOS. Celebre aquí su cumpleaños o su boda. Para grupos de veinte a cien personas.",
    ],
    [
      [
        "Esta noche no quiero cocinar ni salir de casa.",
        "A",
        "The pizzeria delivers in the evening.",
      ],
      [
        "Trabajo cerca y quiero comer bien y barato a mediodía.",
        "D",
        "Casa Pepe has a cheap set lunch on weekdays.",
      ],
      [
        "Quiero aprender a preparar comida de otro país.",
        "E",
        "The Japanese restaurant gives cooking classes on Saturdays.",
      ],
      [
        "Me encanta el pescado y quiero comer mirando el mar.",
        "B",
        "El Puerto serves fresh fish on a terrace with a beach view.",
      ],
      [
        "Quiero ver un partido con mis amigos y tomar algo.",
        "G",
        "The bar shows football on a big screen.",
      ],
      [
        "Mi abuelo cumple ochenta años y viene toda la familia: treinta personas.",
        "I",
        "Los Olivos hosts birthday parties for groups of twenty to a hundred.",
      ],
    ],
  ),
  ads(
    5,
    "home services",
    [
      "MUDANZAS RÁPIDAS. Llevamos sus muebles y sus cajas a su nueva casa. También trabajamos los sábados.",
      "LIMPIEZA DE CASAS Y OFICINAS. Personas con experiencia. Doce euros la hora.",
      "FONTANERO. ¿Problemas con el agua en la cocina o en el baño? Vamos a su casa en una hora.",
      "CLASES DE MATEMÁTICAS. Para niños de seis a dieciséis años. El profesor va a su casa.",
      "HOTEL PARA PERROS Y GATOS. Cuidamos a su animal cuando usted está de viaje.",
      "REPARAMOS ORDENADORES y teléfonos móviles. Precios bajos. Tienda en la calle Mayor.",
      "PINTOR. Pintamos pisos y casas. Trabajo limpio y rápido.",
      "ARREGLOS DE ROPA. Hacemos más corta o más pequeña su ropa: pantalones, camisas, chaquetas y vestidos.",
      "PUERTAS Y LLAVES. ¿No puede abrir la puerta de su casa? Le ayudamos las veinticuatro horas.",
    ],
    [
      [
        "Me voy de viaje dos semanas y no sé dónde dejar a mi perro.",
        "E",
        "The pet hotel looks after animals while owners travel.",
      ],
      [
        "Mi hijo tiene problemas con los números en el colegio.",
        "D",
        "The maths teacher gives classes at home.",
      ],
      [
        "Mi portátil no funciona y lo necesito para trabajar.",
        "F",
        "The shop on calle Mayor repairs computers and phones.",
      ],
      [
        "Mi chaqueta nueva es muy grande para mí.",
        "H",
        "The tailor makes clothes shorter or smaller.",
      ],
      [
        "Esta noche no tengo mis llaves y no puedo entrar en casa.",
        "I",
        "The locksmith opens doors at any hour.",
      ],
      [
        "La próxima semana cambio de piso y tengo muchas cosas.",
        "A",
        "The removal company moves furniture and boxes.",
      ],
    ],
  ),
  ads(
    6,
    "weekend events",
    [
      "JAZZ EN EL PARQUE. Concierto el sábado a las nueve de la noche. Entrada gratis. Traiga su silla.",
      "MERCADILLO. Ropa, libros y discos antiguos a buen precio. Domingos por la mañana en la plaza.",
      "MUSEO DE CIENCIAS. Nueva exposición sobre los dinosaurios. Niños menores de doce años: gratis.",
      "TEATRO EN INGLÉS. Comedia para estudiantes de idiomas. Viernes y sábados a las ocho.",
      "CARRERA DEL DOMINGO. Cinco kilómetros por el centro de la ciudad con más de mil personas. Domingo a las diez. Precio: cinco euros.",
      "CURSO DE FOTOGRAFÍA. Aprenda a hacer buenas fotos con su teléfono móvil. Sábado de diez a una.",
      "GRANJA ESCUELA. Los niños dan de comer a las vacas y a los caballos y hacen pan. Sábados y domingos.",
      "FERIA DEL LIBRO. Más de cien librerías en el paseo central. Libros nuevos y escritores famosos.",
      "KAYAK EN EL RÍO. Excursión para mayores de dieciséis años. Es necesario saber nadar.",
    ],
    [
      [
        "Me gusta la música, pero no quiero gastar dinero.",
        "A",
        "The jazz concert in the park is free.",
      ],
      [
        "Estudio inglés y quiero practicar el fin de semana.",
        "D",
        "The English-language play is for language students.",
      ],
      [
        "Mis hijos quieren estar con animales de verdad.",
        "G",
        "At the farm school children feed real animals. The dinosaurs are a museum exhibition.",
      ],
      [
        "Me gusta correr con mucha gente.",
        "E",
        "The Sunday race has more than a thousand runners.",
      ],
      [
        "Hago muchas fotos con mi teléfono, pero no son buenas.",
        "F",
        "The photography course teaches phone photography.",
      ],
      [
        "Quiero comprar música antigua y no quiero pagar mucho.",
        "B",
        "The flea market sells old records cheaply.",
      ],
    ],
  ),
];

const r4: MockVariant[] = [
  info(
    1,
    "a cultural centre",
    [],
    "CENTRO CULTURAL LA LUNA\nEl centro cultural La Luna está en la calle Mayor, número catorce, al lado del mercado municipal. Es un lugar para estudiar, leer y conocer gente del barrio. Abrimos de lunes a viernes de nueve de la mañana a ocho de la tarde. Los sábados abrimos a las diez y cerramos a las dos. Los domingos no abrimos.\nEn la primera planta hay una biblioteca con libros en español, inglés y francés. Para llevar libros a casa es necesario tener una tarjeta del centro. La tarjeta es gratuita y puede pedirla en la recepción con su documento de identidad.\nEn la segunda planta hay tres aulas. Ofrecemos clases de español los martes y jueves, de seis a siete de la tarde. El curso cuesta treinta euros al mes. Las clases de dibujo son los miércoles a las cinco y cuestan veinte euros al mes.\nTambién tenemos un café en la planta baja. Allí puede tomar café, zumo y bocadillos. No se puede comer en las aulas ni en la biblioteca. Para más información, puede llamar al centro por la mañana o escribir un correo electrónico.",
    [
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
        "The café sells food. The text forbids eating in the classrooms and the library.",
      ],
    ],
  ),
  info(
    2,
    "a sightseeing bus",
    [],
    "BUS TURÍSTICO DE VALENCIA\nCon el bus turístico puede conocer los lugares más importantes de Valencia en un día. El autobús es rojo y tiene dos plantas. La planta de arriba no tiene techo y es perfecta para hacer fotos.\nEl recorrido dura una hora y media y tiene doce paradas. La primera parada está en la plaza del Ayuntamiento. Puede bajar en una parada, visitar un museo o comer, y después subir a otro autobús. Hay un autobús cada veinte minutos.\nEl bus funciona todos los días del año. En verano, de junio a septiembre, el primer autobús sale a las nueve y media y el último a las ocho de la tarde. En invierno el último autobús sale a las seis.\nEl billete para un día cuesta dieciocho euros y el billete para dos días, veinticuatro euros. Los niños de siete a doce años pagan la mitad. Los niños menores de siete años no pagan. Puede comprar el billete en el autobús o en nuestra página web. Por internet es un diez por ciento más barato.\nEn el autobús hay auriculares gratis con información en ocho idiomas. No se puede comer ni beber en el autobús. Los perros pequeños pueden subir.",
    [
      [
        "¿Para qué es perfecta la planta de arriba?",
        "Para hacer fotos.",
        "Para comer.",
        "Para escuchar información.",
        "The open upper deck is perfect for photos. Eating is not allowed, and the headphones are on the whole bus.",
      ],
      [
        "¿Cuánto dura el recorrido?",
        "Una hora y media.",
        "Veinte minutos.",
        "Un día.",
        "El recorrido dura una hora y media. Twenty minutes is the time between buses.",
      ],
      [
        "¿Dónde está la primera parada?",
        "En la plaza del Ayuntamiento.",
        "En un museo.",
        "En la estación.",
        "La primera parada está en la plaza del Ayuntamiento.",
      ],
      [
        "¿Cada cuánto tiempo pasa un autobús?",
        "Cada veinte minutos.",
        "Cada hora.",
        "Cada doce minutos.",
        "Hay un autobús cada veinte minutos. Twelve is the number of stops.",
      ],
      [
        "¿A qué hora sale el último autobús en invierno?",
        "A las seis.",
        "A las ocho.",
        "A las nueve y media.",
        "In winter the last bus leaves at six. Eight is the last bus in summer.",
      ],
      [
        "¿Cuánto cuesta el billete para dos días?",
        "Veinticuatro euros.",
        "Dieciocho euros.",
        "Doce euros.",
        "Two days cost twenty-four euros; eighteen is the one-day ticket.",
      ],
      [
        "¿Quién no paga el billete?",
        "Los niños menores de siete años.",
        "Los niños de siete a doce años.",
        "Los estudiantes.",
        "Children under seven travel free. Children from seven to twelve pay half.",
      ],
      [
        "¿Qué no se puede hacer en el autobús?",
        "Comer.",
        "Hacer fotos.",
        "Subir con un perro pequeño.",
        "No se puede comer ni beber. Small dogs are allowed.",
      ],
    ],
  ),
  info(
    3,
    "a summer Spanish course",
    [],
    "CURSO DE VERANO DE ESPAÑOL · UNIVERSIDAD DEL SUR\nLa Universidad del Sur, en Cádiz, tiene un curso de español para extranjeros en julio. El curso empieza el lunes 3 de julio y termina el viernes 28. Hay cuatro niveles, de A1 a B2. El primer día todos los estudiantes hacen un examen corto para saber su nivel.\nLas clases son de lunes a viernes, de nueve a una. En cada grupo hay doce estudiantes como máximo. Por la tarde hay actividades: clases de baile, cine español y visitas a la ciudad. Las actividades de la tarde son gratis.\nEl curso cuesta seiscientos euros. Los estudiantes pueden vivir con una familia española o en una residencia. Una habitación con una familia cuesta ochocientos euros al mes, con desayuno y cena. La residencia es más barata, quinientos euros al mes, pero no tiene comida.\nLos sábados hay excursiones a pueblos y playas de la región. Cada excursión cuesta veinticinco euros.\nPara hacer el curso, complete el formulario de nuestra página web antes del 15 de mayo. Al final del curso todos los estudiantes reciben un diploma.",
    [
      [
        "¿Cuándo termina el curso?",
        "El 28 de julio.",
        "El 3 de julio.",
        "El 15 de mayo.",
        "The course ends on Friday the 28th. The 15th of May is the deadline to sign up.",
      ],
      [
        "¿Qué hacen los estudiantes el primer día?",
        "Un examen.",
        "Una excursión.",
        "Una fiesta.",
        "On the first day everyone takes a short test to find their level.",
      ],
      [
        "¿Cuántos estudiantes hay como máximo en un grupo?",
        "Doce.",
        "Cuatro.",
        "Nueve.",
        "Groups have at most twelve students. Four is the number of levels.",
      ],
      [
        "¿Cuánto cuestan las actividades de la tarde?",
        "Son gratis.",
        "Veinticinco euros.",
        "Quinientos euros.",
        "The afternoon activities are free; twenty-five euros is a Saturday trip.",
      ],
      [
        "¿Qué comidas tiene la habitación con una familia?",
        "El desayuno y la cena.",
        "Solo el desayuno.",
        "Todas las comidas.",
        "A room with a family includes breakfast and dinner.",
      ],
      [
        "¿Cuánto cuesta la residencia al mes?",
        "Quinientos euros.",
        "Ochocientos euros.",
        "Seiscientos euros.",
        "The residence costs five hundred a month. Eight hundred is the family, six hundred the course.",
      ],
      [
        "¿Qué día hay excursiones?",
        "El sábado.",
        "El viernes.",
        "El lunes.",
        "Los sábados hay excursiones: the trips are on Saturdays, not on class days.",
      ],
      [
        "¿Qué reciben los estudiantes al final del curso?",
        "Un diploma.",
        "Un examen.",
        "Un formulario.",
        "Every student gets a diploma. The test is on the first day; the form is how you sign up.",
      ],
    ],
  ),
  info(
    4,
    "a youth hostel",
    [],
    "ALBERGUE EL FARO · INFORMACIÓN PARA LOS CLIENTES\nBienvenidos al albergue El Faro. Estamos en el puerto, a diez minutos a pie de la estación de autobuses. La recepción está abierta las veinticuatro horas.\nTenemos habitaciones de cuatro y de ocho camas. Todas las habitaciones tienen baño. Las sábanas están incluidas en el precio, pero las toallas no: puede alquilar una toalla en recepción por dos euros.\nEl desayuno se sirve en el comedor de la planta baja, de siete y media a diez. Cuesta cuatro euros. En la primera planta hay una cocina para los clientes. Puede guardar su comida en el frigorífico con su nombre y el número de su habitación.\nHay wifi gratis en todo el edificio. En el salón hay libros, juegos y una televisión.\nEl último día, las habitaciones tienen que estar libres antes de las once de la mañana. Si quiere dejar su maleta después de esa hora, puede usar la sala de maletas, al lado de recepción. Es gratis.\nPor favor, no haga ruido después de las doce de la noche. No se puede fumar en el albergue.",
    [
      [
        "¿Dónde está el albergue?",
        "En el puerto.",
        "En la estación de autobuses.",
        "En el centro.",
        "Estamos en el puerto. The bus station is ten minutes away on foot.",
      ],
      [
        "¿Cuándo está abierta la recepción?",
        "Siempre.",
        "De siete y media a diez.",
        "Hasta las doce de la noche.",
        "Reception is open twenty-four hours. Half past seven to ten is breakfast.",
      ],
      [
        "¿Qué no está incluido en el precio?",
        "La toalla.",
        "Las sábanas.",
        "El wifi.",
        "Sheets are included, but a towel costs two euros. The wifi is free.",
      ],
      [
        "¿Dónde se sirve el desayuno?",
        "En la planta baja.",
        "En la primera planta.",
        "En el salón.",
        "Breakfast is in the ground-floor dining room. The kitchen is on the first floor.",
      ],
      [
        "¿Cuánto cuesta el desayuno?",
        "Cuatro euros.",
        "Dos euros.",
        "Ocho euros.",
        "Breakfast costs four euros; two euros is the towel.",
      ],
      [
        "¿Dónde pueden guardar los clientes su comida?",
        "En el frigorífico.",
        "En la habitación.",
        "En recepción.",
        "Guests keep food in the fridge, labelled with their name and room.",
      ],
      [
        "¿Hasta qué hora pueden estar en la habitación el último día?",
        "Hasta las once.",
        "Hasta las doce.",
        "Hasta las diez.",
        "Rooms must be free before eleven in the morning on the last day.",
      ],
      [
        "¿Qué pueden hacer con su maleta el último día?",
        "Dejarla gratis en una sala.",
        "Dejarla en recepción por dos euros.",
        "Dejarla en la habitación.",
        "The luggage room is free. Two euros is the price of a towel.",
      ],
    ],
  ),
  info(
    5,
    "a botanical garden",
    [],
    "JARDÍN BOTÁNICO\nEl Jardín Botánico tiene más de tres mil plantas de todo el mundo. Está en la avenida del Río, enfrente del hospital. Puede llegar en metro, línea dos, o en los autobuses 5 y 12.\nHorario: de abril a septiembre abrimos de diez de la mañana a nueve de la noche; de octubre a marzo, de diez a seis. Cerramos el 25 de diciembre y el 1 de enero.\nLa entrada cuesta cuatro euros. Los estudiantes y las personas de más de sesenta y cinco años pagan dos euros. Los martes por la tarde la entrada es gratis para todos.\nEl jardín tiene tres zonas. En la zona norte están los árboles más altos y antiguos. En la zona sur hay un edificio de cristal con plantas tropicales: allí siempre hace calor. En el centro hay un lago pequeño con peces de colores.\nLos sábados y domingos a las once hay visitas con guía. Duran una hora y cuestan tres euros más.\nNo se puede entrar con bicicletas ni con perros. Se puede comer en las mesas que están junto a la entrada, pero no en la hierba.",
    [
      [
        "¿Dónde está el jardín?",
        "Enfrente del hospital.",
        "Dentro del hospital.",
        "Detrás del hospital.",
        "Está… enfrente del hospital: opposite the hospital, not in it or behind it.",
      ],
      [
        "¿A qué hora cierra el jardín en enero?",
        "A las seis.",
        "A las nueve.",
        "A las diez.",
        "From October to March it closes at six. Nine is the summer closing time; ten is opening time.",
      ],
      [
        "¿Cuánto paga un estudiante?",
        "Dos euros.",
        "Cuatro euros.",
        "Tres euros.",
        "Students pay two euros. Four is the full price; three is the guided visit.",
      ],
      [
        "¿Cuándo es gratis la entrada?",
        "El martes por la tarde.",
        "El sábado por la mañana.",
        "El 1 de enero.",
        "Tuesday afternoons are free. On the 1st of January the garden is closed.",
      ],
      [
        "¿Qué hay en la zona norte?",
        "Árboles antiguos.",
        "Plantas tropicales.",
        "Un lago.",
        "The north has the tallest, oldest trees. The tropical plants are in the south.",
      ],
      [
        "¿Dónde hace siempre calor?",
        "En el edificio de cristal.",
        "En el centro del jardín.",
        "Junto a la entrada.",
        "The glass building with tropical plants is always warm.",
      ],
      [
        "¿Cuándo hay visitas con guía?",
        "Los fines de semana.",
        "Todos los días.",
        "Los martes.",
        "Guided visits are on Saturdays and Sundays at eleven.",
      ],
      [
        "¿Dónde se puede comer?",
        "En las mesas de la entrada.",
        "En la hierba.",
        "Junto al lago.",
        "Eating is allowed at the tables by the entrance, not on the grass.",
      ],
    ],
  ),
  info(
    6,
    "a public bicycle service",
    [],
    "BICI CIUDAD · EL SERVICIO DE BICICLETAS PÚBLICAS\nCon Bici Ciudad puede ir en bicicleta por toda la ciudad de una forma fácil y barata. Hay ciento veinte estaciones de bicicletas en las calles. Puede tomar una bicicleta en una estación y dejarla en otra.\nPara usar el servicio necesita una tarjeta. Puede pedirla en la oficina de la plaza de España o en la aplicación del teléfono móvil. Es necesario tener dieciséis años o más.\nLa tarjeta para un año cuesta cuarenta euros. Con esta tarjeta, la primera media hora de cada viaje es gratis. Después, cada media hora cuesta cincuenta céntimos. También hay una tarjeta de un día para turistas, que cuesta seis euros.\nEl servicio funciona todos los días, de seis de la mañana a doce de la noche. Los viernes y los sábados funciona toda la noche.\nHay bicicletas normales y bicicletas eléctricas. Las normales son blancas. Las eléctricas son azules y cuestan un euro más por viaje.\nSi tiene un problema con una bicicleta, llame al 900 300 400. La llamada es gratis. Recuerde: no se puede ir en bicicleta dentro de los parques.",
    [
      [
        "¿Dónde se puede dejar la bicicleta?",
        "En otra estación.",
        "Solo en la misma estación.",
        "En la oficina.",
        "You can take a bike at one station and leave it at another.",
      ],
      [
        "¿Dónde se puede pedir la tarjeta?",
        "En la plaza de España.",
        "En cualquier estación.",
        "En un parque.",
        "The card is issued at the office in the plaza de España or in the app.",
      ],
      [
        "¿Cuántos años necesita tener una persona para usar el servicio?",
        "Dieciséis o más.",
        "Dieciocho o más.",
        "Seis o más.",
        "Es necesario tener dieciséis años o más.",
      ],
      [
        "¿Cuánto cuesta la tarjeta para un año?",
        "Cuarenta euros.",
        "Seis euros.",
        "Cincuenta céntimos.",
        "The yearly card is forty euros; six euros is the one-day tourist card.",
      ],
      [
        "¿Cuánto cuesta la primera media hora con una bicicleta normal?",
        "Nada.",
        "Cincuenta céntimos.",
        "Dos euros.",
        "The first half hour is free. Fifty cents is each half hour after it.",
      ],
      [
        "¿Qué días funciona el servicio toda la noche?",
        "Los viernes y los sábados.",
        "Todos los días.",
        "Los domingos.",
        "Only Fridays and Saturdays run all night; other days end at midnight.",
      ],
      [
        "¿De qué color son las bicicletas eléctricas?",
        "Azules.",
        "Blancas.",
        "Rojas.",
        "Las eléctricas son azules: the electric bikes are blue. The normal ones are white.",
      ],
      [
        "¿Dónde no se puede ir en bicicleta?",
        "Dentro de los parques.",
        "En la calle.",
        "En el centro de la ciudad.",
        "No se puede ir en bicicleta dentro de los parques: bikes are banned inside parks.",
      ],
    ],
  ),
];

export const readingTasks: MockTask[] = [
  { id: "r1", variants: r1 },
  { id: "r2", variants: r2 },
  { id: "r3", variants: r3 },
  { id: "r4", variants: r4 },
];
