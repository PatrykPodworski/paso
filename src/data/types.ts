export type Skill = "reading" | "listening" | "writing" | "speaking";

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
      grade?: Grade;
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
  mockRun: MockRun | null;
}

// One version of an official exam task: a whole coherent task with all its items.
export type MockVariant = {
  id: string;
  // What the variant is about and the characters in it. One exam repeats neither.
  theme: string;
  names: string[];
  questions: Question[];
};

// The pool of variants for one official task. Every variant of a task has the same number of
// items, so a section keeps the official structure whichever variants an exam takes.
export type MockTask = { id: string; variants: MockVariant[] };

export type MockSection = { title: string; spanish: string; minutes: number; tasks: MockTask[] };

// The variant an exam uses for each task: task id to variant id.
export type ExamVariants = Record<string, string>;

export type MockStage = "intro" | "run" | "review" | "prep" | "done";

// The mock exam in progress. `deadline` is in epoch milliseconds, 0 when no timer runs.
export interface MockRun {
  section: number;
  index: number;
  stage: MockStage;
  answers: Record<string, string>;
  deadline: number;
  started: string;
  drafts: Record<string, string>;
  // The writing and speaking scores as typed into the score calculator.
  scores: { writing?: string; speaking?: string };
  // The seed the exam builder took and the variants it chose, so a run resumes and is reviewed
  // with the same tasks.
  seed: number;
  variants: ExamVariants;
}

// A change to the mock run: top-level fields replace, answers, drafts and scores merge per key.
export type MockRunPatch = Partial<MockRun>;

// A rehearsal result before the server stores it under an id.
export type NewMockResult = Omit<ProgressSnapshot["mockResults"][number], "id">;
