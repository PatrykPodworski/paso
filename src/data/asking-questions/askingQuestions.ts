import { randomFrom, randomSeed } from "../random.ts";
import type { Question } from "../types.ts";
import { questionOf } from "../practice-sets/item.ts";
import { lessonBuilder } from "../practice-sets/lesson.ts";
import type { PracticeSet } from "../practice-sets/practiceSet.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";
import { l01, t01Items } from "./t01.ts";
import { l02, t02Items } from "./t02.ts";
import { l03, t03Items } from "./t03.ts";
import { l04, r01, t04Items } from "./t04.ts";
import { l05, t05Items } from "./t05.ts";
import { l06, t06Items } from "./t06.ts";
import { l07, t07Items } from "./t07.ts";
import { l08, r02, t08Items } from "./t08.ts";
import { l09, t09Items } from "./t09.ts";
import { l10, t10Items } from "./t10.ts";
import { l11, t11Items } from "./t11.ts";
import { l12, r03, t12Items } from "./t12.ts";
import { l13, t13Items } from "./t13.ts";
import { l14, t14Items } from "./t14.ts";
import { l15, t15Items } from "./t15.ts";
import { l16, t16Items } from "./t16.ts";
import { l17, t17Items } from "./t17.ts";
import { l18, r04, t18Items } from "./t18.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const askingQuestions: Question[] = [
  ...t01Items,
  ...t02Items,
  ...t03Items,
  ...t04Items,
  ...t05Items,
  ...t06Items,
  ...t07Items,
  ...t08Items,
  ...t09Items,
  ...t10Items,
  ...t11Items,
  ...t12Items,
  ...t13Items,
  ...t14Items,
  ...t15Items,
  ...t16Items,
  ...t17Items,
  ...t18Items,
].map(questionOf);

export const askingLessons: SetLesson[] = [
  l01,
  l02,
  l03,
  l04,
  r01,
  l05,
  l06,
  l07,
  l08,
  r02,
  l09,
  l10,
  l11,
  l12,
  r03,
  l13,
  l14,
  l15,
  l16,
  l17,
  l18,
  r04,
];

const UNITS = [
  ["aq-l01", "aq-l02", "aq-l03", "aq-l04", "aq-r01"],
  ["aq-l05", "aq-l06", "aq-l07", "aq-l08", "aq-r02"],
  ["aq-l09", "aq-l10", "aq-l11", "aq-l12", "aq-r03"],
  ["aq-l13", "aq-l14", "aq-l15", "aq-l16", "aq-l17", "aq-l18", "aq-r04"],
];

export const askingUnits = UNITS.map((ids, i) => ({
  id: `aq-u${i + 1}`,
  title: `Unit ${i + 1}`,
  lessons: askingLessons.filter((l) => ids.includes(l.id)),
}));

export const { lessonFrom } = lessonBuilder(askingQuestions);

export const askingLesson = (id: string, random = randomFrom(randomSeed())) =>
  lessonFrom(
    askingLessons.find((l) => l.id === id)!,
    random,
  );

export const askingQuestionsSet: PracticeSet = {
  id: "asking-questions",
  route: "practice/questions",
  name: "Asking questions",
  note: "one new question word per lesson",
  icon: "people",
  title: "Asking questions.",
  description: "Form and ask questions in Spanish, one new question word per lesson.",
  units: askingUnits,
  lessons: askingLessons,
  questions: askingQuestions,
  lesson: askingLesson,
};
