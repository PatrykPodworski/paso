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

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const askingQuestions: Question[] = [...t01Items, ...t02Items, ...t03Items, ...t04Items].map(
  questionOf,
);

export const askingLessons: SetLesson[] = [l01, l02, l03, l04, r01];

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
  title: "Asking questions.",
  description: "Form and ask questions in Spanish, one new question word per lesson.",
  units: askingUnits,
  lessons: askingLessons,
  questions: askingQuestions,
  lesson: askingLesson,
};
