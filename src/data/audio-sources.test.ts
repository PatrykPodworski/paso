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
      "/audio/elevenlabs/135f9a59e6ff5b905d52d15c.mp3",
      "/audio/605891.m4a",
    ]);

    expect(audioSources("phrase never generated 98765")).toEqual([
      `/audio/${audioKey("phrase never generated 98765")}.m4a`,
    ]);
  });
});
