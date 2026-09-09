// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { audioKey } from "../src/data/audio.ts";
import { phrases } from "./audio-catalog.mjs";
import { courseVoices, createMissingPlan, directPhrase } from "./audio-direction.mjs";
import { createPlan, generateClips } from "./elevenlabs.mjs";
import { clipCredits } from "./audio-budget.mjs";

let root;
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "paso-directed-audio-"));
  await mkdir(join(root, "src/data"), { recursive: true });
  await mkdir(join(root, "public/audio/elevenlabs"), { recursive: true });
  await writeFile(join(root, "src/data/audio-sources.json"), "{}");
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("directed Spanish recordings", () => {
  it("keeps the course text and lookup key intact while budgeting every submitted tag", () => {
    const voices = new Set();
    for (const text of phrases) {
      const direction = directPhrase(text);
      const [clip] = createPlan([text], direction.voiceId, direction);
      expect(clip.key).toBe(audioKey(text));
      expect(clip.body).toMatchObject({
        model_id: "eleven_v3",
        language_code: "es",
        voice_settings: { stability: 0.5 },
      });
      expect(clip.body.text.replace(/\[[a-z]+\]\s*/g, "")).toBe(text);
      expect(clipCredits(clip)).toBe(clip.body.text.length);
      expect(courseVoices.some((v) => v.id === clip.voiceId)).toBe(true);
      voices.add(clip.voiceId);
    }
    expect(voices.size).toBe(3);
  });
  it("matches first-person speakers and varies delivery without changing the lesson", () => {
    expect(directPhrase("Yo soy Marta.").voiceId).toBe(courseVoices[0].id);
    expect(directPhrase("Me llamo Pablo.").voiceId).toBe(courseVoices[1].id);
    expect(directPhrase("¿Dónde vives?").tags).toBe("[curious] [slowly]");
    expect(directPhrase("Hola, Ana.").tags).toBe("[warmly] [slowly]");
    expect(directPhrase("apellidos").tags).toBe("[calm] [slowly]");
  });
  it("restores a reviewed take's exact settings when its selected file goes missing", async () => {
    const direction = directPhrase("dieciséis");
    const [original] = createPlan(["dieciséis"], direction.voiceId, direction);
    const [reviewed] = createPlan(["dieciséis"], direction.voiceId, {
      ...direction,
      seed: 20260910,
      voiceSettings: { stability: 1 },
      spokenText: "dieciséis.",
    });
    expect(reviewed.src).not.toBe(original.src);
    await writeFile(
      join(root, "src/data/audio-sources.json"),
      JSON.stringify({
        [reviewed.key]: {
          src: reviewed.src,
          voiceId: reviewed.voiceId,
          request: reviewed.body,
          spokenText: reviewed.spokenText,
        },
      }),
    );
    expect(await createMissingPlan(root, ["dieciséis"])).toEqual([reviewed]);
  });
  it("preserves installed voices, repairs missing or empty assets and deduplicates phrases", async () => {
    const sources = {
      [audioKey("Hola.")]: { src: "/audio/elevenlabs/old.mp3", voiceId: "original" },
      [audioKey("Adiós.")]: { src: "/audio/elevenlabs/missing.mp3" },
      [audioKey("Gracias.")]: { src: "/audio/elevenlabs/empty.mp3" },
    };
    const manifest = join(root, "src/data/audio-sources.json");
    await writeFile(manifest, JSON.stringify(sources));
    await writeFile(join(root, "public/audio/elevenlabs/old.mp3"), Buffer.alloc(1500));
    await writeFile(join(root, "public/audio/elevenlabs/empty.mp3"), "");
    const plan = await createMissingPlan(root, [
      "Hola.",
      "Adiós.",
      "Gracias.",
      "apellidos",
      "apellidos",
    ]);
    expect(plan.map((c) => c.text)).toEqual(["Adiós.", "Gracias.", "apellidos"]);
    expect(JSON.parse(await readFile(manifest, "utf8"))).toEqual(sources);
  });
  it("sends each selected voice, saves tagged provenance, and resumes without a paid request", async () => {
    const plan = await createMissingPlan(root, ["Yo soy Marta.", "Me llamo Pablo."]);
    plan.push(
      ...createPlan(["9:00"], courseVoices[1].id, {
        ...directPhrase("9:00"),
        spokenText: "las nueve de la mañana",
      }),
    );
    const calls = [];
    const options = {
      root,
      plan,
      apiKey: "test-secret",
      log: () => {},
      getSubscription: async () => ({
        tier: "creator",
        character_count: 0,
        character_limit: 100000,
        max_credit_limit_extension: 0,
        next_character_count_reset_unix: Math.floor(Date.now() / 1000) + 86400,
      }),
      request: async (url, options) => {
        calls.push([url, JSON.parse(options.body)]);
        const bytes = Buffer.alloc(1500);
        bytes.write("ID3");
        return new Response(bytes, { headers: { "content-type": "audio/mpeg" } });
      },
    };
    expect(await generateClips(options)).toBe(3);
    expect(calls.map(([url]) => url.split("/").at(-1).split("?")[0])).toEqual([
      courseVoices[0].id,
      courseVoices[1].id,
      courseVoices[1].id,
    ]);
    expect(calls.map(([, body]) => body.text)).toEqual(plan.map((c) => c.body.text));
    const sources = JSON.parse(await readFile(join(root, "src/data/audio-sources.json"), "utf8"));
    expect(sources[audioKey("9:00")].spokenText).toBe("las nueve de la mañana");
    for (const clip of plan) {
      expect(sources[clip.key]).toMatchObject({
        voiceId: clip.voiceId,
        modelId: "eleven_v3",
        text: clip.text,
        request: clip.body,
      });
    }
    expect(
      await createMissingPlan(
        root,
        plan.map((c) => c.text),
      ),
    ).toEqual([]);
    expect(await generateClips(options)).toBe(0);
    expect(calls).toHaveLength(3);
  });
});
