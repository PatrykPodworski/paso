import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { placementLesson, placementUnits } from "./placement";

const kindsOf = (id: string, seed: number, count: number) =>
  placementLesson(id, randomFrom(seed))
    .questions.slice(0, count)
    .map((q) => [q.id, q.kind]);

describe("placement lessons", () => {
  it.each([1, 2, 3])(
    "opens pl-m01 on its introduction, the base items with the form card before SP-T01-N04, then every variation (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-m01", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-m01",
        title: "In, inside and outside",
        subtitle: "en, dentro de and fuera de",
        minutes: 11,
      });

      expect(kindsOf("pl-m01", seed, 14)).toEqual([
        ["SP-M01-INTRO", "teach"],
        ["SP-T01-N01", "choice"],
        ["SP-T02-N01", "choice"],
        ["SP-T03-N01", "choice"],
        ["SP-T01-N02", "type"],
        ["SP-T02-N02", "type"],
        ["SP-T03-N02", "type"],
        ["SP-T01-N03", "type"],
        ["SP-T02-N03", "type"],
        ["SP-T03-N03", "type"],
        ["SP-T01-N04-FORM", "teach"],
        ["SP-T01-N04", "type"],
        ["SP-T02-N04", "type"],
        ["SP-T03-N04", "type"],
      ]);

      expect(
        lesson.questions
          .slice(14)
          .map((q) => q.id)
          .sort(),
      ).toEqual([
        "SP-T01-N05",
        "SP-T01-N06",
        "SP-T01-N07",
        "SP-T02-N05",
        "SP-T02-N06",
        "SP-T02-N07",
        "SP-T03-N05",
        "SP-T03-N06",
        "SP-T03-N07",
      ]);
    },
  );

  it.each([1, 2, 3])(
    "opens pl-m02 on its introduction, the base items with the form card before SP-T04-N04, then every variation with three on unit 1's first phrases (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-m02", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-m02",
        title: "On top of and under",
        subtitle: "encima de and debajo de",
        minutes: 9,
      });

      expect(kindsOf("pl-m02", seed, 10)).toEqual([
        ["SP-M02-INTRO", "teach"],
        ["SP-T04-N01", "choice"],
        ["SP-T05-N01", "choice"],
        ["SP-T04-N02", "type"],
        ["SP-T05-N02", "type"],
        ["SP-T04-N03", "type"],
        ["SP-T05-N03", "type"],
        ["SP-T04-N04-FORM", "teach"],
        ["SP-T04-N04", "type"],
        ["SP-T05-N04", "type"],
      ]);

      expect(
        lesson.questions
          .slice(10)
          .map((q) => q.id)
          .sort(),
      ).toEqual([
        "SP-M02-X01",
        "SP-M02-X02",
        "SP-M02-X03",
        "SP-T04-N05",
        "SP-T04-N06",
        "SP-T04-N07",
        "SP-T05-N05",
        "SP-T05-N06",
        "SP-T05-N07",
      ]);
    },
  );

  it("shows pl-m01's three phrases on its introduction card and their el forms on its form card", () => {
    const questions = placementLesson("pl-m01", randomFrom(1)).questions;
    const [intro, form] = [questions[0], questions[10]];

    expect([intro.prompt, intro.explanation]).toEqual([
      "New phrases: en, dentro de and fuera de",
      "en means in or on: El libro está en la caja. dentro de means inside: El móvil está dentro de la bolsa. fuera de means outside: La taza está fuera de la maleta.",
    ]);

    expect([form.prompt, form.explanation]).toEqual([
      "en el, dentro del, fuera del",
      "en never joins el: El libro está en el armario. Before la, de stays on its own: El billete está dentro de la mochila. Before el, de + el becomes del: El móvil está dentro del bolsillo. La taza está fuera del cajón.",
    ]);
  });

  it("shows pl-m02's two phrases on its introduction card and their del forms on its form card", () => {
    const questions = placementLesson("pl-m02", randomFrom(1)).questions;
    const [intro, form] = [questions[0], questions[7]];

    expect([intro.prompt, intro.explanation]).toEqual([
      "New phrases: encima de and debajo de",
      "encima de means on top of or above: La mochila está encima de la puerta. debajo de means under: La bolsa está debajo de la mesa.",
    ]);

    expect([form.prompt, form.explanation]).toEqual([
      "encima del, debajo del",
      "Before la, de stays on its own: El libro está encima de la ventana. Before el, de + el becomes del: El móvil está encima del sofá. La mochila está debajo del banco.",
    ]);
  });

  it.each([1, 2, 3])(
    "runs pl-mr01 as the five phrases' del gaps, then their la translations, with no cards (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-mr01", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-mr01",
        title: "Unit review",
        subtitle: "Review this unit's lessons",
      });

      expect(lesson.questions.map((q) => q.id)).toEqual([
        "SP-T01-N04",
        "SP-T02-N04",
        "SP-T03-N04",
        "SP-T04-N04",
        "SP-T05-N04",
        "SP-T01-N05",
        "SP-T02-N05",
        "SP-T03-N05",
        "SP-T04-N05",
        "SP-T05-N05",
      ]);
    },
  );

  it.each([
    ["pl-m01", 14],
    ["pl-m02", 10],
  ])("draws a new variation order each time %s opens", (id, start) => {
    const orders = [1, 2, 3, 4].map((seed) =>
      placementLesson(id, randomFrom(seed))
        .questions.slice(start)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBeGreaterThan(1);
  });

  it("lists unit 1 with pl-m01, pl-m02 and pl-mr01 and leaves the units without lessons empty", () => {
    expect(
      placementUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      [
        "pl-u1",
        4,
        "en, dentro de, fuera de, encima de, debajo de",
        ["pl-m01", "pl-m02", "pl-mr01"],
      ],
      ["pl-u2", 4, "delante de, detrás de, enfrente de, al lado de, entre", []],
      ["pl-u3", 4, "cerca de, lejos de, a la izquierda de, a la derecha de", []],
    ]);
  });
});
