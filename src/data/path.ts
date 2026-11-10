import { units } from "./curriculum";
import type { Lesson } from "./types";

// A lesson as the learning path shows it. `lesson()` gives the lesson to run.
export type PathLesson = {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  icon: string;
  lesson: () => Lesson;
};

// `number` is the displayed number, counted from 1 in path order. Stored ids never use it.
export type PathUnit = {
  id: string;
  number: number;
  icon: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  goals: string[];
  tip?: string;
  example?: string;
  lessons: PathLesson[];
};

const courseLesson = (lesson: Lesson): PathLesson => ({
  id: lesson.id,
  title: lesson.title,
  subtitle: lesson.subtitle,
  minutes: lesson.minutes,
  icon: lesson.icon,
  lesson: () => lesson,
});

export const pathUnits: PathUnit[] = units.map((u, i) => ({
  id: u.id,
  number: i + 1,
  icon: u.icon,
  eyebrow: u.spanish,
  title: u.title,
  subtitle: u.subtitle,
  goals: u.goals,
  tip: u.tip,
  example: u.example,
  lessons: u.lessons.map(courseLesson),
}));

export const pathLessons = pathUnits.flatMap((u) => u.lessons);

// Exercises only: teaching cards are never counted.
export const pathExerciseCount = pathLessons
  .flatMap((l) => l.lesson().questions)
  .filter((q) => q.kind !== "teach").length;

// Where a lesson sits on the learning path. Practice sessions have no place.
export const pathPlace = (lessonId: string) => {
  for (const unit of pathUnits) {
    const l = unit.lessons.findIndex((lesson) => lesson.id === lessonId);

    if (l !== -1) {
      return { unit: unit.number, lesson: l + 1 };
    }
  }

  return undefined;
};

const unitNumbers: Record<string, number> = Object.fromEntries(
  pathUnits.map((u) => [u.id, u.number]),
);

// The displayed number of a course unit, given its course index from 1, as words.json stores it.
// Every course unit is on the path.
export const courseUnitNumber = (courseUnit: number) => unitNumbers[units[courseUnit - 1].id];
