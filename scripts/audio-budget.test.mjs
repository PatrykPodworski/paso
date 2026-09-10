import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { budgetStatus, clipCredits, openBudget, readSubscription } from "./audio-budget.mjs";
import { createPlan, generateClips } from "./elevenlabs.mjs";

const testNow = Date.UTC(2026, 8, 9, 12);
const reset = testNow / 1000 + 86_400;
const account = (used = 0) => ({
  tier: "free",
  character_count: used,
  character_limit: 10_000,
  max_credit_limit_extension: 0,
  next_character_count_reset_unix: reset,
});
const clip = (text) => createPlan([text], "course-voice")[0];
let root;
beforeEach(async () => {
  vi.spyOn(Date, "now").mockReturnValue(testNow);
  root = await mkdtemp(join(tmpdir(), "paso-budget-test-"));
  await mkdir(join(root, "src/data"), { recursive: true });
  await writeFile(join(root, "src/data/audio-sources.json"), "{}");
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("free audio allowance", () => {
  it("uses the upgraded included allowance while retaining the shared buffer", () => {
    expect(
      budgetStatus({ ...account(10089), tier: "creator", character_limit: 121535 }),
    ).toMatchObject({ ceiling: 121035, remaining: 110946 });
    expect(() =>
      budgetStatus({ ...account(), tier: "creator", max_credit_limit_extension: 1 }),
    ).toThrow("Overage billing");
  });
  it("counts v3 tags, enforces its 5000-character limit and rejects altered course text", () => {
    const directed = (text) =>
      createPlan([text], "voice", {
        modelId: "eleven_v3",
        tags: "[calm]",
        voiceSettings: { stability: 0.5 },
      })[0];
    expect(clipCredits(directed("hola"))).toBe(11);
    expect(clipCredits(directed("a".repeat(4993)))).toBe(5000);
    expect(() => clipCredits(directed("a".repeat(4994)))).toThrow("per-request");
    expect(() => clipCredits(directed(""))).toThrow("per-request");
    expect(() => clipCredits({ ...directed("hola"), text: "adiós" })).toThrow(
      "No verified quota policy",
    );
  });
  it("budgets reviewed number expansions while retaining the original text key", () => {
    const [clip] = createPlan(["9:00"], "voice", {
      modelId: "eleven_v3",
      tags: "[calm]",
      spokenText: "las nueve de la mañana",
    });
    expect(clip.text).toBe("9:00");
    expect(clipCredits(clip)).toBe("[calm] las nueve de la mañana".length);
    expect(() => clipCredits({ ...clip, spokenText: "las diez" })).toThrow(
      "No verified quota policy",
    );
    const [empty] = createPlan(["9:00"], "voice", {
      modelId: "eleven_v3",
      tags: "[calm]",
      spokenText: "",
    });
    expect(() => clipCredits(empty)).toThrow("per-request");
  });
  it("backs off for a rate-limited read without generating or billing speech", async () => {
    const pause = vi.fn(async () => {});
    const request = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 429, headers: { "retry-after": "3" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify(account(4))));
    expect(await readSubscription("test-secret", request, pause)).toEqual(account(4));
    expect(pause.mock.calls.map(([ms]) => ms)).toEqual([1000, 3000]);
    expect(
      request.mock.calls.every(
        ([url, options]) => url.endsWith("/user/subscription") && !options.method,
      ),
    ).toBe(true);
  });
  it("subtracts existing account usage and retains a 500-credit buffer", () => {
    expect(budgetStatus(account(4))).toMatchObject({ ceiling: 9500, remaining: 9496 });
    expect(budgetStatus({ ...account(100), character_limit: 800 })).toMatchObject({
      remaining: 200,
    });
    expect(budgetStatus({ ...account(), character_limit: 50_000 }).ceiling).toBe(9500);
  });
  it("allows the exact boundary and blocks the next character", async () => {
    const budget = await openBudget({ root, getSubscription: async () => account(9496) });
    await budget.reserve(clip("hola"));
    await expect(budget.reserve(clip("a"))).rejects.toThrow("Included allowance protected");
    expect((await budget.status()).remaining).toBe(0);
  });
  it("remembers reserved requests across restarts even if the API usage has not caught up", async () => {
    const getSubscription = async () => account(9490);
    const first = await openBudget({ root, getSubscription });
    await first.reserve(clip("hola"));
    const resumed = await openBudget({ root, getSubscription });
    expect((await resumed.status()).remaining).toBe(6);
    await expect(resumed.reserve(clip("Buenos días"))).rejects.toThrow(
      "Included allowance protected",
    );
  });
  it("notices usage from elsewhere before the next request", async () => {
    const getSubscription = vi
      .fn()
      .mockResolvedValueOnce(account(9000))
      .mockResolvedValueOnce(account(9499));
    const budget = await openBudget({ root, getSubscription });
    await budget.reserve(clip("hola"));
    await expect(budget.reserve(clip("hola"))).rejects.toThrow("Included allowance protected");
    expect(getSubscription).toHaveBeenCalledTimes(2);
  });
  it("only resets local reservations when the provider reports a new billing period", () => {
    const ledger = { version: 1, reset, usageFloor: 9500 };
    expect(budgetStatus(account(), ledger).remaining).toBe(0);
    expect(
      budgetStatus({ ...account(4), next_character_count_reset_unix: reset + 30 * 86_400 }, ledger)
        .remaining,
    ).toBe(9496);
  });
  it("blocks missing usage, overage billing, unknown models and oversized requests", () => {
    expect(() => budgetStatus({ ...account(), character_count: undefined })).toThrow("Incomplete");
    expect(() => budgetStatus({ ...account(), max_credit_limit_extension: "unlimited" })).toThrow(
      "Overage billing",
    );
    expect(() => budgetStatus({ ...account(), tier: "unknown" })).toThrow(
      "Unknown ElevenLabs subscription tier",
    );
    expect(() =>
      clipCredits({ ...clip("hola"), body: { model_id: "unknown", text: "hola" } }),
    ).toThrow("No verified quota policy");
    expect(() => clipCredits(clip("a".repeat(10_001)))).toThrow("per-request");
  });
  it("blocks generation when usage is unreadable, before making a speech request", async () => {
    const request = vi.fn(async () => new Response("{}", { status: 401 }));
    await expect(
      generateClips({
        root,
        plan: [clip("hola")],
        voiceId: "course-voice",
        apiKey: "test-secret",
        request,
      }),
    ).rejects.toThrow("user_read");
    expect(request).toHaveBeenCalledOnce();
    expect(String(request.mock.calls[0][0]).endsWith("/user/subscription")).toBe(true);
    expect(await readFile(join(root, "src/data/audio-sources.json"), "utf8")).toBe("{}");
  });
  it("does not consume budget or call the API for a cached recording", async () => {
    const saved = clip("hola");
    await mkdir(join(root, "public/audio/elevenlabs"), { recursive: true });
    await writeFile(join(root, "public", saved.src), Buffer.alloc(1500));
    const request = vi.fn();
    const getSubscription = vi.fn();
    expect(
      await generateClips({
        root,
        plan: [saved],
        voiceId: "course-voice",
        apiKey: "test-secret",
        request,
        getSubscription,
        log: () => {},
      }),
    ).toBe(0);
    expect(request).not.toHaveBeenCalled();
    expect(getSubscription).not.toHaveBeenCalled();
  });
  it("never assumes unreadable subscription data means an unused allowance", async () => {
    const request = vi.fn(async () => new Response("{}", { status: 403 }));
    await expect(readSubscription("test-secret", request)).rejects.toThrow(
      "No speech request was sent",
    );
  });
});

describe("quota edge cases and failed reservations", () => {
  it.each([
    ["character_count", -1],
    ["character_count", 0.5],
    ["character_count", Number.MAX_SAFE_INTEGER + 1],
    ["character_limit", -1],
    ["character_limit", 1.5],
    ["next_character_count_reset_unix", 1.5],
    ["next_character_count_reset_unix", 0],
  ])("rejects invalid %s=%s", (key, value) =>
    expect(() => budgetStatus({ ...account(), [key]: value })).toThrow("Incomplete"),
  );
  it("rejects a billing reset exactly at now and accepts the following millisecond", () => {
    expect(() => budgetStatus(account(), null, reset * 1000)).toThrow();
    expect(budgetStatus(account(), null, reset * 1000 - 1).remaining).toBe(9500);
  });
  it.each([
    { version: 2, reset, usageFloor: 0 },
    { version: 1, reset: 1.5, usageFloor: 0 },
    { version: 1, reset, usageFloor: -1 },
    { version: 1, reset, usageFloor: 0.5 },
    { version: 1, reset: reset + 1, usageFloor: 0 },
  ])("fails closed on corrupt reservation %j", (ledger) =>
    expect(() => budgetStatus(account(), ledger)).toThrow("Invalid local"),
  );
  it("uses the higher API or local usage and never returns a negative allowance", () => {
    expect(budgetStatus(account(9501), { version: 1, reset, usageFloor: 9400 })).toEqual({
      used: 9501,
      usageFloor: 9501,
      ceiling: 9500,
      remaining: 0,
      reset,
    });
    expect(budgetStatus({ ...account(), character_limit: 499 }).ceiling).toBe(0);
    expect(budgetStatus({ ...account(), character_limit: 500 }).remaining).toBe(0);
  });
  it("counts supplementary characters conservatively and accepts exactly the request limit", () => {
    expect(clipCredits(clip("á😀"))).toBe(3);
    expect(clipCredits(clip("a".repeat(10000)))).toBe(10000);
    expect(() => clipCredits(clip(""))).toThrow("per-request");
    expect(() => clipCredits({ ...clip("hola"), text: "different" })).toThrow("quota policy");
  });
  it("fails closed on unreadable reservation JSON", async () => {
    await writeFile(join(root, ".elevenlabs-usage.local.json"), "{broken");
    await expect(openBudget({ root, getSubscription: vi.fn() })).rejects.toThrow("Cannot read");
  });
  it("writes a reservation before the paid request and retains it when the request times out", async () => {
    const plan = [clip("hola")];
    const request = vi.fn(async () => {
      const ledger = JSON.parse(await readFile(join(root, ".elevenlabs-usage.local.json"), "utf8"));
      expect(ledger).toEqual({ version: 1, reset, usageFloor: 4 });
      throw new Error("Timed out");
    });
    await expect(
      generateClips({
        root,
        plan,
        voiceId: "voice",
        apiKey: "fake",
        request,
        getSubscription: async () => account(),
        log: () => {},
      }),
    ).rejects.toThrow("Timed out");
    expect(request).toHaveBeenCalledOnce();
    expect(
      (await (await openBudget({ root, getSubscription: async () => account() })).status())
        .remaining,
    ).toBe(9496);
  });
  it.each([null, "nonsense", "1", "-3"])(
    "bounds exponential read retry for Retry-After %s",
    async (header) => {
      const request = vi.fn(
        async () =>
          new Response("{}", {
            status: 429,
            headers: header === null ? {} : { "retry-after": header },
          }),
      );
      const pause = vi.fn();
      await expect(readSubscription("fake", request, pause)).rejects.toThrow("rate limited");
      expect(request).toHaveBeenCalledTimes(3);
      expect(pause.mock.calls.map((c) => c[0])).toEqual([1000, 2000, 4000]);
    },
  );
  it("honours a date Retry-After without allowing waits over 30 seconds", async () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("{}", {
          status: 429,
          headers: { "retry-after": new Date(now + 10000).toUTCString() },
        }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify(account())));
    const pause = vi.fn();
    await readSubscription("fake", request, pause);
    expect(pause.mock.calls[1][0]).toBeGreaterThan(9000);
    expect(pause.mock.calls[1][0]).toBeLessThanOrEqual(10000);
    const blocked = vi.fn(
      async () => new Response("{}", { status: 429, headers: { "retry-after": "31" } }),
    );
    await expect(readSubscription("fake", blocked, vi.fn())).rejects.toThrow("No speech request");
    expect(blocked).toHaveBeenCalledOnce();
  });
  it("accepts a 30-second rate-limit wait and sends the read-only security headers", async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 429, headers: { "retry-after": "30" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify(account())));
    const pause = vi.fn();
    await readSubscription("fake", request, pause);
    expect(pause.mock.calls.map((c) => c[0])).toEqual([1000, 30000]);
    expect(request.mock.calls[0]).toEqual([
      "https://api.elevenlabs.io/v1/user/subscription",
      expect.objectContaining({
        headers: { "xi-api-key": "fake" },
        redirect: "error",
        signal: expect.any(AbortSignal),
      }),
    ]);
  });
});
it("handles zero included credits and a zero local floor without treating them as corrupt", () => {
  expect(budgetStatus({ ...account(), character_limit: 0 }).remaining).toBe(0);
  expect(budgetStatus(account(), { version: 1, reset, usageFloor: 0 }).remaining).toBe(9500);
});
it("rejects unsafe-integer ledger values and preserves private reservation permissions", async () => {
  expect(() =>
    budgetStatus(account(), { version: 1, reset: Number.MAX_SAFE_INTEGER + 1, usageFloor: 0 }),
  ).toThrow("Invalid local");
  expect(() =>
    budgetStatus(account(), { version: 1, reset, usageFloor: Number.MAX_SAFE_INTEGER + 1 }),
  ).toThrow("Invalid local");
  const { stat } = await import("node:fs/promises");
  const budget = await openBudget({ root, getSubscription: async () => account() });
  await budget.reserve(clip("hola"));
  expect((await stat(join(root, ".elevenlabs-usage.local.json"))).mode & 0o777).toBe(0o600);
});
it.each(["free", "starter", "creator", "pro", "scale", "business", "enterprise"])(
  "accepts the %s tier and only caps the free allowance",
  (tier) =>
    expect(budgetStatus({ ...account(), tier, character_limit: 50_000 }).ceiling).toBe(
      tier === "free" ? 9500 : 49_500,
    ),
);
it("strips a v3 delivery tag that is not followed by a space", () => {
  expect(clipCredits({ text: "Hola", body: { model_id: "eleven_v3", text: "[calm]Hola" } })).toBe(
    10,
  );
});
