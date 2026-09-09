import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";
import { open, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { phrases, previewPhrases } from "./audio-catalog.mjs";
import { courseVoices, createMissingPlan } from "./audio-direction.mjs";
import {
  createPlan,
  generateClips,
  isCached,
  listVoices,
  modelId,
  recoverClips,
} from "./elevenlabs.mjs";
import {
  clipCredits,
  creditReserve,
  freeCreditLimit,
  openBudget,
  readSubscription,
} from "./audio-budget.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
// Loaded only by this Node script. Never expose this key through VITE_* variables.
for (const name of [".env.local", ".env"]) {
  const path = join(root, name);
  if (existsSync(path)) {
    loadEnvFile(path);
  }
}

const mode = process.argv[2] || "--plan";
const modes = [
  "--plan",
  "--plan-missing",
  "--quota",
  "--voices",
  "--preview",
  "--generate",
  "--complete",
  "--recover",
];
let lock;
const lockPath = join(root, ".audio-generation.lock");
try {
  if (!modes.includes(mode) || process.argv.length > 3) {
    throw new Error(`Usage: node scripts/generate-elevenlabs.mjs ${modes.join(" | ")}`);
  }
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim();
  const completion = ["--complete", "--plan-missing"].includes(mode);
  const planning = ["--plan", "--plan-missing"].includes(mode);
  if (!planning && !apiKey) {
    throw new Error("Add ELEVENLABS_API_KEY to this project's .env.local first.");
  }
  if (mode === "--quota") {
    const budget = await openBudget({ root, getSubscription: () => readSubscription(apiKey) });
    const status = await budget.status();
    console.log(
      `Account usage: ${status.used} credits. Conservative usage estimate: ${status.usageFloor}.`,
    );
    console.log(
      `${status.remaining} credits available to this generator, retaining a ${creditReserve}-credit buffer.`,
    );
    console.log(
      `Allowance resets at ${new Date(status.reset * 1000).toISOString()}. No speech was generated.`,
    );
  } else if (mode === "--voices") {
    const voices = await listVoices(apiKey);
    console.log(JSON.stringify(voices, null, 2));
  } else {
    const plan = completion
      ? await createMissingPlan(root, phrases)
      : createPlan(mode === "--preview" ? previewPhrases : phrases, voiceId || "unconfigured");
    const pending = [];
    for (const clip of plan) {
      if (!(await isCached(root, clip))) {
        pending.push(clip);
      }
    }
    console.log(
      completion
        ? `Model: eleven_v3. Voices: ${courseVoices.map((v) => v.name).join(", ")}. Existing recordings are preserved.`
        : `Model: ${modelId}. Voice: ${voiceId || "not selected"}.`,
    );
    console.log(
      `${plan.length} clips; ${plan.length - pending.length} cached; ${pending.length} to generate.`,
    );
    if (mode === "--recover") {
      console.log(
        "Recovery only: downloads matching completed history items; no speech generation.",
      );
    } else {
      console.log(
        `${pending.reduce((sum, clip) => sum + [...clip.text].length, 0).toLocaleString("en-US")} text characters to send. Credit usage depends on your ElevenLabs voice and plan.`,
      );
      const plannedCredits = pending.reduce((sum, clip) => sum + clipCredits(clip), 0);
      console.log(
        `Budgeted: ${plannedCredits.toLocaleString("en-US")} credits. The included plan allowance is checked before each request; buffer: ${creditReserve}.`,
      );
      if (plannedCredits > freeCreditLimit - creditReserve) {
        console.log(
          "This collection exceeds a free-tier batch. Generation will pause before the current plan's remaining allowance is used up.",
        );
      }
    }
    if (planning) {
      console.log("Preview only: no requests sent and no files changed.");
    } else {
      if (!completion && (!voiceId || !/^[a-zA-Z0-9_-]+$/.test(voiceId))) {
        throw new Error(
          "Set ELEVENLABS_VOICE_ID in .env.local to a native Spanish voice from pnpm audio:voices.",
        );
      }
      try {
        lock = await open(lockPath, "wx");
      } catch (error) {
        if (error.code === "EEXIST") {
          throw new Error(
            "Audio generation is already locked. If a previous process crashed, remove .audio-generation.lock after checking it has stopped.",
          );
        }
        throw error;
      }
      await lock.writeFile(String(process.pid));
      const generated = await (mode === "--recover" ? recoverClips : generateClips)({
        root,
        plan,
        voiceId,
        apiKey,
      });
      console.log(
        mode === "--recover"
          ? `Recovered ${generated} existing recordings. No speech was generated.`
          : `Ready: ${generated} new ElevenLabs clips; ${plan.length} selected clips installed.`,
      );
      console.log(
        "Refresh the dev app to listen. Run pnpm build before publishing the static site.",
      );
    }
  }
} catch (error) {
  // Avoid serializing fetch request objects or their authorization headers.
  const secret = process.env.ELEVENLABS_API_KEY;
  const message = error instanceof Error ? error.message : "Audio generation failed.";
  console.error(secret ? message.replaceAll(secret, "[redacted]") : message);
  process.exitCode = 1;
} finally {
  if (lock) {
    await lock.close();
    await unlink(lockPath);
  }
}
