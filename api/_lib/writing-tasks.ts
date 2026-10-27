import { allQuestions } from "../../src/data/curriculum.ts";
import { formPractice, mockQuestions } from "../../src/data/mock.ts";
import type { Question } from "../../src/data/types.ts";

export type WritingTask = {
  id: string;
  kind: "form" | "write";
  // Exam tasks get a DELE A1 band; lesson and practice tasks get feedback only.
  exam: boolean;
  prompt: string;
  points: string[];
  wordRange: [number, number];
};

const isWriting = (q: Question) => q.kind === "write" || q.kind === "form";

const taskOf = (q: Question, exam: boolean): WritingTask => ({
  id: q.id,
  kind: q.kind === "form" ? "form" : "write",
  exam,
  prompt: q.prompt,
  points: q.kind === "form" ? q.fields!.map((f) => f.label) : q.checklist!,
  wordRange: [q.minWords!, q.maxWords!],
});

const TASKS = new Map(
  [
    ...[...allQuestions, formPractice].filter(isWriting).map((q) => taskOf(q, false)),
    ...mockQuestions.filter(isWriting).map((q) => taskOf(q, true)),
  ].map((task) => [task.id, task]),
);

export const writingTaskOf = (id: unknown) => (typeof id === "string" ? TASKS.get(id) : undefined);
