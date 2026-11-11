import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { placementLesson, placementUnits } from "./placement";

const variationsOf = (t: string) =>
  Array.from({ length: 12 }, (_, i) => `${t}-V${String(i + 1).padStart(2, "0")}`);

describe("placement lessons", () => {
  it.each([1, 2, 3])(
    "opens L01 on its introduction, the base items with the form card before E05, then every variation (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-l01", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-l01",
        title: "In or on",
        subtitle: "Learn one new phrase",
      });

      expect(lesson.questions.slice(0, 8).map((q) => [q.id, q.kind])).toEqual([
        ["SP-T01-INTRO", "teach"],
        ["SP-T01-E01", "choice"],
        ["SP-T01-E02", "type"],
        ["SP-T01-E03", "type"],
        ["SP-T01-E04", "type"],
        ["SP-T01-E05-FORM", "teach"],
        ["SP-T01-E05", "type"],
        ["SP-T01-E06", "write"],
      ]);

      expect(
        lesson.questions
          .slice(8)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("SP-T01"));
    },
  );

  it.each([1, 2, 3])(
    "opens L02 on T01's recalled V09, its introduction, the base items with the form card before E05, then every variation (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-l02", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-l02",
        title: "Inside",
        subtitle: "Learn one new phrase",
      });

      expect(lesson.questions.slice(0, 9).map((q) => [q.id, q.kind])).toEqual([
        ["SP-T01-V09", "type"],
        ["SP-T02-INTRO", "teach"],
        ["SP-T02-E01", "choice"],
        ["SP-T02-E02", "type"],
        ["SP-T02-E03", "type"],
        ["SP-T02-E04", "type"],
        ["SP-T02-E05-FORM", "teach"],
        ["SP-T02-E05", "type"],
        ["SP-T02-E06", "write"],
      ]);

      expect(
        lesson.questions
          .slice(9)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("SP-T02"));
    },
  );

  it("shows dentro de on the L02 introduction card and dentro de la, dentro del on its form card", () => {
    const [, intro, , , , , form] = placementLesson("pl-l02", randomFrom(1)).questions;

    expect([intro.prompt, intro.explanation]).toEqual([
      "New phrase: dentro de",
      "dentro de means inside. Example: La bolsa está dentro de la maleta.",
    ]);

    expect([form.prompt, form.explanation]).toEqual([
      "dentro de la, dentro del",
      "Before la, de stays on its own: El móvil está dentro de la bolsa. Before el, de + el becomes del: La mochila está dentro del armario.",
    ]);
  });

  it.each([1, 2, 3])(
    "opens L03 on T02's recalled V09, its introduction, the base items with the form card before E05, then every variation (seed %i)",
    (seed) => {
      const lesson = placementLesson("pl-l03", randomFrom(seed));

      expect(lesson).toMatchObject({
        id: "pl-l03",
        title: "Outside",
        subtitle: "Learn one new phrase",
      });

      expect(lesson.questions.slice(0, 9).map((q) => [q.id, q.kind])).toEqual([
        ["SP-T02-V09", "type"],
        ["SP-T03-INTRO", "teach"],
        ["SP-T03-E01", "choice"],
        ["SP-T03-E02", "type"],
        ["SP-T03-E03", "type"],
        ["SP-T03-E04", "type"],
        ["SP-T03-E05-FORM", "teach"],
        ["SP-T03-E05", "type"],
        ["SP-T03-E06", "write"],
      ]);

      expect(
        lesson.questions
          .slice(9)
          .map((q) => q.id)
          .sort(),
      ).toEqual(variationsOf("SP-T03"));
    },
  );

  it("shows fuera de on the L03 introduction card and fuera de la, fuera del on its form card", () => {
    const [, intro, , , , , form] = placementLesson("pl-l03", randomFrom(1)).questions;

    expect([intro.prompt, intro.explanation]).toEqual([
      "New phrase: fuera de",
      "fuera de means outside. Example: La bolsa está fuera de la maleta.",
    ]);

    expect([form.prompt, form.explanation]).toEqual([
      "fuera de la, fuera del",
      "Before la, de stays on its own: El móvil está fuera de la bolsa. Before el, de + el becomes del: La mochila está fuera del armario.",
    ]);
  });

  it("shows en on the introduction card and en la, en el on the form card", () => {
    const [intro, , , , , form] = placementLesson("pl-l01", randomFrom(1)).questions;

    expect([intro.prompt, intro.explanation]).toEqual([
      "New phrase: en",
      "en means in or on. Example: La bolsa está en la maleta.",
    ]);

    expect([form.prompt, form.explanation]).toEqual([
      "en la, en el",
      "en never joins the article: El móvil está en la mesa. La mochila está en el armario.",
    ]);
  });

  it.each([
    ["pl-l01", 8],
    ["pl-l02", 9],
    ["pl-l03", 9],
  ])("draws a new variation order each time %s opens", (id, start) => {
    const orders = [1, 2, 3, 4].map((seed) =>
      placementLesson(id, randomFrom(seed))
        .questions.slice(start)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBeGreaterThan(1);
  });

  it("lists unit 1 with L01 to L03 and leaves the units without lessons empty", () => {
    expect(placementUnits.map((u) => [u.id, u.after, u.lessons.map((l) => l.id)])).toEqual([
      ["pl-u1", 4, ["pl-l01", "pl-l02", "pl-l03"]],
      ["pl-u2", 4, []],
      ["pl-u3", 4, []],
      ["pl-u4", 4, []],
    ]);
  });
});
