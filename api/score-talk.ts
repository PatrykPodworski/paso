import type { LiveItem, LiveScore, TalkTurn } from "../src/data/types.ts";
import { clientIp, FREE_SECONDS, give, json, take } from "./_lib/limits.js";
import { passcodeRefusal } from "./_lib/passcode.js";
import { rubric } from "./_lib/talk-rubric.js";

const MAX_CHARACTERS = 4000;
const MAX_FRAGMENTS = 1000;
const ITEMS = ["name", "age", "country"] as const;
const LEVELS: LiveItem[] = ["correct", "understandable", "missing"];

const schema = {
  type: "object",
  properties: Object.fromEntries(ITEMS.map((item) => [item, { type: "string", enum: LEVELS }])),
  required: ITEMS,
  additionalProperties: false,
};

const gradeOf = (items: LiveScore["items"]): LiveScore["grade"] => {
  const levels = Object.values(items);

  if (levels.includes("missing")) {
    return "bad";
  }

  return levels.every((level) => level === "correct") ? "perfect" : "good";
};

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

type ModelResponse = {
  output?: { type: string; content?: { type: string; text: string }[] }[];
};

const modelItems = (data: ModelResponse) => {
  const text = data.output
    ?.find((o) => o.type === "message")
    ?.content?.find((c) => c.type === "output_text")?.text;

  try {
    const items = JSON.parse(text ?? "");

    return ITEMS.every((item) => LEVELS.includes(items[item]))
      ? (Object.fromEntries(ITEMS.map((item) => [item, items[item]])) as LiveScore["items"])
      : null;
  } catch {
    return null;
  }
};

export const POST = async (request: Request) => {
  const body = (await request.json().catch(() => ({}))) as {
    turns?: unknown;
    passcode?: unknown;
  };
  const passcode = typeof body.passcode === "string" ? body.passcode : undefined;
  const turns = parseTurns(body.turns);
  const key = process.env.OPENAI_API_KEY;

  if (!turns) {
    return json({ error: "transcript" }, 400);
  }

  if (!turns.some((t) => t.role === "student" && t.text.trim())) {
    return json(
      { grade: "bad", items: { name: "missing", age: "missing", country: "missing" } },
      200,
    );
  }

  if (!key) {
    return json({ error: "unavailable" }, 503);
  }

  const freeKey = `score:free:${clientIp(request)}`;

  if (passcode !== undefined) {
    const refusal = await passcodeRefusal(request, passcode);

    if (refusal) {
      return refusal;
    }
  } else if (!(await take(freeKey, 1, FREE_SECONDS))) {
    return json({ error: "free_used" }, 403);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5.6-luna",
      reasoning: { effort: "low" },
      store: false,
      instructions: rubric,
      input: turns
        .map((t) => `${t.role === "student" ? "Student" : "Examiner"}: ${t.text}`)
        .join("\n"),
      text: { format: { type: "json_schema", name: "talk_score", strict: true, schema } },
    }),
  });

  const items = response.ok ? modelItems((await response.json()) as ModelResponse) : null;

  if (!items) {
    console.error("Talk scoring failed", response.status);
    if (passcode === undefined) {
      await give(freeKey, FREE_SECONDS);
    }

    return json({ error: "upstream" }, 502);
  }

  return json({ grade: gradeOf(items), items }, 200);
};
