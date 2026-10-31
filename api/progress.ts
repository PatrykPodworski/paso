import { type Db, neonDb } from "./_lib/db.js";
import { clientIp, DAY_SECONDS, json, take, today } from "./_lib/limits.js";
import {
  attemptOf,
  GOALS,
  isCount,
  isExamDate,
  isId,
  isInstant,
  isRecord,
  isText,
  MAX_NAME,
  MAX_TOTAL,
  mockResultOf,
  mockRunPatchOf,
  reviewOf,
  timeZoneOf,
} from "./_lib/progress-fields.js";
import {
  completeLesson,
  readProgress,
  resetProgress,
  saveAttempt,
  saveDraft,
  saveMockResult,
  saveMockRun,
  saveSettings,
  saveVocabulary,
  setCheck,
} from "./_lib/progress-store.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Write = (db: Db, learner: string) => Promise<object>;

// Each action checks its body and returns the write, or the first invalid field.
const actions: Record<string, (body: Record<string, unknown>) => Write | string> = {
  attempt: ({ attempt, timeZone }) => {
    const a = attemptOf(attempt);

    return a ? (db, learner) => saveAttempt(db, learner, a, timeZoneOf(timeZone)) : "attempt";
  },
  complete: ({ lessonId, score, total, at }) => {
    if (!isId(lessonId)) {
      return "lessonId";
    }

    if (!isCount(total, 1, MAX_TOTAL)) {
      return "total";
    }

    if (!isCount(score, 0, total)) {
      return "score";
    }

    if (!isInstant(at)) {
      return "at";
    }

    return (db, learner) => completeLesson(db, learner, lessonId, { score, total, at });
  },
  draft: ({ questionId, text }) => {
    if (!isId(questionId)) {
      return "questionId";
    }

    if (!isText(text)) {
      return "text";
    }

    return (db, learner) => saveDraft(db, learner, questionId, text);
  },
  vocabulary: ({ reviews }) => {
    const entries = isRecord(reviews) ? Object.entries(reviews) : [];

    const parsed = entries.flatMap(([word, r]) => {
      const review = isId(word) ? reviewOf(r) : null;

      return review ? [[word, review] as const] : [];
    });

    if (!entries.length || parsed.length !== entries.length) {
      return "reviews";
    }

    return (db, learner) => saveVocabulary(db, learner, Object.fromEntries(parsed));
  },
  check: ({ checkId, done }) => {
    if (!isId(checkId)) {
      return "checkId";
    }

    if (typeof done !== "boolean") {
      return "done";
    }

    return (db, learner) => setCheck(db, learner, checkId, done);
  },
  settings: ({ name, goal, examDate }) => {
    if (!isText(name, MAX_NAME)) {
      return "name";
    }

    if (!GOALS.includes(goal as number)) {
      return "goal";
    }

    if (!isExamDate(examDate)) {
      return "examDate";
    }

    return (db, learner) => saveSettings(db, learner, { name, goal: goal as number, examDate });
  },
  mockResult: ({ result }) => {
    const m = mockResultOf(result);

    return m ? (db, learner) => saveMockResult(db, learner, m) : "result";
  },
  mockRun: ({ run, replace }) => {
    const patch = mockRunPatchOf(run);

    if (!patch) {
      return "run";
    }

    if (!(replace === undefined || typeof replace === "boolean")) {
      return "replace";
    }

    return (db, learner) => saveMockRun(db, learner, patch, replace === true);
  },

  reset: () => resetProgress,
};

// Requests per address. A lesson sends about one write per answer, so a learner stays far
// below both; the limits stop a script from flooding the store with new learner ids.
export const PER_MINUTE = 120;
export const PER_DAY = 5000;

// The largest body a write needs is a vocabulary batch or a mock run with its drafts, both
// well under this. Vercel already refuses bodies over 4.5 MB, so reading one is bounded.
export const MAX_BODY = 256 * 1024;

// Returns the refusal once the address has used up a limit, or null.
export const progressLimit = async (request: Request) => {
  const ip = clientIp(request);
  const minute = Math.floor(Date.now() / 60_000);

  const allowed =
    (await take(`progress:minute:${ip}:${minute}`, PER_MINUTE, 60)) &&
    (await take(`progress:day:${ip}:${today()}`, PER_DAY, DAY_SECONDS));

  return allowed ? null : json({ error: "rate" }, 429);
};

const bodyOf = async (request: Request) => {
  const raw = await request.arrayBuffer();

  if (raw.byteLength > MAX_BODY) {
    return "too_large";
  }

  try {
    return JSON.parse(new TextDecoder().decode(raw)) as unknown;
  } catch {
    return null;
  }
};

// GET returns the learner's snapshot; POST { action, ... } writes and returns the fresh one.
export const handleProgress = async (
  request: Request,
  db: Db,
  limit: (request: Request) => Promise<Response | null>,
) => {
  const refused = await limit(request);

  if (refused) {
    return refused;
  }

  const learner = request.headers.get("x-learner-id") ?? "";
  let write: Write = readProgress;

  if (!UUID.test(learner)) {
    return json({ error: "learner" }, 400);
  }

  if (request.method === "POST") {
    const body = await bodyOf(request);

    if (body === "too_large") {
      return json({ error: "too_large" }, 413);
    }

    if (!isRecord(body)) {
      return json({ error: "body" }, 400);
    }

    const action =
      typeof body.action === "string" && Object.hasOwn(actions, body.action)
        ? actions[body.action](body)
        : "action";

    if (typeof action === "string") {
      return json({ error: action }, 400);
    }

    write = action;
  } else if (request.method !== "GET") {
    return json({ error: "method" }, 405);
  }

  return json(await write(db, learner.toLowerCase()), 200);
};

const handle = (request: Request) => {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error("Progress is not configured: set DATABASE_URL");

    return json({ error: "unavailable" }, 503);
  }

  return handleProgress(request, neonDb(url), progressLimit);
};

export const GET = handle;
export const POST = handle;
