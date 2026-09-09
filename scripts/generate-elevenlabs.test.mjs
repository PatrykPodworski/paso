// @vitest-environment node
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  exists: vi.fn(() => false),
  loadEnv: vi.fn(),
  open: vi.fn(),
  unlink: vi.fn(),
  close: vi.fn(),
  write: vi.fn(),
  generate: vi.fn(),
  recover: vi.fn(),
  cached: vi.fn(),
  voices: vi.fn(),
  subscription: vi.fn(),
  budget: vi.fn(),
  plan: vi.fn(),
  missing: vi.fn(),
  credits: vi.fn(() => 4),
}));
vi.mock("node:fs", async (original) => ({ ...(await original()), existsSync: mocks.exists }));
vi.mock("node:fs/promises", async (original) => ({
  ...(await original()),
  open: mocks.open,
  unlink: mocks.unlink,
}));
vi.mock("node:process", async (original) => ({
  ...(await original()),
  loadEnvFile: mocks.loadEnv,
}));
vi.mock("./audio-catalog.mjs", () => ({ phrases: ["hola", "adiós"], previewPhrases: ["hola"] }));
vi.mock("./audio-direction.mjs", () => ({
  courseVoices: [{ name: "Sara" }, { name: "Antonio" }],
  createMissingPlan: mocks.missing,
}));
vi.mock("./elevenlabs.mjs", () => ({
  createPlan: mocks.plan,
  generateClips: mocks.generate,
  isCached: mocks.cached,
  listVoices: mocks.voices,
  modelId: "eleven_multilingual_v2",
  recoverClips: mocks.recover,
}));
vi.mock("./audio-budget.mjs", () => ({
  clipCredits: mocks.credits,
  creditReserve: 500,
  freeCreditLimit: 10000,
  openBudget: mocks.budget,
  readSubscription: mocks.subscription,
}));
let argv, exitCode, log, error;
beforeEach(() => {
  argv = process.argv;
  exitCode = process.exitCode;
  process.exitCode = undefined;
  vi.stubEnv("ELEVENLABS_API_KEY", "fake-secret");
  vi.stubEnv("ELEVENLABS_VOICE_ID", "spanish-voice");
  log = vi.spyOn(console, "log").mockImplementation(() => {});
  error = vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.exists.mockReturnValue(false);
  mocks.open.mockResolvedValue({ close: mocks.close, writeFile: mocks.write });
  mocks.cached.mockResolvedValue(false);
  mocks.generate.mockResolvedValue(2);
  mocks.recover.mockResolvedValue(1);
  mocks.voices.mockResolvedValue([{ id: "voice" }]);
  mocks.plan.mockImplementation((phrases) =>
    phrases.map((text) => ({ text, src: `/audio/${text}.mp3` })),
  );
  mocks.missing.mockResolvedValue([
    { text: "hola", src: "/audio/hola.mp3", voiceId: "directed-voice" },
  ]);
});
afterEach(() => {
  process.argv = argv;
  process.exitCode = exitCode;
  vi.unstubAllEnvs();
});
const run = async (...args) => {
  process.argv = ["node", "generate-elevenlabs.mjs", ...args];
  vi.resetModules();
  await import("./generate-elevenlabs.mjs");
  return {
    output: log.mock.calls.flat().join("\n"),
    error: error.mock.calls.flat().join("\n"),
    code: process.exitCode,
  };
};
describe("audio command authorization and locking", () => {
  it("plans missing directed recordings offline without requiring credentials", async () => {
    vi.stubEnv("ELEVENLABS_API_KEY", undefined);
    vi.stubEnv("ELEVENLABS_VOICE_ID", undefined);
    const result = await run("--plan-missing");
    expect(result.code).toBeUndefined();
    expect(result.output).toContain("Model: eleven_v3. Voices: Sara, Antonio");
    expect(mocks.missing).toHaveBeenCalledWith(expect.any(String), ["hola", "adiós"]);
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.open).not.toHaveBeenCalled();
  });
  it("completes only missing audio using per-clip voices under the shared generation lock", async () => {
    vi.stubEnv("ELEVENLABS_VOICE_ID", undefined);
    expect((await run("--complete")).code).toBeUndefined();
    expect(mocks.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        plan: [{ text: "hola", src: "/audio/hola.mp3", voiceId: "directed-voice" }],
      }),
    );
    expect(mocks.open).toHaveBeenCalledOnce();
    expect(mocks.close).toHaveBeenCalledOnce();
    expect(mocks.unlink).toHaveBeenCalledOnce();
  });
  it.each([{ args: ["--invalid"] }, { args: ["--plan", "extra"] }])(
    "rejects invalid arguments $args",
    async ({ args }) => {
      expect((await run(...args)).error).toContain("Usage:");
      expect(process.exitCode).toBe(1);
      expect(mocks.generate).not.toHaveBeenCalled();
      expect(mocks.open).not.toHaveBeenCalled();
    },
  );
  it("defaults to a read-only plan without requiring a key", async () => {
    vi.stubEnv("ELEVENLABS_API_KEY", undefined);
    vi.stubEnv("ELEVENLABS_VOICE_ID", undefined);
    const result = await run();
    expect(result.output).toContain("no requests sent and no files changed");
    expect(mocks.plan).toHaveBeenCalledWith(["hola", "adiós"], "unconfigured");
    expect(mocks.open).not.toHaveBeenCalled();
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it.each(["--generate", "--preview", "--recover", "--quota", "--voices"])(
    "requires a key before %s",
    async (mode) => {
      vi.stubEnv("ELEVENLABS_API_KEY", "  ");
      expect((await run(mode)).error).toContain("ELEVENLABS_API_KEY");
      expect(mocks.open).not.toHaveBeenCalled();
      expect(mocks.generate).not.toHaveBeenCalled();
    },
  );
  it.each(["", "invalid/voice", ";shell"])(
    "requires a valid voice before reserving or generating %s",
    async (voice) => {
      vi.stubEnv("ELEVENLABS_VOICE_ID", voice);
      expect((await run("--generate")).error).toContain("ELEVENLABS_VOICE_ID");
      expect(mocks.open).not.toHaveBeenCalled();
      expect(mocks.generate).not.toHaveBeenCalled();
    },
  );
  it("takes an exclusive lock before generation and always releases its own lock", async () => {
    const result = await run("--generate");
    expect(result.error).toBe("");
    expect(mocks.open).toHaveBeenCalledWith(
      expect.stringMatching(/\.audio-generation.lock$/),
      "wx",
    );
    expect(mocks.write).toHaveBeenCalledWith(String(process.pid));
    expect(mocks.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        voiceId: "spanish-voice",
        apiKey: "fake-secret",
        plan: expect.any(Array),
      }),
    );
    expect(mocks.open.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.generate.mock.invocationCallOrder[0],
    );
    expect(mocks.close).toHaveBeenCalledOnce();
    expect(mocks.unlink).toHaveBeenCalledOnce();
    expect(mocks.recover).not.toHaveBeenCalled();
  });
  it("does not remove another process lock or start a competing request", async () => {
    mocks.open.mockRejectedValue(Object.assign(new Error("exists"), { code: "EEXIST" }));
    expect((await run("--generate")).error).toContain("already locked");
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.unlink).not.toHaveBeenCalled();
  });
  it("surfaces lock I/O failures without making a request", async () => {
    mocks.open.mockRejectedValue(new Error("disk full"));
    expect((await run("--generate")).error).toBe("disk full");
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.unlink).not.toHaveBeenCalled();
  });
  it("redacts secrets and releases the lock after generation fails", async () => {
    mocks.generate.mockRejectedValueOnce(new Error("upstream fake-secret failed"));
    expect((await run("--generate")).error).toBe("upstream [redacted] failed");
    expect(mocks.close).toHaveBeenCalledOnce();
    expect(mocks.unlink).toHaveBeenCalledOnce();
    expect(process.exitCode).toBe(1);
  });
  it("uses only preview phrases for preview and only recovery for recover", async () => {
    await run("--preview");
    expect(mocks.plan).toHaveBeenCalledWith(["hola"], "spanish-voice");
    expect(mocks.generate).toHaveBeenCalledOnce();
    vi.clearAllMocks();
    const result = await run("--recover");
    expect(mocks.recover).toHaveBeenCalledOnce();
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(result.output).toContain("No speech was generated");
  });
  it("reads quota without locking or generating", async () => {
    mocks.budget.mockImplementation(async ({ getSubscription }) => {
      await getSubscription();
      return {
        status: async () => ({ used: 9465, usageFloor: 9477, remaining: 23, reset: 1800000000 }),
      };
    });
    const result = await run("--quota");
    expect(result.output).toContain("23 credits available");
    expect(mocks.subscription).toHaveBeenCalledWith("fake-secret");
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.open).not.toHaveBeenCalled();
  });
  it("lists voices without taking a lock", async () => {
    await run("--voices");
    expect(mocks.voices).toHaveBeenCalledWith("fake-secret");
    expect(mocks.open).not.toHaveBeenCalled();
  });
  it("loads environment files only server-side and accounts for cache hits", async () => {
    mocks.exists.mockReturnValue(true);
    mocks.cached.mockResolvedValueOnce(true);
    const result = await run("--plan");
    expect(mocks.loadEnv.mock.calls.map(([path]) => path.split("/").at(-1))).toEqual([
      ".env.local",
      ".env",
    ]);
    expect(result.output).toContain("2 clips; 1 cached; 1 to generate");
    expect(result.output).toContain("Budgeted: 4 credits");
  });
});
