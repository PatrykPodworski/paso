import type { TalkTurn } from "../../data/types";

// A transcript delta with its place on the session timeline.
export type Fragment = TalkTurn & { start: number; end: number };

// `at` is the turn's start on the session timeline, which keys it in the list.
export type LiveTurn = TalkTurn & { at: number };

// GPT-Live is full duplex and its input transcript can lag the examiner's speech, so
// fragments are ordered by their timeline position before they are joined into turns.
export const turnsOf = (fragments: Fragment[]) => {
  const turns: LiveTurn[] = [];

  for (const f of [...fragments].sort((a, b) => a.start - b.start || a.end - b.end)) {
    const last = turns.at(-1);

    if (last?.role === f.role) {
      last.text += f.text;
    } else {
      turns.push({ role: f.role, text: f.text, at: f.start });
    }
  }

  return turns;
};

export const transcriptText = (turns: TalkTurn[]) =>
  turns.map((t) => `${t.role === "student" ? "You" : "Examiner"}: ${t.text.trim()}`).join("\n");
