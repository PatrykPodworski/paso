import type { TaskSpec } from "./base.ts";

export const u6: TaskSpec = {
  id: "u6",
  mode: "interview",
  scenario:
    "You are a waitress in a café in Spain and the learner is your customer. If the learner asks the price, answer with a simple price, for example «Son cinco euros». If they ask for the bill, say «Aquí tienes la cuenta» and the total. If they thank you, answer «De nada».",
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
