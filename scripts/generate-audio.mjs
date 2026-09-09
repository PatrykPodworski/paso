// Regenerates original Spanish speech assets on macOS. No network service required.
import { mkdir, writeFile, stat, unlink } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { phrases } from "./audio-catalog.mjs";
import { audioKey } from "../src/data/audio.ts";
const run = promisify(execFile);
await mkdir("public/audio", { recursive: true });
let index = 0,
  created = 0;
const worker = async () => {
  while (index < phrases.length) {
    const text = phrases[index++];
    const key = audioKey(text);
    const output = join(process.cwd(), "public/audio", `${key}.m4a`);
    try {
      if ((await stat(output)).size > 1000) {
        continue;
      }
    } catch {}
    const input = join(tmpdir(), `paso-${key}.txt`);
    const aiff = join(tmpdir(), `paso-${key}.aiff`);
    await writeFile(input, text);
    await run("/usr/bin/say", ["-v", "Mónica", "-r", "135", "-f", input, "-o", aiff]);
    await run("/opt/homebrew/bin/ffmpeg", [
      "-y",
      "-v",
      "error",
      "-i",
      aiff,
      "-c:a",
      "aac",
      "-b:a",
      "64k",
      output,
    ]);
    await Promise.all([unlink(input), unlink(aiff)]);
    if ((await stat(output)).size <= 1000) {
      throw new Error(`No speech generated for ${key}. The system voice service may be blocked.`);
    }
    created++;
    if (created % 20 === 0) {
      process.stdout.write(`Created ${created} Spanish audio clips\n`);
    }
  }
};
await Promise.all(Array.from({ length: 3 }, worker));
await writeFile(
  "public/audio/manifest.json",
  JSON.stringify(Object.fromEntries(phrases.map((t) => [audioKey(t), t])), null, 2),
);
process.stdout.write(
  `Ready: ${phrases.length} original Spanish audio clips (${created} newly generated).\n`,
);
