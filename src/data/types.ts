export type Skill = "reading" | "listening" | "writing" | "speaking";
export type QuestionKind = "choice" | "listen" | "type" | "order" | "write" | "speak" | "form";
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
  color: string;
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
}
export interface Progress {
  version: 1;
  name: string;
  goal: number;
  completed: Record<string, { score: number; total: number; at: string }>;
  attempts: Attempt[];
  mistakes: string[];
  reviewed: string[];
  mistakeReviews: Record<string, { level: number; nextAt: string }>;
  vocabularyReviews: Record<string, { level: number; nextAt: string; reviewedAt?: string }>;
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
