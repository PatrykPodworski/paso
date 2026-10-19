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

const TASKS = new Map<string, TaskSpec>(
  [u1, u2, u3, u4, u5, u6, u7, u8, u9, u10].map((task) => [task.id, task]),
);

export const tasks = [...TASKS.values()];

export const taskOf = (id: unknown) => (typeof id === "string" ? TASKS.get(id) : undefined);

const COUNTS = ["one", "two", "three", "four", "five", "six"];
const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth"];
const LEVELS = ["correct", "understandable", "missing"];

const numbered = (asks: string[]) => asks.map((ask, i) => `${i + 1}. ${ask}`);

// "a, b and c"
const join = (words: string[], last: string) =>
  words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} ${last} ${words.at(-1)}`;

const quoted = (words: string[]) => words.map((w) => `"${w}"`);

const interview = (task: TaskSpec) => [
  `Ask exactly these ${COUNTS[task.asks.length - 1]} questions, one at a time and in this order:`,
  ...numbered(task.asks),
  "After each answer say only «Muy bien» or «Gracias» and ask the next question. Do not ask follow-up questions, do not correct mistakes, do not explain anything and do not talk about other topics.",
  "If the learner does not answer or you do not understand the answer, repeat the same question once, more slowly, and then move on to the next one.",
  `After the ${ORDINALS[task.asks.length - 1]} answer, ${farewell}`,
];

const monologue = (task: TaskSpec) => [
  "The learner speaks alone. Give them the task in these words, in this order, and then listen without interrupting:",
  ...numbered(task.asks),
  "Do not ask follow-up questions, do not correct mistakes, do not explain anything and do not talk about other topics.",
  "Only if the learner is silent for more than ten seconds, encourage them with a short sentence, for example «Sigue, por favor».",
  `When the learner finishes, ${farewell}`,
];

export const instructionsOf = (task: TaskSpec) =>
  [
    ...persona,
    ...(task.scenario ? [task.scenario] : []),
    ...(task.mode === "interview" ? interview(task) : monologue(task)),
    ...policies,
  ].join("\n");

export const greetingOf = (task: TaskSpec) =>
  `${greetingStart} Then ${task.mode === "interview" ? "ask" : "say"} «${task.asks[0]}» and listen.`;

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
