import type { Lesson, Question } from "../types.ts";
import type { SetLesson } from "./setLesson.ts";

// `name` and `note` are the practice studio card's title and subline; `title` and
// `description` head the set's page.
export type PracticeSet = {
  id: string;
  route: `practice/${string}`;
  name: string;
  note: string;
  title: string;
  description: string;
  units: { id: string; title: string; lessons: SetLesson[] }[];
  lessons: SetLesson[];
  // Exercises only; teaching cards never join the exercise bank.
  questions: Question[];
  lesson: (id: string, random?: () => number) => Lesson;
};
