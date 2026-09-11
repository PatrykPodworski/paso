import type { Question, Unit, Skill } from "./types.ts";
import { vocabularyHints } from "./vocabulary-hints.ts";
import type { VocabularyWord } from "./vocabulary-hints.ts";
type Seed = {
  title: string;
  spanish: string;
  subtitle: string;
  icon: string;
  color: string;
  goals: string[];
  tip: string;
  example: string;
  words: [word: VocabularyWord, meaning: string, visual: string][];
  grammar: string[][];
  reading: string;
  read: string[][];
  audio: string;
  listen: string[][];
  sentence: string;
  translate: string[];
  writing: string;
  model: string;
  checks: string[];
  speaking: string;
  speech: string;
  speechChecks: string[];
};
const seeds: Seed[] = [
  {
    title: "¡Hola, mundo!",
    spanish: "Primeros pasos",
    subtitle: "Say hello. Make your first connection.",
    icon: "sun",
    color: "peach",
    goals: [
      "Greet and introduce yourself",
      "Use ser and llamarse",
      "Spell names and ask for repetition",
    ],
    tip: "Use soy for identity and origin. Use me llamo to introduce your name. Spanish h is silent; ñ is a different letter from n.",
    example: "Hola, me llamo Ana. Soy de Polonia.",
    words: [
      ["hola", "hello", "👋"],
      ["adiós", "goodbye", "👋"],
      ["gracias", "thank you", "💛"],
      ["por favor", "please", "🙏"],
      ["buenos días", "good morning", "🌤️"],
      ["buenas noches", "good evening / good night", "🌙"],
      ["hasta luego", "see you later", "🕊️"],
      ["perdón", "sorry / excuse me", "💬"],
    ],
    grammar: [
      [
        "Yo ___ Marta.",
        "soy",
        "eres",
        "es",
        "Soy is the yo form of ser. Eres goes with tú; es goes with él, ella or usted.",
      ],
      [
        "¿Cómo ___ llamas?",
        "te",
        "me",
        "se",
        "Tú uses te in llamarse: ¿Cómo te llamas? Me is for yo; se is for él, ella or usted.",
      ],
      [
        "Ella ___ de México.",
        "es",
        "soy",
        "eres",
        "Ella takes es. Use ser + de for origin: Ella es de México.",
      ],
      [
        "You do not understand. What do you say?",
        "¿Puedes repetir, por favor?",
        "Mucho gusto.",
        "Hasta mañana.",
        "Ask for repetition with ¿Puedes repetir, por favor? Mucho gusto means nice to meet you; hasta mañana means see you tomorrow.",
      ],
      [
        "Which letter distinguishes año from ano?",
        "ñ",
        "n",
        "h",
        "Ñ is its own letter and sound, roughly like ny in canyon. Año means year. Do not replace ñ with n.",
        "año",
      ],
      [
        "Which greeting fits 9 a.m.?",
        "Buenos días.",
        "Buenas noches.",
        "Adiós.",
        "Buenos días is a morning greeting. Buenas noches is used in the evening or at night; adiós is a farewell.",
      ],
    ],
    reading:
      "Hola, soy Lucía. Soy de Sevilla, pero vivo en Madrid. Soy profesora de español. Mi amigo se llama David. Él es de México. Hablamos español en clase.",
    read: [
      [
        "¿De dónde es Lucía?",
        "De Sevilla.",
        "De Madrid.",
        "De México.",
        "Soy de Sevilla gives her origin. Vivo en Madrid tells you where she lives, a different detail.",
      ],
      [
        "¿Cómo se llama el amigo?",
        "David.",
        "Madrid.",
        "Lucía.",
        "Mi amigo se llama David names the friend. Madrid is a city; Lucía is the writer.",
      ],
    ],
    audio:
      "Hola, buenos días. Me llamo Pablo. Soy de España. ¿Cómo te llamas? Por favor, habla más despacio.",
    listen: [
      [
        "What is the speaker’s name?",
        "Pablo.",
        "Pedro.",
        "Paula.",
        "Listen for Me llamo Pablo. The other names sound similar but are not said.",
      ],
      [
        "What does the speaker ask for?",
        "Slower speech.",
        "A coffee.",
        "An address.",
        "Habla más despacio means speak more slowly. Despacio is the key word.",
      ],
    ],
    sentence: "Hola me llamo Ana",
    translate: ["Say “I am from Poland.”", "Soy de Polonia."],
    writing:
      "Write a short first message to a Spanish classmate. Greet them, give your name and origin, say where you live and which language you study, ask their name, and say goodbye.",
    model:
      "Hola, me llamo Julia y soy de Polonia. Vivo en Varsovia con mi familia. Estudio español en una escuela y hablo inglés. Me gusta mucho la clase. ¿Cómo te llamas? Hasta pronto, Julia.",
    checks: [
      "I included a greeting and a farewell.",
      "I gave my name, origin, home and language.",
      "I asked my classmate’s name.",
    ],
    speaking:
      "Introduce yourself. Give your name, nationality, age, home, occupation, languages and one personality trait. Speak for 1–2 minutes, expanding each point with a simple detail.",
    speech:
      "Me llamo Ana. Soy polaca y tengo treinta años. Vivo en Varsovia. Soy profesora. Hablo polaco e inglés y estudio español. Soy una persona tranquila. Me gusta leer.",
    speechChecks: [
      "I covered all seven personal details.",
      "My words were understandable when I replayed them.",
      "I used short sentences and added simple details.",
    ],
  },
  {
    title: "This is me",
    spanish: "Así soy yo",
    subtitle: "Names, numbers and your little corner of the world.",
    icon: "user",
    color: "lavender",
    goals: [
      "Give age, nationality and contact details",
      "Recognize numbers and question words",
      "Complete a personal information form",
    ],
    tip: "Spanish uses tener for age: tengo veinte años. A question word carries an accent: qué, cómo, dónde, cuántos.",
    example: "¿Cuántos años tienes? Tengo veinticinco años.",
    words: [
      ["el nombre", "first name", "🪪"],
      ["el apellido", "surname", "🪪"],
      ["la dirección", "address", "📍"],
      ["el teléfono", "telephone", "☎️"],
      ["veinte", "twenty", "🔢"],
      ["treinta", "thirty", "🔢"],
      ["la nacionalidad", "nationality", "🌍"],
      ["el correo electrónico", "email", "✉️"],
    ],
    grammar: [
      [
        "Yo ___ veintidós años.",
        "tengo",
        "soy",
        "estoy",
        "Use tener, not ser or estar, to state age. Tengo is the yo form.",
      ],
      [
        "¿___ vives? — En Málaga.",
        "Dónde",
        "Cuántos",
        "Quién",
        "Dónde asks where. Cuántos asks how many; quién asks who.",
      ],
      [
        "El número 16 se escribe…",
        "dieciséis",
        "sesenta",
        "seis",
        "Dieciséis is 16, sesenta is 60 and seis is 6. The accent marks the stressed syllable.",
      ],
      [
        "Ana es de España. Es ___.",
        "española",
        "español",
        "España",
        "The nationality adjective agrees with Ana: española. España is the country name.",
      ],
      [
        "Nosotros ___ estudiantes.",
        "somos",
        "son",
        "sois",
        "Nosotros takes somos. Son is for ellos/ellas/ustedes; sois is for vosotros/vosotras.",
      ],
      [
        "¿___ es tu teléfono?",
        "Cuál",
        "Quién",
        "Cuántos",
        "Cuál identifies one item, such as a telephone number. Quién asks about a person; cuántos asks about quantity.",
      ],
    ],
    reading:
      "FICHA DE ESTUDIANTE\nNombre: Carlos\nApellidos: Ruiz López\nEdad: 28\nNacionalidad: argentina\nDomicilio: calle Luna, 12, Valencia\nTeléfono: 612 345 789\nCorreo: carlos@example.com",
    read: [
      [
        "What belongs in “Apellidos”?",
        "Ruiz López",
        "Carlos",
        "Valencia",
        "Apellidos means surnames. Carlos is the given name and Valencia is the city.",
        "apellidos",
      ],
      [
        "¿Cuántos años tiene Carlos?",
        "Veintiocho.",
        "Veintidós.",
        "Treinta y ocho.",
        "The form says Edad: 28, which is veintiocho. Do not confuse it with the street number, 12.",
      ],
    ],
    audio:
      "Hola, soy Laura García. Tengo treinta y dos años y vivo en el número quince de la calle Sol. Soy italiana. Mi teléfono es seis, dos, uno, cuatro, cinco, siete, ocho, nueve, cero.",
    listen: [
      [
        "What is Laura’s street number?",
        "15",
        "32",
        "21",
        "Número quince is street number 15. Treinta y dos refers to her age.",
      ],
      [
        "What is Laura’s nationality?",
        "Italian.",
        "Spanish.",
        "Polish.",
        "Soy italiana gives her nationality. Living on calle Sol does not determine nationality.",
      ],
    ],
    sentence: "Tengo veinticinco años",
    translate: ["Say “My name is Carlos.”", "Me llamo Carlos."],
    writing:
      "Write a message introducing yourself to a language exchange partner. Include your name, age, nationality, city and languages. Ask where your partner lives and include a greeting and farewell.",
    model:
      "Hola, me llamo Pablo y tengo veintiocho años. Soy argentino y vivo en Valencia. Hablo español e inglés. Estudio italiano en una escuela cerca de mi casa. ¿Dónde vives tú? Un saludo, Pablo.",
    checks: [
      "I provided the requested personal details.",
      "I used tener for age and ser for nationality.",
      "I greeted, asked a question and signed off.",
    ],
    speaking:
      "Practise exchanging personal details. Say and spell your name, give your age and city, then say a fictional nine-digit phone number slowly. Ask your partner two personal questions.",
    speech:
      "Me llamo Elena: e, ele, e, ene, a. Tengo veintiséis años. Vivo en Bilbao. Mi teléfono es seis, uno, dos, tres, cuatro, cinco, seis, siete, ocho. ¿Cómo te llamas? ¿Dónde vives?",
    speechChecks: [
      "I said my personal details clearly.",
      "I spelled the name and spoke the digits separately.",
      "I asked two understandable questions.",
    ],
  },
  {
    title: "My favorite people",
    spanish: "Mi gente",
    subtitle: "Family, friends and the words that bring you together.",
    icon: "people",
    color: "sage",
    goals: [
      "Describe family and appearance",
      "Use possessives and adjective agreement",
      "Understand simple personal descriptions",
    ],
    tip: "Possessives agree with the thing possessed: mi hermano, mis hermanos. Describing words usually follow the noun: una casa blanca.",
    example: "Mis hermanas son altas y simpáticas.",
    words: [
      ["la madre", "mother", "👩"],
      ["el padre", "father", "👨"],
      ["la hermana", "sister", "👩‍🦱"],
      ["el hermano", "brother", "👨‍🦱"],
      ["la abuela", "grandmother", "👵"],
      ["el hijo", "son", "👦"],
      ["la amiga", "female friend", "👩‍🦰"],
      ["la familia", "family", "👪"],
    ],
    grammar: [
      [
        "___ padres viven en Sevilla. (my)",
        "Mis",
        "Mi",
        "Yo",
        "Padres is plural, so use mis. Mi is singular. Yo is a subject pronoun, not a possessive.",
      ],
      [
        "Mi hermana es ___.",
        "alta",
        "alto",
        "altos",
        "Hermana is feminine singular. The adjective must also be feminine singular: alta.",
      ],
      [
        "El padre de mi madre es mi ___.",
        "abuelo",
        "tío",
        "primo",
        "Your mother’s father is your grandfather, abuelo. Tío is uncle and primo is cousin.",
      ],
      [
        "Tenemos dos hijas. Son ___ hijas.",
        "nuestras",
        "nuestros",
        "nuestro",
        "Hijas is feminine plural, so nuestro changes to nuestras.",
      ],
      [
        "Plural: una mujer → dos ___.",
        "mujeres",
        "mujers",
        "mujer",
        "Nouns ending in a consonant usually add -es: mujer → mujeres.",
        "Una mujer. Dos mujeres.",
      ],
      [
        "La profesora ___ simpática.",
        "es",
        "está",
        "hay",
        "Use ser for a description of character. Está usually expresses a state or location; hay introduces existence.",
      ],
    ],
    reading:
      "Mi familia es pequeña. Mi madre, Rosa, tiene cincuenta años y es médica. Mi padre es alto y tiene el pelo negro. Mi hermana Sara tiene dieciséis años. Los domingos comemos con mi abuela Carmen.",
    read: [
      [
        "¿Quién es médica?",
        "Rosa.",
        "Sara.",
        "Carmen.",
        "Mi madre, Rosa… es médica identifies her profession. Sara is the sister and Carmen the grandmother.",
      ],
      [
        "¿Cuándo comen con la abuela?",
        "Los domingos.",
        "Los lunes.",
        "Todos los días.",
        "Los domingos means on Sundays. It does not mean every day.",
      ],
    ],
    audio:
      "Esta es mi amiga Isabel. Es baja y tiene el pelo rubio. Tiene un hermano pequeño que se llama Luis. Isabel trabaja en una tienda y su hermano es estudiante.",
    listen: [
      [
        "What is Isabel’s hair like?",
        "Blond.",
        "Black.",
        "Red.",
        "Pelo rubio means blond hair. Negro means black; pelirrojo describes red hair.",
      ],
      [
        "Who is a student?",
        "Luis.",
        "Isabel.",
        "Their mother.",
        "Su hermano es estudiante refers to Luis, her brother. Isabel works in a shop.",
      ],
    ],
    sentence: "Mi hermana es muy simpática",
    translate: ["Say “I have two brothers.”", "Tengo dos hermanos."],
    writing:
      "Write to a friend about your family. Greet them, say who is in your family, describe one person’s appearance and character, mention something you do together, and say goodbye.",
    model:
      "Hola, Julia. Vivo con mis padres y mi hermana. Mi hermana se llama Ana. Es alta y muy simpática. Los domingos comemos juntos en casa de mi abuela y hablamos mucho. Un abrazo, Luis.",
    checks: [
      "I described my family and one person.",
      "My adjectives agree in gender and number.",
      "I included a shared activity, greeting and farewell.",
    ],
    speaking:
      "Talk about your family for 2–3 minutes. Say who they are, describe one person and explain what you do together. Ask the interviewer two questions about their family.",
    speech:
      "Mi familia es pequeña. Vivo con mi madre y mi hermano. Mi madre es profesora y es muy simpática. Los domingos vamos al parque. ¿Tienes hermanos? ¿Dónde vive tu familia?",
    speechChecks: [
      "I covered people, description and shared activities.",
      "I added simple details instead of a list of names.",
      "I asked two questions about family.",
    ],
  },
  {
    title: "A place called home",
    spanish: "En casa",
    subtitle: "Open the door. Find your words.",
    icon: "home",
    color: "sand",
    goals: [
      "Name rooms and furniture",
      "Distinguish hay and estar",
      "Describe position and read housing advertisements",
    ],
    tip: "Hay introduces something: Hay una mesa. Estar locates something already identified: La mesa está en la cocina.",
    example: "Hay dos sillas. La silla verde está junto a la ventana.",
    words: [
      ["la casa", "house", "🏠"],
      ["la cocina", "kitchen", "🍳"],
      ["el dormitorio", "bedroom", "🛏️"],
      ["el baño", "bathroom", "🛁"],
      ["la mesa", "table", "🪑"],
      ["la silla", "chair", "🪑"],
      ["la ventana", "window", "🪟"],
      ["la puerta", "door", "🚪"],
    ],
    grammar: [
      [
        "En mi casa ___ tres dormitorios.",
        "hay",
        "están",
        "es",
        "Hay states that three bedrooms exist. It stays the same with singular and plural nouns.",
      ],
      [
        "La cocina ___ al lado del baño.",
        "está",
        "hay",
        "es",
        "Use estar to locate an identified place, la cocina. Hay introduces an indefinite thing.",
      ],
      [
        "El libro está ___ la mesa. (on)",
        "encima de",
        "debajo de",
        "lejos de",
        "Encima de means on top of. Debajo de means under, and lejos de means far from.",
      ],
      [
        "Choose the neutral descriptive word order for “a white house”.",
        "una casa blanca",
        "un casa blanco",
        "una blanca casa",
        "Casa is feminine and blanca agrees. At A1, the neutral descriptive order is noun then adjective: casa blanca.",
      ],
      [
        "¿___ habitaciones hay?",
        "Cuántas",
        "Cuántos",
        "Dónde",
        "Habitaciones is feminine plural, so the quantity question uses cuántas.",
      ],
      [
        "Voy ___ salón.",
        "al",
        "a el",
        "del",
        "A + el contracts to al. Del is the contraction of de + el.",
      ],
    ],
    reading:
      "SE ALQUILA PISO\nPiso de dos dormitorios en el centro. Salón grande, cocina pequeña y un baño. Está cerca del metro. No tiene jardín. Precio: 650 euros al mes. Llamar por la tarde.",
    read: [
      [
        "¿Qué tiene el piso?",
        "Dos dormitorios.",
        "Un jardín.",
        "Tres baños.",
        "The advertisement states dos dormitorios. No tiene jardín explicitly rules out a garden.",
      ],
      [
        "¿Cuándo puedes llamar?",
        "Por la tarde.",
        "Por la mañana.",
        "Solo el domingo.",
        "Llamar por la tarde asks you to call in the afternoon. No day is specified.",
      ],
    ],
    audio:
      "Mi casa tiene una cocina grande. La mesa está junto a la ventana. Hay cuatro sillas y una lámpara sobre la mesa. Mi habitación está a la derecha del baño.",
    listen: [
      [
        "How many chairs are there?",
        "Four.",
        "Three.",
        "Two.",
        "Hay cuatro sillas means there are four chairs.",
      ],
      [
        "Where is the bedroom?",
        "To the right of the bathroom.",
        "Inside the kitchen.",
        "To the left of the bathroom.",
        "A la derecha del baño means to the right of the bathroom. Izquierda would mean left.",
      ],
    ],
    sentence: "La cocina está al lado del baño",
    translate: ["Say “There is a table.”", "Hay una mesa."],
    writing:
      "Write a message about your home to a visiting friend. Say where it is, which rooms it has and where your friend can sleep. Include a greeting and farewell.",
    model:
      "Hola, Ana. Mi casa está en el centro, cerca de la estación. Tiene dos dormitorios, una cocina y un salón grande. Puedes dormir en la habitación pequeña, junto al baño. Nos vemos pronto. Un abrazo.",
    checks: [
      "I included location, rooms and a place to sleep.",
      "I used hay for existence and estar for location.",
      "I included a greeting and farewell.",
    ],
    speaking:
      "Describe your home for 2–3 minutes: its location, rooms and your favorite room. Describe where three objects are. Ask the interviewer two questions about their home.",
    speech:
      "Vivo en un piso en el centro. Tiene dos habitaciones y una cocina. Me gusta el salón porque es grande. Hay una mesa junto a la ventana. ¿Dónde vives? ¿Cómo es tu casa?",
    speechChecks: [
      "I covered location, rooms and a favorite room.",
      "I located objects using estar and position words.",
      "I asked two questions.",
    ],
  },
  {
    title: "A day in my life",
    spanish: "Mi día a día",
    subtitle: "From the first coffee to buenas noches.",
    icon: "clock",
    color: "blue",
    goals: [
      "Tell the time and understand schedules",
      "Use present-tense verbs and reflexives",
      "Talk about dates and routines",
    ],
    tip: "Use es la una but son las dos. For an event time, use a la una / a las dos. Reflexive verbs need me, te or se.",
    example: "Me levanto a las siete y desayuno a las ocho.",
    words: [
      ["la mañana", "morning", "🌅"],
      ["la tarde", "afternoon", "🌇"],
      ["la noche", "night", "🌃"],
      ["el lunes", "Monday", "📅"],
      ["el viernes", "Friday", "📅"],
      ["desayunar", "to have breakfast", "🥐"],
      ["trabajar", "to work", "💼"],
      ["dormir", "to sleep", "💤"],
    ],
    grammar: [
      [
        "Son las tres y media. What time is it?",
        "3:30",
        "3:15",
        "2:30",
        "Y media means half past. Y cuarto is quarter past; menos cuarto is quarter to.",
        "Son las tres y media.",
      ],
      [
        "Yo ___ a las siete. (get up)",
        "me levanto",
        "se levanto",
        "levantar",
        "Yo requires me and the conjugated verb levanto. Se goes with él/ella/usted; levantar is an infinitive.",
      ],
      [
        "Nosotros ___ español.",
        "estudiamos",
        "estudian",
        "estudio",
        "Regular -ar verbs use -amos with nosotros. Estudian is they; estudio is I.",
      ],
      [
        "La clase empieza ___ las nueve.",
        "a",
        "en",
        "de",
        "Use a before a clock time: a las nueve.",
      ],
      [
        "Which is 1:00?",
        "Es la una.",
        "Son las una.",
        "Es las uno.",
        "One o’clock is singular: es la una. From two onward use son las.",
      ],
      [
        "Hoy es lunes. Mañana es ___.",
        "martes",
        "domingo",
        "jueves",
        "Martes follows lunes. Domingo is Sunday; jueves is Thursday.",
      ],
    ],
    reading:
      "HORARIO DE ANA\nDe lunes a viernes trabaja de nueve a cinco. Come a las dos. El martes y el jueves tiene clase de español a las seis. Los sábados no trabaja: visita a sus padres.",
    read: [
      [
        "¿A qué hora come Ana?",
        "A las dos.",
        "A las cinco.",
        "A las nueve.",
        "Come a las dos gives lunchtime. Nine and five are the start and end of work.",
      ],
      [
        "¿Cuándo estudia español?",
        "Martes y jueves.",
        "Lunes y viernes.",
        "Solo los sábados.",
        "The timetable names el martes y el jueves for Spanish classes.",
      ],
    ],
    audio:
      "Me llamo Diego. Me levanto a las siete y cuarto. Desayuno a las ocho y voy al trabajo en autobús. Por la noche leo un libro. Me acuesto a las once.",
    listen: [
      [
        "When does Diego get up?",
        "7:15",
        "7:45",
        "8:00",
        "Siete y cuarto is 7:15. Siete menos cuarto would be 6:45. Eight is breakfast time.",
      ],
      [
        "How does he get to work?",
        "By bus.",
        "By train.",
        "On foot.",
        "En autobús means by bus. En tren is by train and a pie means on foot.",
      ],
    ],
    sentence: "Me levanto a las siete de la mañana",
    translate: ["Say “We study Spanish.”", "Estudiamos español."],
    writing:
      "Write a message to a friend describing your weekday. Say when you get up, what you do during the day and what you do in the evening. Greet your friend and say goodbye.",
    model:
      "Hola, Luis. Me levanto a las siete y desayuno en casa. Trabajo de nueve a cinco y como con mis compañeros. Por la noche estudio español y leo un libro. Me acuesto a las once. Saludos.",
    checks: [
      "I described morning, daytime and evening.",
      "I used conjugated present-tense verbs.",
      "I expressed times with a la / a las.",
    ],
    speaking:
      "Talk about a typical day for 2–3 minutes. Include your morning, work or studies, and evening. Say several times clearly. Ask two questions about the interviewer’s routine.",
    speech:
      "Me levanto a las siete. Desayuno café con pan. Trabajo en una oficina de nueve a cinco. Por la tarde estudio español. Me acuesto a las once. ¿A qué hora te levantas? ¿Trabajas por la tarde?",
    speechChecks: [
      "I described the three parts of my day.",
      "I gave clear times and used reflexive verbs.",
      "I asked two routine questions.",
    ],
  },
  {
    title: "A table for two",
    spanish: "¡Buen provecho!",
    subtitle: "Order something delicious. Make yourself understood.",
    icon: "coffee",
    color: "peach",
    goals: [
      "Order food and ask for the bill",
      "Express preferences with gustar",
      "Understand menus, quantities and prices",
    ],
    tip: "Use gusta with a singular noun or infinitive, and gustan with a plural noun. Me gusta el café. Me gustan las manzanas.",
    example: "Un café con leche y una tostada, por favor.",
    words: [
      ["el pan", "bread", "🥖"],
      ["el agua", "water", "💧"],
      ["el café", "coffee", "☕"],
      ["la leche", "milk", "🥛"],
      ["la manzana", "apple", "🍎"],
      ["el pescado", "fish", "🐟"],
      ["la cuenta", "bill", "🧾"],
      ["el queso", "cheese", "🧀"],
    ],
    grammar: [
      [
        "Me ___ las manzanas.",
        "gustan",
        "gusta",
        "gusto",
        "Manzanas is plural, so use gustan. Gusto is not used to say I like something.",
      ],
      [
        "Me gusta ___ café.",
        "el",
        "un",
        "— (no article)",
        "Use the definite article with a general preference: me gusta el café.",
      ],
      [
        "How do you ask for the bill?",
        "La cuenta, por favor.",
        "El cuento, por favor.",
        "La puerta, por favor.",
        "La cuenta is the bill. El cuento means story; la puerta means door.",
      ],
      [
        "Yo ___ una ensalada.",
        "quiero",
        "quiere",
        "queremos",
        "Yo takes quiero. Quiere is for él/ella/usted; queremos is for nosotros.",
      ],
      [
        "Quiero café ___ leche.",
        "con",
        "en",
        "a",
        "Con means with: café con leche. En means in or on; a often marks direction.",
      ],
      [
        "“Dos euros con cincuenta” is…",
        "€2.50",
        "€2.15",
        "€12.50",
        "Cincuenta is fifty, so the price is two euros and fifty cents. Quince is fifteen.",
        "Dos euros con cincuenta.",
      ],
    ],
    reading:
      "CAFÉ LA PLAZA\nCafé solo: 1,50 €\nCafé con leche: 2 €\nTostada con tomate: 3 €\nBocadillo de queso: 4 €\nZumo de naranja: 2,50 €\nDesayunos hasta las 12:00. Cerrado los lunes.",
    read: [
      [
        "How much are a café con leche and a toast?",
        "5 €",
        "3,50 €",
        "6 €",
        "Café con leche is 2 € and toast is 3 €: 2 + 3 = 5 €. Café solo is a different drink.",
      ],
      [
        "¿Qué día está cerrado?",
        "El lunes.",
        "El domingo.",
        "El martes.",
        "Cerrado los lunes means closed on Mondays.",
      ],
    ],
    audio:
      "Buenos días. Para mí, una tostada con tomate y un café con leche. Para mi amiga, un zumo de naranja. No queremos azúcar. La cuenta, por favor.",
    listen: [
      [
        "What does the friend want?",
        "Orange juice.",
        "Coffee with milk.",
        "Tea.",
        "Para mi amiga, un zumo de naranja specifies the friend’s drink. The coffee is for the speaker.",
      ],
      [
        "Do they want sugar?",
        "No.",
        "Yes.",
        "Only in the juice.",
        "No queremos azúcar explicitly says they do not want sugar.",
      ],
    ],
    sentence: "Me gustan las manzanas y el pan",
    translate: ["Say “A coffee, please.”", "Un café, por favor."],
    writing:
      "Invite a friend to eat at a café. Say where the café is, which day and time to meet and what you like to eat there. Include a greeting and farewell.",
    model:
      "Hola, Elena. ¿Quieres comer conmigo el sábado? Hay un café muy bueno junto a la plaza. Podemos quedar a las dos. Me gustan sus bocadillos de queso y el zumo de naranja. Hasta pronto, Ana.",
    checks: [
      "I gave a meeting place, day and time.",
      "I mentioned food and used gusta / gustan correctly.",
      "I included an invitation and farewell.",
    ],
    speaking:
      "Practise a café conversation: greet the waiter, order food and a drink, ask the price, request the bill and say thank you. Then explain what you like to eat.",
    speech:
      "Buenos días. Quiero un café con leche y una tostada, por favor. ¿Cuánto cuesta? Me gusta el pan con tomate. La cuenta, por favor. Muchas gracias. Hasta luego.",
    speechChecks: [
      "I ordered both food and a drink.",
      "I asked for the price and bill politely.",
      "I expressed a preference clearly.",
    ],
  },
  {
    title: "Around the neighborhood",
    spanish: "Por el barrio",
    subtitle: "Find your way, one conversation at a time.",
    icon: "map",
    color: "sage",
    goals: [
      "Ask for and understand directions",
      "Locate places and services",
      "Understand public signs and opening hours",
    ],
    tip: "Dónde asks for location. Cerca de means near; lejos de means far from. Izquierda is left and derecha is right.",
    example: "¿Dónde está la farmacia? Está enfrente del banco.",
    words: [
      ["la calle", "street", "🛣️"],
      ["la plaza", "square", "⛲"],
      ["el banco", "bank", "🏦"],
      ["la farmacia", "pharmacy", "💊"],
      ["el supermercado", "supermarket", "🛒"],
      ["el parque", "park", "🌳"],
      ["la estación", "station", "🚉"],
      ["la biblioteca", "library", "📚"],
    ],
    grammar: [
      [
        "La farmacia está enfrente ___ banco.",
        "del",
        "de el",
        "al",
        "De + el contracts to del. Al means a + el.",
      ],
      [
        "“A la izquierda” means…",
        "To the left.",
        "To the right.",
        "Straight ahead.",
        "Izquierda is left. Derecha is right. Todo recto means straight ahead.",
        "A la izquierda.",
      ],
      [
        "En mi barrio ___ un parque.",
        "hay",
        "está",
        "son",
        "Hay introduces a park. Use está to locate a known park: el parque está…",
      ],
      [
        "¿Dónde ___ los baños?",
        "están",
        "está",
        "hay",
        "Los baños is a definite plural subject, so use están to ask their location.",
      ],
      [
        "Voy ___ la biblioteca.",
        "a",
        "en",
        "de",
        "Use ir a for a destination. A la does not contract; only a + el becomes al.",
      ],
      [
        "A sign says “No fumar”. What does it mean?",
        "No smoking.",
        "No entry.",
        "No parking.",
        "Fumar means to smoke. The infinitive appears in brief public prohibitions.",
        "No fumar.",
      ],
    ],
    reading:
      "BIBLIOTECA MUNICIPAL\nAbierto de lunes a viernes, de 9:00 a 20:00. Sábados: de 10:00 a 14:00. Domingos cerrado. Entrada gratuita. Está al lado del parque, enfrente de la farmacia.",
    read: [
      [
        "When does the library close on Saturday?",
        "14:00",
        "20:00",
        "10:00",
        "Sábados has its own hours: 10:00–14:00. The 20:00 closing time applies Monday to Friday.",
      ],
      [
        "What is opposite the library?",
        "The pharmacy.",
        "The bank.",
        "The station.",
        "Enfrente de la farmacia means opposite the pharmacy. The park is next to it.",
      ],
    ],
    audio:
      "Perdona, ¿dónde está la estación? Está cerca. Sigue todo recto y después gira a la derecha. La estación está al lado del supermercado. Son cinco minutos a pie.",
    listen: [
      [
        "Which turn should you take?",
        "Right.",
        "Left.",
        "Turn around.",
        "Gira a la derecha means turn right.",
      ],
      [
        "How long is the walk?",
        "Five minutes.",
        "Fifteen minutes.",
        "Fifty minutes.",
        "Cinco minutos a pie gives a five-minute walk. Quince is fifteen and cincuenta is fifty.",
      ],
    ],
    sentence: "La farmacia está enfrente del banco",
    translate: ["Say “Where is the station?”", "¿Dónde está la estación?"],
    writing:
      "Write directions to a friend visiting your neighborhood. Tell them where you live, name two nearby places and explain how to get from the station to your home. Add a greeting and farewell.",
    model:
      "Hola, Eva. Vivo en la calle Luna, cerca del parque y del banco. Desde la estación, sigue todo recto y gira a la derecha. Mi casa está enfrente de la farmacia. Nos vemos pronto. Un abrazo.",
    checks: [
      "I named my location and two nearby places.",
      "I gave a simple route using direction words.",
      "I used location phrases and a greeting / farewell.",
    ],
    speaking:
      "Describe your neighborhood: where it is, which places it has and what you like about it. Ask where the bank is and how far it is from the station.",
    speech:
      "Mi barrio está en el centro. Hay un parque y dos supermercados. Me gusta porque es tranquilo. La farmacia está al lado del banco. ¿Dónde está el banco? ¿Está lejos de la estación?",
    speechChecks: [
      "I described the location and places.",
      "I used hay and estar appropriately.",
      "I asked two practical questions.",
    ],
  },
  {
    title: "A little shopping",
    spanish: "De compras",
    subtitle: "Colors, sizes and something just right.",
    icon: "bag",
    color: "lavender",
    goals: [
      "Ask about prices, sizes and colors",
      "Use demonstratives and quantities",
      "Read shop offers and payment information",
    ],
    tip: "Este / esta means this. Estos / estas means these. Match the noun: esta camisa, estos zapatos. Cuánto also agrees with what you ask about.",
    example: "¿Cuánto cuestan estos zapatos? Cuarenta euros.",
    words: [
      ["la camisa", "shirt", "👔"],
      ["los zapatos", "shoes", "👞"],
      ["el vestido", "dress", "👗"],
      ["la chaqueta", "jacket", "🧥"],
      ["rojo", "red", "🔴"],
      ["azul", "blue", "🔵"],
      ["la talla", "size", "📏"],
      ["la tarjeta", "card", "💳"],
    ],
    grammar: [
      [
        "___ camisa es roja.",
        "Esta",
        "Este",
        "Estos",
        "Camisa is feminine singular, so use esta. Este is masculine; estos is masculine plural.",
      ],
      [
        "¿Cuánto ___ los zapatos?",
        "cuestan",
        "cuesta",
        "cuesto",
        "Los zapatos is plural, so the verb is cuestan. Cuesta goes with a singular item.",
      ],
      [
        "Quiero una chaqueta ___.",
        "negra",
        "negro",
        "negros",
        "Chaqueta is feminine singular, and negra agrees with it.",
      ],
      [
        "“Cuarenta y cinco euros” is…",
        "45 €",
        "54 €",
        "405 €",
        "Cuarenta is forty and cinco is five. Fifty-four is cincuenta y cuatro.",
        "Cuarenta y cinco euros.",
      ],
      [
        "___ zapatos son azules.",
        "Estos",
        "Esta",
        "Este",
        "Zapatos is masculine plural. Use estos and the plural adjective azules.",
      ],
      [
        "¿Puedo pagar ___ tarjeta?",
        "con",
        "a",
        "de",
        "Pagar con tarjeta is the usual expression for paying by card.",
      ],
    ],
    reading:
      "TIENDA LUNA\nCamisetas: 12 €\nPantalones: 25 €\nChaquetas: 40 €\nTallas S, M y L. Abierto de 10:00 a 19:00 de lunes a sábado. Aceptamos tarjetas. Los domingos, cerrado.",
    read: [
      [
        "Which item costs 25 €?",
        "Trousers.",
        "T-shirts.",
        "Jackets.",
        "Pantalones means trousers. Camisetas are T-shirts; chaquetas are jackets.",
      ],
      [
        "Can you pay by card?",
        "Yes.",
        "No.",
        "Only on Sundays.",
        "Aceptamos tarjetas means cards are accepted. Sunday is a closed day.",
      ],
    ],
    audio:
      "Buenos días. Busco una camisa azul, talla mediana. ¿Cuánto cuesta? Cuesta veintidós euros. Muy bien. Quiero dos, por favor. ¿Puedo pagar con tarjeta?",
    listen: [
      [
        "Which color does the customer want?",
        "Blue.",
        "Red.",
        "White.",
        "Camisa azul means a blue shirt.",
      ],
      [
        "How many shirts does the customer want?",
        "Two.",
        "One.",
        "Twenty-two.",
        "Quiero dos specifies two shirts. Veintidós is the price of one shirt, not the quantity.",
      ],
    ],
    sentence: "Quiero una camisa azul por favor",
    translate: ["Say “Can I pay by card?”", "¿Puedo pagar con tarjeta?"],
    writing:
      "Write to a friend about a shop you like. Say where it is, what it sells, give a price and its opening hours. Suggest a day to go together. Include a greeting and farewell.",
    model:
      "Hola, Mario. Hay una tienda de ropa junto al banco. Tiene camisas azules por veinte euros y chaquetas muy bonitas. Abre de diez a siete. ¿Quieres ir conmigo el sábado por la mañana? Hasta pronto.",
    checks: [
      "I named the location, products and a price.",
      "I included hours and suggested a day.",
      "I checked agreement of clothing and color words.",
    ],
    speaking:
      "Role-play buying clothes. Ask for a garment, color and size. Ask the price and whether you can pay by card. Explain which colors you like.",
    speech:
      "Buenos días. Quiero una camisa azul, talla mediana, por favor. ¿Cuánto cuesta? ¿Puedo pagar con tarjeta? Me gusta el azul, pero no me gusta el rojo. Muchas gracias.",
    speechChecks: [
      "I requested an item, color and size.",
      "I asked two shopping questions.",
      "I expressed a preference politely.",
    ],
  },
  {
    title: "Life beyond work",
    spanish: "Tiempo libre",
    subtitle: "The things you love and the people you meet.",
    icon: "heart",
    color: "peach",
    goals: [
      "Talk about hobbies, work and studies",
      "Accept or decline an invitation",
      "Connect ideas with y, pero and porque",
    ],
    tip: "Use gusta + an infinitive for an activity: Me gusta leer. To give a simple reason, use porque. To ask why, use ¿por qué?",
    example: "Me gusta leer, pero no me gusta bailar.",
    words: [
      ["leer", "to read", "📖"],
      ["bailar", "to dance", "💃"],
      ["nadar", "to swim", "🏊"],
      ["el cine", "cinema", "🎬"],
      ["la música", "music", "🎵"],
      ["el fútbol", "football", "⚽"],
      ["la escuela", "school", "🏫"],
      ["el trabajo", "work / job", "💼"],
    ],
    grammar: [
      [
        "Me gusta ___ libros.",
        "leer",
        "leo",
        "leyendo",
        "After me gusta, use an infinitive for an activity: leer. Leo is a conjugated verb.",
      ],
      [
        "No voy al cine ___ trabajo.",
        "porque",
        "por qué",
        "dónde",
        "Porque gives a reason. Por qué asks why. Dónde asks where.",
      ],
      [
        "Me gusta bailar, ___ no me gusta cantar.",
        "pero",
        "porque",
        "también",
        "Pero introduces a contrast. Porque gives a reason and también means also.",
      ],
      [
        "¿Quieres ir al cine? Choose a polite acceptance.",
        "Sí, gracias. Buena idea.",
        "No entiendo la palabra.",
        "Soy profesora.",
        "Sí, gracias. Buena idea accepts the invitation. The others do not answer it.",
      ],
      [
        "Ellos ___ en una escuela.",
        "trabajan",
        "trabajamos",
        "trabajo",
        "Ellos takes trabajan. Trabajamos is we; trabajo is I.",
      ],
      [
        "“Yo tampoco” agrees with…",
        "No me gusta el fútbol.",
        "Me gusta el fútbol.",
        "¿Dónde está el cine?",
        "Tampoco agrees with a negative statement: I don’t either. También agrees with a positive one.",
      ],
    ],
    reading:
      "Hola, Ana. El sábado hay una película española en el cine del centro. Empieza a las siete. La entrada cuesta ocho euros. ¿Quieres venir con Luis y conmigo? Podemos quedar a las seis y media delante del cine. Un abrazo, Marta.",
    read: [
      [
        "What time is the meeting?",
        "18:30",
        "19:00",
        "20:00",
        "Quedar a las seis y media is the meeting time. The film starts at seven.",
      ],
      [
        "Who wrote the invitation?",
        "Marta.",
        "Ana.",
        "Luis.",
        "The signature is Marta. Ana is the recipient; Luis is another guest.",
      ],
    ],
    audio:
      "Los sábados me gusta nadar por la mañana. Por la tarde escucho música en casa. No me gusta el fútbol, pero mi hermano juega los domingos. Estudio español porque quiero viajar.",
    listen: [
      [
        "What does the speaker do Saturday morning?",
        "Swims.",
        "Plays football.",
        "Goes to the cinema.",
        "Nadar por la mañana gives the activity. Football is the brother’s hobby.",
      ],
      [
        "Why does the speaker study Spanish?",
        "To travel.",
        "For a job.",
        "To sing.",
        "Porque quiero viajar means because I want to travel.",
      ],
    ],
    sentence: "Me gusta leer porque es interesante",
    translate: ["Say “I do not like football.”", "No me gusta el fútbol."],
    writing:
      "Reply to a friend’s invitation to the cinema. Thank them, accept or decline with a reason, suggest a meeting time and place, and say goodbye.",
    model:
      "Hola, Marta. Muchas gracias por tu invitación. Sí, quiero ir porque me gustan las películas españolas. Podemos quedar a las seis y media delante del cine. Después podemos tomar un café juntos. Un abrazo, Ana.",
    checks: [
      "I thanked my friend and answered the invitation.",
      "I used porque to give a reason.",
      "I included a meeting time, place and farewell.",
    ],
    speaking:
      "Talk about your free time for 2–3 minutes: favorite activities, when and with whom you do them. Invite the interviewer to an activity and ask about their hobbies.",
    speech:
      "Me gusta leer y nadar. Los sábados voy a la piscina con mi amiga. Por la noche escucho música en casa. ¿Qué te gusta hacer? ¿Quieres ir al cine el domingo?",
    speechChecks: [
      "I described activities, times and companions.",
      "I expressed likes using infinitives or nouns.",
      "I made an invitation and asked a question.",
    ],
  },
  {
    title: "A ticket to somewhere",
    spanish: "¡Buen viaje!",
    subtitle: "Trains, check-ins and your next small adventure.",
    icon: "train",
    color: "blue",
    goals: [
      "Understand tickets and travel announcements",
      "Ask for a room or a transport ticket",
      "Recognize dates, durations and destinations",
    ],
    tip: "Ir a expresses a destination: voy a Madrid. En describes transport: en tren. A pie is the exception for walking.",
    example: "Un billete a Sevilla para el viernes, por favor.",
    words: [
      ["el tren", "train", "🚆"],
      ["el autobús", "bus", "🚌"],
      ["el avión", "airplane", "✈️"],
      ["el billete", "ticket", "🎟️"],
      ["el hotel", "hotel", "🏨"],
      ["la maleta", "suitcase", "🧳"],
      ["el pasaporte", "passport", "🛂"],
      ["la habitación", "room", "🛏️"],
    ],
    grammar: [
      [
        "Voy a Barcelona ___ tren.",
        "en",
        "a",
        "de",
        "Use en before a form of transport: en tren, en autobús.",
      ],
      [
        "Un billete ___ Valencia, por favor.",
        "a",
        "en",
        "con",
        "A introduces the destination of the ticket.",
      ],
      [
        "Una habitación para dos personas es ___.",
        "doble",
        "individual",
        "cerrada",
        "Doble means double. Individual is for one person; cerrada means closed.",
      ],
      [
        "Vamos ___ hotel.",
        "al",
        "a el",
        "en el",
        "Ir a + el hotel becomes ir al hotel. A + el contracts to al.",
      ],
      [
        "El tren sale a las ocho menos cuarto.",
        "7:45",
        "8:15",
        "8:45",
        "Ocho menos cuarto means a quarter to eight: 7:45.",
        "El tren sale a las ocho menos cuarto.",
      ],
      [
        "“Ida y vuelta” means…",
        "A return ticket.",
        "One way only.",
        "A late departure.",
        "Ida is the outward journey and vuelta is the return. Together they mean round trip.",
        "Ida y vuelta.",
      ],
    ],
    reading:
      "BILLETE DE TREN\nOrigen: Madrid\nDestino: Sevilla\nFecha: 18 de junio\nSalida: 09:15\nLlegada: 12:00\nCoche: 4 · Asiento: 12A\nPrecio: 35 €",
    read: [
      [
        "Where does this train arrive?",
        "Sevilla.",
        "Madrid.",
        "Valencia.",
        "Destino names the arrival city, Sevilla. Origen is the starting point.",
      ],
      [
        "Which seat is reserved?",
        "12A",
        "4",
        "18",
        "Asiento means seat. Coche 4 is the carriage and 18 is the day of the month.",
      ],
    ],
    audio:
      "Atención, por favor. El autobús a Granada sale a las diez y media de la estación central. El billete cuesta quince euros. El viaje dura dos horas. Gracias.",
    listen: [
      [
        "When does the bus leave?",
        "10:30",
        "10:15",
        "12:30",
        "Diez y media is 10:30. Y media means half past, while y cuarto means a quarter past.",
      ],
      [
        "How much is the ticket?",
        "15 €",
        "50 €",
        "2 €",
        "Quince euros is 15 €. Two is the journey’s duration in hours.",
      ],
    ],
    sentence: "Quiero una habitación para dos personas",
    translate: ["Say “A ticket to Madrid, please.”", "Un billete a Madrid, por favor."],
    writing:
      "Write to a hotel to request a room. Say how many people, your arrival day, how many nights, and ask the price. Greet the hotel staff and sign off.",
    model:
      "Buenos días. Me llamo Ana López. Quiero una habitación para dos personas el viernes, durante tres noches. Llegamos por la tarde. ¿Cuánto cuesta la habitación? ¿El desayuno está incluido? Muchas gracias. Un saludo, Ana.",
    checks: [
      "I gave people, arrival day and number of nights.",
      "I asked the price with a clear question.",
      "I used an appropriate greeting and farewell.",
    ],
    speaking:
      "Role-play a station and hotel visit. Buy a ticket, ask departure time and price, then request a room for two people for three nights.",
    speech:
      "Buenos días. Un billete a Madrid, por favor. ¿A qué hora sale el tren? ¿Cuánto cuesta? Tengo una reserva en el hotel. Quiero una habitación doble para tres noches. Gracias.",
    speechChecks: [
      "I gave the destination and asked two travel questions.",
      "I requested the type of room and number of nights.",
      "My numbers and time expressions were clear.",
    ],
  },
  {
    title: "Come rain or shine",
    spanish: "¿Qué tal estás?",
    subtitle: "Talk about the weather and how you feel.",
    icon: "cloud",
    color: "sand",
    goals: [
      "Describe weather and seasons",
      "Express basic feelings and physical needs",
      "Understand a simple appointment message",
    ],
    tip: "Weather uses several patterns: hace frío, hace calor, hay viento, llueve. A physical need uses tener: tengo hambre, tengo sed.",
    example: "Hoy hace calor. Tengo sed y quiero agua.",
    words: [
      ["el sol", "sun", "☀️"],
      ["la lluvia", "rain", "🌧️"],
      ["el frío", "cold", "❄️"],
      ["el calor", "heat", "🌡️"],
      ["el verano", "summer", "🏖️"],
      ["el invierno", "winter", "⛄"],
      ["cansado", "tired (masculine)", "😴"],
      ["contento", "happy (masculine)", "🙂"],
    ],
    grammar: [
      [
        "Hoy ___ mucho frío.",
        "hace",
        "es",
        "tiene",
        "The standard weather phrase is hace frío. Do not translate English it is literally.",
      ],
      [
        "Quiero comer. Tengo ___.",
        "hambre",
        "sed",
        "años",
        "Tener hambre means to be hungry. Tener sed means to be thirsty; años expresses age.",
      ],
      [
        "Estoy ___ porque trabajo mucho. (female speaker)",
        "cansada",
        "cansado",
        "cansadas",
        "A female singular speaker uses cansada. This describes a state, so estar is appropriate.",
      ],
      [
        "En invierno normalmente ___ frío.",
        "hace",
        "hay el",
        "está un",
        "Hace frío is the fixed weather pattern. Hay is used in other weather phrases, such as hay viento.",
      ],
      [
        "Necesito beber agua. Tengo ___.",
        "sed",
        "hambre",
        "sueño",
        "Sed is thirst; hambre is hunger; sueño in tener sueño is sleepiness.",
      ],
      [
        "Which sentence says “It is raining”?",
        "Llueve.",
        "Nieva.",
        "Hace sol.",
        "Llueve means it rains / it is raining. Nieva means it snows and hace sol means it is sunny.",
      ],
    ],
    reading:
      "Hola, Julia. Tu cita con la doctora García es el martes 12 de mayo a las once y media. La consulta está en la calle Sol, número 8, primera planta. Por favor, llega diez minutos antes.",
    read: [
      [
        "What is the appointment time?",
        "11:30",
        "12:00",
        "11:20",
        "Once y media is 11:30. Arriving ten minutes earlier means 11:20, but that is not the appointment time.",
      ],
      [
        "On which floor is the office?",
        "First.",
        "Eighth.",
        "Twelfth.",
        "Primera planta means first floor. Eight is the street number and twelve is the date.",
      ],
    ],
    audio:
      "Hoy es lunes y hace mucho calor en Sevilla. La temperatura es de treinta y cinco grados. Por la tarde hay viento. Mañana llueve y hace menos calor.",
    listen: [
      [
        "What is today’s temperature?",
        "35 degrees.",
        "25 degrees.",
        "15 degrees.",
        "Treinta y cinco is 35. Veinticinco is 25; quince is 15.",
      ],
      [
        "What is tomorrow’s weather?",
        "Rainy.",
        "Snowy.",
        "Hotter than today.",
        "Mañana llueve means it rains tomorrow. Hace menos calor indicates lower heat.",
      ],
    ],
    sentence: "Tengo sed y quiero un vaso de agua",
    translate: ["Say “Today it is cold.”", "Hoy hace frío."],
    writing:
      "Write a message to a friend who wants to visit. Describe today’s weather, say how you feel, suggest something to do and a time to meet. Include a greeting and farewell.",
    model:
      "Hola, Sara. Hoy hace mucho sol y calor en mi ciudad. Estoy contenta porque no trabajo. ¿Quieres ir al parque conmigo? Podemos quedar a las cinco y tomar un zumo en el café. Un abrazo.",
    checks: [
      "I described the weather and how I feel.",
      "I suggested an activity and meeting time.",
      "I used weather and state expressions appropriately.",
    ],
    speaking:
      "Describe today’s weather and your favorite season. Say how you feel and what you need. Ask the interviewer about their favorite season and today’s weather in their city.",
    speech:
      "Hoy hace sol y tengo calor. Quiero un vaso de agua. Me gusta el verano porque puedo nadar. Estoy contento. ¿Cuál es tu estación favorita? ¿Qué tiempo hace en tu ciudad?",
    speechChecks: [
      "I described weather, a feeling and a need.",
      "I explained my favorite season simply.",
      "I asked two questions.",
    ],
  },
  {
    title: "Ready for your next chapter",
    spanish: "¡Tú puedes!",
    subtitle: "Bring it all together. Walk in with confidence.",
    icon: "flag",
    color: "sage",
    goals: [
      "Complete exam-style personal exchanges",
      "Apply grammar, spelling and reading strategies",
      "Use clarification and check every task point",
    ],
    tip: "Answer the information requested, not just a familiar word. Read the whole message: times, negation and who does what often matter.",
    example: "Perdón, no entiendo. ¿Puedes hablar más despacio?",
    words: [
      ["escuchar", "to listen", "🎧"],
      ["escribir", "to write", "✍️"],
      ["hablar", "to speak", "💬"],
      ["la pregunta", "question", "❓"],
      ["la respuesta", "answer", "💡"],
      ["despacio", "slowly", "🐢"],
      ["entender", "to understand", "🧠"],
      ["repetir", "to repeat", "🔁"],
    ],
    grammar: [
      [
        "Which has the correct question accents?",
        "¿Dónde vives?",
        "¿Donde vives?",
        "¿Dondé vives?",
        "The question word dónde has an accent on ó. Spanish also uses an opening question mark.",
      ],
      [
        "Soy profesora y ___ en Madrid.",
        "vivo",
        "vive",
        "vivimos",
        "The implied subject is yo from soy. Yo takes vivo; vive is he/she and vivimos is we.",
      ],
      [
        "Tengo dos hermanas. ___ hermanas son altas.",
        "Mis",
        "Mi",
        "Mis altas",
        "Mis agrees with plural hermanas and belongs before the noun. The description altas follows son here.",
      ],
      [
        "You did not hear the question. Choose the best response.",
        "¿Puedes repetir, por favor?",
        "No me gusta.",
        "Hasta el lunes.",
        "A request for repetition keeps the conversation going. The other responses do not resolve the misunderstanding.",
      ],
      [
        "Choose the correctly written sentence.",
        "Mi madre tiene treinta años.",
        "Mi madre es treinta años.",
        "Mi madre tiene treinta anos.",
        "Age uses tener. The letter ñ in años is essential; anos is a different word.",
      ],
      [
        "A message says “No puedo ir el lunes. ¿El martes?” When is the proposed meeting?",
        "Tuesday.",
        "Monday.",
        "Sunday.",
        "The speaker rejects Monday with no puedo and proposes el martes, Tuesday.",
        "No puedo ir el lunes. ¿El martes?",
      ],
    ],
    reading:
      "Hola, Pablo. Soy Elena, tu nueva compañera de español. Soy italiana, tengo veintisiete años y trabajo en un hotel. Las clases son los lunes y miércoles a las seis. Esta semana no puedo ir el lunes porque trabajo. ¿Podemos estudiar el martes en la biblioteca a las cinco? Saludos, Elena.",
    read: [
      [
        "Why can Elena not attend on Monday?",
        "She works.",
        "The library is closed.",
        "She is on holiday.",
        "Porque trabajo gives the reason. Do not confuse the regular class schedule with her proposed study meeting.",
      ],
      [
        "When does she propose studying together?",
        "Tuesday at five.",
        "Monday at six.",
        "Wednesday at six.",
        "El martes… a las cinco is the proposal. Monday and Wednesday at six are regular class times.",
      ],
    ],
    audio:
      "Buenos días. La prueba empieza a las nueve. Primero, escriba su nombre y sus apellidos. Después, lea las preguntas. Si necesita ayuda, pregunte al profesor. Los teléfonos deben estar apagados.",
    listen: [
      [
        "What should you write first?",
        "Your name and surnames.",
        "Your phone number.",
        "Your answers.",
        "Primero, escriba su nombre y sus apellidos gives the first step.",
      ],
      [
        "What should happen to phones?",
        "They must be switched off.",
        "They should play audio.",
        "They should be on the desk.",
        "Apagados means switched off. The message gives no instruction to use them.",
      ],
    ],
    sentence: "Estudio español porque quiero viajar a España",
    translate: ["Say “Can you speak more slowly?”", "¿Puedes hablar más despacio?"],
    writing:
      "Reply to a new Spanish classmate. Greet them, introduce yourself, say why you study Spanish, and propose a place and time to study together. End appropriately.",
    model:
      "Hola, Elena. Me llamo Pablo y soy polaco. Vivo en Madrid y trabajo en una tienda. Estudio español porque quiero hablar con mis amigos. Podemos estudiar el martes a las cinco en la biblioteca. Un saludo.",
    checks: [
      "I answered every requested point.",
      "I used clear basic sentences and checked accents.",
      "I included a greeting, place, time and farewell.",
    ],
    speaking:
      "Rehearse the exam: introduce yourself (1–2 minutes); describe your studies, work or home (2–3 minutes); answer follow-up questions and ask two questions about the same topic (3–4 minutes).",
    speech:
      "Me llamo Pablo. Soy polaco y vivo en Madrid. Trabajo en una tienda. Estudio español los lunes. Mi clase es pequeña y mi profesora es simpática. ¿Dónde trabajas? ¿Qué lenguas hablas?",
    speechChecks: [
      "I practised all three tasks and covered the prompts.",
      "I could answer questions and ask two of my own.",
      "I stayed understandable and requested repetition if needed.",
    ],
  },
];
const rotate = <T>(items: T[], n: number) => [
  ...items.slice(n % items.length),
  ...items.slice(0, n % items.length),
];
export const units: Unit[] = seeds.map((s, ui) => {
  const uid = `u${ui + 1}`;
  const vocab: Question[] = s.words.map((w, i) => {
    const options = rotate([w[1], s.words[(i + 2) % 8][1], s.words[(i + 5) % 8][1]], (ui + i) % 3);
    return {
      id: `${uid}-v${i}`,
      kind: i % 2 ? "listen" : "choice",
      skill: i % 2 ? "listening" : "reading",
      prompt:
        i % 2 ? "Listen. What does the Spanish word or phrase mean?" : `What does “${w[0]}” mean?`,
      answer: w[1],
      options,
      visual: i % 2 ? undefined : w[2],
      audio: i % 2 ? w[0] : undefined,
      pronunciation: w[0],
      explanation: `“${w[0]}” means “${w[1]}”.`,
      memoryHint: vocabularyHints[w[0]],
    };
  });
  const grammar: Question[] = s.grammar.map((g, i) => ({
    id: `${uid}-g${i}`,
    kind: "choice",
    skill: "reading",
    prompt: g[0],
    answer: g[1],
    pronunciation:
      g[5] ||
      (g[0].includes("___") ? g[0].replace("___", g[1]).replace(/\s*\([^)]*\)/g, "") : g[1]),
    options: rotate(g.slice(1, 4), (ui + i + 1) % 3),
    explanation: g[4],
  }));
  const real: Question[] = [
    ...s.read.map((r, i) => ({
      id: `${uid}-r${i}`,
      kind: "choice" as const,
      skill: "reading" as Skill,
      prompt: r[0],
      passage: s.reading,
      pronunciation: r[5],
      answer: r[1],
      options: rotate(r.slice(1, 4), (ui + i) % 3),
      explanation: r[4],
      image: ui === 5 ? "cafe" : ui === 6 ? "town" : ui === 9 ? "train" : undefined,
    })),
    ...s.listen.map((r, i) => ({
      id: `${uid}-a${i}`,
      kind: "listen" as const,
      skill: "listening" as Skill,
      prompt: r[0],
      audio: s.audio,
      answer: r[1],
      options: rotate(r.slice(1, 4), (ui + i + 2) % 3),
      explanation: r[4],
    })),
  ];
  const output: Question[] = [
    {
      id: `${uid}-o0`,
      kind: "order",
      skill: "writing",
      prompt: "Build the Spanish sentence. Tap words in order.",
      answer: s.sentence,
      tokens: rotate(s.sentence.split(" "), Math.ceil(s.sentence.split(" ").length / 2)),
      explanation: `The sentence is “${s.sentence}”. ${s.tip}`,
    },
    {
      id: `${uid}-o1`,
      kind: "type",
      skill: "writing",
      prompt: s.translate[0],
      answer: s.translate[1],
      accepted: [
        ["Yo soy de Polonia."],
        ["Mi nombre es Carlos.", "Yo me llamo Carlos."],
        ["Yo tengo dos hermanos."],
        [],
        ["Nosotros estudiamos español.", "Nosotras estudiamos español."],
        [],
        ["¿Dónde se encuentra la estación?"],
        ["¿Se puede pagar con tarjeta?"],
        ["A mí no me gusta el fútbol."],
        ["Quiero un billete a Madrid, por favor."],
        ["Hace frío hoy."],
        [
          "¿Puede hablar más despacio?",
          "¿Puedes hablar más lentamente?",
          "¿Puede hablar más lentamente?",
        ],
      ][ui],
      explanation: `One correct answer is “${s.translate[1]}”. ${s.tip} Capitalization and punctuation are flexible here; accents and ñ matter.`,
    },
    {
      id: `${uid}-o2`,
      kind: "write",
      skill: "writing",
      prompt: s.writing,
      answer: s.model,
      explanation:
        "Compare your text with the model and review each requested point. Different answers can be valid. The checklist and word count are practice feedback, not an examiner grade.",
      checklist: s.checks,
      minWords: 30,
      maxWords: 40,
    },
    {
      id: `${uid}-o3`,
      kind: "speak",
      skill: "speaking",
      prompt: s.speaking,
      answer: s.speech,
      explanation:
        "Replay your recording and review the checklist. The model is a short starting example, not a full timed response. Add your own details. Pronunciation and communication need human judgment; no automatic score is assigned.",
      checklist: s.speechChecks,
    },
  ];
  return {
    id: uid,
    title: s.title,
    spanish: s.spanish,
    subtitle: s.subtitle,
    icon: s.icon,
    color: s.color,
    goals: s.goals,
    tip: s.tip,
    example: s.example,
    lessons: [
      {
        id: `${uid}-words`,
        title: "Words to take with you",
        subtitle: "Discover vocabulary · listen & choose",
        minutes: 4,
        icon: "spark",
        questions: vocab,
      },
      {
        id: `${uid}-patterns`,
        title: "Make the words work",
        subtitle: "Understand patterns · guided grammar",
        minutes: 4,
        icon: "layers",
        questions: grammar,
      },
      {
        id: `${uid}-life`,
        title: "A little real life",
        subtitle: "Read & listen · everyday situations",
        minutes: 5,
        icon: "headphones",
        questions: real,
      },
      {
        id: `${uid}-voice`,
        title: "Make it your own",
        subtitle: "Build, write & speak · your turn",
        minutes: 8,
        icon: "mic",
        questions: output,
      },
    ],
  };
});
export const allLessons = units.flatMap((u) => u.lessons);
export const allQuestions = allLessons.flatMap((l) => l.questions);
export const vocabulary = seeds.flatMap((s, ui) =>
  s.words.map((w) => ({
    es: w[0],
    en: w[1],
    visual: w[2],
    unit: ui + 1,
    memoryHint: vocabularyHints[w[0]],
  })),
);
export const foundations: Question[] = [
  [
    "The letter h in hola is…",
    "silent.",
    "pronounced like English h.",
    "the same sound as j.",
    "Spanish h is silent in ordinary words such as hola.",
    "hola",
  ],
  [
    "“Mañana” contains which distinct Spanish letter?",
    "ñ",
    "n",
    "ḿ",
    "Ñ is a distinct letter. Keep its tilde: mañana means tomorrow / morning.",
    "mañana",
  ],
  ["How is 100 written?", "cien", "diez", "mil", "Cien is 100. Diez is 10 and mil is 1,000."],
  [
    "How is 200 written before personas?",
    "doscientas personas",
    "doscientos personas",
    "dos personas",
    "Hundreds from 200 agree with the noun: doscientas personas but doscientos euros.",
  ],
  [
    "“Décimo” means…",
    "tenth.",
    "second.",
    "first.",
    "Décimo is tenth; segundo is second and primero is first.",
    "décimo",
  ],
  [
    "Which comes after agosto?",
    "septiembre",
    "julio",
    "enero",
    "Septiembre follows agosto. Julio comes before agosto; enero is January.",
  ],
  [
    "Choose “our female friends”.",
    "nuestras amigas",
    "nuestros amigas",
    "nuestra amigas",
    "The possessive agrees with the feminine plural noun: nuestras amigas.",
  ],
  [
    "Vosotros ___ españoles.",
    "sois",
    "somos",
    "son",
    "Vosotros takes sois. Somos belongs to nosotros; son to ellos/ellas/ustedes.",
  ],
  [
    "Ustedes ___ estudiantes.",
    "son",
    "sois",
    "eres",
    "Ustedes uses third-person plural agreement: son. In much of Latin America it is the everyday plural you.",
  ],
  [
    "Choose “those houses over there” (far from both speakers).",
    "aquellas casas",
    "esta casa",
    "estos casas",
    "Aquellas agrees with feminine plural casas and points to something distant.",
  ],
  [
    "¿Qué es ___? (an unidentified thing nearby)",
    "esto",
    "este",
    "esta",
    "Neuter esto points to an unidentified thing without a named noun.",
  ],
  [
    "Choose the correct negative sentence.",
    "No hablo francés.",
    "Hablo no francés.",
    "No hablar francés.",
    "Normally put no before the conjugated verb. Hablo is I speak; hablar is the infinitive.",
  ],
  [
    "The plural of “el papel” is…",
    "los papeles",
    "los papels",
    "las papeles",
    "Consonant-ending nouns usually add -es. Papel is masculine, so its article becomes los.",
  ],
  [
    "Which asks “Who is she?”",
    "¿Quién es ella?",
    "¿Dónde es ella?",
    "¿Cuánto es ella?",
    "Quién asks who; dónde asks where; cuánto asks how much.",
  ],
  [
    "Complete: Hay ___ libros. (many)",
    "muchos",
    "mucho",
    "muy",
    "Muchos agrees with masculine plural libros. Muy modifies adjectives or adverbs.",
  ],
  [
    "Complete: La casa es ___ pequeña. (very)",
    "muy",
    "muchas",
    "muchos",
    "Muy modifies an adjective: muy pequeña. Mucho varies when quantifying nouns.",
  ],
  [
    "“¿Por qué estudias?” asks for…",
    "a reason.",
    "a location.",
    "a quantity.",
    "Por qué asks why. A response can begin with porque, because.",
    "¿Por qué estudias?",
  ],
  [
    "Which spelling is correct for “Spanish” in an ordinary sentence?",
    "español",
    "Español",
    "espanol",
    "Language names normally use lowercase in Spanish, and español needs ñ.",
  ],
  [
    "Which month is “enero”?",
    "January.",
    "June.",
    "September.",
    "Enero is January, junio is June and septiembre is September.",
    "enero",
  ],
  [
    "“Mil quinientos” is…",
    "1,500",
    "150",
    "15,000",
    "Mil is 1,000 and quinientos is 500. Together they make 1,500.",
    "Mil quinientos.",
  ],
  [
    "Complete: Tú ___ agua.",
    "bebes",
    "bebe",
    "bebemos",
    "For regular -er verbs, tú uses -es: bebes.",
  ],
  [
    "Complete: Ellas ___ en Madrid.",
    "viven",
    "vivimos",
    "vive",
    "Ellas uses the third-person plural -en ending: viven.",
  ],
  [
    "Which phrase asks the meaning of a word?",
    "¿Qué significa “billete”?",
    "¿Cuánto cuesta el billete?",
    "Quiero un billete.",
    "Qué significa asks what something means. Cuánto cuesta asks its price.",
  ],
  [
    "“También” is stressed on…",
    "the final syllable: bién.",
    "the first syllable: tam.",
    "both syllables equally.",
    "The written accent tells you where to stress también. Spanish vowels keep relatively stable sounds.",
    "también",
  ],
].map((r, i) => ({
  id: `foundation-${i}`,
  kind: "choice",
  skill: "reading",
  prompt: r[0],
  answer: r[1],
  pronunciation:
    r[5] ||
    (r[0].includes("___")
      ? r[0]
          .replace("___", r[1])
          .replace(/^Complete: /, "")
          .replace(/\s*\([^)]*\)/g, "")
      : r[1]),
  options: rotate(r.slice(1, 4), i % 3),
  explanation: r[4],
}));
export const visualQuestions: Question[] = [
  {
    id: "visual-cafe-1",
    kind: "choice",
    skill: "reading",
    image: "cafe",
    prompt: "Look at the café illustration. ¿Qué hay sobre la mesa?",
    answer: "Un café y pan.",
    options: ["Un teléfono y libros.", "Un café y pan.", "Un billete y una maleta."],
    explanation:
      "The illustration shows a coffee cup on the left of the table and bread on a plate to the right. Hay introduces things you can see: hay un café y pan.",
  },
  {
    id: "visual-cafe-2",
    kind: "choice",
    skill: "reading",
    image: "cafe",
    prompt: "Look at the café illustration. ¿Dónde está el árbol?",
    answer: "A la derecha del café.",
    options: ["A la derecha del café.", "Dentro del café.", "A la izquierda del café."],
    explanation:
      "The tree is drawn on the right side of the café. A la derecha means to the right; a la izquierda means to the left; dentro means inside.",
  },
  {
    id: "visual-town-1",
    kind: "choice",
    skill: "reading",
    image: "town",
    prompt: "Use the neighborhood illustration. ¿Qué edificio está a la izquierda del banco?",
    answer: "La farmacia.",
    options: ["La estación.", "El hotel.", "La farmacia."],
    explanation:
      "The building labeled FARMACIA is left of the central BANCO. The station is on the right. Use estar when locating an identified building.",
  },
  {
    id: "visual-town-2",
    kind: "choice",
    skill: "reading",
    image: "town",
    prompt: "Use the neighborhood illustration. ¿Dónde está la estación?",
    answer: "A la derecha del banco.",
    options: ["A la izquierda del banco.", "A la derecha del banco.", "Dentro de la farmacia."],
    explanation:
      "The ESTACIÓN building appears to the right of BANCO. De + el contracts to del in a la derecha del banco.",
  },
  {
    id: "visual-train-1",
    kind: "choice",
    skill: "reading",
    image: "train",
    prompt: "Look at the picture. ¿Qué medio de transporte ves?",
    answer: "Un tren.",
    options: ["Un avión.", "Un autobús.", "Un tren."],
    explanation:
      "The vehicle has a long railway carriage and sits on rails: it is un tren. An avión flies and an autobús travels on roads.",
  },
  {
    id: "visual-train-2",
    kind: "choice",
    skill: "reading",
    image: "train",
    prompt: "Read the station sign in the picture. ¿Qué ciudad aparece?",
    answer: "Sevilla.",
    options: ["Sevilla.", "Madrid.", "Valencia."],
    explanation:
      "The green sign at the upper left reads SEVILLA. Reading short signs and picking out place names is a useful A1 skill.",
  },
];
