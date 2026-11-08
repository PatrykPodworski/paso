import { expect, it } from "vitest";
import { tilesOf } from "./item";

it.each([
  [
    ["¿Qué", "quieres", "?"],
    ["¿Qué", "quieres?"],
  ],
  [
    ["¿", "Qué", "lee", "Luis", "?"],
    ["¿Qué", "lee", "Luis?"],
  ],
])("joins punctuation chunks %j to their words", (chunks, tiles) => {
  expect(tilesOf(chunks)).toEqual(tiles);
});
