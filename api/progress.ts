import { type Db, neonDb } from "./_lib/db.js";
import { legacyProgressOf } from "./_lib/legacy-progress.js";
import { json } from "./_lib/limits.js";
import { passcodeRefusal } from "./_lib/passcode.js";
import {
  attemptOf,
  GOALS,
  isCount,
  isExamDate,
  isId,
  isInstant,
  isRecord,
  isText,
  legacyMockRunOf,
  MAX_NAME,
  MAX_TOTAL,
  mockResultOf,
  mockRunPatchOf,
  reviewOf,
  timeZoneOf,
} from "./_lib/progress-fields.js";
import {
  completeLesson,
  importMockRun,
  importProgress,
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
  importMockRun: ({ run }) => {
    const kept = legacyMockRunOf(run);

    return (db, learner) => importMockRun(db, learner, kept);
  },
  reset: () => resetProgress,
  import: ({ progress, timeZone }) => {
    const legacy = legacyProgressOf(progress);

    return (db, learner) => importProgress(db, learner, legacy, timeZoneOf(timeZone));
  },
};

// Browsers send header values as Latin-1, so clients URI-encode the passcode.
const passcodeOf = (request: Request) => {
  const sent = request.headers.get("x-passcode") ?? "";

  try {
    return decodeURIComponent(sent);
  } catch {
    return sent;
  }
};

// GET returns the learner's snapshot; POST { action, ... } writes and returns the fresh one.
export const handleProgress = async (
  request: Request,
  db: Db,
  refusal: (request: Request, passcode: string) => Promise<Response | null>,
) => {
  const learner = request.headers.get("x-learner-id") ?? "";
  let write: Write = readProgress;

  if (!UUID.test(learner)) {
    return json({ error: "learner" }, 400);
  }

  if (request.method === "POST") {
    const body: unknown = await request.json().catch(() => null);

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

  const refused = await refusal(request, passcodeOf(request));

  if (refused) {
    return refused;
  }

  return json(await write(db, learner.toLowerCase()), 200);
};

const handle = (request: Request) => {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error("Progress is not configured: set DATABASE_URL");

    return json({ error: "unavailable" }, 503);
  }

  return handleProgress(request, neonDb(url), passcodeRefusal);
};

export const GET = handle;
export const POST = handle;
