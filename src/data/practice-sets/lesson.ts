import { hash, randomFrom, shuffle } from "../random.ts";
import type { Lesson, Question } from "../types.ts";
import { teachingCard } from "./item.ts";
import type { SetLesson } from "./setLesson.ts";

export const exerciseCount = (l: SetLesson) =>
  l.recalled.length + l.base.length + l.variations.length;

// Builds a set's lessons from the exercises their ids name.
export const lessonBuilder = (questions: Question[]) => {
  const byId = new Map(questions.map((q) => [q.id, q]));

  const baseOf = (l: SetLesson) =>
    l.base.flatMap((id) => {
      const card = l.formCards.find((c) => c.before === id);
      const q = byId.get(id)!;

      if (!card) {
        return [q];
      }

      const formId = `${id}-FORM`;

      return [
        "teach" in card
          ? teachingCard(formId, card.teach)
          : teachingCard(formId, card.heading, card.text),
        q,
      ];
    });

  // A review lesson has no introduction card.
  const introOf = (l: SetLesson) => (l.introduction ? [l.introduction] : []);

  return {
    // The lesson's own questions in written order; its recalled items belong to earlier lessons.
    lessonItems: (l: SetLesson) => [
      ...introOf(l),
      ...baseOf(l),
      ...l.variations.map((id) => byId.get(id)!),
    ],
    // The variations' order comes from the lesson's id, so the lesson opens in the same order
    // every time and Continue resumes where the learner stopped.
    lessonFrom: (l: SetLesson, random = randomFrom(hash(l.id))): Lesson => ({
      id: l.id,
      title: l.title,
      subtitle: l.subtitle,
      minutes: Math.ceil(exerciseCount(l) / 2),
      icon: "spark",
      questions: [
        ...l.recalled.map((id) => byId.get(id)!),
        ...introOf(l),
        ...baseOf(l),
        ...shuffle(
          l.variations.map((id) => byId.get(id)!),
          random,
        ),
      ],
    }),
  };
};
