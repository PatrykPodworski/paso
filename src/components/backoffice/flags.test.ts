import { afterEach, expect, it } from "vitest";
import { flaggedIdList, readFlags, saveFlags } from "./flags";

afterEach(() => localStorage.clear());

it("lists the flagged ids in asset order, one per line, skipping ids no asset has", () => {
  const assets = ["audio:a1", "audio:b2", "image:hola.webp"];
  const flagged = new Set(["image:hola.webp", "audio:gone", "audio:a1"]);

  expect(flaggedIdList(assets, flagged)).toBe("audio:a1\nimage:hola.webp");
});

it("keeps the flags across a reload", () => {
  saveFlags(new Set(["audio:a1", "image:hola.webp"]));

  expect([...readFlags()]).toEqual(["audio:a1", "image:hola.webp"]);
});

it("starts empty when the stored flags are missing or broken", () => {
  expect(readFlags().size).toBe(0);

  localStorage.setItem("paso-backoffice-flags-v1", "{not json");
  expect(readFlags().size).toBe(0);

  localStorage.setItem("paso-backoffice-flags-v1", JSON.stringify({ a: 1 }));
  expect(readFlags().size).toBe(0);
});
