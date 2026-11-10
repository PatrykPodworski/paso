import { units } from "./curriculum";
import { practiceSets } from "./practice-sets/index";
import { exerciseCount, lessonBuilder } from "./practice-sets/lesson";
import type { PracticeSet } from "./practice-sets/practiceSet";
import type { SetLesson } from "./practice-sets/setLesson";
import type { Lesson, Question, Unit } from "./types";

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

// A unit before it gets its number, with the exercises the path counts for it.
type Entry = { unit: Omit<PathUnit, "number">; exercises: Question[] };

const courseLesson = (lesson: Lesson): PathLesson => ({
  id: lesson.id,
  title: lesson.title,
  subtitle: lesson.subtitle,
  minutes: lesson.minutes,
  icon: lesson.icon,
  lesson: () => lesson,
});

const courseEntry = (u: Unit): Entry => ({
  unit: {
    id: u.id,
    icon: u.icon,
    eyebrow: u.spanish,
    title: u.title,
    subtitle: u.subtitle,
    goals: u.goals,
    tip: u.tip,
    example: u.example,
    lessons: u.lessons.map(courseLesson),
  },
  exercises: u.lessons.flatMap((l) => l.questions),
});

const setEntries = (set: PracticeSet) => {
  const { lessonItems } = lessonBuilder(set.questions);

  const setLesson = (l: SetLesson): PathLesson => ({
    id: l.id,
    title: l.title,
    subtitle: l.subtitle,
    minutes: Math.ceil(exerciseCount(l) / 2),
    icon: "spark",
    lesson: () => set.lesson(l.id),
  });

  return set.units
    .map((u, k): Entry & { after: number } => ({
      after: u.after,
      unit: {
        id: u.id,
        icon: set.icon,
        eyebrow: `Part ${k + 1} of ${set.units.length}`,
        title: set.name,
        subtitle: u.subtitle,
        goals: [],
        lessons: u.lessons.map(setLesson),
      },
      // A lesson's recalled items belong to earlier lessons and are counted there.
      exercises: u.lessons.flatMap(lessonItems),
    }))
    .filter((e) => e.unit.lessons.length);
};

// The learning path: each course unit, then the set units that follow it, in registry order.
// A set unit without lessons is left out and takes no number.
export const pathModel = (courseUnits: Unit[], sets: PracticeSet[]) => {
  const setUnits = sets.flatMap(setEntries);

  const entries = courseUnits.flatMap((u, i) => [
    courseEntry(u),
    ...setUnits.filter((e) => e.after === i + 1),
  ]);

  const pathUnits: PathUnit[] = entries.map((e, i) => ({ ...e.unit, number: i + 1 }));
  const pathLessons = pathUnits.flatMap((u) => u.lessons);

  // Exercises only: teaching cards are never counted.
  const pathExerciseCount = entries
    .flatMap((e) => e.exercises)
    .filter((q) => q.kind !== "teach").length;

  // Where a lesson sits on the learning path. Practice sessions have no place.
  const pathPlace = (lessonId: string) => {
    for (const unit of pathUnits) {
      const l = unit.lessons.findIndex((lesson) => lesson.id === lessonId);

      if (l !== -1) {
        return { unit: unit.number, lesson: l + 1 };
      }
    }

    return undefined;
  };

  const unitNumbers = new Map(pathUnits.map((u) => [u.id, u.number]));

  // The displayed number of a course or set unit; a set unit without lessons has none.
  const pathUnitNumber = (unitId: string) => unitNumbers.get(unitId);

  // The displayed number of a course unit, given its course index from 1, as words.json stores it.
  // Every course unit is on the path.
  const courseUnitNumber = (courseUnit: number) => unitNumbers.get(courseUnits[courseUnit - 1].id)!;

  return { pathUnits, pathLessons, pathExerciseCount, pathPlace, pathUnitNumber, courseUnitNumber };
};

export const {
  pathUnits,
  pathLessons,
  pathExerciseCount,
  pathPlace,
  pathUnitNumber,
  courseUnitNumber,
} = pathModel(units, practiceSets);
