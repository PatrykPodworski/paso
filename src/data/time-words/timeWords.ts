import { randomFrom, randomSeed } from "../random.ts";
import type { Question } from "../types.ts";
import { questionOf } from "../practice-sets/item.ts";
import { lessonBuilder } from "../practice-sets/lesson.ts";
import type { PracticeSet } from "../practice-sets/practiceSet.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";
import { m01 } from "./m01.ts";
import { m02 } from "./m02.ts";
import { t01Items } from "./t01.ts";
import { t02Items } from "./t02.ts";
import { t03Items } from "./t03.ts";
import { t04Items } from "./t04.ts";
import { t05Items } from "./t05.ts";
import { t06Items } from "./t06.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const timeWordsQuestions: Question[] = [
  ...t01Items,
  ...t02Items,
  ...t03Items,
  ...t04Items,
  ...t05Items,
  ...t06Items,
].map(questionOf);

export const timeWordsLessons: SetLesson[] = [m01, m02];

const UNITS = [
  {
    after: 5,
    subtitle: "hoy, ahora, antes, temprano and more",
    ids: ["tm-m01", "tm-m02", "tm-m03", "tm-r01"],
  },
  {
    after: 5,
    subtitle: "por la mañana, siempre, desde and more",
    ids: ["tm-m04", "tm-m05", "tm-m06", "tm-r02"],
  },
];

export const timeWordsUnits = UNITS.map(({ after, subtitle, ids }, i) => ({
  id: `tm-u${i + 1}`,
  after,
  subtitle,
  lessons: timeWordsLessons.filter((l) => ids.includes(l.id)),
}));

const { lessonFrom } = lessonBuilder(timeWordsQuestions);

export const timeWordsLesson = (id: string, random = randomFrom(randomSeed())) =>
  lessonFrom(
    timeWordsLessons.find((l) => l.id === id)!,
    random,
  );

export const timeWordsSet: PracticeSet = {
  id: "time-words",
  route: "practice/time-words",
  name: "Time words",
  note: "hoy, luego, siempre: two or three at a time",
  icon: "sun",
  title: "Time words.",
  description:
    "Learn sixteen everyday Spanish time words, from hoy to hasta, two or three per lesson.",
  units: timeWordsUnits,
  lessons: timeWordsLessons,
  questions: timeWordsQuestions,
  lesson: timeWordsLesson,
};
