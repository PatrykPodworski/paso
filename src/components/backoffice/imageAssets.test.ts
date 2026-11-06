import { readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { imageAssets } from "./imageAssets";

it("lists every unit word with its picture file", () => {
  expect(imageAssets).toHaveLength(96);

  expect(imageAssets[0]).toEqual({
    id: "image:hola.webp",
    word: "hola",
    english: "hello",
    unit: 1,
    emoji: "👋",
    src: "/illustrations/words/hola.webp",
  });

  expect(imageAssets.filter((a) => !a.src).map((a) => a.word)).toEqual([]);
});

it("covers every word picture in the repo", () => {
  const files = readdirSync("public/illustrations/words").map((f) => `image:${f}`);

  expect(imageAssets.flatMap((a) => (a.id ? [a.id] : [])).sort()).toEqual(files.sort());
});
