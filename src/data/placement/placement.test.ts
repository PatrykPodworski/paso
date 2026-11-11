import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { placementLesson, placementUnits } from "./placement";

const variations = Array.from(
  { length: 12 },
  (_, i) => `SP-T01-V${String(i + 1).padStart(2, "0")}`,
);

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
      ).toEqual(variations);
    },
  );

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

  it("draws a new variation order each time the lesson opens", () => {
    const orders = [1, 2, 3, 4].map((seed) =>
      placementLesson("pl-l01", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBeGreaterThan(1);
  });

  it("lists unit 1 with L01 and leaves the units without lessons empty", () => {
    expect(placementUnits.map((u) => [u.id, u.after, u.lessons.map((l) => l.id)])).toEqual([
      ["pl-u1", 4, ["pl-l01"]],
      ["pl-u2", 4, []],
      ["pl-u3", 4, []],
      ["pl-u4", 4, []],
    ]);
  });
});
