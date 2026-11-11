import { randomFrom, randomSeed } from "../random.ts";
import type { Question } from "../types.ts";
import { questionOf } from "../practice-sets/item.ts";
import { lessonBuilder } from "../practice-sets/lesson.ts";
import type { PracticeSet } from "../practice-sets/practiceSet.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";
import { calendarItems } from "./calendar.ts";
import { l01, l02, l03, r01, r02 } from "./lessons.ts";
import { t01Items } from "./t01.ts";
import { t02Items } from "./t02.ts";
import { t03Items } from "./t03.ts";
import { t04Items } from "./t04.ts";
import { t05Items } from "./t05.ts";
import { t06Items } from "./t06.ts";
import { t07Items } from "./t07.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const weekdaysQuestions: Question[] = [
  ...t01Items,
  ...t02Items,
  ...t03Items,
  ...t04Items,
  ...t05Items,
  ...t06Items,
  ...t07Items,
  ...calendarItems,
].map(questionOf);

export const weekdaysLessons: SetLesson[] = [l01, l02, r01, l03, r02];

const UNITS = [
  { after: 5, subtitle: "lunes to viernes", ids: ["wd-l01", "wd-l02", "wd-r01"] },
  { after: 5, subtitle: "the weekend and the whole week", ids: ["wd-l03", "wd-r02"] },
];

export const weekdaysUnits = UNITS.map(({ after, subtitle, ids }, i) => ({
  id: `wd-u${i + 1}`,
  after,
  subtitle,
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
  note: "the seven days, two or three at a time",
  icon: "clock",
  title: "Weekdays.",
  description: "Learn the seven days of the week in Spanish, two or three new days per lesson.",
  units: weekdaysUnits,
  lessons: weekdaysLessons,
  questions: weekdaysQuestions,
  lesson: weekdaysLesson,
};
