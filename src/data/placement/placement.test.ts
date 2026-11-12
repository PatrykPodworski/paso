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

  it.each([1, 2, 3])(
    "opens pl-m03 on its introduction, the base items with the form card before SP-T06-N04, then every variation with three on unit 1's phrases (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-m03", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-m03",
        title: "In front, behind and opposite",
        subtitle: "delante de, detrás de and enfrente de",
        minutes: 12,
      });

      expect(kindsOf("pl-m03", seed, 14)).toEqual([
        ["SP-M03-INTRO", "teach"],
        ["SP-T06-N01", "choice"],
        ["SP-T07-N01", "choice"],
        ["SP-T14-N01", "choice"],
        ["SP-T06-N02", "type"],
        ["SP-T07-N02", "type"],
        ["SP-T14-N02", "type"],
        ["SP-T06-N03", "type"],
        ["SP-T07-N03", "type"],
        ["SP-T14-N03", "type"],
        ["SP-T06-N04-FORM", "teach"],
        ["SP-T06-N04", "type"],
        ["SP-T07-N04", "type"],
        ["SP-T14-N04", "type"],
      ]);

      expect(
        lesson.questions
          .slice(14)
          .map((q) => q.id)
          .sort(),
      ).toEqual([
        "SP-M03-X01",
        "SP-M03-X02",
        "SP-M03-X03",
        "SP-T06-N05",
        "SP-T06-N06",
        "SP-T06-N07",
        "SP-T07-N05",
        "SP-T07-N06",
        "SP-T07-N07",
        "SP-T14-N05",
        "SP-T14-N06",
        "SP-T14-N07",
      ]);
    },
  );

  it.each([1, 2, 3])(
    "opens pl-m04 on its introduction, the base items with the form card before SP-T08-N04, then every variation with three on earlier phrases (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-m04", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-m04",
        title: "Next to and between",
        subtitle: "al lado de and entre",
        minutes: 9,
      });

      expect(kindsOf("pl-m04", seed, 10)).toEqual([
        ["SP-M04-INTRO", "teach"],
        ["SP-T08-N01", "choice"],
        ["SP-T09-N01", "choice"],
        ["SP-T08-N02", "type"],
        ["SP-T09-N02", "type"],
        ["SP-T08-N03", "type"],
        ["SP-T09-N03", "type"],
        ["SP-T08-N04-FORM", "teach"],
        ["SP-T08-N04", "type"],
        ["SP-T09-N04", "type"],
      ]);

      expect(
        lesson.questions
          .slice(10)
          .map((q) => q.id)
          .sort(),
      ).toEqual([
        "SP-M04-X01",
        "SP-M04-X02",
        "SP-M04-X03",
        "SP-T08-N05",
        "SP-T08-N06",
        "SP-T08-N07",
        "SP-T09-N05",
        "SP-T09-N06",
        "SP-T09-N07",
      ]);
    },
  );

  it.each([1, 2, 3])(
    "opens pl-m05 on its introduction, the base items with the form card before SP-T10-N04, then every variation with three on earlier phrases (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-m05", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-m05",
        title: "Near and far",
        subtitle: "cerca de and lejos de",
        minutes: 9,
      });

      expect(kindsOf("pl-m05", seed, 10)).toEqual([
        ["SP-M05-INTRO", "teach"],
        ["SP-T10-N01", "choice"],
        ["SP-T11-N01", "choice"],
        ["SP-T10-N02", "type"],
        ["SP-T11-N02", "type"],
        ["SP-T10-N03", "type"],
        ["SP-T11-N03", "type"],
        ["SP-T10-N04-FORM", "teach"],
        ["SP-T10-N04", "type"],
        ["SP-T11-N04", "type"],
      ]);

      expect(
        lesson.questions
          .slice(10)
          .map((q) => q.id)
          .sort(),
      ).toEqual([
        "SP-M05-X01",
        "SP-M05-X02",
        "SP-M05-X03",
        "SP-T10-N05",
        "SP-T10-N06",
        "SP-T10-N07",
        "SP-T11-N05",
        "SP-T11-N06",
        "SP-T11-N07",
      ]);
    },
  );

  it.each([1, 2, 3])(
    "opens pl-m06 on its introduction, the base items with the form card before SP-T12-N04, then every variation with three on earlier phrases (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-m06", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-m06",
        title: "Left and right",
        subtitle: "a la izquierda de and a la derecha de",
        minutes: 9,
      });

      expect(kindsOf("pl-m06", seed, 10)).toEqual([
        ["SP-M06-INTRO", "teach"],
        ["SP-T12-N01", "choice"],
        ["SP-T13-N01", "choice"],
        ["SP-T12-N02", "type"],
        ["SP-T13-N02", "type"],
        ["SP-T12-N03", "type"],
        ["SP-T13-N03", "type"],
        ["SP-T12-N04-FORM", "teach"],
        ["SP-T12-N04", "type"],
        ["SP-T13-N04", "type"],
      ]);

      expect(
        lesson.questions
          .slice(10)
          .map((q) => q.id)
          .sort(),
      ).toEqual([
        "SP-M06-X01",
        "SP-M06-X02",
        "SP-M06-X03",
        "SP-T12-N05",
        "SP-T12-N06",
        "SP-T12-N07",
        "SP-T13-N05",
        "SP-T13-N06",
        "SP-T13-N07",
      ]);
    },
  );

  it("shows pl-m01's three phrases on its introduction card and their el forms on its form card", () => {
    const questions = placementLesson("pl-m01", randomFrom(1)).questions;
    const [intro, form] = [questions[0], questions[10]];

    expect(intro.teach!.terms!.map((t) => [t.es, t.meaning])).toEqual([
      ["en", "in, on"],
      ["dentro de", "inside"],
      ["fuera de", "outside"],
    ]);

    expect([form.prompt, form.teach!.rule]).toEqual([
      "en el, dentro del, fuera del",
      "de + el becomes del, de + la stays as it is, and en never joins el.",
    ]);

    expect(form.teach!.examples!.map((e) => e.es)).toEqual([
      "El libro está en el armario.",
      "El billete está dentro de la mochila.",
      "El móvil está dentro del bolsillo.",
      "La taza está fuera del cajón.",
    ]);
  });

  it("shows pl-m02's two phrases on its introduction card and their del forms on its form card", () => {
    const questions = placementLesson("pl-m02", randomFrom(1)).questions;
    const [intro, form] = [questions[0], questions[7]];

    expect(intro.teach!.terms!.map((t) => [t.es, t.meaning])).toEqual([
      ["encima de", "on top of, above"],
      ["debajo de", "under"],
    ]);

    expect([form.prompt, form.teach!.rule]).toEqual([
      "encima del, debajo del",
      "de + el becomes del, and de + la stays as it is.",
    ]);

    expect(form.teach!.examples!.map((e) => e.es)).toEqual([
      "El libro está encima de la ventana.",
      "El móvil está encima del sofá.",
      "La mochila está debajo del banco.",
    ]);
  });

  it("shows pl-m03's three phrases and where you stand on its introduction card and their del forms on its form card", () => {
    const questions = placementLesson("pl-m03", randomFrom(1)).questions;
    const [intro, form] = [questions[0], questions[10]];

    expect(intro.teach!.terms!.map((t) => [t.es, t.meaning])).toEqual([
      ["delante de", "in front of"],
      ["detrás de", "behind"],
      ["enfrente de", "opposite"],
    ]);

    expect(intro.teach!.terms!.flatMap((t) => t.note ?? [])).toEqual([
      "Front and behind depend on where you stand: the instructions always say it.",
    ]);

    expect([form.prompt, form.teach!.rule]).toEqual([
      "delante del, detrás del, enfrente del",
      "de + el becomes del, and de + la stays as it is.",
    ]);

    expect(form.teach!.examples!.map((e) => e.es)).toEqual([
      "La taza está delante de la puerta.",
      "La bolsa está delante del banco.",
      "El billete está detrás del armario.",
      "El banco está enfrente del café.",
    ]);
  });

  it("shows pl-m04's two phrases on its introduction card and entre next to al lado del on its form card", () => {
    const questions = placementLesson("pl-m04", randomFrom(1)).questions;
    const [intro, form] = [questions[0], questions[7]];

    expect(intro.teach!.terms!.map((t) => [t.es, t.meaning])).toEqual([
      ["al lado de", "next to"],
      ["entre", "between"],
    ]);

    expect([form.prompt, form.teach!.rule]).toEqual([
      "al lado del, entre … y …",
      "entre takes no de, and in al lado de, de + el becomes del while de + la stays as it is.",
    ]);

    expect(form.teach!.examples!.map((e) => e.es)).toEqual([
      "El móvil está entre el armario y el sofá.",
      "El billete está al lado de la lámpara.",
      "El libro está al lado del armario.",
    ]);
  });

  it("shows pl-m05's two phrases on its introduction card and their del forms on its form card", () => {
    const questions = placementLesson("pl-m05", randomFrom(1)).questions;
    const [intro, form] = [questions[0], questions[7]];

    expect(intro.teach!.terms!.map((t) => [t.es, t.meaning])).toEqual([
      ["cerca de", "near"],
      ["lejos de", "far from"],
    ]);

    expect([form.prompt, form.teach!.rule]).toEqual([
      "cerca del, lejos del",
      "de + el becomes del, and de + la stays as it is.",
    ]);

    expect(form.teach!.examples!.map((e) => e.es)).toEqual([
      "El móvil está cerca de la silla.",
      "El libro está cerca del banco.",
      "La mochila está lejos del armario.",
    ]);
  });

  it("shows pl-m06's two phrases and where you stand on its introduction card and their del forms on its form card", () => {
    const questions = placementLesson("pl-m06", randomFrom(1)).questions;
    const [intro, form] = [questions[0], questions[7]];

    expect(intro.teach!.terms!.map((t) => [t.es, t.meaning])).toEqual([
      ["a la izquierda de", "to the left of"],
      ["a la derecha de", "to the right of"],
    ]);

    expect(intro.teach!.terms!.flatMap((t) => t.note ?? [])).toEqual([
      "Left and right depend on where you stand: the instructions always say it.",
    ]);

    expect([form.prompt, form.teach!.rule]).toEqual([
      "a la izquierda del, a la derecha del",
      "de + el becomes del, and de + la stays as it is.",
    ]);

    expect(form.teach!.examples!.map((e) => e.es)).toEqual([
      "La mochila está a la izquierda de la maleta.",
      "La taza está a la izquierda del armario.",
      "La bolsa está a la derecha del sofá.",
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

  it.each([1, 2, 3])(
    "runs pl-mr02 as the five phrases' del gaps, then their la translations, with no cards (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-mr02", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-mr02",
        title: "Unit review",
        subtitle: "Review this unit's lessons",
      });

      expect(lesson.questions.map((q) => q.id)).toEqual([
        "SP-T06-N04",
        "SP-T07-N04",
        "SP-T14-N04",
        "SP-T08-N04",
        "SP-T09-N04",
        "SP-T06-N05",
        "SP-T07-N05",
        "SP-T14-N05",
        "SP-T08-N05",
        "SP-T09-N05",
      ]);
    },
  );

  it.each([1, 2, 3])(
    "runs pl-mr03 as the four phrases' del gaps, then their la translations, with no cards (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-mr03", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-mr03",
        title: "Unit review",
        subtitle: "Review this unit's lessons",
      });

      expect(lesson.questions.map((q) => q.id)).toEqual([
        "SP-T10-N04",
        "SP-T11-N04",
        "SP-T12-N04",
        "SP-T13-N04",
        "SP-T10-N05",
        "SP-T11-N05",
        "SP-T12-N05",
        "SP-T13-N05",
      ]);
    },
  );

  it.each([
    ["pl-m01", 14],
    ["pl-m02", 10],
    ["pl-m03", 14],
    ["pl-m04", 10],
    ["pl-m05", 10],
    ["pl-m06", 10],
  ])("draws a new variation order each time %s opens", (id, start) => {
    const orders = [1, 2, 3, 4].map((seed) =>
      placementLesson(id, randomFrom(seed))
        .questions.slice(start)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBeGreaterThan(1);
  });

  it("lists unit 1 with pl-m01, pl-m02 and pl-mr01, unit 2 with pl-m03, pl-m04 and pl-mr02, and unit 3 with pl-m05, pl-m06 and pl-mr03", () => {
    expect(
      placementUnits.map((u) => [u.id, u.after, u.subtitle, u.lessons.map((l) => l.id)]),
    ).toEqual([
      [
        "pl-u1",
        4,
        "en, dentro de, fuera de, encima de, debajo de",
        ["pl-m01", "pl-m02", "pl-mr01"],
      ],
      [
        "pl-u2",
        4,
        "delante de, detrás de, enfrente de, al lado de, entre",
        ["pl-m03", "pl-m04", "pl-mr02"],
      ],
      [
        "pl-u3",
        4,
        "cerca de, lejos de, a la izquierda de, a la derecha de",
        ["pl-m05", "pl-m06", "pl-mr03"],
      ],
    ]);
  });
});
