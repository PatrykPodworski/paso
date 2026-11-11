import { askingQuestionsSet } from "../asking-questions/askingQuestions.ts";
import { placementSet } from "../placement/placement.ts";
import { weekdaysSet } from "../weekdays/weekdays.ts";
import type { PracticeSet } from "./practiceSet.ts";

export const practiceSets: PracticeSet[] = [askingQuestionsSet, weekdaysSet, placementSet];

export const setLessons = practiceSets.flatMap((s) => s.lessons);

export const setQuestions = practiceSets.flatMap((s) => s.questions);

export const setOf = (lessonId: string) =>
  practiceSets.find((s) => s.lessons.some((l) => l.id === lessonId));
