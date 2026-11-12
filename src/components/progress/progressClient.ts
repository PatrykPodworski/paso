import type {
  Attempt,
  MockResponses,
  MockRunPatch,
  NewMockResult,
  ProgressSnapshot,
  VocabularyReview,
} from "../../data/types";
import { type Body, keepUnsent, readUnsent } from "./unsentWrites";

const DRAFT_DELAY = 800;

// How long a failed write waits before the client sends it again. The last delay repeats.
export const RETRY_DELAYS = [2000, 5000, 15000, 30000];

// "save": a write failed and waits to be sent again. "refused": the server refused a write,
// so sending it again cannot help; it was dropped and the writes behind it went on.
export type Problem = "load" | "save" | "refused";
export type ProgressState = { snapshot: ProgressSnapshot | null; problem: Problem | null };
export type Preferences = { name: string; goal: number; examDate: string };

// A failed request. "refused" is an answer the same request would get again.
type Failure = { failure: "failed" | "refused"; status?: number };

// 408 and 429 pass with time; any other 4xx is about the request itself.
const failureOf = (status: number): Failure => ({
  failure: status >= 400 && status < 500 && status !== 408 && status !== 429 ? "refused" : "failed",
  status,
});

const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const requestInit = (learner: string, body: Body | undefined): RequestInit => ({
  method: body ? "POST" : "GET",
  headers: { "x-learner-id": learner, ...(body ? { "content-type": "application/json" } : {}) },
  body: body && JSON.stringify(body),
});

// Loads the learner's snapshot, then sends writes one at a time, in order. Each response
// replaces the snapshot. A failed write stops the queue: it waits on this device and is sent
// again after a delay, when the browser is back online, or on retry(). A refused write is
// dropped so it does not block the writes behind it.
export const createProgressClient = (learner: string, onChange: (state: ProgressState) => void) => {
  let state: ProgressState = { snapshot: null, problem: null };
  let loading: Promise<void> | null = null;
  let sending = false;
  const queue: Body[] = [];
  // Set while the head of the queue waits for its next try.
  let waiting: { timer: ReturnType<typeof setTimeout> } | null = null;
  let failures = 0;
  // The learner closed the dialog: tries in the background do not open it again.
  let dismissed = false;
  const drafts = new Map<string, { timer: ReturnType<typeof setTimeout>; text: string }>();
  // Drafts sent but not yet answered. Responses to earlier writes still hold the older
  // text, and a lesson opened now must not show it.
  const sentDrafts = new Map<string, string>();

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

  const request = async (body: Body | undefined): Promise<ProgressSnapshot | Failure> => {
    try {
      const response = await fetch("/api/progress", requestInit(learner, body));

      if (response.ok) {
        return (await response.json()) as ProgressSnapshot;
      }

      return failureOf(response.status);
    } catch {
      // A network error or a body that is not JSON is a failed request.
      return { failure: "failed" };
    }
  };

  const isFailure = (result: ProgressSnapshot | Failure): result is Failure => "failure" in result;

  const report = (body: Body | undefined, { failure, status }: Failure) =>
    console.error(`Progress ${body ? "save" : "load"} ${failure}`, {
      action: body?.action,
      status,
    });

  // Writes kept from an earlier visit go first, so the snapshot shown already holds them.
  const loadOnce = async () => {
    const unsent = readUnsent(learner);

    while (unsent.length) {
      const result = await request(unsent[0]);

      if (isFailure(result) && result.failure === "failed") {
        report(unsent[0], result);
        update({ problem: "load" });

        return;
      }

      if (isFailure(result)) {
        report(unsent[0], result);
      }

      unsent.shift();
      keepUnsent(learner, unsent);
    }

    const result = await request(undefined);

    if (isFailure(result)) {
      report(undefined, result);
    }

    update(isFailure(result) ? { problem: "load" } : { snapshot: result });
  };

  const load = () => {
    loading ??= loadOnce().finally(() => {
      loading = null;
    });

    return loading;
  };

  const online = () => {
    clearTimeout(waiting?.timer);
    waiting = null;
    void send();
  };

  const stopWaiting = () => {
    clearTimeout(waiting?.timer);
    waiting = null;
    window.removeEventListener("online", online);
  };

  const wait = () => {
    const delay = RETRY_DELAYS[Math.min(failures, RETRY_DELAYS.length) - 1];

    waiting = { timer: setTimeout(online, delay) };
    window.addEventListener("online", online);
  };

  const isFailed = (result: ProgressSnapshot | Failure): result is Failure =>
    isFailure(result) && result.failure === "failed";

  // A sent draft no longer needs showing over the snapshot.
  const forgetDraft = (body: Body) => {
    if (body.action === "draft" && sentDrafts.get(body.questionId as string) === body.text) {
      sentDrafts.delete(body.questionId as string);
    }
  };

  // A failed write stays first in the queue and waits for its next try.
  const hold = (failure: Failure) => {
    report(queue[0], failure);
    failures += 1;
    keepUnsent(learner, queue);
    wait();
    update(dismissed ? {} : { problem: "save" });
  };

  // The head of the queue left it: saved, or refused by the server.
  const settle = (result: ProgressSnapshot | Failure) => {
    const body = queue.shift()!;

    forgetDraft(body);
    keepUnsent(learner, failures ? queue : []);

    if (isFailure(result)) {
      report(body, result);
      update({ problem: "refused" });

      return;
    }

    update({ snapshot: result, problem: state.problem === "save" ? null : state.problem });
  };

  // Everything is saved: the next failure shows the dialog again.
  const drained = () => {
    failures = 0;
    dismissed = false;
    stopWaiting();
    keepUnsent(learner, []);
  };

  const send = async () => {
    if (sending || waiting || !queue.length) {
      return;
    }

    sending = true;
    const result = await request(queue[0]);

    sending = false;

    if (isFailed(result)) {
      hold(result);

      return;
    }

    settle(result);

    if (!queue.length) {
      drained();
    }

    void send();
  };

  const write = (body: Body) => {
    queue.push(body);

    if (failures) {
      keepUnsent(learner, queue);
    }

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

    if (!state.snapshot) {
      return load();
    }

    clearTimeout(waiting?.timer);
    waiting = null;

    return send();
  };

  return {
    load,
    retry,
    // Closes the dialog. A failed write keeps its tries in the background.
    dismiss: () => {
      dismissed = state.problem === "save" || dismissed;
      update({ problem: null });
    },
    // Stops the background tries, for a client that is no longer used.
    stop: stopWaiting,
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
    // An id the exam already saved updates that result. A new result takes a fresh id.
    mockResult: (result: NewMockResult & { id?: string }) =>
      write({
        action: "mockResult",
        result: { ...result, id: result.id ?? crypto.randomUUID() },
      }),
    // One rehearsal result's responses, read when the learner opens them. The read is not a
    // write, so it skips the queue, and a failure rejects instead of setting a problem.
    mockResponses: async (resultId: string): Promise<MockResponses | null> => {
      const response = await fetch(
        `/api/progress?result=${encodeURIComponent(resultId)}`,
        requestInit(learner, undefined),
      );

      if (!response.ok) {
        throw new Error(`Responses not loaded: ${response.status}`);
      }

      return ((await response.json()) as { responses: MockResponses | null }).responses;
    },
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
    // The mock exam task variants a section shows as it starts.
    seen: (variants: string[]) => write({ action: "seen", variants, at: new Date().toISOString() }),
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
