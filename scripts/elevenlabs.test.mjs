import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createPlan, generateClips, listVoices, recoverClips } from "./elevenlabs.mjs";

let root;
const mp3 = () => {
  const bytes = Buffer.alloc(1500);
  bytes.write("ID3");
  return new Response(bytes, { headers: { "content-type": "audio/mpeg" } });
};
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "paso-audio-test-"));
  await mkdir(join(root, "src/data"), { recursive: true });
  await writeFile(join(root, "src/data/audio-sources.json"), "{}");
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});
const manifest = async () =>
  JSON.parse(await readFile(join(root, "src/data/audio-sources.json"), "utf8"));
const run = (plan, request) =>
  generateClips({
    root,
    plan,
    voiceId: "spanish-voice",
    apiKey: "test-secret",
    request,
    getSubscription: async () => ({
      tier: "free",
      character_count: 0,
      character_limit: 10_000,
      max_credit_limit_extension: 0,
      next_character_count_reset_unix: Math.floor(Date.now() / 1000) + 86_400,
    }),
    log: () => {},
  });

describe("ElevenLabs audio generation", () => {
  it("recovers a billed clip with GET requests and leaves the credit ledger unchanged", async () => {
    const plan = createPlan(["Hola."], "spanish-voice");
    const item = {
      history_item_id: "completed-item",
      text: "Hola.",
      voice_id: "spanish-voice",
      model_id: plan[0].body.model_id,
      settings: plan[0].body.voice_settings,
    };
    const request = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ history: [item] })))
      .mockResolvedValueOnce(mp3());
    const ledgerPath = join(root, ".elevenlabs-usage.local.json");
    await writeFile(ledgerPath, "existing reservation");
    const options = {
      root,
      plan,
      voiceId: "spanish-voice",
      apiKey: "test-secret",
      request,
      log: () => {},
    };
    expect(await recoverClips(options)).toBe(1);
    expect((await manifest())[plan[0].key].src).toBe(plan[0].src);
    expect(await readFile(ledgerPath, "utf8")).toBe("existing reservation");
    expect(request.mock.calls.every(([, opts]) => !opts.method || opts.method === "GET")).toBe(
      true,
    );
    expect(String(request.mock.calls[1][0])).toBe(
      "https://api.elevenlabs.io/v1/history/completed-item/audio",
    );
    expect(await recoverClips(options)).toBe(0);
    expect(request).toHaveBeenCalledTimes(2);
  });
  it("does not recover a different voice, model, or delivery under the course cache key", async () => {
    const plan = createPlan(["Hola."], "spanish-voice");
    const item = {
      history_item_id: "completed-item",
      text: "Hola.",
      voice_id: "spanish-voice",
      model_id: plan[0].body.model_id,
      settings: plan[0].body.voice_settings,
    };
    const request = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            history: [
              { ...item, voice_id: "other-voice" },
              { ...item, model_id: "other-model" },
              { ...item, settings: { ...item.settings, speed: 1.2 } },
              { ...item, settings: undefined },
            ],
          }),
        ),
    );
    expect(
      await recoverClips({
        root,
        plan,
        voiceId: "spanish-voice",
        apiKey: "test-secret",
        request,
        log: () => {},
      }),
    ).toBe(0);
    expect(request).toHaveBeenCalledOnce();
    expect(await manifest()).toEqual({});
  });
  it("sends the verified API format and reuses saved clips without another paid request", async () => {
    const plan = createPlan(["Hola.", "Hola."], "spanish-voice");
    const request = vi.fn(async () => mp3());
    expect(await run(plan, request)).toBe(1);
    expect(await run(plan, request)).toBe(0);
    expect(request).toHaveBeenCalledTimes(1);
    const [url, options] = request.mock.calls[0];
    expect(url).toBe(
      "https://api.elevenlabs.io/v1/text-to-speech/spanish-voice?output_format=mp3_44100_128",
    );
    expect(options.headers["xi-api-key"]).toBe("test-secret");
    expect(options).toMatchObject({
      method: "POST",
      redirect: "error",
      headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
    });
    expect(JSON.parse(options.body)).toMatchObject({
      text: "Hola.",
      model_id: "eleven_multilingual_v2",
    });
    expect(JSON.parse(options.body)).not.toHaveProperty("language_code");
    expect((await manifest())[plan[0].key].src).toBe(plan[0].src);
    expect(JSON.stringify(await manifest())).not.toContain("test-secret");
  });
  it("resumes after an API failure without losing or regenerating the finished clip", async () => {
    const plan = createPlan(["Hola.", "Buenos días."], "spanish-voice");
    const request = vi
      .fn()
      .mockResolvedValueOnce(mp3())
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            detail: { status: "quota_exceeded", message: "private upstream details" },
          }),
          { status: 401 },
        ),
      );
    await expect(run(plan, request)).rejects.toThrow("quota_exceeded");
    expect(Object.keys(await manifest())).toEqual([plan[0].key]);
    const retry = vi.fn(async () => mp3());
    expect(await run(plan, retry)).toBe(1);
    expect(retry).toHaveBeenCalledTimes(1);
    expect(Object.keys(await manifest())).toHaveLength(2);
  });
  it("does not publish an error document or corrupt audio over an existing recording", async () => {
    const plan = createPlan(["Hola."], "spanish-voice");
    const previous = { [plan[0].key]: { src: "/audio/previous.mp3" } };
    await writeFile(join(root, "src/data/audio-sources.json"), JSON.stringify(previous));
    await expect(
      run(
        plan,
        async () => new Response("oops".repeat(400), { headers: { "content-type": "audio/mpeg" } }),
      ),
    ).rejects.toThrow("invalid MP3");
    expect(await manifest()).toEqual(previous);
  });
  it("reports a payment rejection for the current key and voice without publishing recordings", async () => {
    const plan = createPlan(["Hola."], "spanish-voice");
    const request = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ detail: { status: "payment_required", message: "private response" } }),
          { status: 402 },
        ),
    );
    await expect(run(plan, request)).rejects.toThrow("HTTP 402 (payment_required)");
    expect(await manifest()).toEqual({});
    expect(request).toHaveBeenCalledOnce();
  });
  it("changes the cache filename when the voice or spoken text changes", () => {
    const first = createPlan(["Hola."], "first")[0];
    expect(createPlan(["Hola."], "second")[0].src).not.toBe(first.src);
    expect(createPlan(["Adiós."], "first")[0].src).not.toBe(first.src);
  });
  it("collects paginated voices and excludes private account metadata", async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            voices: [{ voice_id: "uno", name: "Uno", private: "secret" }],
            has_more: true,
            next_page_token: "next",
          }),
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ voices: [{ voice_id: "dos", name: "Dos" }], has_more: false }),
        ),
      );
    const voices = await listVoices("test-secret", request);
    expect(voices.map((v) => v.id)).toEqual(["uno", "dos"]);
    expect(request.mock.calls[1][0].searchParams.get("next_page_token")).toBe("next");
    expect(JSON.stringify(voices)).not.toContain("secret");
  });
});

describe("audio cache and provider contracts", () => {
  it("rejects real phrase-key collisions before any generation", () =>
    expect(() => createPlan(["palabra 449939", "palabra 1528734"], "voice")).toThrow(
      "Audio key collision",
    ));
  it("keeps stable plans and the complete delivery settings", () => {
    const plan = createPlan(["Hola."], "voice");
    expect(createPlan(["Hola.", "Hola."], "voice")).toEqual(plan);
    expect(plan[0].body).toEqual({
      text: "Hola.",
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true,
        speed: 0.95,
      },
    });
    expect(plan[0].src).toMatch(/^\/audio\/elevenlabs\/[a-f0-9]{24}\.mp3$/);
  });
  it.each([0, 1000, 1001])(
    "recognizes a complete cached clip only above 1000 bytes: %s",
    async (size) => {
      const { isCached } = await import("./elevenlabs.mjs");
      const clip = createPlan(["Hola."], "voice")[0];
      expect(await isCached(root, clip)).toBe(false);
      await mkdir(join(root, "public/audio/elevenlabs"), { recursive: true });
      await writeFile(join(root, "public", clip.src), Buffer.alloc(size));
      expect(await isCached(root, clip)).toBe(size > 1000);
    },
  );
  it("propagates filesystem errors instead of treating them as an unused cache", async () => {
    const { isCached } = await import("./elevenlabs.mjs");
    await writeFile(join(root, "public"), "not a directory");
    await expect(isCached(root, { src: "/audio/file.mp3" })).rejects.toMatchObject({
      code: "ENOTDIR",
    });
  });
  it.each([undefined, "application/json", "text/plain"])(
    "refuses non-audio responses: %s",
    async (type) => {
      const plan = createPlan(["Hola."], "voice");
      await expect(
        run(
          plan,
          async () =>
            new Response(Buffer.alloc(1500), { headers: type ? { "content-type": type } : {} }),
        ),
      ).rejects.toThrow("non-audio");
      expect(await manifest()).toEqual({});
    },
  );
  it.each([
    [1000, [73, 68, 51], false],
    [1001, [73, 68, 51], true],
    [1500, [255, 224], true],
    [1500, [254, 224], false],
    [1500, [255, 192], false],
  ])("validates MP3 signature and length %s %j", async (size, header, valid) => {
    const bytes = Buffer.alloc(size);
    Buffer.from(header).copy(bytes);
    const plan = createPlan(["Hola."], "voice");
    const result = run(
      plan,
      async () => new Response(bytes, { headers: { "content-type": "audio/mpeg" } }),
    );
    if (valid) {
      expect(await result).toBe(1);
      expect(await readFile(join(root, "public", plan[0].src))).toEqual(bytes);
    } else {
      await expect(result).rejects.toThrow("invalid MP3");
      expect(await manifest()).toEqual({});
    }
  });
  it.each([
    [401, "Check the API key"],
    [402, "available credits"],
    [403, "Check access"],
    [429, "rate limits"],
    [500, "voice configuration"],
  ])("sanitizes upstream HTTP %s failures without retrying paid requests", async (status, hint) => {
    const request = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ detail: { status: "safe_error", message: "private sentinel" } }),
          { status },
        ),
    );
    await expect(run(createPlan(["Hola."], "voice"), request)).rejects.toThrow(
      `HTTP ${status} (safe_error)`,
    );
    expect(request).toHaveBeenCalledOnce();
    const request2 = vi.fn(async () => new Response("<html>private sentinel</html>", { status }));
    await expect(run(createPlan(["Adiós."], "voice"), request2)).rejects.toThrow(hint);
    expect(await manifest()).toEqual({});
  });
  it.each(["UPPERCASE", "private key spaces", "x".repeat(61), 123])(
    "does not echo untrusted provider status %s",
    async (status) => {
      let error;
      try {
        await run(
          createPlan(["Hola."], "voice"),
          async () =>
            new Response(JSON.stringify({ detail: { status, message: "private sentinel" } }), {
              status: 500,
            }),
        );
      } catch (e) {
        error = e;
      }
      expect(error.message).toContain("HTTP 500.");
      expect(error.message).not.toContain(String(status));
      expect(error.message).not.toContain("private sentinel");
    },
  );
  it("maps verified language metadata and validates the voice request URL and headers", async () => {
    const request = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            voices: [
              {
                voice_id: "uno",
                name: "Uno",
                labels: { accent: "spanish" },
                verified_languages: [{ language: "es", accent: "Spain", private: "secret" }],
                preview_url: "https://example.test/preview",
                private: "hidden",
              },
            ],
            has_more: false,
          }),
        ),
    );
    expect(await listVoices("fake", request)).toEqual([
      {
        id: "uno",
        name: "Uno",
        labels: { accent: "spanish" },
        languages: [{ language: "es", accent: "Spain" }],
        preview: "https://example.test/preview",
      },
    ]);
    const [url, options] = request.mock.calls[0];
    expect(url.href).toBe("https://api.elevenlabs.io/v2/voices?page_size=100");
    expect(options).toMatchObject({ headers: { "xi-api-key": "fake" }, redirect: "error" });
  });
  it.each([undefined, "same"])(
    "refuses missing or repeated pagination tokens %s",
    async (token) => {
      const request = vi.fn(
        async () =>
          new Response(JSON.stringify({ voices: [], has_more: true, next_page_token: token })),
      );
      await expect(listVoices("fake", request)).rejects.toThrow("invalid voice pagination token");
      expect(request).toHaveBeenCalledTimes(token ? 2 : 1);
    },
  );
  it("downloads history once for duplicate matching entries and ignores unrelated texts", async () => {
    const plan = createPlan(["Hola."], "voice");
    const item = {
      history_item_id: "item/one",
      text: "Hola.",
      voice_id: "voice",
      model_id: plan[0].body.model_id,
      settings: plan[0].body.voice_settings,
    };
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ history: [{ ...item, text: "other" }, item, item] })),
      )
      .mockResolvedValueOnce(mp3());
    expect(
      await recoverClips({ root, plan, voiceId: "voice", apiKey: "fake", request, log: () => {} }),
    ).toBe(1);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[0][0].href).toBe(
      "https://api.elevenlabs.io/v1/history?page_size=100&voice_id=voice",
    );
    expect(request.mock.calls[1][0]).toBe("https://api.elevenlabs.io/v1/history/item%2Fone/audio");
    expect(request.mock.calls[1][1]).toMatchObject({
      headers: { "xi-api-key": "fake" },
      redirect: "error",
    });
  });
});
