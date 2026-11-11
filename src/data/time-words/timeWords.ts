import { randomFrom, randomSeed } from "../random.ts";
import type { Question } from "../types.ts";
import { questionOf } from "../practice-sets/item.ts";
import { lessonBuilder } from "../practice-sets/lesson.ts";
import type { PracticeSet } from "../practice-sets/practiceSet.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";
import { l01, t01Items } from "./t01.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const timeWordsQuestions: Question[] = [...t01Items].map(questionOf);

export const timeWordsLessons: SetLesson[] = [l01];

const UNITS = [
  {
    after: 5,
    subtitle: "hoy, mañana, ayer, ahora",
    ids: ["tm-l01", "tm-l02", "tm-l03", "tm-l04", "tm-r01"],
  },
  {
    after: 5,
    subtitle: "antes, después, temprano, tarde",
    ids: ["tm-l05", "tm-l06", "tm-l07", "tm-l08", "tm-r02"],
  },
  {
    after: 5,
    subtitle: "por la mañana, por la tarde, por la noche, siempre",
    ids: ["tm-l09", "tm-l10", "tm-l11", "tm-l12", "tm-r03"],
  },
  {
    after: 5,
    subtitle: "a veces, nunca, desde, hasta",
    ids: ["tm-l13", "tm-l14", "tm-l15", "tm-l16", "tm-r04"],
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
  note: "hoy, luego, siempre: one new time word per lesson",
  icon: "sun",
  title: "Time words.",
  description: "Learn sixteen everyday Spanish time words, from hoy to hasta, one per lesson.",
  units: timeWordsUnits,
  lessons: timeWordsLessons,
  questions: timeWordsQuestions,
  lesson: timeWordsLesson,
};
