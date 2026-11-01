import { test, expect, answer, resumeMockExam, saved } from "../fixtures/app";
import { mockLiveTalk } from "../fixtures/live";
import { mockWritingReview } from "../fixtures/writing";
import { examSections, firstVariants } from "../../src/data/mock";
import type { Question } from "../../src/data/types";

// The exam as variant 1 of each task.
const sections = examSections(firstVariants);

test("complete all 55 exam questions with section reviews, oral prep, score calculation and export", async ({
  page,
}) => {
  test.setTimeout(90000);

  await mockLiveTalk(page, {
    grade: "good",
    items: [{ id: "name", label: "Name", level: "understandable" }],
    corrections: [
      {
        original: "Soy veinte años",
        corrected: "Tengo veinte años",
        explanation: "Spanish uses tener for age.",
      },
    ],
  });

  await page.goto("/#exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await expect(page.getByRole("timer")).toHaveText("45:00");
  await expect.poll(async () => (await saved(page)).mockRun?.stage).toBe("run");

  // The variants the exam builder chose for this run.
  const exam = examSections((await saved(page)).mockRun!.variants);

  for (let section = 0; section < 4; section++) {
    if (section === 3) {
      await expect(
        page.getByRole("heading", { name: "A moment to find your words." }),
      ).toBeVisible();

      await page
        .getByRole("textbox", { name: "Your preparation notes" })
        .fill("Ana · Polonia · veinte años");

      await expect
        .poll(async () => (await saved(page)).mockRun?.drafts.prep)
        .toBe("Ana · Polonia · veinte años");

      await page.reload();

      await expect(page.getByRole("textbox", { name: "Your preparation notes" })).toHaveValue(
        "Ana · Polonia · veinte años",
      );

      await page.getByRole("button", { name: "I’m ready · start speaking" }).click();
    }

    for (let i = 0; i < exam[section].questions.length; i++) {
      const q = exam[section].questions[i];

      await expect(page.getByRole("heading", { name: q.prompt, exact: true })).toBeVisible();

      if (section === 1) {
        await expect(page.getByRole("button", { name: /Show transcript/ })).toHaveCount(0);
      }

      await answer(page, q, true);

      if (section === 0 && i === 0) {
        await expect.poll(async () => (await saved(page)).mockRun?.answers[q.id]).toBe(q.answer);
        await page.reload();
        await page.getByRole("button", { name: "← Previous question" }).click();

        await expect(page.getByRole("button", { name: q.answer, exact: true })).toHaveAttribute(
          "aria-pressed",
          "true",
        );

        await page.getByRole("button", { name: "Skip for now →" }).click();
      }
    }

    await expect(page.getByRole("dialog")).toContainText("0 unanswered");
    await page.getByRole("button", { name: "Finish & review", exact: true }).click();

    if (section < 2) {
      await expect(page.getByRole("heading", { name: "25 out of 25." })).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "Your practice is ready to review." }),
      ).toBeVisible();
    }

    await page
      .getByRole("button", {
        name:
          section === 0
            ? "Continue to listening"
            : section === 1
              ? "Continue to writing"
              : section === 2
                ? "Continue to speaking preparation"
                : "See my results",
        exact: true,
      })
      .click();
  }

  await expect(page.getByRole("heading", { name: "You’ve met the exam." })).toBeVisible();
  await expect(page.getByText(/A pass cannot be determined/)).toBeVisible();
  await page.getByRole("spinbutton", { name: "Writing score /25" }).fill("5");
  await page.getByRole("spinbutton", { name: "Speaking score /25" }).fill("5");
  await expect(page.getByText(/Both groups meet 30/)).toBeVisible();
  await page.getByRole("spinbutton", { name: "Speaking score /25" }).fill("4.99");
  await expect(page.getByText(/At least one group is below/)).toBeVisible();
  await expect.poll(async () => (await saved(page)).mockResults).toHaveLength(1);

  await expect(page.getByRole("list", { name: "Lucía's grades" })).toHaveText(
    "Task 1GoodTask 2GoodTask 3Good",
  );

  const downloaded = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export responses for review" }).click();
  const download = await downloaded;

  expect(download.suggestedFilename()).toBe("paso-exam-responses.json");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];

  for await (const chunk of stream!) {
    chunks.push(chunk);
  }

  const report = JSON.parse(Buffer.concat(chunks).toString());

  expect(report.responses).toHaveLength(55);

  expect(report).toMatchObject({
    reading: 25,
    listening: 25,
    writing: "Requires human assessment",
    speaking: "Requires human assessment",
  });

  await page.getByRole("button", { name: "Return to exam overview" }).click();
  await expect(page.getByText("Your previous rehearsals")).toBeVisible();
});

test("timer expires during navigation and section confirmation can be cancelled", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-09-09T10:00:00+02:00") });
  await page.goto("/#exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await page.getByRole("button", { name: "Finish section", exact: true }).click();
  await page.getByRole("button", { name: "Keep working" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/#today");
  await page.clock.fastForward(45 * 60000);
  await page.goto("/#exam");
  await expect(page.getByRole("heading", { name: "0 out of 25." })).toBeVisible();
  await expect(page.getByRole("timer")).toHaveCount(0);
});

test("listening permits two plays and writing draft survives reload and clearing", async ({
  page,
}) => {
  const [form, open] = sections[2].questions;

  await page.goto("/#exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await page.getByRole("button", { name: "Finish section", exact: true }).click();
  await page.getByRole("button", { name: "Finish & review", exact: true }).click();
  await page.getByRole("button", { name: "Continue to listening" }).click();

  for (let i = 0; i < 2; i++) {
    if (i > 0) {
      await page.getByRole("button", { name: "Play Spanish audio" }).click();
    }

    await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
    await expect(page.getByText(`${i + 1}/2 plays`)).toBeVisible();
    await page.getByRole("button", { name: "Stop audio" }).click();
  }

  await expect(page.getByRole("button", { name: "Play Spanish audio" })).toBeDisabled();
  await expect(page.getByText("2/2 plays")).toBeVisible();
  await page.getByRole("button", { name: "Finish section", exact: true }).click();
  await page.getByRole("button", { name: "Finish & review", exact: true }).click();
  await page.getByRole("button", { name: "Continue to writing" }).click();
  await page.getByRole("textbox", { name: "Nacionalidad" }).fill("polaca");
  await expect.poll(async () => (await saved(page)).mockRun?.drafts[form.id]).toContain("polaca");
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Nacionalidad" })).toHaveValue("polaca");
  await page.getByRole("button", { name: "Skip for now →" }).click();
  const input = page.getByRole("textbox", { name: "Your answer in Spanish" });

  await input.fill("Hola, soy Ana.");
  await page.getByRole("button", { name: "Save answer" }).click();
  await page.getByRole("button", { name: "Keep working" }).click();
  await input.clear();
  await expect.poll(async () => (await saved(page)).mockRun?.drafts[open.id]).toBe("");
  await page.reload();
  await expect(input).toHaveValue("");
});

const markedReview = (q: Question, reason: string) => ({
  wordCount: 30,
  coverage: (q.fields?.map((f) => f.label) ?? q.checklist!).map((point) => ({
    point,
    met: true,
    feedback: "Covered.",
  })),
  corrections: [],
  revised: q.answer,
  mark: { band: 2, reason },
});

test("mark both writing tasks at the section review and scale them to 25", async ({ page }) => {
  const [form, letter] = sections[2].questions;

  await mockWritingReview(page, {
    [form.id]: markedReview(form, "Every field answered at A1 level."),
    [letter.id]: markedReview(letter, "Clear reply with one missed point."),
  });

  await resumeMockExam(page, { section: 2, index: 0, stage: "run" });

  for (const q of [form, letter]) {
    await expect(page.getByRole("heading", { name: q.prompt, exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Get feedback on my writing" })).toHaveCount(0);
    await answer(page, q, true);
  }

  await page.getByRole("button", { name: "Finish & review", exact: true }).click();
  await page.getByLabel("Passcode").fill("olé");
  await page.getByRole("button", { name: "Get feedback on my writing" }).click();

  await expect(page.getByText("16.67 out of 25 for writing.")).toBeVisible();
  await expect(page.getByText("Every field answered at A1 level.")).toBeVisible();
  await expect(page.getByText("Clear reply with one missed point.")).toBeVisible();
  await expect(page.getByText("Mark: 2 out of 3.")).toHaveCount(2);
});

test("a rehearsal resumes after a reload, and a reset clears it", async ({ page }) => {
  const [first, second] = sections[0].questions;

  await page.goto("/#exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await answer(page, first, true);
  await expect(page.getByRole("heading", { name: second.prompt, exact: true })).toBeVisible();
  await expect.poll(async () => (await saved(page)).mockRun?.answers[first.id]).toBe(first.answer);
  await page.reload();
  await expect(page.getByRole("heading", { name: second.prompt, exact: true })).toBeVisible();
  await expect(page.getByText("2 / 25")).toBeVisible();
  await page.getByRole("button", { name: "Open your learning preferences" }).click();
  await page.getByText("Start over", { exact: true }).click();
  await page.getByRole("button", { name: "Reset my progress", exact: true }).click();
  await page.getByRole("button", { name: "Clear my practice data" }).click();
  await expect(page.getByRole("heading", { name: "A good day to learn Spanish." })).toBeVisible();
  await page.goto("/#exam");
  await expect(page.getByRole("button", { name: "Start exam rehearsal" })).toBeVisible();
  expect((await saved(page)).mockRun).toBeNull();
});

test("typed writing and speaking scores are kept after a reload", async ({ page }) => {
  await resumeMockExam(page, { section: 3, index: 0, stage: "done" });
  await page.getByRole("spinbutton", { name: "Writing score /25" }).fill("18.5");
  await page.getByRole("spinbutton", { name: "Speaking score /25" }).fill("14");
  await expect(page.getByText(/At least one group is below/)).toBeVisible();

  await expect
    .poll(async () => (await saved(page)).mockRun?.scores)
    .toEqual({ writing: "18.5", speaking: "14" });

  await page.reload();
  await expect(page.getByRole("spinbutton", { name: "Writing score /25" })).toHaveValue("18.5");
  await expect(page.getByRole("spinbutton", { name: "Speaking score /25" })).toHaveValue("14");
  await expect(page.getByText(/At least one group is below/)).toBeVisible();
});
