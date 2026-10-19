import {
  farewell,
  greetingStart,
  persona,
  policies,
  rubricEnd,
  rubricFrame,
  type TaskSpec,
} from "./base.ts";
import { u1 } from "./u1.ts";
import { u2 } from "./u2.ts";
import { u3 } from "./u3.ts";
import { u4 } from "./u4.ts";
import { u5 } from "./u5.ts";
import { u6 } from "./u6.ts";
import { u7 } from "./u7.ts";
import { u8 } from "./u8.ts";
import { u9 } from "./u9.ts";
import { u10 } from "./u10.ts";
import { u11 } from "./u11.ts";
import { u12 } from "./u12.ts";

const TASKS = new Map<string, TaskSpec>(
  [u1, u2, u3, u4, u5, u6, u7, u8, u9, u10, u11, u12].map((task) => [task.id, task]),
);

export const tasks = [...TASKS.values()];

export const taskOf = (id: unknown) => (typeof id === "string" ? TASKS.get(id) : undefined);

const COUNTS = ["una", "dos", "tres", "cuatro", "cinco", "seis"];
const ORDINALS = ["primera", "segunda", "tercera", "cuarta", "quinta", "sexta"];
const LEVELS = ["correct", "understandable", "missing"];

const numbered = (asks: string[]) => asks.map((ask, i) => `${i + 1}. ${ask}`);

// "a, b and c"
const join = (words: string[], last: string) =>
  words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} ${last} ${words.at(-1)}`;

const quoted = (words: string[]) => words.map((w) => `"${w}"`);

const interview = (task: TaskSpec) => [
  `Haz exactamente estas ${COUNTS[task.asks.length - 1]} preguntas, una cada vez y en este orden:`,
  ...numbered(task.asks),
  "Después de cada respuesta di solo «Muy bien» o «Gracias» y haz la pregunta siguiente. No hagas preguntas de seguimiento, no corrijas errores, no expliques nada y no hables de otros temas.",
  "Si el estudiante no responde o no entiendes la respuesta, repite la misma pregunta una vez, más despacio, y después pasa a la siguiente.",
  `Después de la ${ORDINALS[task.asks.length - 1]} respuesta, ${farewell}`,
];

const monologue = (task: TaskSpec) => [
  "El estudiante habla solo. Dile la tarea con estas palabras, en este orden, y después escucha sin interrumpir:",
  ...numbered(task.asks),
  "No hagas preguntas de seguimiento, no corrijas errores, no expliques nada y no hables de otros temas.",
  "Solo si el estudiante calla durante más de diez segundos, anímale con una frase corta, por ejemplo «Sigue, por favor».",
  `Cuando el estudiante termine, ${farewell}`,
];

export const instructionsOf = (task: TaskSpec) =>
  [
    ...persona,
    ...(task.scenario ? [task.scenario] : []),
    ...(task.mode === "interview" ? interview(task) : monologue(task)),
    ...policies,
  ].join("\n");

export const greetingOf = (task: TaskSpec) =>
  `${greetingStart} Después ${task.mode === "interview" ? "pregunta" : "di"} «${task.asks[0]}» y escucha.`;

export const rubricOf = (task: TaskSpec) => {
  const [frame, turns] = rubricFrame[task.mode];

  return [
    frame,
    task.asked,
    turns,
    `For each of ${join(
      task.items.map((i) => i.id),
      "and",
    )}, return one of:`,
    `- "correct": the learner gave it in Spanish without grammar or vocabulary errors. A short answer such as ${join(quoted(task.items.map((i) => i.example)), "or")} is correct.`,
    `- "understandable": the learner gave it in Spanish an examiner would understand, but with errors, for example "${task.flawed}".`,
    '- "missing": the learner did not give it, gave it in another language, or the Spanish cannot be understood.',
    ...rubricEnd,
  ].join("\n");
};

export const schemaOf = (task: TaskSpec) => ({
  type: "object",
  properties: Object.fromEntries(
    task.items.map((item) => [item.id, { type: "string", enum: LEVELS }]),
  ),
  required: task.items.map((item) => item.id),
  additionalProperties: false,
});
