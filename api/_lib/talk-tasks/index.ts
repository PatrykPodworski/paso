import {
  farewell,
  greetingStart,
  persona,
  policies,
  rubricEnd,
  rubricFrame,
  TOPICS,
  type Ask,
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
const LEVELS = ["correct", "understandable", "missing"];

const lineOf = (ask: Ask) =>
  typeof ask === "string"
    ? ask
    : `The learner asks this. Do not ask it yourself, do not answer it before they ask, and do not say it as an instruction: ${ask.learner} If they do not ask it, give one short hint for this point only.`;

const numbered = (asks: readonly Ask[]) => asks.map((ask, i) => `${i + 1}. ${lineOf(ask)}`);

// The Spanish Lucía may say for one point. A note's question is the part inside «».
export const linesOf = (task: TaskSpec) =>
  task.asks.flatMap((ask) => {
    if (typeof ask !== "string") {
      return [];
    }

    const quoted = [...ask.matchAll(/«([^»]*)»/g)].map((match) => match[1]);

    return quoted.length > 0 ? quoted : [ask];
  });

// "a, b and c"
const join = (words: string[], last: string) =>
  words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} ${last} ${words.at(-1)}`;

const quoted = (words: string[]) => words.map((w) => `"${w}"`);

const noPraise =
  "Do not use «Muy bien». If you acknowledge an answer, vary a short reaction such as «Ah», «Vale» or «Gracias», or say nothing and continue. Do not praise every turn. An acknowledgement is not a correction and not a grade.";

const answerFirst =
  "If the learner asks you a question, or repairs what they said, answer that first in one short sentence. Do not ask your next question and do not say goodbye until you have answered.";

const acknowledgement = [
  noPraise,
  "Do not correct mistakes, do not explain anything and do not leave the points above.",
  "Remember every detail the learner has already given. Skip a detail they already gave. Each turn asks for one detail that is still missing, including another missing detail of the same point.",
  answerFirst,
];

const practiceInterview = (task: TaskSpec) => [
  "Cover every point below, in order. This is a conversation, not a checklist.",
  "Ask one short question per turn. Never ask two questions in the same turn.",
  "Where a point puts a question in «», the words outside «» are for you, not a line to speak. The question inside «» is an example: ask one short question for the missing detail, of that kind.",
  ...numbered(task.asks),
  ...acknowledgement,
  "Do not say «Ahora, pregúntame…», «Ahora, hazme…» or «Ahora, invítame…». Do not read the points aloud as instructions. One hint is one short question about one missing point, never a list.",
  "Stay in your role. If the learner says goodbye or clearly ends the exchange, answer a thank-you if they gave one, then close. A goodbye ends the talk even if a point is still open. Do not ask another question, do not greet them again and do not restart the scene.",
  "If the learner does not answer, or you do not understand, repeat that same question once, more slowly, and then move on.",
  `When every point is covered, or the learner has ended the talk, ${farewell}`,
];

const examInterview = (task: TaskSpec) => [
  `Ask exactly these ${COUNTS[task.asks.length - 1]} questions, one at a time and in this order. Say each line as it is written. One line is one turn.`,
  ...numbered(task.asks),
  noPraise,
  "Do not correct mistakes, do not explain anything and do not add a question that is not in the list.",
  "Remember what the learner has already said. If a later line is already answered, do not ask it again.",
  answerFirst,
  "If the learner says goodbye or clearly ends the exchange, do not restart and do not go back to an earlier line. Close.",
  "If the learner does not answer, or you do not understand, repeat that same line once, more slowly, and then move on.",
  `When the lines are done, or the learner has ended the talk, ${farewell}`,
];

const monologue = (task: TaskSpec) => [
  "The learner speaks alone. Give them the task in these words, in this order, and then listen without interrupting:",
  ...numbered(task.asks),
  "Do not ask follow-up questions, do not correct mistakes, do not explain anything and do not talk about other topics.",
  "Say the task once. Do not use «Muy bien». An acknowledgement is not a correction and not a grade. If the learner says goodbye, close and do not give the task again.",
  "If the learner asks you a question when they finish, answer it in one short sentence before goodbye.",
  `Only if the learner is silent for more than ten seconds, encourage them once with a short question about a point they have not mentioned yet,${task.nudge ? ` for example «${task.nudge}»,` : ""} and then listen again.`,
  `When the learner finishes, ${farewell}`,
];

export const instructionsOf = (task: TaskSpec) =>
  [
    ...persona,
    ...(task.scenario ? [task.scenario] : []),
    ...(task.mode === "interview"
      ? task.examScript
        ? examInterview(task)
        : practiceInterview(task)
      : monologue(task)),
    ...policies,
  ].join("\n");

export const greetingOf = (task: TaskSpec) => {
  const opening = task.asks[0];

  if (typeof opening !== "string" || opening.includes("«")) {
    throw new Error(`Task ${task.id} must open with one spoken line`);
  }

  return `${greetingStart} Then ${task.mode === "interview" ? "ask" : "say"} «${opening}» and listen.`;
};

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
