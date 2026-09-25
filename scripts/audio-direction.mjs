import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { audioKey } from "../src/data/audio.ts";
import { createPlan, isCached } from "./elevenlabs.mjs";
import words from "../src/data/words.json" with { type: "json" };
import examples from "../src/data/examples.json" with { type: "json" };

const vocabularyWords = new Set(words.flatMap((t) => t.words.map((w) => w.es)));
const exampleSentences = new Set(Object.values(examples).map((e) => e.es));
// Cards write both genders or alternatives compactly; read them out in full.
const spokenForms = {
  "el profesor (la profesora)": "el profesor, la profesora",
  "las palomitas (de maíz)": "las palomitas de maíz",
};
// v3 returns an empty clip for these phrases with the default tags.
const retagged = { "¿Dónde recojo el equipaje?": "[curious]" };
export const spokenWord = (text) =>
  spokenForms[text] ??
  (text.includes("o/a")
    ? `${text.replace(/o\/a\b/, "o")}, ${text.replace(/o\/a\b/, "a")}`
    : text.replaceAll("/", ", "));

// Native Spanish voices auditioned for this course. A stable assignment keeps
// subsequent additions and interrupted runs from changing existing recordings.
export const courseVoices = [
  { name: "Sara Martin", id: "KHCvMklQZZo0O30ERnVn", accent: "Spain" },
  { name: "Antonio", id: "htFfPSZGJwjBv1CL0aMD", accent: "Latin America" },
  { name: "Brian", id: "jBlmi27XRORxjPquUeCh", accent: "Latin America" },
];

const female =
  /\b(?:soy polaca|soy italiana|soy profesora|estoy contenta|estoy cansada|soy tranquila|soy Marta|me llamo (?:Ana|Elena)|(?:abrazo|saludos), (?:Ana|Elena|Marta))\b/i;
const male =
  /\b(?:soy polaco|estoy contento|me llamo Pablo)\b|\b(?:estoy (?:muy |un poco )?|me siento )\w+[ai]do\b|^Encantado\b/i;
// Example sentences are read by Sara Martin and topic words by Antonio,
// whatever their length, so a long word is never hashed to another voice.
const voiceFor = (text) => {
  if (female.test(text)) {
    return courseVoices[0];
  }
  if (male.test(text) || vocabularyWords.has(text)) {
    return courseVoices[1];
  }
  if (exampleSentences.has(text)) {
    return courseVoices[0];
  }
  if (text.length < 20 || text.startsWith("¿")) {
    return courseVoices[1];
  }
  return courseVoices[parseInt(audioKey(text), 36) % (text.length > 100 ? 3 : 2)];
};
const moodFor = (text) =>
  text.startsWith("¿")
    ? "curious"
    : /^(Hola|Buenos días|Sí, gracias)/.test(text)
      ? "warmly"
      : "calm";

export const directPhrase = (text) => {
  const word = vocabularyWords.has(text);
  return {
    voiceId: voiceFor(text).id,
    modelId: "eleven_v3",
    // Topic words sound flat and breathy with "[calm] [slowly]"; "[confidently]"
    // gives them energy without the throat noise "[clearly]" triggers.
    tags: retagged[text] ?? (word ? "[confidently]" : `[${moodFor(text)}] [slowly]`),
    voiceSettings: { stability: 0.5 },
    ...(word && spokenWord(text) !== text ? { spokenText: spokenWord(text) } : {}),
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
