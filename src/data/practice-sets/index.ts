import { askingQuestionsSet } from "../asking-questions/askingQuestions.ts";
import type { PracticeSet } from "./practiceSet.ts";

export const practiceSets: PracticeSet[] = [askingQuestionsSet];

export const setLessons = practiceSets.flatMap((s) => s.lessons);

export const setQuestions = practiceSets.flatMap((s) => s.questions);

export const setOf = (lessonId: string) =>
  practiceSets.find((s) => s.lessons.some((l) => l.id === lessonId));
