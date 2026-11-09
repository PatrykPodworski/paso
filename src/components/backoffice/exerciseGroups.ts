import { askingUnits, lessonItems } from "../../data/asking-questions/askingQuestions";
import { units } from "../../data/curriculum";
import { mockExam } from "../../data/mock";
import type { Question } from "../../data/types";

type Group = { id: string; title: string; rows: { question: Question; context: string }[] };

export const exerciseGroups: Group[] = [
  ...units.map((u, i) => ({
    id: u.id,
    title: `Unit ${i + 1} · ${u.title}`,
    rows: u.lessons.flatMap((l) => l.questions.map((question) => ({ question, context: l.title }))),
  })),
  ...askingUnits
    .filter((u) => u.lessons.length)
    .map((u) => ({
      id: u.id,
      title: `Asking questions · ${u.title}`,
      rows: u.lessons.flatMap((l) =>
        lessonItems(l).map((question) => ({ question, context: l.title })),
      ),
    })),
  {
    id: "mock",
    title: "Mock exam",
    // Every variant of every task.
    rows: mockExam.flatMap((s) =>
      s.tasks.flatMap((t) =>
        t.variants.flatMap((v) => v.questions.map((question) => ({ question, context: s.title }))),
      ),
    ),
  },
];

export const exerciseCount = exerciseGroups.reduce((n, g) => n + g.rows.length, 0);
