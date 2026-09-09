import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { allLessons } from "../src/data/curriculum.ts";
import { audioKey } from "../src/data/audio.ts";
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1080 },
  permissions: ["microphone"],
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await mkdir("docs/screenshots", { recursive: true });
await page.goto("http://127.0.0.1:5173");
await page.getByRole("heading", { name: "A good day to learn Spanish." }).waitFor();
await page.screenshot({ path: "docs/screenshots/dashboard-desktop.png", fullPage: true });
await page.getByRole("button", { name: "Let’s take the first step" }).click();
await page.getByRole("heading", { name: "What does “hola” mean?" }).waitFor();
await page.screenshot({ path: "docs/screenshots/lesson-desktop.png", fullPage: true });
await page.locator(".answer-option").nth(1).click();
await page.getByRole("heading", { name: "A good moment to learn." }).waitFor();
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.evaluate(() => {
  window.__pasoAudio = [];
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    this.addEventListener(
      "playing",
      () => window.__pasoAudio.push({ src: this.src, duration: this.duration, event: "playing" }),
      { once: true },
    );
    return play.call(this);
  };
});
const stopListening = page.getByRole("button", { name: "Stop audio", exact: true });
if (await stopListening.isVisible()) {
  await stopListening.click();
}
await page.getByRole("button", { name: "Play Spanish audio", exact: true }).click();
await page.waitForFunction(() =>
  window.__pasoAudio.some((a) => a.event === "playing" && a.duration > 0),
);
const playedAudio = await page.evaluate(() => window.__pasoAudio[0]);
const generatedAudio = JSON.parse(await readFile("src/data/audio-sources.json", "utf8"));
const expectedAudio = generatedAudio[audioKey(allLessons[0].questions[1].audio)];
if (expectedAudio && new URL(playedAudio.src).pathname !== expectedAudio.src) {
  throw new Error("The player did not use the installed ElevenLabs recording.");
}
await page.waitForTimeout(1300);
await page.screenshot({ path: "docs/screenshots/listening-desktop.png" });
await page.getByRole("button", { name: "Close lesson" }).click();
await page.getByRole("button", { name: "Save & leave" }).click();
await page.getByRole("button", { name: "Practice studio" }).click();
await page.getByRole("button", { name: "My mistakes (1)", exact: true }).click();
await page.getByRole("heading", { name: "Mistakes are little signposts." }).waitFor();
await page.getByRole("button", { name: "Review my mistakes", exact: true }).click();
await page.getByRole("button", { name: "hello", exact: true }).click();
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.getByRole("heading", { name: "Look at you go." }).waitFor();
await page.getByRole("button", { name: "Back to my journey" }).click();
await page.getByRole("button", { name: "My mistakes (0)", exact: true }).waitFor();
await page.getByRole("button", { name: "All skills", exact: true }).click();
await page.getByRole("textbox", { name: "Search vocabulary" }).fill("coffee");
await page.getByRole("button", { name: "Flip card: el café" }).click();
await page
  .getByRole("button", { name: "Flip card: el café" })
  .getByText("coffee", { exact: true })
  .waitFor();
await page.getByRole("textbox", { name: "Search vocabulary" }).fill("no-such-word");
await page.getByRole("heading", { name: "No word found yet." }).waitFor();
await page.getByRole("button", { name: "Clear search", exact: true }).click();
await page.getByRole("button", { name: "Fill in your story", exact: false }).click();
await page.getByRole("textbox", { name: "Nombre y apellidos" }).fill("Ana María López");
await page.getByRole("textbox", { name: "Nacionalidad" }).fill("polaca");
await page.getByRole("textbox", { name: "Ciudad" }).fill("Varsovia");
await page.getByRole("textbox", { name: "Profesión" }).fill("profesora de música");
await page.getByRole("textbox", { name: "Lenguas" }).fill("polaco inglés y español");
await page.getByRole("textbox", { name: "Aficiones" }).fill("leer libros y escuchar música");
await page.getByRole("button", { name: "Review my practice" }).click();
await page.getByRole("heading", { name: "Let’s reflect on your answer" }).waitFor();
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.getByRole("button", { name: "Back to my journey" }).click();
await page.getByRole("button", { name: "The A1 guide", exact: true }).click();
await page.getByRole("checkbox").first().check();
await page.screenshot({ path: "docs/screenshots/guide-desktop.png", fullPage: true });
await page.reload();
if (!(await page.getByRole("checkbox").first().isChecked())) {
  throw new Error("Checklist did not persist");
}
await page.getByRole("button", { name: "Exam rehearsal", exact: true }).click();
await page.getByRole("button", { name: "Start exam rehearsal" }).click();
await page.getByRole("heading", { name: "¿De dónde es Laura?" }).waitFor();
await page.getByRole("button", { name: "De Italia.", exact: true }).click();
await page.reload();
await page.getByRole("heading", { name: "¿Con quién vive Laura?" }).waitFor();
await page.screenshot({ path: "docs/screenshots/exam-desktop.png", fullPage: true });
await page.getByRole("button", { name: "Finish section", exact: true }).click();
await page.getByRole("button", { name: "Finish & review", exact: true }).click();
await page.getByRole("heading", { name: "1 out of 25." }).waitFor();
await page.getByRole("button", { name: "Continue to listening", exact: true }).click();
await page.getByRole("heading", { name: "¿Qué quiere beber la mujer?" }).waitFor();
await page.getByRole("button", { name: "Finish section", exact: true }).click();
await page.getByRole("button", { name: "Finish & review", exact: true }).click();
await page.getByRole("button", { name: "Continue to writing", exact: true }).click();
for (const [label, value] of [
  ["Nombre y apellidos", "Ana María López"],
  ["Nacionalidad", "polaca"],
  ["Ciudad", "Varsovia"],
  ["Profesión", "profesora de música"],
  ["Lenguas", "polaco inglés y español"],
  ["Aficiones", "leer libros y escuchar música"],
]) {
  await page.getByRole("textbox", { name: label }).fill(value);
}
await page.reload();
if ((await page.getByRole("textbox", { name: "Nacionalidad" }).inputValue()) !== "polaca") {
  throw new Error("Mock form draft lost on reload");
}
await page.getByRole("button", { name: "Save answer", exact: true }).click();
await page
  .getByRole("textbox", { name: "Your answer in Spanish" })
  .fill(
    "Hola, Ana. Sí, puedo quedar el domingo. Nos vemos a las once en la estación. Podemos visitar el parque y después comer en un restaurante del centro. Me gusta mucho la idea. Un abrazo, Elena.",
  );
await page.getByRole("button", { name: "Save answer", exact: true }).click();
await page.getByRole("button", { name: "Finish & review", exact: true }).click();
await page.getByRole("button", { name: "Continue to speaking preparation", exact: true }).click();
await page.getByRole("heading", { name: "A moment to find your words." }).waitFor();
await page.getByRole("button", { name: "I’m ready · start speaking", exact: true }).click();
for (let i = 0; i < 3; i++) {
  await page
    .getByRole("checkbox", { name: "I practised aloud (with or without a recording)." })
    .check();
  await page.getByRole("button", { name: "Save answer", exact: true }).click();
}
await page.getByRole("button", { name: "Finish & review", exact: true }).click();
await page.getByRole("button", { name: "See my results", exact: true }).click();
await page.getByRole("heading", { name: "You’ve met the exam." }).waitFor();
await page.getByRole("spinbutton", { name: "Writing score /25" }).fill("25");
await page.getByRole("spinbutton", { name: "Speaking score /25" }).fill("25");
await page
  .getByText("At least one group is below 30/50 based on the entered scores.", { exact: false })
  .waitFor();

await page.getByRole("button", { name: "My learning space", exact: true }).click();
await page.getByRole("button", { name: "Open your learning preferences" }).click();
await page.getByRole("textbox", { name: "What should we call you?" }).fill("Patryk");
await page.getByRole("button", { name: "Save preferences", exact: true }).click();
await page.getByRole("heading", { name: "Hola, Patryk." }).waitFor();
await page.reload();
await page.getByRole("heading", { name: "Hola, Patryk." }).waitFor();
await page.getByRole("button", { name: "Find your voice", exact: false }).click();
await page.getByRole("button", { name: "Record your answer", exact: true }).click();
await page.getByRole("button", { name: "Stop recording", exact: true }).waitFor();
await page.waitForTimeout(1300);
await page.getByRole("button", { name: "Stop recording", exact: true }).click();
await page.getByRole("link", { name: "Save recording", exact: true }).waitFor();
await page.screenshot({ path: "docs/screenshots/speaking-desktop.png" });
await page.getByRole("button", { name: "Close lesson" }).click();
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  deviceScaleFactor: 1,
});
const mp = await mobile.newPage();
await mp.goto("http://127.0.0.1:5173");
await mp.getByRole("heading", { name: "A good day to learn Spanish." }).waitFor();
await mp.screenshot({ path: "docs/screenshots/dashboard-mobile.png", fullPage: true });
for (const hash of ["today", "path", "practice", "exam", "guide"]) {
  await mp.goto(`http://127.0.0.1:5173/#${hash}`);
  await mp.waitForTimeout(120);
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) {
    throw new Error(`Mobile overflow on ${hash}`);
  }
}
await mp.goto("http://127.0.0.1:5173/#today");
await mp.getByRole("button", { name: "Let’s take the first step" }).click();
await mp.screenshot({ path: "docs/screenshots/lesson-mobile.png" });
if (errors.length) {
  throw new Error(errors.join("\n"));
}
await writeFile(
  "docs/browser-results.json",
  JSON.stringify(
    {
      passed: true,
      desktop: "1440 × 1080",
      mobile: "390 × 844",
      checks: [
        "initial dashboard",
        "wrong-answer explanation",
        "audio playback interaction",
        "mistake persistence and clearing",
        "vocabulary flip and search",
        "writing form",
        "checklist persistence",
        "mock scoring, form persistence, oral preparation and full completion",
        "profile persistence",
        "microphone recording and playback",
        "five mobile pages without overflow",
      ],
      browserErrors: errors,
      playedAudio,
    },
    null,
    2,
  ),
);
await browser.close();
process.stdout.write("Browser checks passed. Screenshots saved in docs/screenshots.\n");
