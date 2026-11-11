import { askingQuestionsSet } from "../asking-questions/askingQuestions.ts";
import { timeWordsSet } from "../time-words/timeWords.ts";
import { weekdaysSet } from "../weekdays/weekdays.ts";
import type { PracticeSet } from "./practiceSet.ts";

export const practiceSets: PracticeSet[] = [askingQuestionsSet, weekdaysSet, timeWordsSet];

export const setLessons = practiceSets.flatMap((s) => s.lessons);

export const setQuestions = practiceSets.flatMap((s) => s.questions);

export const setOf = (lessonId: string) =>
  practiceSets.find((s) => s.lessons.some((l) => l.id === lessonId));
