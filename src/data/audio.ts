import type { Question } from "./types.ts";

export const audioKey = (text: string) => {
  let hash = 2166136261;

  for (const ch of text) {
    hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  }

  return (hash >>> 0).toString(36);
};

// The plays the exam allows each listening recording.
export const EXAM_PLAYS = 2;

export const spokenText = (q: Question) => q.pronunciation || q.audio || q.passage || q.answer;
