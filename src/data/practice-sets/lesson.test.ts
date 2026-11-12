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
