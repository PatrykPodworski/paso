import type { TalkTurn } from "../../data/types";

export const addDelta = (turns: TalkTurn[], role: TalkTurn["role"], delta: string) => {
  const last = turns.at(-1);

  return last?.role === role
    ? [...turns.slice(0, -1), { role, text: last.text + delta }]
    : [...turns, { role, text: delta }];
};

export const transcriptText = (turns: TalkTurn[]) =>
  turns.map((t) => `${t.role === "student" ? "You" : "Examiner"}: ${t.text.trim()}`).join("\n");
