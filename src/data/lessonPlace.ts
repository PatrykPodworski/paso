import { units } from "./curriculum";

// Where a lesson sits on the learning path, counted from 1. Practice sessions have no place.
export const lessonPlace = (lessonId: string) => {
  for (const [u, unit] of units.entries()) {
    const l = unit.lessons.findIndex((lesson) => lesson.id === lessonId);

    if (l !== -1) {
      return { unit: u + 1, lesson: l + 1 };
    }
  }

  return undefined;
};
