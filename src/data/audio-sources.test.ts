import { describe, expect, it } from "vitest";
import { audioKey } from "./audio";
import { audioSources } from "./audio-sources";

describe("bundled audio lookup", () => {
  it("keeps stable cache keys for existing course assets", () => {
    expect(audioKey("Hola.")).toBe("1kuzly3");
    expect(audioKey("")).toBe("ztntfp");
  });

  it("prefers the exact generated clip and retains the original fallback", () => {
    expect(audioSources("el escritorio")).toEqual([
      "/audio/voxcpm/273d175c2a18b9fe3a5f9bee.mp3",
      "/audio/605891.m4a",
    ]);

    expect(audioSources("la cocina")).toEqual([
      "/audio/voxcpm/401bff33039f205fe74afd37.mp3",
      "/audio/v6yukl.m4a",
    ]);

    expect(audioSources("phrase never generated 98765")).toEqual([
      `/audio/${audioKey("phrase never generated 98765")}.m4a`,
    ]);
  });
});
