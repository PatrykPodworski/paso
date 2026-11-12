import { randomFrom, randomSeed } from "../random.ts";
import type { Question } from "../types.ts";
import { questionOf } from "../practice-sets/item.ts";
import { lessonBuilder } from "../practice-sets/lesson.ts";
import type { PracticeSet } from "../practice-sets/practiceSet.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";
import { m01, m01Items } from "./m01.ts";
import { m02, m02Items } from "./m02.ts";
import { m03, m03Items } from "./m03.ts";
import { m04, m04Items } from "./m04.ts";
import { r01, r01Items } from "./r01.ts";
import { m05, m05Items } from "./m05.ts";
import { m06, m06Items } from "./m06.ts";
import { m07, m07Items } from "./m07.ts";
import { m08, m08Items } from "./m08.ts";
import { r02, r02Items } from "./r02.ts";
import { m09, m09Items } from "./m09.ts";
import { m10, m10Items } from "./m10.ts";
import { m11, m11Items } from "./m11.ts";
import { r03, r03Items } from "./r03.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const numbersQuestions: Question[] = [
  ...m01Items,
  ...m02Items,
  ...m03Items,
  ...m04Items,
  ...r01Items,
  ...m05Items,
  ...m06Items,
  ...m07Items,
  ...m08Items,
  ...r02Items,
  ...m09Items,
  ...m10Items,
  ...m11Items,
  ...r03Items,
].map(questionOf);

export const numbersLessons: SetLesson[] = [
  m01,
  m02,
  m03,
  m04,
  r01,
  m05,
  m06,
  m07,
  m08,
  r02,
  m09,
  m10,
  m11,
  r03,
];

const UNITS = [
  { after: 2, subtitle: "cero to siete", ids: ["nu-m01", "nu-m02", "nu-m03", "nu-m04", "nu-r01"] },
  { after: 2, subtitle: "ocho to quince", ids: ["nu-m05", "nu-m06", "nu-m07", "nu-m08", "nu-r02"] },
  { after: 3, subtitle: "dieciséis to veintinueve", ids: ["nu-m09", "nu-m10", "nu-m11", "nu-r03"] },
  {
    after: 4,
    subtitle: "treinta to cien",
    ids: ["nu-m12", "nu-m13", "nu-m14", "nu-m15", "nu-r04"],
  },
];

export const numbersUnits = UNITS.map(({ after, subtitle, ids }, i) => ({
  id: `nu-u${i + 1}`,
  after,
  subtitle,
  lessons: numbersLessons.filter((l) => ids.includes(l.id)),
}));

const { lessonFrom } = lessonBuilder(numbersQuestions);

export const numbersLesson = (id: string, random = randomFrom(randomSeed())) =>
  lessonFrom(
    numbersLessons.find((l) => l.id === id)!,
    random,
  );

export const numbersSet: PracticeSet = {
  id: "numbers",
  route: "practice/numbers",
  name: "Numbers",
  note: "cero to cien, two or three at a time",
  icon: "layers",
  title: "Numbers.",
  description: "Learn the Spanish numbers from cero to cien, two or three new ones per lesson.",
  units: numbersUnits,
  lessons: numbersLessons,
  questions: numbersQuestions,
  lesson: numbersLesson,
};
