import { test, expect, openLesson, answer, closeLesson, stored } from "../fixtures/app";
import { readFileSync } from "node:fs";
import { audioKey } from "../../src/data/audio";
import { emptyProgress } from "../../src/data/progress";
const recordings = JSON.parse(readFileSync("src/data/audio-sources.json", "utf8"));
const expectedAudio = (text: string) =>
  recordings[audioKey(text)]?.src || `/audio/${audioKey(text)}.m4a`;

test("a choice reads el nombre immediately and the next listening question starts itself", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).__heard = [];
    (window as any).__clips = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      (window as any).__clips.push(this);
      this.addEventListener(
        "playing",
        () => {
          (window as any).__heard.push({
            src: new URL(this.src).pathname,
            duration: this.duration,
          });
        },
        { once: true },
      );
      return play.call(this);
    };
  });
  const lesson = await openLesson(page, 4);
  await expect(page.getByRole("button", { name: "Check answer" })).toHaveCount(0);
  await page.getByRole("button", { name: "first name", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: lesson.questions[0].prompt, exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "¡Muy bien! You’ve got it." })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as any).__heard[0]))
    .toMatchObject({
      src: expectedAudio("el nombre"),
      duration: expect.any(Number),
    });
  expect(await page.evaluate(() => (window as any).__heard[0].duration)).toBeGreaterThan(0);
  expect((await stored(page)).attempts).toHaveLength(1);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__heard.at(-1).src))
    .toBe(expectedAudio("el apellido"));
  expect(await page.evaluate(() => (window as any).__clips[0].paused)).toBe(true);
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  const clipsBeforeAnswer = await page.evaluate(() => (window as any).__clips.length);
  await page.getByRole("button", { name: "surname", exact: true }).click();
  expect(await page.evaluate(() => (window as any).__clips.length)).toBe(clipsBeforeAnswer);
  await page.getByRole("button", { name: "Stop audio" }).click();
  await page.getByRole("button", { name: "Play Spanish audio" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__clips.length))
    .toBe(clipsBeforeAnswer + 1);
  await expect(
    page.locator(".question-heading").getByRole("button", { name: "Stop audio" }),
  ).toBeVisible();
});

test("a grammar choice plays the completed Spanish sentence from a local recording", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).__heard = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      this.addEventListener(
        "playing",
        () => {
          (window as any).__heard.push({
            src: new URL(this.src).pathname,
            duration: this.duration,
          });
        },
        { once: true },
      );
      return play.call(this);
    };
  });
  await openLesson(page, 1);
  await page.getByRole("button", { name: "soy", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__heard[0]?.src))
    .toBe(expectedAudio("Yo soy Marta."));
  expect(await page.evaluate(() => (window as any).__heard[0].duration)).toBeGreaterThan(0);
});

test("complete a lesson, persist progress, continue the path, and recover a mistake", async ({
  page,
}) => {
  const lesson = await openLesson(page, 0);
  for (let i = 0; i < lesson.questions.length; i++) {
    await answer(page, lesson.questions[i], false, i === 0);
    if (i === 0) {
      await expect(page.getByText(lesson.questions[i].memoryHint!, { exact: true })).toBeVisible();
      expect((await stored(page)).mistakes).toContain(lesson.questions[i].id);
    }
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await expect(page.getByRole("heading", { name: "Look at you go." })).toBeVisible();
  expect((await stored(page)).completed[lesson.id]).toMatchObject({
    score: lesson.questions.length - 1,
    total: lesson.questions.length,
  });
  await page.getByRole("button", { name: "Back to my journey" }).click();
  await page.reload();
  expect((await stored(page)).completed[lesson.id]).toBeTruthy();
  await page.goto("/#practice");
  await page.getByRole("button", { name: "My mistakes (1)", exact: true }).click();
  await page.getByRole("button", { name: "Review my mistakes" }).click();
  await answer(page, lesson.questions[0]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Back to my journey" }).click();
  expect((await stored(page)).mistakes).toEqual([]);
  expect((await stored(page)).reviewed).toEqual([lesson.questions[0].id]);
  expect(Object.keys((await stored(page)).completed)).toEqual([lesson.id]);
});

test("sentence building supports removal and reads the sentence after checking", async ({
  page,
}) => {
  const lesson = await openLesson(page, 3);
  const q = lesson.questions[0];
  await page.evaluate(() => {
    (window as any).__plays = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      (window as any).__plays.push(this.src);
      return original.call(this);
    };
  });
  await expect(page.getByRole("button", { name: "Check answer" })).toBeDisabled();
  const first = page.locator(".word-bank button").first();
  const word = q.tokens![0];
  await first.click();
  await page.locator(".sentence-tray").getByRole("button", { name: word, exact: false }).click();
  await expect(first).toBeEnabled();
  expect(await page.evaluate(() => (window as any).__plays)).toEqual([]);
  await answer(page, q);
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  expect(await page.evaluate(() => (window as any).__plays.length)).toBe(1);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue("");
  await page.getByRole("textbox").fill("Soy de");
  await page.getByRole("button", { name: "Close lesson" }).click();
  await page.getByRole("button", { name: "Keep learning" }).click();
  await expect(page.getByRole("textbox")).toHaveValue("Soy de");
  await closeLesson(page);
  await openLesson(page, 3);
  await answer(page, q);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue("");
});

test("writing persists drafts, reviews and permits revision", async ({ page }) => {
  const lesson = await openLesson(page, 3);
  for (const q of lesson.questions.slice(0, 2)) {
    await answer(page, q);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  const input = page.getByRole("textbox", { name: "Your answer in Spanish" });
  await input.fill("Me llamo Ana. Soy veinte años.");
  await closeLesson(page);
  await openLesson(page, 3);
  for (const q of lesson.questions.slice(0, 2)) {
    await answer(page, q);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await expect(input).toHaveValue("Me llamo Ana. Soy veinte años.");
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByRole("heading", { name: "Let’s reflect on your answer" })).toBeVisible();
  await page.getByRole("button", { name: "Revise my answer" }).click();
  await expect(input).toBeEnabled();
  await input.fill("Me llamo Ana. Tengo veinte años.");
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByRole("heading", { name: "Let’s reflect on your answer" })).toBeVisible();
  expect(
    (await stored(page)).attempts
      .filter((a: any) => a.questionId === lesson.questions[2].id)
      .every((a: any) => a.correct === null),
  ).toBe(true);
});

test("record, review and download speaking", async ({ page }) => {
  await page.goto("/#today");
  await page.getByRole("button", { name: "Find your voice", exact: false }).click();
  await page.getByRole("button", { name: "Record your answer" }).click();
  await expect(page.getByRole("button", { name: "Stop recording" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Review my practice" })).toBeDisabled();
  await expect.poll(() => page.locator(".recorder .mono").innerText()).not.toBe("00:00");
  await page.getByRole("button", { name: "Stop recording" }).click();
  await expect(page.getByRole("button", { name: "Review my practice" })).toBeEnabled();
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByRole("heading", { name: "Let’s reflect on your answer" })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Save recording" }).click();
  expect((await download).suggestedFilename()).toMatch(/^paso-speaking\.(webm|m4a)$/);
});

test("speaking supports microphone denial and self-review", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException("Denied", "NotAllowedError");
    };
  });
  await page.goto("/#today");
  await page.getByRole("button", { name: "Find your voice", exact: false }).click();
  await page.getByRole("button", { name: "Record your answer" }).click();
  await expect(page.getByText(/Microphone access was declined/)).toBeVisible();
  await page.getByRole("checkbox", { name: "I practised aloud", exact: false }).check();
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByRole("heading", { name: "Let’s reflect on your answer" })).toBeVisible();
});

test("vocabulary search and a complete self-assessed flashcard review", async ({ page }) => {
  const progress = emptyProgress();
  progress.completed["u6-words"] = { score: 8, total: 8, at: "2026-01-01T00:00:00Z" };
  await page.goto("/#practice");
  await page.evaluate(
    (state) => localStorage.setItem("paso-progress-v1", JSON.stringify(state)),
    progress,
  );
  await page.reload();
  await page.evaluate(() => {
    (window as any).__vocabularyClips = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      this.addEventListener(
        "playing",
        () => {
          (window as any).__vocabularyClips.push(this);
        },
        { once: true },
      );
      return play.call(this);
    };
  });
  const pocket = page.getByRole("region", { name: "Your pocket vocabulary" });
  await expect(pocket.locator(".vocabulary-list li")).toHaveCount(8);
  const search = pocket.getByRole("textbox", { name: "Search vocabulary" });
  await search.fill("COFFEE");
  await expect(pocket.getByText("el café", { exact: true })).toBeVisible();
  await search.fill("no-such-word");
  await expect(page.getByRole("heading", { name: "No word found yet." })).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("button", { name: "Review flashcards" }).click();
  const dialog = page.getByRole("dialog", { name: "Vocabulary review" });
  for (let i = 0; i < 8; i++) {
    await expect(dialog.locator(".lesson-counter")).toHaveText(`${i + 1} / 8`);
    await expect(dialog.locator(".flashcard-answer")).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => (window as any).__vocabularyClips.length))
      .toBe(i + 1);
    const word = await dialog.locator(".flashcard-prompt h2").innerText();
    expect(
      await page.evaluate(() => new URL((window as any).__vocabularyClips.at(-1).src).pathname),
    ).toBe(expectedAudio(word));
    await expect(dialog.locator(".audio-control button")).toHaveCount(1);
    await expect(dialog.locator(".waveform, .speed-button")).toHaveCount(0);
    await page.getByRole("button", { name: "Reveal answer" }).click();
    await expect(dialog.locator(".memory-hint")).toBeVisible();
    expect(await page.evaluate(() => (window as any).__vocabularyClips.length)).toBe(i + 1);
    expect(Object.keys((await stored(page)).vocabularyReviews)).toHaveLength(i);
    await page.getByRole("button", { name: i === 0 ? /Got it wrong/ : /Got it right/ }).click();
    await expect(dialog.getByRole("status")).toContainText(i === 0 ? "in 10 min" : "in 1 day");
    await expect(dialog.getByRole("status").locator("time")).toHaveAttribute(
      "datetime",
      i === 0 ? "2026-09-09T08:10:00.000Z" : "2026-09-10T08:00:00.000Z",
    );
  }
  await expect(dialog.getByRole("heading", { name: "Your review is complete." })).toBeVisible();
  expect(
    await page.evaluate(() =>
      (window as any).__vocabularyClips.every((clip: HTMLAudioElement) => clip.paused),
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Back to vocabulary" }).click();
  await expect(page.getByRole("button", { name: "Review flashcards" })).toBeDisabled();
  await page.reload();
  await expect(page.getByRole("button", { name: "Review flashcards" })).toBeDisabled();
  await expect(
    pocket.locator(".vocabulary-stats > div").filter({ hasText: "Reviewed today" }).locator("dd"),
  ).toHaveText("8");
  await expect(pocket.locator(".vocabulary-list time")).toHaveCount(8);
});

test("form requires every field, saves labels and gives productive feedback", async ({ page }) => {
  await page.goto("/#practice");
  await page.getByRole("button", { name: "Fill in your story", exact: false }).click();
  await expect(page.getByRole("button", { name: "Review my practice" })).toBeDisabled();
  const fields = page.getByRole("dialog").getByRole("textbox");
  for (let i = 0; i < (await fields.count()); i++) {
    await fields.nth(i).fill(`Respuesta ${i}`);
  }
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByRole("heading", { name: "Let’s reflect on your answer" })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("creative practices")).toBeVisible();
});

test("listening records transcript assistance and plays bundled audio", async ({ page }) => {
  const lesson = await openLesson(page, 0);
  await answer(page, lesson.questions[0]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const q = lesson.questions[1];
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  await page.getByRole("button", { name: "Need a hand? Show transcript" }).click();
  await page.getByRole("button", { name: "Hide transcript" }).click();
  await answer(page, q);
  expect((await stored(page)).attempts.at(-1)).toMatchObject({ correct: true, assisted: true });
});
