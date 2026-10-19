import {
  farewell,
  greetingStart,
  persona,
  policies,
  rubricEnd,
  rubricFrame,
  TOPICS,
  type TaskSpec,
  type Topic,
} from "./base.ts";
import { mockS1 } from "./mock-s1.ts";
import { mockS2 } from "./mock-s2.ts";
import { mockS3 } from "./mock-s3.ts";
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

// A task is one spec, or one spec per topic when the talk depends on the learner's pick.
type Listed = TaskSpec | Record<Topic, TaskSpec>;

const byTopic = (listed: Listed): listed is Record<Topic, TaskSpec> => !("id" in listed);

const isTopic = (topic: unknown): topic is Topic =>
  typeof topic === "string" && (TOPICS as readonly string[]).includes(topic);

const TASKS = new Map<string, Listed>([
  ...[u1, u2, u3, u4, u5, u6, u7, u8, u9, u10, u11, u12, mockS1].map((task): [string, Listed] => [
    task.id,
    task,
  ]),
  ["mock-s2", mockS2],
  ["mock-s3", mockS3],
]);

export const tasks = [...TASKS.values()].flatMap((listed) =>
  byTopic(listed) ? Object.values(listed) : [listed],
);

export const taskOf = (id: unknown, topic?: unknown) => {
  const listed = typeof id === "string" ? TASKS.get(id) : undefined;

  if (!listed || !byTopic(listed)) {
    return listed;
  }

  return isTopic(topic) ? listed[topic] : undefined;
};

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
  `Only if the learner is silent for more than ten seconds, encourage them once with a short question about a point they have not mentioned yet,${task.nudge ? ` for example «${task.nudge}»,` : ""} and then listen again.`,
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
