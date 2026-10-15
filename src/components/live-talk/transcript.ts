import type { TalkTurn } from "../../data/types";

// A transcript delta with its place on the session timeline.
export type Fragment = TalkTurn & { start: number; end: number };

// `at` is the turn's start on the session timeline, which keys it in the list.
export type LiveTurn = TalkTurn & { at: number };

// GPT-Live is full duplex and its input transcript can lag the examiner's speech, so
// fragments are ordered by their timeline position before they are joined into turns.
export const turnsOf = (fragments: Fragment[]) =>
  [...fragments]
    .sort((a, b) => a.start - b.start || a.end - b.end)
    .reduce<LiveTurn[]>((turns, f) => {
      const last = turns.at(-1);

      return last?.role === f.role
        ? [...turns.slice(0, -1), { ...last, text: last.text + f.text }]
        : [...turns, { role: f.role, text: f.text, at: f.start }];
    }, []);

export const transcriptText = (turns: TalkTurn[]) =>
  turns.map((t) => `${t.role === "student" ? "You" : "Examiner"}: ${t.text.trim()}`).join("\n");
