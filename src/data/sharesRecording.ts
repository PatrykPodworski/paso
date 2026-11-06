import type { Question } from "./types";

// A recording keeps playing across the questions that share it.
export const sharesRecording = (q: Question, other: Question | undefined) =>
  !!q.audio && q.audio === other?.audio;
