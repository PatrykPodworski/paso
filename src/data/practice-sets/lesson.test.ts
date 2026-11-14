import { expect, it } from "vitest";
import { lessonBuilder } from "./lesson";
import { questionOf } from "./item";
import type { SetLesson } from "./setLesson";

const exercise = questionOf({
  id: "WT-T01-E01",
  mode: "cloze",
  prompt: "The book is in the box.",
  answer: "en",
  say: "El libro está en la caja.",
  feedback: "",
  hints: ["", ""],
});

const lesson = (formCards: SetLesson["formCards"]): SetLesson => ({
  id: "wt-m01",
  title: "In and inside",
  subtitle: "",
  recalled: [],
  base: ["WT-T01-E01"],
  formCards,
  variations: [],
});

it("puts a form card's structured content on the card before its exercise", () => {
  const { lessonItems } = lessonBuilder([exercise]);

  const teach = {
    heading: "en el, dentro del, fuera del",
    rule: "de + el becomes del. en never joins el.",
    examples: [{ es: "El móvil está dentro del bolsillo.", en: "The phone is in the pocket." }],
  };

  const [card] = lessonItems(lesson([{ before: "WT-T01-E01", teach }]));

  expect(card).toEqual({
    id: "WT-T01-E01-FORM",
    kind: "teach",
    skill: "reading",
    prompt: "en el, dentro del, fuera del",
    answer: "",
    explanation: "",
    teach: {
      heading: "en el, dentro del, fuera del",
      rule: "de + el becomes del. en never joins el.",
      examples: [{ es: "El móvil está dentro del bolsillo.", en: "The phone is in the pocket." }],
    },
  });
});

it("keeps a plain-text form card's heading and text", () => {
  const { lessonItems } = lessonBuilder([exercise]);

  const [card] = lessonItems(
    lesson([{ before: "WT-T01-E01", heading: "en", text: "en means in or on." }]),
  );

  expect([card.id, card.prompt, card.explanation, card.teach]).toEqual([
    "WT-T01-E01-FORM",
    "en",
    "en means in or on.",
    undefined,
  ]);
});

it("opens a lesson's variations in the same order every time, an order its id draws", () => {
  const exercises = Array.from({ length: 8 }, (_, i) => ({ ...exercise, id: `WT-T01-V0${i}` }));
  const ids = exercises.map((q) => q.id);
  const { lessonFrom } = lessonBuilder(exercises);
  const review = (id: string) => ({ ...lesson([]), id, base: [], variations: ids });
  const order = (id: string) => lessonFrom(review(id)).questions.map((q) => q.id);

  expect(order("wt-r01")).toEqual(order("wt-r01"));
  expect(order("wt-r01")).not.toEqual(ids);
  expect(order("wt-r01")).not.toEqual(order("wt-r02"));
  expect(order("wt-r01").toSorted()).toEqual(ids);
});
