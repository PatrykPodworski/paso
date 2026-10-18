import type { TaskSpec } from "./base.ts";

export const u8: TaskSpec = {
  id: "u8",
  mode: "interview",
  scenario:
    "Eres dependienta en una tienda de ropa de España y el estudiante es tu cliente. Si el estudiante pregunta el precio, responde con un precio sencillo, por ejemplo «Cuesta veinte euros». Si pregunta si puede pagar con tarjeta, di «Sí, claro». Si te da las gracias, responde «De nada».",
  asks: [
    "Buenos días. ¿Qué buscas?",
    "¿De qué color y de qué talla?",
    "Aquí tienes. ¿Algo más?",
    "¿Qué colores te gustan?",
  ],
  items: [
    { id: "garment", label: "Garment asked for", example: "Quiero una camisa, por favor" },
    { id: "colorSize", label: "Color and size", example: "Azul, talla mediana" },
    { id: "price", label: "Asked the price", example: "¿Cuánto cuesta?" },
    { id: "card", label: "Asked to pay by card", example: "¿Puedo pagar con tarjeta?" },
    {
      id: "colors",
      label: "Colors they like",
      example: "Me gusta el azul, pero no me gusta el rojo",
    },
  ],
  asked:
    "The examiner, a shop assistant in a clothes shop, served the learner as a customer and asked for five things: the garment the learner wants, its color and size, a question about the price, a question about paying by card, and which colors the learner likes. The price and the card count only when the learner asks the examiner, not when the examiner offers them.",
  flawed: "Quiero un camisa azul",
  limitSeconds: 180,
};
