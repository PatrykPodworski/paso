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

export type LiveGrade = "perfect" | "good" | "bad";
export type LiveItem = "correct" | "understandable" | "missing";
export type LiveScoreItem = { id: string; label: string; level: LiveItem };
export type LiveScore = { grade: LiveGrade; items: LiveScoreItem[] };
export type TalkTurn = { role: "examiner" | "student"; text: string };

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
  grade?: LiveGrade;
}

export type ReviewState = {
  level: number;
  nextAt: string;
};

export type VocabularyReview = ReviewState & { reviewedAt?: string };

// A learner's progress as the server stores it (api/progress.ts).
export interface ProgressSnapshot {
  name: string;
  goal: number;
  examDate: string;
  xp: number;
  completed: Record<string, { score: number; total: number; at: string }>;
  // The previous attempt at each question, with its mistake and review state.
  questions: Record<
    string,
    {
      skill: Skill;
      at: string;
      correct: boolean | null;
      answer: string;
      assisted?: boolean;
      grade?: LiveGrade;
      inMistakes: boolean;
      review?: ReviewState;
    }
  >;
  vocabularyReviews: Record<string, VocabularyReview>;
  checks: string[];
  mockResults: {
    id: string;
    at: string;
    reading: number;
    listening: number;
    writing?: number;
    speaking?: number;
  }[];
  drafts: Record<string, string>;
  // The last 20 attempts, newest first.
  recent: Attempt[];
  // Distinct local days with an attempt, newest first, at most 400.
  days: string[];
}

// A rehearsal result before the server stores it under an id.
export type NewMockResult = Omit<ProgressSnapshot["mockResults"][number], "id">;
