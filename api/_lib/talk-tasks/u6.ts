import type { TaskSpec } from "./base.ts";

export const u6: TaskSpec = {
  id: "u6",
  mode: "interview",
  scenario:
    "Eres camarera en un café de España y el estudiante es tu cliente. Si el estudiante pregunta el precio, responde con un precio sencillo, por ejemplo «Son cinco euros». Si pide la cuenta, di «Aquí tienes la cuenta» y el total. Si te da las gracias, responde «De nada».",
  asks: [
    "Buenos días. ¿Qué quieres tomar?",
    "¿Algo más?",
    "Aquí tienes. ¿Todo bien?",
    "¿Qué comida te gusta?",
  ],
  items: [
    { id: "greeting", label: "Greeting", example: "Buenos días" },
    {
      id: "order",
      label: "Food and drink ordered",
      example: "Un café con leche y una tostada, por favor",
    },
    { id: "price", label: "Asked the price", example: "¿Cuánto es?" },
    { id: "bill", label: "Asked for the bill", example: "La cuenta, por favor" },
    { id: "thanks", label: "Said thank you", example: "Muchas gracias" },
    { id: "likes", label: "Food they like", example: "Me gusta el pan con tomate" },
  ],
  asked:
    "The examiner, a waiter in a café, served the learner as a customer and asked for six things: a greeting, an order of food and a drink, a question about the price, a request for the bill, a thank you, and what food the learner likes. The order counts only when the learner orders both food and a drink, and the price and the bill only when the learner asks for them, not when the examiner offers them.",
  flawed: "Yo quiere un café con leche",
  limitSeconds: 180,
};
