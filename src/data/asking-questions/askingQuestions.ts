import { randomFrom, randomSeed, shuffle } from "../random.ts";
import type { Lesson, Question } from "../types.ts";
import { questionOf, teachingCard } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";
import { l01, t01Items } from "./t01.ts";
import { l02, t02Items } from "./t02.ts";

// The set's exercises; teaching cards are not exercises and never join the exercise bank.
export const askingQuestions: Question[] = [...t01Items, ...t02Items].map(questionOf);

export const askingLessons: SetLesson[] = [l01, l02];

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

const byId = new Map(askingQuestions.map((q) => [q.id, q]));

export const exerciseCount = (l: SetLesson) =>
  l.recalled.length + l.base.length + l.variations.length;

const baseOf = (l: SetLesson) =>
  l.base.flatMap((id) => {
    const card = l.formCards.find((c) => c.before === id);
    const q = byId.get(id)!;

    return card ? [teachingCard(`${id}-FORM`, card.heading, card.text), q] : [q];
  });

// The lesson's own questions in written order; its recalled items belong to earlier lessons.
export const lessonItems = (l: SetLesson) => [
  l.introduction,
  ...baseOf(l),
  ...l.variations.map((id) => byId.get(id)!),
];

export const lessonFrom = (l: SetLesson, random: () => number): Lesson => ({
  id: l.id,
  title: l.title,
  subtitle: l.subtitle,
  minutes: Math.ceil(exerciseCount(l) / 2),
  icon: "spark",
  questions: [
    ...l.recalled.map((id) => byId.get(id)!),
    l.introduction,
    ...baseOf(l),
    ...shuffle(
      l.variations.map((id) => byId.get(id)!),
      random,
    ),
  ],
});

export const askingLesson = (id: string, random = randomFrom(randomSeed())) =>
  lessonFrom(
    askingLessons.find((l) => l.id === id)!,
    random,
  );
