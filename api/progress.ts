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
  isSeenVariants,
  isText,
  MAX_NAME,
  MAX_TOTAL,
  mockResultOf,
  mockRunFaultOf,
  mockRunPatchOf,
  reviewOf,
  timeZoneOf,
} from "./_lib/progress-fields.js";
import {
  completeLesson,
  readProgress,
  readResponses,
  resetProgress,
  saveAttempt,
  saveDraft,
  saveMockResult,
  saveMockRun,
  saveSeen,
  saveSettings,
  saveVocabulary,
  setCheck,
} from "./_lib/progress-store.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Write = (db: Db, learner: string) => Promise<object>;
// Why a request is refused. The detail goes to the log only.
type Refusal = { error: string; status: number; detail?: string };

// Each action checks its body and returns the write, or the first invalid field.
const actions: Record<
  string,
  (body: Record<string, unknown>) => Write | string | Omit<Refusal, "status">
> = {
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
  mockRun: ({ run, replace, runId }) => {
    const patch = mockRunPatchOf(run);

    if (!patch) {
      return { error: "run", detail: mockRunFaultOf(run) ?? "" };
    }

    if (!(replace === undefined || typeof replace === "boolean")) {
      return "replace";
    }

    // Only a new run sets its id.
    if (patch.id !== undefined && replace !== true) {
      return "id";
    }

    if (!(runId === undefined || isId(runId))) {
      return "runId";
    }

    return (db, learner) => saveMockRun(db, learner, patch, replace === true, runId ?? null);
  },
  seen: ({ variants, at }) => {
    if (!isSeenVariants(variants)) {
      return "variants";
    }

    if (!isInstant(at)) {
      return "at";
    }

    return (db, learner) => saveSeen(db, learner, variants, at);
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

// What the log says about a request, so a failed save can be traced.
type Context = { method: string; learner: string; bytes?: number; action?: string };

const parsed = (raw: ArrayBuffer) => {
  try {
    return JSON.parse(new TextDecoder().decode(raw)) as unknown;
  } catch {
    return null;
  }
};

// The write a POST body asks for, or why it is refused.
const writeOf = async (request: Request, context: Context): Promise<Write | Refusal> => {
  const raw = await request.arrayBuffer();

  context.bytes = raw.byteLength;

  if (raw.byteLength > MAX_BODY) {
    return { error: "too_large", status: 413 };
  }

  const body = parsed(raw);

  if (!isRecord(body)) {
    return { error: "body", status: 400 };
  }

  if (typeof body.action !== "string" || !Object.hasOwn(actions, body.action)) {
    return { error: "action", status: 400 };
  }

  context.action = body.action;
  const action = actions[body.action](body);

  if (typeof action === "function") {
    return action;
  }

  return typeof action === "string" ? { error: action, status: 400 } : { ...action, status: 400 };
};

// The read a GET asks for: the snapshot, or with ?result=<id> one result's responses.
const readOf = (request: Request): Write | Refusal => {
  const resultId = new URL(request.url).searchParams.get("result");

  if (resultId === null) {
    return readProgress;
  }

  return isId(resultId)
    ? (db, learner) => readResponses(db, learner, resultId)
    : { error: "result", status: 400 };
};

// One line per failed request: the client sees only the error code, so the log is where a
// failed save is diagnosed.
const logFailure = (context: Context, status: number, error: unknown, detail?: string) =>
  console.error("Progress request failed", {
    endpoint: "/api/progress",
    status,
    ...context,
    error: error instanceof Error ? error.message : error,
    ...(detail ? { detail } : {}),
  });

const refusal = (context: Context, { error, status, detail }: Refusal) => {
  logFailure(context, status, error, detail);

  return json({ error }, status);
};

// GET returns the learner's snapshot, or one rehearsal result's responses; POST
// { action, ... } writes and returns the fresh snapshot.
export const handleProgress = async (
  request: Request,
  db: Db,
  limit: (request: Request) => Promise<Response | null>,
) => {
  const learner = request.headers.get("x-learner-id") ?? "";

  // A header that is not an id stays out of the log.
  const context: Context = {
    method: request.method,
    learner: UUID.test(learner) ? learner.toLowerCase() : "invalid",
  };

  const refused = await limit(request);

  if (refused) {
    return refusal(context, { error: "rate", status: refused.status });
  }

  if (!UUID.test(learner)) {
    return refusal(context, { error: "learner", status: 400 });
  }

  const handler =
    request.method === "POST"
      ? await writeOf(request, context)
      : request.method === "GET"
        ? readOf(request)
        : { error: "method", status: 405 };

  if ("error" in handler) {
    return refusal(context, handler);
  }

  try {
    const result = await handler(db, learner.toLowerCase());

    // A write for another run than the current one: the client drops it.
    if ("stale" in result) {
      console.error("Progress request failed", {
        endpoint: "/api/progress",
        status: 409,
        method: request.method,
        learner: learner.toLowerCase(),
        action: "mockRun",
        error: "stale_run",
        detail: result.stale,
      });

      return json({ error: "stale_run" }, 409);
    }

    return json(result, 200);
  } catch (error) {
    logFailure(context, 500, error);

    return json({ error: "server" }, 500);
  }
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
