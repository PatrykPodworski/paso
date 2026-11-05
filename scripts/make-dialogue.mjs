#!/usr/bin/env node
// Makes each listening dialogue in scripts/dialogues.mjs as one clip in the local VoxCPM2 voices:
// every turn is spoken on its own in its speaker's voice with the ai repo's
// audio/spanish/make-sentences, the turns are levelled and joined with a pause, encoded like the other public/audio/voxcpm clips, checked whole by Whisper
// and installed in src/data/audio-sources.json. Full output goes to temp/make-dialogue.log.
//
// Usage: node scripts/make-dialogue.mjs [dialogue id ...]   (AI_REPO defaults to ~/Projects/ai)
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { audioKey } from "../src/data/audio.ts";
import { dialogueText, installClip, sameWords } from "./dialogue-clip.mjs";
import { dialogues } from "./dialogues.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const aiRepo = process.env.AI_REPO || join(homedir(), "Projects/ai");
const python = join(execFileSync("uv", ["tool", "dir"]).toString().trim(), "mlx-audio/bin/python");
const sourcesPath = join(root, "src/data/audio-sources.json");
const logPath = join(root, "temp/make-dialogue.log");
const modelId = "mlx-community/VoxCPM2-8bit";
const whisper = "mlx-community/whisper-large-v3-turbo-asr-fp16";
// A pause long enough to hear that the other speaker answers, short enough to keep the exchange.
const pauseSeconds = 0.7;

const trim =
  "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse";

// VoxCPM output is peaky: a fast limiter holds peaks at -2 dBFS after the gain toward -17 LUFS.
const limiter = "alimiter=limit=0.794:attack=5:release=50:level=disabled";

const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8" });

  if (result.error) {
    throw new Error(`${command}: ${result.error.message}`);
  }

  return { code: result.status, output: `${result.stdout}${result.stderr}` };
};

const ffmpeg = (args) => {
  const result = run("ffmpeg", ["-hide_banner", "-nostats", "-y", ...args]);

  if (result.code !== 0) {
    throw new Error(result.output.trim().split("\n").slice(-3).join("\n"));
  }

  return result.output;
};

const seconds = (path) =>
  Number(
    execFileSync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      path,
    ]).toString(),
  );

// EBU R128 gates in 400 ms blocks, so a clip under 1.5 s is looped for the measurement.
const loudness = (path) => {
  const loop = seconds(path) < 1.5 ? ["-stream_loop", "9"] : [];

  const output = ffmpeg([
    ...loop,
    "-i",
    path,
    "-af",
    "loudnorm=print_format=json",
    "-f",
    "null",
    "-",
  ]);

  const start = output.lastIndexOf("{");

  return Number(JSON.parse(output.slice(start, output.indexOf("}", start) + 1)).input_i);
};

// Speaks every turn in its speaker's voice, one make-sentences run per voice, and returns the
// turn files in dialogue order.
const speakTurns = (dialogue, work, lines) => {
  const voiceOf = dialogue.turns.map(([speaker]) => dialogue.voices[speaker]);
  const files = [];

  for (const voice of new Set(voiceOf)) {
    const turns = dialogue.turns.filter((_, i) => voiceOf[i] === voice);
    const list = join(work, `turns-${voice}.txt`);

    writeFileSync(list, `${turns.map(([, text]) => text).join("\n")}\n`);

    const spoken = run(join(aiRepo, "audio/spanish/make-sentences"), [
      ...["--voice", voice, "--out", work, "--name", "turn", "--file", list],
    ]);

    lines.push(`make-sentences --voice ${voice}:`, spoken.output.trim());

    if (spoken.code !== 0 && !spoken.output.includes("MISMATCH")) {
      throw new Error(spoken.output.trim().split("\n").slice(-3).join("\n"));
    }

    let n = 0;

    voiceOf.forEach((v, i) => {
      if (v === voice) {
        n += 1;

        files[i] = join(
          work,
          voice,
          turns.length === 1 ? "turn.wav" : `turn-${String(n).padStart(2, "0")}.wav`,
        );
      }
    });
  }

  return { files, voiceOf };
};

const makeClip = (dialogue, sources) => {
  const text = dialogueText(dialogue.turns);
  const work = join(root, "temp/make-dialogue", dialogue.id);
  const lines = [];

  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });

  const { files, voiceOf } = speakTurns(dialogue, work, lines);
  const pause = join(work, "pause.wav");

  ffmpeg([
    "-f",
    "lavfi",
    "-i",
    "anullsrc=r=48000:cl=mono",
    "-t",
    String(pauseSeconds),
    "-c:a",
    "pcm_f32le",
    pause,
  ]);

  // Each turn gets its own gain toward -17 LUFS, so both voices play equally loud.
  const levelled = files.map((file, i) => {
    const out = join(work, `levelled-${String(i + 1).padStart(2, "0")}.wav`);
    const gain = -17 - loudness(file);

    ffmpeg(["-i", file, "-af", `volume=${gain.toFixed(2)}dB`, "-c:a", "pcm_f32le", out]);
    lines.push(`turn ${i + 1} (${voiceOf[i]}): gain ${gain.toFixed(2)} dB`);

    return out;
  });

  const parts = levelled.flatMap((file, i) => [...(i ? [pause] : []), file]);

  writeFileSync(join(work, "parts.txt"), parts.map((p) => `file '${p}'`).join("\n"));

  const joined = join(work, "joined.wav");

  ffmpeg(["-f", "concat", "-safe", "0", "-i", join(work, "parts.txt"), "-c", "copy", joined]);

  const used = [...new Set(voiceOf)];
  const voiceId = used.map((voice) => `es-${voice}-teacher`).join("+");

  const settings = {
    referenceAudio: used.map((voice) => `audio/spanish/voices/es-${voice}-teacher.wav`),
    turnVoices: voiceOf,
    inferenceTimesteps: 30,
    seed: 0,
    method: "make-dialogue",
    pauseSeconds,
  };

  const name = createHash("sha256")
    .update(JSON.stringify({ voiceId, modelId, text, settings }))
    .digest("hex")
    .slice(0, 24);

  const mp3 = join(work, `${name}.mp3`);

  ffmpeg([
    "-i",
    joined,
    "-af",
    `${trim},${limiter},aresample=44100`,
    ...["-ac", "1", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k"],
    ...["-map_metadata", "-1", "-write_xing", "1", mp3],
  ]);

  const heardRun = run(python, [
    ...["-m", "mlx_audio.stt.generate", "--model", whisper, "--audio", mp3],
    ...["--output-path", join(work, "whisper"), "--format", "json", "--language", "es"],
  ]);

  if (heardRun.code !== 0) {
    throw new Error(heardRun.output.trim().split("\n").slice(-3).join("\n"));
  }

  const heard = JSON.parse(readFileSync(join(work, "whisper.json"), "utf8")).text.trim();
  const duration = seconds(mp3);
  const wordsPerSecond = text.split(/\s+/).length / duration;
  const src = `/audio/voxcpm/${name}.mp3`;
  const installed = installClip(sources, audioKey(text), { src, voiceId, modelId, text, settings });

  copyFileSync(mp3, join(root, "public", src));

  if (installed.unused && installed.unused !== src) {
    unlinkSync(join(root, "public", installed.unused));
  }

  lines.push(
    `clip: public${src} (${duration.toFixed(1)} s, ${wordsPerSecond.toFixed(2)} words/s, ${loudness(mp3).toFixed(1)} LUFS)`,
    `removed: ${installed.unused ?? "none"}`,
    `expected: ${text}`,
    `whisper:  ${heard}`,
  );

  return {
    sources: installed.sources,
    lines,
    // make-sentences flags a turn whose numbers Whisper wrote as digits; the whole-clip check
    // accepts those, so it alone decides.
    attention: sameWords(text, heard) ? [] : [`MISMATCH ${dialogue.id}: heard '${heard}'`],
    summary: `${dialogue.id}: public${src}, ${duration.toFixed(1)} s, ${wordsPerSecond.toFixed(2)} words/s`,
  };
};

const writeLog = (sections) => {
  let cursor = sections.length + 2;

  const toc = sections.map(({ name, body }) => {
    const entry = `${name}: lines ${cursor}-${cursor + body.length}`;

    cursor += body.length + 1;

    return entry;
  });

  const content = [...toc, "", ...sections.flatMap(({ name, body }) => [`## ${name}`, ...body])];

  for (const entry of toc) {
    const start = Number(entry.split("lines ")[1].split("-")[0]);

    if (!content[start - 1].startsWith("## ")) {
      throw new Error(`Log contents point at line ${start}, not a section header.`);
    }
  }

  mkdirSync(join(root, "temp"), { recursive: true });
  writeFileSync(logPath, `${content.join("\n")}\n`);
};

const ids = process.argv.slice(2);
const unknown = ids.filter((id) => !dialogues.some((d) => d.id === id));

if (unknown.length) {
  console.error(
    `Unknown dialogue: ${unknown.join(", ")}. Known: ${dialogues.map((d) => d.id).join(", ")}`,
  );

  process.exit(1);
}

let sources = JSON.parse(readFileSync(sourcesPath, "utf8"));
const sections = [];
const digest = [];
let failed = 0;
let flagged = 0;

for (const dialogue of dialogues.filter((d) => !ids.length || ids.includes(d.id))) {
  try {
    const clip = makeClip(dialogue, sources);

    sources = clip.sources;
    writeFileSync(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`);
    sections.push({ name: dialogue.id, body: clip.lines });
    digest.push(clip.summary, ...clip.attention);
    flagged += clip.attention.length ? 1 : 0;
  } catch (error) {
    failed += 1;
    sections.push({ name: dialogue.id, body: [`FAILED: ${error.message}`] });
    digest.push(`FAILED ${dialogue.id}: ${error.message}`);
  }
}

writeLog(sections);
// The manifest is checked by oxfmt, which lays out short arrays differently from JSON.stringify.
run(join(root, "node_modules/.bin/oxfmt"), [sourcesPath]);

console.log(
  `${sections.length} dialogues: ${sections.length - failed - flagged} ok, ${flagged} mismatch, ${failed} failed`,
);

for (const line of digest) {
  console.log(line);
}

console.log(`log: ${logPath}`);
process.exitCode = failed || flagged ? 1 : 0;
