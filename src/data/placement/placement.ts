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
export const placementQuestions: Question[] = [
  ...t01Items,
  ...t02Items,
  ...t03Items,
  ...t04Items,
].map(questionOf);

export const placementLessons: SetLesson[] = [l01, l02, l03, l04, r01];

const UNITS = [
  {
    after: 4,
    subtitle: "en, dentro de, fuera de, encima de",
    ids: ["pl-l01", "pl-l02", "pl-l03", "pl-l04", "pl-r01"],
  },
  {
    after: 4,
    subtitle: "debajo de, delante de, detrás de, al lado de",
    ids: ["pl-l05", "pl-l06", "pl-l07", "pl-l08", "pl-r02"],
  },
  {
    after: 4,
    subtitle: "entre, cerca de, lejos de, a la izquierda de",
    ids: ["pl-l09", "pl-l10", "pl-l11", "pl-l12", "pl-r03"],
  },
  { after: 4, subtitle: "a la derecha de, enfrente de", ids: ["pl-l13", "pl-l14", "pl-r04"] },
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
  note: "14 place phrases, one new phrase per lesson",
  icon: "map",
  title: "Where things are.",
  description: "Learn 14 Spanish phrases that say where things are, one new phrase per lesson.",
  units: placementUnits,
  lessons: placementLessons,
  questions: placementQuestions,
  lesson: placementLesson,
};
