import type { TalkTurn } from "../../data/types";

const KEY = "paso-pending-talk-v1";

// Finished talks that have no grade yet, by question id. The server has already counted
// the talk, so the transcript must outlive the view until it is scored.
type PendingTalks = Record<string, TalkTurn[]>;

const readAll = (): PendingTalks => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");

    return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  } catch {
    return {};
  }
};

const write = (talks: PendingTalks) => {
  try {
    if (Object.keys(talks).length) {
      localStorage.setItem(KEY, JSON.stringify(talks));
    } else {
      localStorage.removeItem(KEY);
    }
  } catch {
    // Without storage the talk can still be scored again until the view closes.
  }
};

// A talk without a question id is kept in memory only.
export const readPendingTalk = (questionId: string | undefined) => {
  const turns = questionId ? readAll()[questionId] : undefined;

  return Array.isArray(turns) ? turns : undefined;
};

export const savePendingTalk = (questionId: string | undefined, turns: TalkTurn[]) => {
  if (questionId) {
    write({ ...readAll(), [questionId]: turns });
  }
};

export const clearPendingTalk = (questionId: string | undefined) => {
  const talks = readAll();

  if (questionId && questionId in talks) {
    delete talks[questionId];
    write(talks);
  }
};
