import { allQuestions } from "../../src/data/curriculum.ts";
import { formPractice, mockQuestions } from "../../src/data/mock.ts";
import { setQuestions } from "../../src/data/practice-sets/index.ts";
import type { Question } from "../../src/data/types.ts";

export type WritingTask = {
  id: string;
  kind: "form" | "write" | "question" | "sentence";
  // Exam tasks get a DELE A1 band; lesson and practice tasks get a passed, partly or failed result.
  exam: boolean;
  prompt: string;
  // The note, message or advert shown in its own box; the prompt only refers to it.
  sourceText?: string;
  points: string[];
  wordRange: [number, number];
};

const isWriting = (q: Question) => q.kind === "write" || q.kind === "form";

const kindOf = (q: Question) => (q.kind === "form" ? "form" : (q.single ?? "write"));

export const taskOf = (q: Question, exam: boolean): WritingTask => ({
  id: q.id,
  kind: kindOf(q),
  exam,
  prompt: q.prompt,
  sourceText: q.passage,
  points: q.kind === "form" ? q.fields!.map((f) => f.label) : q.checklist!,
  wordRange: [q.minWords!, q.maxWords!],
});

// The lesson and practice questions the review knows, every practice set's exercises included.
const practiceQuestions = [...allQuestions, formPractice, ...setQuestions];

const TASKS = new Map(
  [
    ...practiceQuestions.filter(isWriting).map((q) => taskOf(q, false)),
    ...mockQuestions.filter(isWriting).map((q) => taskOf(q, true)),
  ].map((task) => [task.id, task]),
);

export const writingTaskOf = (id: unknown) => (typeof id === "string" ? TASKS.get(id) : undefined);
