import type { TaskSpec } from "./base.ts";

export const u10: TaskSpec = {
  id: "u10",
  mode: "interview",
  scenario:
    "You are first a ticket clerk at a train station in Spain and then a hotel receptionist, and the learner is your customer. When the learner asks you what time the train leaves and how much the ticket costs, answer each question with a short sentence, for example «El tren sale a las diez» and «Cuesta quince euros». If they thank you, answer «De nada».",
  asks: [
    "Buenos días. ¿Adónde quieres viajar?",
    "Aquí tienes el billete. Ahora, pregúntame a qué hora sale el tren y cuánto cuesta.",
    "Ahora estás en el hotel. Buenas tardes. ¿Qué quieres?",
    "¿Para cuántas personas y cuántas noches?",
  ],
  items: [
    { id: "ticket", label: "Ticket asked for", example: "Un billete a Madrid, por favor" },
    { id: "departure", label: "Asked the departure time", example: "¿A qué hora sale el tren?" },
    { id: "price", label: "Asked the price", example: "¿Cuánto cuesta?" },
    {
      id: "room",
      label: "Room for two, three nights",
      example: "Una habitación para dos personas, para tres noches",
    },
  ],
  asked:
    "The examiner, first a ticket clerk at a train station and then a hotel receptionist, served the learner as a customer and asked for four things: a ticket to a destination, a question about the departure time, a question about the price, and a room for two people for three nights. The departure time and the price count only when the learner asks the examiner, not when the examiner gives them unasked, and the room only when the learner says both two people and three nights.",
  flawed: "Quiero un habitación para dos persona",
  limitSeconds: 180,
};
