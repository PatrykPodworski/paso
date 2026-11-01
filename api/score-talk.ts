import type { LiveItem, LiveScore, TalkTurn } from "../src/data/types.ts";
import { correctionsSchema, isCorrections, keptCorrections } from "./_lib/corrections.js";
import { json } from "./_lib/limits.js";
import { reserve } from "./_lib/reserve.js";
import type { TaskSpec } from "./_lib/talk-tasks/base.js";
import { rubricOf, schemaOf, taskOf } from "./_lib/talk-tasks/index.js";

const MAX_CHARACTERS = 4000;
const MAX_FRAGMENTS = 1000;
const LEVELS: LiveItem[] = ["correct", "understandable", "missing"];

const gradeOf = (items: LiveScore["items"]): LiveScore["grade"] => {
  const levels = items.map((item) => item.level);

  if (levels.includes("missing")) {
    return "bad";
  }

  return levels.every((level) => level === "correct") ? "perfect" : "good";
};

const itemsOf = (task: TaskSpec, levelOf: (id: string) => LiveItem): LiveScore["items"] =>
  task.items.map(({ id, label }) => ({ id, label, level: levelOf(id) }));

// Joins consecutive fragments from one speaker, so a transcript split into many short
// turns still reads as a conversation.
const joinTurns = (turns: TalkTurn[]) => {
  const joined: TalkTurn[] = [];

  for (const t of turns) {
    const last = joined.at(-1);

    if (last?.role === t.role) {
      last.text = `${last.text} ${t.text.trim()}`;
    } else {
      joined.push({ role: t.role, text: t.text.trim() });
    }
  }

  return joined;
};

const parseTurns = (turns: unknown): TalkTurn[] | null => {
  if (!Array.isArray(turns) || turns.length > MAX_FRAGMENTS) {
    return null;
  }

  const valid = turns.every(
    (t) => (t?.role === "examiner" || t?.role === "student") && typeof t.text === "string",
  );

  return valid && turns.reduce((n, t) => n + t.text.length, 0) <= MAX_CHARACTERS
    ? joinTurns(turns)
    : null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

// The text of the model's message in a Responses API envelope, or undefined when the
// envelope has another shape.
const modelText = (data: unknown) => {
  if (!isRecord(data) || !Array.isArray(data.output)) {
    return undefined;
  }

  const message: unknown = data.output.find((o: unknown) => isRecord(o) && o.type === "message");

  if (!isRecord(message) || !Array.isArray(message.content)) {
    return undefined;
  }

  const part: unknown = message.content.find(
    (c: unknown) => isRecord(c) && c.type === "output_text",
  );

  return isRecord(part) && typeof part.text === "string" ? part.text : undefined;
};

const modelSchemaOf = (task: TaskSpec) => ({
  type: "object",
  properties: { levels: schemaOf(task), corrections: correctionsSchema },
  required: ["levels", "corrections"],
  additionalProperties: false,
});

// Null when the output breaks the schema, so a talk is never scored without its corrections.
const modelScore = (task: TaskSpec, data: unknown) => {
  try {
    const { levels, corrections } = JSON.parse(modelText(data) ?? "");

    return isRecord(levels) &&
      task.items.every((item) => LEVELS.includes(levels[item.id] as LiveItem)) &&
      isCorrections(corrections)
      ? {
          items: itemsOf(task, (id) => levels[id] as LiveItem),
          corrections: keptCorrections(corrections),
        }
      : null;
  } catch {
    return null;
  }
};

// Returns null on any failure, so the caller has one path that refunds the score.
const scoreTurns = async (key: string, task: TaskSpec, turns: TalkTurn[]) => {
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        reasoning: { effort: "low" },
        store: false,
        instructions: rubricOf(task),
        input: turns
          .map((t) => `${t.role === "student" ? "Student" : "Examiner"}: ${t.text}`)
          .join("\n"),
        text: {
          format: {
            type: "json_schema",
            name: "talk_score",
            strict: true,
            schema: modelSchemaOf(task),
          },
        },
      }),
    });

    const scored = response.ok ? modelScore(task, await response.json()) : null;

    if (!scored) {
      console.error("Talk scoring failed", response.status);
    }

    return scored;
  } catch (error) {
    console.error("Talk scoring failed", error);

    return null;
  }
};

export const POST = async (request: Request) => {
  const body = (await request.json().catch(() => ({}))) as {
    turns?: unknown;
    task?: unknown;
    passcode?: unknown;
  };

  const passcode = typeof body.passcode === "string" ? body.passcode : undefined;
  const task = taskOf(body.task);
  const turns = parseTurns(body.turns);
  const key = process.env.OPENAI_API_KEY;

  if (!turns) {
    return json({ error: "transcript" }, 400);
  }

  if (!task) {
    return json({ error: "task" }, 400);
  }

  if (!turns.some((t) => t.role === "student" && t.text.trim())) {
    return json({ grade: "bad", items: itemsOf(task, () => "missing") }, 200);
  }

  if (!key) {
    return json({ error: "unavailable" }, 503);
  }

  const reserved = await reserve(request, passcode, "score");

  if (reserved.refusal) {
    return reserved.refusal;
  }

  const scored = await scoreTurns(key, task, turns);

  if (!scored) {
    await reserved.refund();

    return json({ error: "upstream" }, 502);
  }

  const score: LiveScore = { grade: gradeOf(scored.items), ...scored };

  return json(score, 200);
};
