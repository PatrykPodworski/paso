export type Skill = "reading" | "listening" | "writing" | "speaking";
export type Tone = "peach" | "sage" | "lavender" | "sand" | "blue";

export type QuestionKind =
  | "choice"
  | "listen"
  | "type"
  | "order"
  | "write"
  | "speak"
  | "form"
  | "live";

export type Grade = "perfect" | "good" | "bad";
export type LiveItem = "correct" | "understandable" | "missing";
export type LiveScoreItem = { id: string; label: string; level: LiveItem };
export type LiveScore = { grade: Grade; items: LiveScoreItem[] };
export type TalkTurn = { role: "examiner" | "student"; text: string };

export type WritingCoverage = { point: string; met: boolean; feedback: string };
export type WritingCorrection = { original: string; corrected: string; explanation: string };
// A DELE A1 writing mark: one holistic band from 0 to 3 per task.
export type WritingMark = { band: number; reason: string };

export type WritingReview = {
  wordCount: number;
  coverage: WritingCoverage[];
  corrections: WritingCorrection[];
  revised: string;
  mark?: WritingMark;
  // A practice task's result, recorded like a live talk's grade.
  grade?: Grade;
};

export interface Question {
  id: string;
  kind: QuestionKind;
  skill: Skill;
  prompt: string;
  answer: string;
  explanation: string;
  memoryHint?: string;
  options?: string[];
  accepted?: string[];
  passage?: string;
  audio?: string;
  // Spanish to hear after answering; separate from listening prompts and English answers.
  pronunciation?: string;
  image?: string;
  visual?: string;
  tokens?: string[];
  checklist?: string[];
  minWords?: number;
  maxWords?: number;
  fields?: { label: string; example: string }[];
  task?: string;
  // The server-side talk task a live question runs.
  talk?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  icon: string;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  spanish: string;
  subtitle: string;
  color: Tone;
  icon: string;
  goals: string[];
  tip: string;
  example: string;
  lessons: Lesson[];
}

export interface Attempt {
  id: string;
  questionId: string;
  skill: Skill;
  correct: boolean | null;
  answer: string;
  at: string;
  assisted?: boolean;
  grade?: Grade;
}

export type ReviewState = {
  level: number;
  nextAt: string;
};

export type VocabularyReview = ReviewState & { reviewedAt?: string };

export interface Progress {
  version: 1;
  name: string;
  goal: number;
  completed: Record<string, { score: number; total: number; at: string }>;
  attempts: Attempt[];
  mistakes: string[];
  reviewed: string[];
  mistakeReviews: Record<string, ReviewState>;
  vocabularyReviews: Record<string, VocabularyReview>;
  checks: string[];
  examDate: string;
  mockResults: {
    at: string;
    reading: number;
    listening: number;
    writing?: number;
    speaking?: number;
  }[];
  drafts: Record<string, string>;
}
