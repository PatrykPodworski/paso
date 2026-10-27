import {
  test,
  expect,
  openLesson,
  answer,
  closeLesson,
  resumeMockExam,
  stored,
} from "../fixtures/app";
import { examiner, mockLiveTalk, sentEvents } from "../fixtures/live";
import { mockWritingReview } from "../fixtures/writing";
import { readFileSync } from "node:fs";
import { audioKey } from "../../src/data/audio";
import { emptyProgress } from "../../src/data/progress";
import { mockSections } from "../../src/data/mock";

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

test("a reading passage plays from the start and keeps going across its questions", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).__clips = [];
    const play = HTMLMediaElement.prototype.play;

    HTMLMediaElement.prototype.play = function () {
      (window as any).__clips.push(this);

      return play.call(this);
    };
  });

  const lesson = await openLesson(page, 2);
  const clips = () => page.evaluate(() => (window as any).__clips.length);

  await page.getByRole("button", { name: "Play the reading passage" }).click();
  await expect.poll(clips).toBe(1);

  await expect
    .poll(() => page.evaluate(() => new URL((window as any).__clips[0].src).pathname))
    .toBe(expectedAudio(lesson.questions[0].passage!));

  await answer(page, lesson.questions[0]);
  // The model answer must not interrupt a passage the learner is listening to.
  expect(await clips()).toBe(1);
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: lesson.questions[1].prompt, exact: true }),
  ).toBeVisible();

  expect(await page.evaluate(() => (window as any).__clips[0].paused)).toBe(false);
  expect(await clips()).toBe(1);
  await expect(page.getByRole("button", { name: "Pause audio" })).toBeVisible();
  await answer(page, lesson.questions[1]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  // The next question is not about this passage, so the passage stops.
  await expect.poll(() => page.evaluate(() => (window as any).__clips[0].paused)).toBe(true);
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
  // Tapping a word reads that word; the sentence model waits for the check.
  expect(await page.evaluate(() => (window as any).__plays.length)).toBe(1);
  await answer(page, q);
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  expect(await page.evaluate(() => (window as any).__plays.length)).toBe(q.tokens!.length + 2);
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

test("check a lesson's writing with the AI tutor and keep the answer", async ({ page }) => {
  const lesson = await openLesson(page, 3);
  const writing = lesson.questions[2];

  await mockWritingReview(page, {
    [writing.id]: {
      wordCount: 6,
      coverage: writing.checklist!.map((point, i) => ({
        point,
        met: i > 0,
        feedback: i > 0 ? "Covered." : "Add a greeting and a farewell.",
      })),
      corrections: [
        { original: "Soy veinte años", corrected: "Tengo veinte años", explanation: "Use tener." },
      ],
      revised: "Hola. Me llamo Ana. Tengo veinte años. Adiós.",
    },
  });

  for (const q of lesson.questions.slice(0, 2)) {
    await answer(page, q);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }

  await page
    .getByRole("textbox", { name: "Your answer in Spanish" })
    .fill("Me llamo Ana. Soy veinte años.");

  await page.getByRole("button", { name: "Review my practice" }).click();
  await page.getByLabel("Passcode").fill("olé");
  await page.getByRole("button", { name: "Check my writing" }).click();

  await expect(page.getByText("6 words. Target: 30–40.")).toBeVisible();
  await expect(page.getByText("Add a greeting and a farewell.")).toBeVisible();
  await expect(page.getByText("Tengo veinte años", { exact: true })).toBeVisible();
  await expect(page.getByText("Hola. Me llamo Ana. Tengo veinte años. Adiós.")).toBeVisible();
  await page.getByRole("button", { name: "Revise my answer" }).click();

  await expect(page.getByRole("textbox", { name: "Your answer in Spanish" })).toHaveValue(
    "Me llamo Ana. Soy veinte años.",
  );
});

// The mock exam holds the only recording tasks: every unit's speaking task is a live talk.
const [speakingTask, nextSpeakingTask] = mockSections[3].questions;

test("record, save and download a speaking answer in the mock exam", async ({ page }) => {
  await resumeMockExam(page, { section: 3, index: 0, stage: "run" });
  await expect(page.getByRole("heading", { name: speakingTask.prompt, exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Record your answer" }).click();
  await expect(page.getByRole("button", { name: "Stop recording" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save answer" })).toBeDisabled();
  await expect.poll(() => page.locator(".recorder .mono").innerText()).not.toBe("00:00");
  await page.getByRole("button", { name: "Stop recording" }).click();
  await expect(page.getByRole("button", { name: "Save answer" })).toBeEnabled();
  const download = page.waitForEvent("download");

  await page.getByRole("link", { name: "Save recording" }).click();
  expect((await download).suggestedFilename()).toMatch(/^paso-speaking\.(webm|m4a)$/);
  await page.getByRole("button", { name: "Save answer" }).click();

  await expect(
    page.getByRole("heading", { name: nextSpeakingTask.prompt, exact: true }),
  ).toBeVisible();
});

test("speaking supports microphone denial and the practised-aloud fallback", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException("Denied", "NotAllowedError");
    };
  });

  await resumeMockExam(page, { section: 3, index: 0, stage: "run" });
  await page.getByRole("button", { name: "Record your answer" }).click();
  await expect(page.getByText(/Microphone access was declined/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Save answer" })).toBeDisabled();
  await page.getByRole("checkbox", { name: "I practised aloud", exact: false }).check();
  await page.getByRole("button", { name: "Save answer" }).click();

  await expect(
    page.getByRole("heading", { name: nextSpeakingTask.prompt, exact: true }),
  ).toBeVisible();
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
    await expect(dialog.getByText(`${i + 1} / 8`, { exact: true })).toBeVisible();
    await expect(dialog.getByText("THE MEANING", { exact: true })).toHaveCount(0);

    await expect
      .poll(() => page.evaluate(() => (window as any).__vocabularyClips.length))
      .toBe(2 * i + 1);

    const word = await dialog.getByRole("heading", { level: 2 }).innerText();

    expect(
      await page.evaluate(() => new URL((window as any).__vocabularyClips.at(-1).src).pathname),
    ).toBe(expectedAudio(word));

    await expect(dialog.locator(".audio-control button")).toHaveCount(1);
    await expect(dialog.locator(".waveform, .speed-button")).toHaveCount(0);
    await page.getByRole("button", { name: "Reveal answer" }).click();
    await expect(dialog.getByText("Memory hint", { exact: true })).toBeVisible();
    const example = await dialog.locator("p[lang='es']").innerText();

    await expect
      .poll(() => page.evaluate(() => (window as any).__vocabularyClips.length))
      .toBe(2 * i + 2);

    expect(
      await page.evaluate(() => new URL((window as any).__vocabularyClips.at(-1).src).pathname),
    ).toBe(expectedAudio(example));

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

test("talk to Lucía live, get scored and pass unit 1's speaking", async ({ page }) => {
  await mockLiveTalk(page, {
    grade: "good",
    items: [
      { id: "name", label: "Name", level: "correct" },
      { id: "age", label: "Age", level: "understandable" },
      { id: "country", label: "Country", level: "correct" },
    ],
  });

  const lesson = await openLesson(page, 3);

  for (const q of lesson.questions.slice(0, 3)) {
    await answer(page, q);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }

  await page.getByRole("button", { name: "Start the talk" }).click();
  await expect(page.getByRole("status")).toHaveText("Connecting to Lucía…");
  await examiner(page, { type: "session.started", session: { id: "live_1" } });

  await examiner(page, {
    type: "session.output_transcript.delta",
    delta: "¿Cómo te llamas?",
    start_ms: 1000,
  });

  await examiner(page, {
    type: "session.input_transcript.delta",
    delta: "Me llamo Ana.",
    start_ms: 2000,
  });

  await expect(page.getByRole("status")).toHaveText("Live");
  await expect(page.getByText(/^0:0\d$/)).toBeVisible();
  await expect(page.getByText("Me llamo Ana.")).toBeHidden();
  await page.getByRole("button", { name: "End the talk" }).click();
  expect(await sentEvents(page)).toEqual(["session.close"]);
  await examiner(page, { type: "session.closed", reason: "close_requested" });
  await expect(page.getByRole("heading", { name: "Good. You passed." })).toBeVisible();
  await expect(page.getByRole("list", { name: "Transcript" })).toBeHidden();
  await page.getByText("Transcript", { exact: true }).click();
  await expect(page.getByRole("list", { name: "Transcript" })).toContainText("Me llamo Ana.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Look at you go." })).toBeVisible();

  const progress = await stored(page);

  expect(progress.attempts.at(-1)).toMatchObject({
    questionId: lesson.questions[3].id,
    correct: true,
    grade: "good",
    answer: "Lucía: ¿Cómo te llamas?\nYou: Me llamo Ana.",
  });

  expect(await stored(page, "paso-live-v1")).toEqual({ freeUsed: true, passcode: "" });
});
