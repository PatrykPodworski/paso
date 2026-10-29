import type {
  Attempt,
  MockRunPatch,
  NewMockResult,
  ProgressSnapshot,
  VocabularyReview,
} from "../../data/types";
import { readAccess, savePasscode } from "../live-talk/liveAccess";

const LEGACY_KEY = "paso-progress-v1";
const MOCK_KEY = "paso-mock-v1";
const DRAFT_DELAY = 800;

export type Problem = "load" | "save" | "passcode" | "wrongPasscode" | "passcodeTries";
export type ProgressState = { snapshot: ProgressSnapshot | null; problem: Problem | null };
export type Preferences = { name: string; goal: number; examDate: string };

type Body = { action: string } & Record<string, unknown>;

const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// What this browser saved under `key` before the server kept it.
const keptIn = (key: string) => {
  try {
    const raw = localStorage.getItem(key);

    return raw === null ? null : { raw, value: JSON.parse(raw) as unknown };
  } catch {
    return null;
  }
};

const keepAsBackup = (key: string, raw: string) => {
  try {
    localStorage.setItem(`${key}-imported`, raw);
    localStorage.removeItem(key);
  } catch {
    // The server ignores a second import, so a key that stays only costs a request.
  }
};

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

  const request = async (
    body: Body | undefined,
    failure: Problem,
  ): Promise<ProgressSnapshot | Problem> => {
    const passcode = readAccess().passcode || typed;

    try {
      const response = await fetch("/api/progress", {
        method: body ? "POST" : "GET",
        headers: {
          "x-learner-id": learner,
          ...(body ? { "content-type": "application/json" } : {}),
          ...(passcode ? { "x-passcode": encodeURIComponent(passcode) } : {}),
        },
        body: body && JSON.stringify(body),
      });

      if (response.ok) {
        return (await response.json()) as ProgressSnapshot;
      }

      if (response.status === 401) {
        typed = "";
        savePasscode("");

        return passcode ? "wrongPasscode" : "passcode";
      }

      if (response.status === 429) {
        return "passcodeTries";
      }
    } catch {
      // A network error or a body that is not JSON is a failed request.
    }

    return failure;
  };

  // Sends what this browser kept under `key` when the server lacks it. Either way the key
  // then moves to a backup that is never read, so a later reset does not import it again.
  const importKept = async (
    loaded: ProgressSnapshot | Problem,
    key: string,
    held: (snapshot: ProgressSnapshot) => boolean,
    body: (value: unknown) => Body,
  ) => {
    const kept = typeof loaded === "string" ? null : keptIn(key);

    if (!kept) {
      return loaded;
    }

    if (held(loaded as ProgressSnapshot)) {
      keepAsBackup(key, kept.raw);

      return loaded;
    }

    const result = await request(body(kept.value), "load");

    if (typeof result === "string") {
      return result;
    }

    keepAsBackup(key, kept.raw);

    const { importedNow: _, ...snapshot } = result as ProgressSnapshot & {
      importedNow?: boolean;
    };

    return snapshot;
  };

  const loadOnce = async () => {
    const progress = await importKept(
      await request(undefined, "load"),
      LEGACY_KEY,
      (snapshot) => snapshot.imported,
      (value) => ({ action: "import", progress: value, timeZone: timeZone() }),
    );

    const result = await importKept(
      progress,
      MOCK_KEY,
      (snapshot) => snapshot.mockRun !== null,
      (value) => ({ action: "importMockRun", run: value }),
    );

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

  // The mock run's drafts wait together and go as one change.
  let mockDrafts: { timer: ReturnType<typeof setTimeout>; drafts: Record<string, string> } | null =
    null;

  const saveMockDrafts = () => {
    if (mockDrafts) {
      clearTimeout(mockDrafts.timer);
      write({ action: "mockRun", run: { drafts: mockDrafts.drafts } });
      mockDrafts = null;
    }
  };

  const dropMockDrafts = () => {
    clearTimeout(mockDrafts?.timer);
    mockDrafts = null;
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
    flushDrafts: () => {
      [...drafts.keys()].forEach(saveDraft);
      saveMockDrafts();
    },
    vocabulary: (reviews: Record<string, VocabularyReview>) =>
      write({ action: "vocabulary", reviews }),
    check: (checkId: string, done: boolean) => write({ action: "check", checkId, done }),
    settings: (preferences: Preferences) => write({ action: "settings", ...preferences }),
    // The id makes a resent result a no-op on the server.
    mockResult: (result: NewMockResult) =>
      write({ action: "mockResult", result: { id: crypto.randomUUID(), ...result } }),
    // Answers, drafts and scores merge per key on the server; drafts are sent debounced.
    mockRun: ({ drafts: changed, ...change }: MockRunPatch) => {
      if (changed) {
        clearTimeout(mockDrafts?.timer);

        mockDrafts = {
          timer: setTimeout(saveMockDrafts, DRAFT_DELAY),
          drafts: { ...mockDrafts?.drafts, ...changed },
        };
      }

      if (Object.keys(change).length) {
        write({ action: "mockRun", run: change });
      }
    },
    newMockRun: (run: MockRunPatch) => {
      dropMockDrafts();
      write({ action: "mockRun", run, replace: true });
    },
    reset: () => {
      drafts.forEach((d) => clearTimeout(d.timer));
      drafts.clear();
      dropMockDrafts();
      write({ action: "reset" });
    },
  };
};
