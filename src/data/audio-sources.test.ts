import { describe, expect, it } from "vitest";
import { audioKey } from "./audio";
import { audioSources } from "./audio-sources";
import sources from "./audio-sources.json";

describe("bundled audio lookup", () => {
  it("keeps stable cache keys for existing course assets", () => {
    expect(audioKey("Hola.")).toBe("1kuzly3");
    expect(audioKey("")).toBe("ztntfp");
  });

  it("prefers the exact generated clip and retains the original fallback", () => {
    const first = Object.entries(sources)[0];

    // Validate public behaviour against a real known course phrase.
    expect(first).toBeDefined();
    const key = audioKey("Hola.");
    const generated = (sources as Record<string, { src: string }>)[key];

    expect(audioSources("Hola.")).toEqual(
      generated ? [generated.src, `/audio/${key}.m4a`] : [`/audio/${key}.m4a`],
    );

    expect(audioSources("phrase never generated 98765")).toEqual([
      `/audio/${audioKey("phrase never generated 98765")}.m4a`,
    ]);
  });
});
