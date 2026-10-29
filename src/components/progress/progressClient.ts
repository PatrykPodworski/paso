import type { Attempt, NewMockResult, ProgressSnapshot, VocabularyReview } from "../../data/types";
import { readAccess, savePasscode } from "../live-talk/liveAccess";

const LEGACY_KEY = "paso-progress-v1";
const DRAFT_DELAY = 800;

export type Problem = "load" | "save" | "passcode" | "wrongPasscode" | "passcodeTries";
export type ProgressState = { snapshot: ProgressSnapshot | null; problem: Problem | null };
export type Preferences = { name: string; goal: number; examDate: string };

type Body = { action: string } & Record<string, unknown>;

const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// The progress saved in this browser before progress moved to the server.
const legacyProgress = () => {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);

    return raw === null ? null : { raw, progress: JSON.parse(raw) as unknown };
  } catch {
    return null;
  }
};

const keepAsBackup = (raw: string) => {
  try {
    localStorage.setItem(`${LEGACY_KEY}-imported`, raw);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // The server ignores a second import, so a key that stays only costs a request.
  }
};

const requestInit = (learner: string, body: Body | undefined, passcode: string): RequestInit => ({
  method: body ? "POST" : "GET",
  headers: {
    "x-learner-id": learner,
    ...(body ? { "content-type": "application/json" } : {}),
    ...(passcode ? { "x-passcode": encodeURIComponent(passcode) } : {}),
  },
  body: body && JSON.stringify(body),
});

// Loads the learner's snapshot, then sends writes one at a time, in order. Each response
// replaces the snapshot. A failed request stops the queue until retry() sends it again.
export const createProgressClient = (learner: string, onChange: (state: ProgressState) => void) => {
  let state: ProgressState = { snapshot: null, problem: null };
  let loading: Promise<void> | null = null;
  let sending = false;
  const queue: Body[] = [];
  const drafts = new Map<string, { timer: ReturnType<typeof setTimeout>; text: string }>();
  // Drafts sent but not yet answered. Responses to earlier writes still hold the older
  // text, and a lesson opened now must not show it.
  const sentDrafts = new Map<string, string>();
  // Without browser storage the passcode lasts for this visit.
  let typed = "";

  const update = (patch: Partial<ProgressState>) => {
    const { snapshot, ...rest } = { ...state, ...patch };

    state = {
      ...rest,
      snapshot: snapshot && {
        ...snapshot,
        drafts: { ...snapshot.drafts, ...Object.fromEntries(sentDrafts) },
      },
    };

    onChange(state);
  };

  // The problem for a status that refuses the passcode, or null for any other status.
  const refusal = (status: number, passcode: string): Problem | null => {
    if (status === 401) {
      typed = "";
      savePasscode("");

      return passcode ? "wrongPasscode" : "passcode";
    }

    return status === 429 ? "passcodeTries" : null;
  };

  const request = async (
    body: Body | undefined,
    failure: Problem,
  ): Promise<ProgressSnapshot | Problem> => {
    const passcode = readAccess().passcode || typed;

    try {
      const response = await fetch("/api/progress", requestInit(learner, body, passcode));

      if (response.ok) {
        return (await response.json()) as ProgressSnapshot;
      }

      return refusal(response.status, passcode) ?? failure;
    } catch {
      // A network error or a body that is not JSON is a failed request.
      return failure;
    }
  };

  const loadOnce = async () => {
    let result = await request(undefined, "load");
    const legacy = typeof result === "string" ? null : legacyProgress();

    if (legacy && typeof result !== "string" && result.imported) {
      keepAsBackup(legacy.raw);
    } else if (legacy) {
      result = await request(
        { action: "import", progress: legacy.progress, timeZone: timeZone() },
        "load",
      );

      if (typeof result !== "string") {
        keepAsBackup(legacy.raw);

        const { importedNow: _, ...snapshot } = result as ProgressSnapshot & {
          importedNow: boolean;
        };

        result = snapshot;
      }
    }

    update(typeof result === "string" ? { problem: result } : { snapshot: result });
  };

  const load = () => {
    loading ??= loadOnce().finally(() => {
      loading = null;
    });

    return loading;
  };

  const send = async () => {
    if (sending || state.problem || !queue.length) {
      return;
    }

    sending = true;
    const result = await request(queue[0], "save");

    sending = false;

    if (typeof result === "string") {
      update({ problem: result });

      return;
    }

    const body = queue.shift()!;

    if (body.action === "draft" && sentDrafts.get(body.questionId as string) === body.text) {
      sentDrafts.delete(body.questionId as string);
    }

    update({ snapshot: result });
    void send();
  };

  const write = (body: Body) => {
    queue.push(body);
    void send();
  };

  const saveDraft = (questionId: string) => {
    const draft = drafts.get(questionId)!;

    clearTimeout(draft.timer);
    drafts.delete(questionId);
    sentDrafts.set(questionId, draft.text);
    update({});
    write({ action: "draft", questionId, text: draft.text });
  };

  const retry = () => {
    update({ problem: null });

    return state.snapshot ? send() : load();
  };

  return {
    load,
    retry,
    unlock: (passcode: string) => {
      typed = passcode;
      savePasscode(passcode);

      return retry();
    },
    attempt: (attempt: Attempt) => write({ action: "attempt", attempt, timeZone: timeZone() }),
    complete: (lessonId: string, score: number, total: number) =>
      write({ action: "complete", lessonId, score, total, at: new Date().toISOString() }),
    draft: (questionId: string, text: string) => {
      clearTimeout(drafts.get(questionId)?.timer);
      drafts.set(questionId, { timer: setTimeout(() => saveDraft(questionId), DRAFT_DELAY), text });
    },
    flushDrafts: () => [...drafts.keys()].forEach(saveDraft),
    vocabulary: (reviews: Record<string, VocabularyReview>) =>
      write({ action: "vocabulary", reviews }),
    check: (checkId: string, done: boolean) => write({ action: "check", checkId, done }),
    settings: (preferences: Preferences) => write({ action: "settings", ...preferences }),
    // The id makes a resent result a no-op on the server.
    mockResult: (result: NewMockResult) =>
      write({ action: "mockResult", result: { id: crypto.randomUUID(), ...result } }),
    reset: () => {
      drafts.forEach((d) => clearTimeout(d.timer));
      drafts.clear();
      write({ action: "reset" });
    },
  };
};
