import { units } from "../../data/curriculum";
import { mockExam } from "../../data/mock";
import { courseUnitNumber, pathUnitNumber } from "../../data/path";
import { practiceSets } from "../../data/practice-sets/index";
import { lessonBuilder } from "../../data/practice-sets/lesson";
import type { Question } from "../../data/types";

type Group = { id: string; title: string; rows: { question: Question; context: string }[] };

export const exerciseGroups: Group[] = [
  ...units.map((u, i) => ({
    id: u.id,
    title: `Unit ${courseUnitNumber(i + 1)} · ${u.title}`,
    rows: u.lessons.flatMap((l) => l.questions.map((question) => ({ question, context: l.title }))),
  })),
  ...practiceSets.flatMap((s) => {
    const { lessonItems } = lessonBuilder(s.questions);

    return s.units
      .filter((u) => u.lessons.length)
      .map((u) => ({
        id: u.id,
        title: `${s.name} · Unit ${pathUnitNumber(u.id)}`,
        rows: u.lessons.flatMap((l) =>
          lessonItems(l).map((question) => ({ question, context: l.title })),
        ),
      }));
  }),
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

export const exerciseRowCount = exerciseGroups.reduce((n, g) => n + g.rows.length, 0);
