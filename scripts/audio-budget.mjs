import { readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

// One shared allowance, not a separate allowance for every model or every run.
export const freeCreditLimit = 10_000;
export const creditReserve = 500;
const maximumRequestCharacters = 10_000;

export const readSubscription = async (apiKey, request = fetch, pause = delay) => {
  let waitMs = 1000;
  // Stryker disable next-line EqualityOperator: equivalent mutant. The last attempt always
  // returns or throws, because `continue` below is gated on attempt < 2.
  for (let attempt = 0; attempt < 3; attempt++) {
    // Space out quota reads. Retrying this GET does not generate or bill speech.
    await pause(waitMs);
    const response = await request("https://api.elevenlabs.io/v1/user/subscription", {
      headers: { "xi-api-key": apiKey },
      signal: AbortSignal.timeout(30_000),
      redirect: "error",
    });
    if (response.ok) {
      return response.json();
    }
    if (response.status === 429 && attempt < 2) {
      const retryAfter = response.headers.get("retry-after");
      // Number(null) is 0, which the Math.max below floors away exactly like a missing header.
      const seconds = Number(retryAfter);
      const requestedWait = Number.isFinite(seconds)
        ? seconds * 1000
        : Date.parse(retryAfter) - Date.now();
      waitMs = Math.max(2000 * (attempt + 1), Number.isFinite(requestedWait) ? requestedWait : 0);
      if (waitMs <= 30_000) {
        continue;
      }
    }
    const hint = [401, 403].includes(response.status)
      ? "The key needs User: Read (user_read)."
      : "The usage service is unavailable or rate limited; try again later.";
    throw new Error(
      `Cannot verify remaining ElevenLabs allowance (HTTP ${response.status}). ${hint} No speech request was sent.`,
    );
  }
  // Stryker disable next-line all: unreachable guard, see the loop bound above.
  throw new Error("Cannot verify the remaining allowance; generation blocked.");
};

export const clipCredits = (clip) => {
  // Reserve one credit per submitted character, including v3 delivery tags.
  // This deliberately does not rely on temporary API discounts.
  const v3 = clip.body.model_id === "eleven_v3";
  const spokenText = v3 ? clip.body.text.replace(/\[[a-z ,.-]+\]\s*/gi, "") : clip.body.text;
  const expectedText = clip.spokenText ?? clip.text;
  if ((!v3 && clip.body.model_id !== "eleven_multilingual_v2") || spokenText !== expectedText) {
    throw new Error("No verified quota policy for this speech request; generation blocked.");
  }
  // UTF-16 length conservatively counts supplementary characters twice.
  const characters = clip.body.text.length;
  if (!expectedText.length || characters > (v3 ? 5000 : maximumRequestCharacters)) {
    throw new Error("Speech text exceeds the permitted per-request character limit.");
  }
  return characters;
};

export const budgetStatus = (subscription, ledger = null, now = Date.now()) => {
  const used = subscription.character_count;
  const included = subscription.character_limit;
  const reset = subscription.next_character_count_reset_unix;
  if (
    !Number.isSafeInteger(used) ||
    used < 0 ||
    !Number.isSafeInteger(included) ||
    included < 0 ||
    !Number.isSafeInteger(reset) ||
    reset * 1000 <= now
  ) {
    throw new Error("Incomplete ElevenLabs usage information; generation blocked.");
  }
  if (
    !["free", "starter", "creator", "pro", "scale", "business", "enterprise"].includes(
      subscription.tier,
    )
  ) {
    throw new Error("Unknown ElevenLabs subscription tier; generation blocked.");
  }
  if (subscription.max_credit_limit_extension !== 0) {
    throw new Error("Overage billing must be disabled in ElevenLabs before generation can run.");
  }
  if (
    ledger &&
    (ledger.version !== 1 ||
      !Number.isSafeInteger(ledger.reset) ||
      !Number.isSafeInteger(ledger.usageFloor) ||
      ledger.usageFloor < 0 ||
      ledger.reset > reset)
  ) {
    throw new Error("Invalid local audio usage record; generation blocked.");
  }
  const usageFloor = Math.max(used, ledger?.reset === reset ? ledger.usageFloor : 0);
  const allowance = subscription.tier === "free" ? Math.min(included, freeCreditLimit) : included;
  const ceiling = Math.max(0, allowance - creditReserve);
  return { used, usageFloor, ceiling, remaining: Math.max(0, ceiling - usageFloor), reset };
};

export const openBudget = async ({ root, getSubscription }) => {
  const path = join(root, ".elevenlabs-usage.local.json");
  let ledger = null;
  try {
    // Stryker disable next-line StringLiteral: equivalent mutant. An unrecognised encoding
    // yields a Buffer, which JSON.parse decodes as UTF-8 anyway.
    ledger = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error("Cannot read the local audio usage record; generation blocked.");
    }
  }
  return {
    status: async () => budgetStatus(await getSubscription(), ledger),
    reserve: async (clip) => {
      const credits = clipCredits(clip);
      // Check live account usage before every uncached request, including previews.
      const status = budgetStatus(await getSubscription(), ledger);
      if (credits > status.remaining) {
        throw new Error(
          `Included allowance protected: ${status.remaining} credits available after the ${creditReserve}-credit buffer; the next clip needs ${credits}. Generation paused. Completed clips are saved.`,
        );
      }
      ledger = { version: 1, reset: status.reset, usageFloor: status.usageFloor + credits };
      const temporary = `${path}.${process.pid}.tmp`;
      // Reserve before sending. A crash, timeout or rejected request does not
      // erase a potentially billed attempt from the budget on the next run.
      await writeFile(temporary, `${JSON.stringify(ledger, null, 2)}\n`, { mode: 0o600 });
      await rename(temporary, path);
    },
  };
};
