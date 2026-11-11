import { randomFrom, randomSeed } from "../random.ts";
import type { Question } from "../types.ts";
import { questionOf } from "../practice-sets/item.ts";
import { lessonBuilder } from "../practice-sets/lesson.ts";
import type { PracticeSet } from "../practice-sets/practiceSet.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";
import { m01, m01Items } from "./m01.ts";
import { m02, m02Items, mr01 } from "./m02.ts";
import { m03, m03Items } from "./m03.ts";
import { m04, m04Items, mr02 } from "./m04.ts";
import { m05, m05Items } from "./m05.ts";
import { m06, m06Items, mr03 } from "./m06.ts";
import { m07, m07Items } from "./m07.ts";
import { m08, m08Items, mr04 } from "./m08.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const askingQuestions: Question[] = [
  ...m01Items,
  ...m02Items,
  ...m03Items,
  ...m04Items,
  ...m05Items,
  ...m06Items,
  ...m07Items,
  ...m08Items,
].map(questionOf);

export const askingLessons: SetLesson[] = [
  m01,
  m02,
  mr01,
  m03,
  m04,
  mr02,
  m05,
  m06,
  mr03,
  m07,
  m08,
  mr04,
];

const UNITS = [
  {
    after: 9,
    subtitle: "qué, cómo, dónde, cuándo",
    ids: ["aq-m01", "aq-m02", "aq-mr01"],
  },
  {
    after: 9,
    subtitle: "quién, cuál, cuánto, por qué",
    ids: ["aq-m03", "aq-m04", "aq-mr02"],
  },
  {
    after: 10,
    subtitle: "de dónde, adónde, a qué hora, con quién",
    ids: ["aq-m05", "aq-m06", "aq-mr03"],
  },
  {
    after: 11,
    subtitle: "desde cuándo, hasta cuándo, cada cuánto, de quién, para qué, por dónde",
    ids: ["aq-m07", "aq-m08", "aq-mr04"],
  },
];

export const askingUnits = UNITS.map(({ after, subtitle, ids }, i) => ({
  id: `aq-u${i + 1}`,
  after,
  subtitle,
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
  note: "two or three new question words per lesson",
  icon: "people",
  title: "Asking questions.",
  description: "Form and ask questions in Spanish, two or three new question words per lesson.",
  units: askingUnits,
  lessons: askingLessons,
  questions: askingQuestions,
  lesson: askingLesson,
};
