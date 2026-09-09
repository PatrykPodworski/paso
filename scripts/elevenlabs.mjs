import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { audioKey } from "../src/data/audio.ts";
import { openBudget, readSubscription } from "./audio-budget.mjs";

const api = "https://api.elevenlabs.io";
const outputFormat = "mp3_44100_128";
export const modelId = "eleven_multilingual_v2";
const voiceSettings = {
  stability: 0.45,
  similarity_boost: 0.75,
  style: 0,
  use_speaker_boost: true,
  speed: 0.95,
};

export const createPlan = (phrases, voiceId, direction = {}) => {
  const keys = new Set();
  return [...new Set(phrases)].map((text) => {
    const key = audioKey(text);
    if (keys.has(key)) {
      throw new Error("Audio key collision: use different phrase keys before generating.");
    }
    keys.add(key);
    // Multilingual v2 infers the language from the Spanish text and voice;
    // its API does not support the language_code parameter.
    const selectedModel = direction.modelId || modelId;
    const spokenText = direction.spokenText ?? text;
    const body = {
      text: direction.tags ? `${direction.tags} ${spokenText}` : spokenText,
      model_id: selectedModel,
      voice_settings: direction.voiceSettings || voiceSettings,
      ...(selectedModel === "eleven_v3"
        ? { language_code: "es", seed: direction.seed ?? 20260909 }
        : {}),
    };
    const fingerprint = createHash("sha256")
      .update(JSON.stringify({ voiceId, outputFormat, body }))
      .digest("hex")
      .slice(0, 24);
    return {
      key,
      text,
      voiceId,
      body,
      src: `/audio/elevenlabs/${fingerprint}.mp3`,
      ...(direction.spokenText !== undefined ? { spokenText } : {}),
    };
  });
};

export const isCached = async (root, clip) => {
  try {
    return (await stat(join(root, "public", clip.src))).size > 1000;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};

const atomicWrite = async (path, data) => {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, data);
  await rename(temporary, path);
};

const saveAudioResponse = async (root, clip, response) => {
  await checkResponse(response);
  if (!response.headers.get("content-type")?.startsWith("audio/")) {
    throw new Error(
      "ElevenLabs returned a non-audio response; existing recordings were preserved.",
    );
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const mp3 =
    bytes.subarray(0, 3).toString() === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  if (bytes.length <= 1000 || !mp3) {
    throw new Error("ElevenLabs returned an invalid MP3; existing recordings were preserved.");
  }
  await atomicWrite(join(root, "public", clip.src), bytes);
};

const checkResponse = async (response) => {
  if (response.ok) {
    return;
  }
  const payload = await response.json().catch(() => ({}));
  const status = payload.detail?.status;
  const code = typeof status === "string" && /^[a-z_]{1,60}$/.test(status) ? ` (${status})` : "";
  if (status === "payment_required") {
    throw new Error(
      "ElevenLabs HTTP 402 (payment_required) for this voice and API key. Check that .env.local uses the key and voice tested in your account.",
    );
  }
  if (status === "quota_exceeded") {
    throw new Error(
      "ElevenLabs quota_exceeded: check available credits or the API key's credit limit, then rerun to resume saved clips.",
    );
  }
  const hints = {
    401: "Check the API key and its permissions for this operation.",
    402: "Check the account's available credits.",
    403: "Check access to this voice and the API key's permissions.",
    429: "Check credits or rate limits, then rerun to resume saved clips.",
  };
  // Do not print the request, headers or arbitrary upstream error bodies.
  throw new Error(
    `ElevenLabs HTTP ${response.status}${code}. ${hints[response.status] || "Check the voice configuration and account, then rerun."}`,
  );
};

export const listVoices = async (apiKey, request = fetch) => {
  const voices = [];
  let token;
  do {
    const url = new URL(`${api}/v2/voices`);
    url.searchParams.set("page_size", "100");
    if (token) {
      url.searchParams.set("next_page_token", token);
    }
    const response = await request(url, {
      headers: { "xi-api-key": apiKey },
      signal: AbortSignal.timeout(30_000),
      redirect: "error",
    });
    await checkResponse(response);
    const data = await response.json();
    voices.push(...data.voices);
    if (data.has_more && (!data.next_page_token || data.next_page_token === token)) {
      throw new Error("ElevenLabs returned an invalid voice pagination token.");
    }
    token = data.has_more ? data.next_page_token : undefined;
  } while (token);
  return voices.map((v) => ({
    id: v.voice_id,
    name: v.name,
    labels: v.labels,
    languages: v.verified_languages?.map((l) => ({ language: l.language, accent: l.accent })),
    preview: v.preview_url,
  }));
};

export const generateClips = async ({
  root,
  plan,
  voiceId,
  apiKey,
  request = fetch,
  getSubscription = () => readSubscription(apiKey, request),
  log = console.log,
  manifestPath = join(root, "src/data/audio-sources.json"),
}) => {
  const sources = JSON.parse(await readFile(manifestPath, "utf8"));
  const budget = await openBudget({ root, getSubscription });
  let generated = 0;
  for (const [index, clip] of plan.entries()) {
    if (!(await isCached(root, clip))) {
      await budget.reserve(clip);
      const response = await request(
        `${api}/v1/text-to-speech/${encodeURIComponent(clip.voiceId || voiceId)}?output_format=${outputFormat}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          body: JSON.stringify(clip.body),
          signal: AbortSignal.timeout(180_000),
          redirect: "error",
        },
      );
      await saveAudioResponse(root, clip, response);
      generated++;
    }
    // Publish only complete files. A stopped run can resume without regenerating them.
    sources[clip.key] = {
      src: clip.src,
      voiceId: clip.voiceId || voiceId,
      modelId: clip.body.model_id,
      text: clip.text,
      request: clip.body,
      ...(clip.spokenText !== undefined ? { spokenText: clip.spokenText } : {}),
    };
    await atomicWrite(manifestPath, `${JSON.stringify(sources, null, 2)}\n`);
    log(
      `[${index + 1}/${plan.length}] ${clip.text.slice(0, 65)}${clip.text.length > 65 ? "…" : ""}`,
    );
  }
  return generated;
};

export const recoverClips = async ({
  root,
  plan,
  voiceId,
  apiKey,
  request = fetch,
  log = console.log,
}) => {
  const manifestPath = join(root, "src/data/audio-sources.json");
  const sources = JSON.parse(await readFile(manifestPath, "utf8"));
  const pending = new Map();
  for (const clip of plan) {
    if (await isCached(root, clip)) {
      sources[clip.key] = { src: clip.src, voiceId, modelId };
    } else {
      pending.set(clip.text, clip);
    }
  }
  if (!pending.size) {
    await atomicWrite(manifestPath, `${JSON.stringify(sources, null, 2)}\n`);
    return 0;
  }
  const headers = { "xi-api-key": apiKey };
  const url = new URL(`${api}/v1/history`);
  url.searchParams.set("page_size", "100");
  url.searchParams.set("voice_id", voiceId);
  const response = await request(url, {
    headers,
    signal: AbortSignal.timeout(30_000),
    redirect: "error",
  });
  await checkResponse(response);
  const history = await response.json();
  let recovered = 0;
  // Only inspect this voice's 100 most recent items. A matching text alone is
  // insufficient: never publish another voice/model/settings under this cache key.
  for (const item of history.history) {
    const clip = pending.get(item.text);
    if (
      !clip ||
      item.voice_id !== voiceId ||
      item.model_id !== clip.body.model_id ||
      !Object.entries(clip.body.voice_settings).every(
        ([key, value]) => item.settings?.[key] === value,
      )
    ) {
      continue;
    }
    const audio = await request(
      `${api}/v1/history/${encodeURIComponent(item.history_item_id)}/audio`,
      {
        headers,
        signal: AbortSignal.timeout(60_000),
        redirect: "error",
      },
    );
    await saveAudioResponse(root, clip, audio);
    sources[clip.key] = { src: clip.src, voiceId, modelId };
    await atomicWrite(manifestPath, `${JSON.stringify(sources, null, 2)}\n`);
    pending.delete(clip.text);
    recovered++;
    log(`Recovered without regeneration: ${clip.text.slice(0, 65)}…`);
  }
  return recovered;
};
