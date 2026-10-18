import type { TaskSpec } from "./base.ts";

export const u1: TaskSpec = {
  id: "u1",
  mode: "interview",
  asks: ["¿Cómo te llamas?", "¿Cuántos años tienes?", "¿De dónde eres?"],
  items: [
    { id: "name", label: "Name", example: "Ana" },
    { id: "age", label: "Age", example: "Veinte años" },
    { id: "country", label: "Country", example: "De Polonia" },
  ],
  asked: "The examiner asked for three things: the learner's name, age and country of origin.",
  flawed: "Soy veinte años",
  limitSeconds: 120,
};
