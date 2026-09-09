// Live integration check: uses Codex account allowance and fictional course audio.
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { allQuestions } from "../src/data/curriculum.ts";
import { audioKey } from "../src/data/audio.ts";

const directory = await mkdtemp(join(tmpdir(), "paso-browser-coach-"));
const spoken = allQuestions.find((q) => q.id === "u1-o3");
const recordings = JSON.parse(await readFile("src/data/audio-sources.json", "utf8"));
const sample = resolve("public" + recordings[audioKey(spoken.answer)].src);
const wav = join(directory, "spanish.wav");
execFileSync("ffmpeg", ["-v", "error", "-i", sample, "-ac", "1", "-ar", "48000", wav]);
const duration = Number(
  execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      wav,
    ],
    { encoding: "utf8" },
  ),
);
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
    `--use-file-for-fake-audio-capture=${wav}`,
  ],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    permissions: ["microphone"],
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:5173");
  await page.evaluate(() => {
    localStorage.setItem(
      "paso-progress-v1",
      JSON.stringify({
        version: 1,
        completed: {},
        attempts: [],
        mistakes: [],
        drafts: { "u1-o1": "Soy de Polonia." },
      }),
    );
  });
  await page.reload();
  await page.evaluate(() => {
    window.__sentencePlays = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      this.addEventListener(
        "playing",
        () => window.__sentencePlays.push({ src: this.src, duration: this.duration }),
        { once: true },
      );
      return original.call(this);
    };
  });
  await page
    .getByRole("button", { name: /Make it your own/ })
    .first()
    .click();
  for (const word of "Hola me llamo Ana".split(" ")) {
    await page.locator(".word-bank").getByRole("button", { name: word, exact: true }).click();
  }
  if (await page.evaluate(() => window.__sentencePlays.length)) {
    throw new Error("Sentence read before checking");
  }
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await page.waitForFunction(() => window.__sentencePlays.length === 1);
  const sentenceAudio = await page.evaluate(() => window.__sentencePlays[0]);
  if (!sentenceAudio.src.includes(audioKey("Hola me llamo Ana")) || sentenceAudio.duration <= 0) {
    throw new Error("Wrong sentence playback");
  }
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  if (await page.getByRole("textbox").inputValue()) {
    throw new Error("Old objective answer was restored");
  }
  await page.getByRole("textbox").fill("Soy de Polonia.");
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const writing =
    "Hola, me llamo Ana. Soy de Polonia y vivo en Varsovia con mi familia. Soy veinte años. Estudio español en una escuela. Me gusta la clase. Como te llamas? Hasta pronto, Ana.";
  await page.getByRole("textbox", { name: "Your answer in Spanish" }).fill(writing);
  const writingResponse = page.waitForResponse((r) => r.url().endsWith("/api/coach/review"), {
    timeout: 140000,
  });
  await page.getByRole("button", { name: "Review my practice", exact: true }).click();
  const writingResult = await (await writingResponse).json();
  if (!writingResult.review) {
    throw new Error(JSON.stringify(writingResult));
  }
  await page.locator(".coach-summary").waitFor();
  await page.locator(".coach-feedback").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "docs/screenshots/coach-writing-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".coach-feedback").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "docs/screenshots/coach-writing-mobile.png" });
  if (
    await page.evaluate(() =>
      [...document.querySelectorAll("dialog")].some((d) => d.scrollWidth > d.clientWidth),
    )
  ) {
    throw new Error("Mobile feedback overflow");
  }
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Record your answer", exact: true }).click();
  await page.getByRole("button", { name: "Stop recording", exact: true }).waitFor();
  await page.waitForTimeout(Math.ceil(duration * 1000) + 400);
  await page.getByRole("button", { name: "Stop recording", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector("#spoken-transcript")?.value.length > 10,
    undefined,
    { timeout: 190000 },
  );
  const transcript = await page.getByRole("textbox", { name: "Your spoken Spanish" }).inputValue();
  await page
    .locator(".speech-transcript")
    .screenshot({ path: "docs/screenshots/coach-transcript.png" });
  const speakingResponse = page.waitForResponse((r) => r.url().endsWith("/api/coach/review"), {
    timeout: 140000,
  });
  await page.getByRole("button", { name: "Review my practice", exact: true }).click();
  const speakingResult = await (await speakingResponse).json();
  if (!speakingResult.review) {
    throw new Error(JSON.stringify(speakingResult));
  }
  await page.locator(".coach-summary").waitFor();
  await page.locator(".coach-feedback").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "docs/screenshots/coach-speaking-desktop.png" });
  if (errors.length) {
    throw new Error(errors.join("\n"));
  }
  await writeFile(
    "docs/coach-verification.json",
    JSON.stringify(
      {
        passed: true,
        source: "Fictional writing and existing course audio through a simulated microphone",
        checks: [
          "sentence autoplay after correct check",
          "previous objective answer ignored",
          "live Codex writing feedback",
          "mobile feedback layout",
          "local recorded-speech transcription",
          "live Codex speaking feedback",
        ],
        sentenceAudio,
        writing,
        writingResult,
        transcript,
        speakingResult,
        errors,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Live sentence playback, fresh answer, Codex writing and recorded-speaking checks passed.",
  );
} finally {
  await browser.close();
  await rm(directory, { recursive: true, force: true });
}
