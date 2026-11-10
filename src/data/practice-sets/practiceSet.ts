import type { Lesson, Question } from "../types.ts";
import type { SetLesson } from "./setLesson.ts";

// `name` and `note` are the practice studio card's title and subline; `title` and
// `description` head the set's page. A unit sits on the learning path right after course unit
// `after`, counted from 1; `subtitle` says what it teaches.
export type PracticeSet = {
  id: string;
  route: `practice/${string}`;
  name: string;
  note: string;
  icon: string;
  title: string;
  description: string;
  units: { id: string; after: number; subtitle: string; lessons: SetLesson[] }[];
  lessons: SetLesson[];
  // Exercises only; teaching cards never join the exercise bank.
  questions: Question[];
  lesson: (id: string, random?: () => number) => Lesson;
};
