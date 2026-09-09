import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { audioKey } from "../src/data/audio.ts";
import { createPlan, isCached } from "./elevenlabs.mjs";

// Native Spanish voices auditioned for this course. A stable assignment keeps
// subsequent additions and interrupted runs from changing existing recordings.
export const courseVoices = [
  { name: "Sara Martin", id: "KHCvMklQZZo0O30ERnVn", accent: "Spain" },
  { name: "Antonio", id: "htFfPSZGJwjBv1CL0aMD", accent: "Latin America" },
  { name: "Brian", id: "jBlmi27XRORxjPquUeCh", accent: "Latin America" },
];

export const directPhrase = (text) => {
  const female =
    /\b(?:soy polaca|soy italiana|soy profesora|estoy contenta|estoy cansada|soy tranquila|soy Marta|me llamo (?:Ana|Elena)|(?:abrazo|saludos), (?:Ana|Elena|Marta))\b/i.test(
      text,
    );
  const male = /\b(?:soy polaco|estoy contento|me llamo Pablo)\b/i.test(text);
  const voice = female
    ? courseVoices[0]
    : male || text.length < 20 || text.startsWith("¿")
      ? courseVoices[1]
      : courseVoices[parseInt(audioKey(text), 36) % (text.length > 100 ? 3 : 2)];
  const mood = text.startsWith("¿")
    ? "curious"
    : /^(Hola|Buenos días|Sí, gracias)/.test(text)
      ? "warmly"
      : "calm";
  return {
    voiceId: voice.id,
    modelId: "eleven_v3",
    tags: `[${mood}] [slowly]`,
    voiceSettings: { stability: 0.5 },
  };
};

export const createMissingPlan = async (root, phrases) => {
  const sources = JSON.parse(await readFile(join(root, "src/data/audio-sources.json"), "utf8"));
  const plan = [];
  for (const text of new Set(phrases)) {
    const installed = sources[audioKey(text)];
    if (installed && (await isCached(root, installed))) {
      continue;
    }
    if (installed?.request) {
      // Keep reviewed takes reproducible if a selected asset ever goes missing.
      plan.push({
        key: audioKey(text),
        text,
        voiceId: installed.voiceId,
        body: installed.request,
        src: installed.src,
        ...(installed.spokenText !== undefined ? { spokenText: installed.spokenText } : {}),
      });
      continue;
    }
    const direction = directPhrase(text);
    plan.push(...createPlan([text], direction.voiceId, direction));
  }
  return plan;
};
