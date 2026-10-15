import type { TalkTurn } from "../../data/types";

// `at` is the turn's start on the session timeline, which keys it in the list.
export type LiveTurn = TalkTurn & { at: number };

export const addDelta = (turns: LiveTurn[], role: TalkTurn["role"], delta: string, at = 0) => {
  const last = turns.at(-1);

  return last?.role === role
    ? [...turns.slice(0, -1), { ...last, text: last.text + delta }]
    : [...turns, { role, text: delta, at }];
};

export const transcriptText = (turns: TalkTurn[]) =>
  turns.map((t) => `${t.role === "student" ? "You" : "Examiner"}: ${t.text.trim()}`).join("\n");
