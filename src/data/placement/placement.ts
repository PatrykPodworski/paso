import { randomFrom, randomSeed } from "../random.ts";
import type { Question } from "../types.ts";
import { questionOf } from "../practice-sets/item.ts";
import { lessonBuilder } from "../practice-sets/lesson.ts";
import type { PracticeSet } from "../practice-sets/practiceSet.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";
import { m01, m01Items } from "./m01.ts";
import { m02, m02Items, mr01 } from "./m02.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const placementQuestions: Question[] = [...m01Items, ...m02Items].map(questionOf);

export const placementLessons: SetLesson[] = [m01, m02, mr01];

const UNITS = [
  {
    after: 4,
    subtitle: "en, dentro de, fuera de, encima de, debajo de",
    ids: ["pl-m01", "pl-m02", "pl-mr01"],
  },
  {
    after: 4,
    subtitle: "delante de, detrás de, enfrente de, al lado de, entre",
    ids: ["pl-m03", "pl-m04", "pl-mr02"],
  },
  {
    after: 4,
    subtitle: "cerca de, lejos de, a la izquierda de, a la derecha de",
    ids: ["pl-m05", "pl-m06", "pl-mr03"],
  },
];

export const placementUnits = UNITS.map(({ after, subtitle, ids }, i) => ({
  id: `pl-u${i + 1}`,
  after,
  subtitle,
  lessons: placementLessons.filter((l) => ids.includes(l.id)),
}));

const { lessonFrom } = lessonBuilder(placementQuestions);

export const placementLesson = (id: string, random = randomFrom(randomSeed())) =>
  lessonFrom(
    placementLessons.find((l) => l.id === id)!,
    random,
  );

export const placementSet: PracticeSet = {
  id: "placement",
  route: "practice/placement",
  name: "Where things are",
  note: "14 place phrases, two or three new phrases per lesson",
  icon: "map",
  title: "Where things are.",
  description:
    "Learn 14 Spanish phrases that say where things are, two or three new phrases per lesson.",
  units: placementUnits,
  lessons: placementLessons,
  questions: placementQuestions,
  lesson: placementLesson,
};
