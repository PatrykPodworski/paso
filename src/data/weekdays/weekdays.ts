import { randomFrom, randomSeed } from "../random.ts";
import type { Question } from "../types.ts";
import { questionOf } from "../practice-sets/item.ts";
import { lessonBuilder } from "../practice-sets/lesson.ts";
import type { PracticeSet } from "../practice-sets/practiceSet.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";
import { l01, t01Items } from "./t01.ts";
import { l02, t02Items } from "./t02.ts";
import { l03, r01, t03Items } from "./t03.ts";
import { l04, t04Items } from "./t04.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const weekdaysQuestions: Question[] = [
  ...t01Items,
  ...t02Items,
  ...t03Items,
  ...t04Items,
].map(questionOf);

export const weekdaysLessons: SetLesson[] = [l01, l02, l03, r01, l04];

const UNITS = [
  ["wd-l01", "wd-l02", "wd-l03", "wd-r01"],
  ["wd-l04", "wd-l05", "wd-l06", "wd-r02"],
  ["wd-l07", "wd-r03"],
];

export const weekdaysUnits = UNITS.map((ids, i) => ({
  id: `wd-u${i + 1}`,
  title: `Unit ${i + 1}`,
  lessons: weekdaysLessons.filter((l) => ids.includes(l.id)),
}));

const { lessonFrom } = lessonBuilder(weekdaysQuestions);

export const weekdaysLesson = (id: string, random = randomFrom(randomSeed())) =>
  lessonFrom(
    weekdaysLessons.find((l) => l.id === id)!,
    random,
  );

export const weekdaysSet: PracticeSet = {
  id: "weekdays",
  route: "practice/weekdays",
  name: "Weekdays",
  note: "the seven days, one new day per lesson",
  icon: "clock",
  title: "Weekdays.",
  description: "Learn the seven days of the week in Spanish, one new day per lesson.",
  units: weekdaysUnits,
  lessons: weekdaysLessons,
  questions: weekdaysQuestions,
  lesson: weekdaysLesson,
};
