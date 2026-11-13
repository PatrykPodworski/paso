import { test, expect, answer, resumeMockExam, saved, seedProgress } from "../fixtures/app";
import { mockLiveTalk, talkToLucia } from "../fixtures/live";
import { mockWritingReview } from "../fixtures/writing";
import { examSections, firstVariants, mockTasks } from "../../src/data/mock";
import { shownOptions } from "../../src/data/optionOrder";
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

  await page.goto("/exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await expect(page.getByRole("timer")).toHaveText("45:00");
  await expect.poll(async () => (await saved(page)).mockRun?.stage).toBe("run");

  // The variants the exam builder chose for this run, and the seed that orders its options.
  const { variants, seed } = (await saved(page)).mockRun!;
  const exam = examSections(variants);

  for (let section = 0; section < 4; section++) {
    if (section === 3) {
      await expect(
        page.getByRole("heading", { name: "A moment to find your words." }),
      ).toBeVisible();

      await page
        .getByRole("textbox", { name: "Your preparation notes" })
        .fill("Bruno · Polonia · veinte años");

      await expect
        .poll(async () => (await saved(page)).mockRun?.drafts.prep)
        .toBe("Bruno · Polonia · veinte años");

      await page.reload();

      await expect(page.getByRole("textbox", { name: "Your preparation notes" })).toHaveValue(
        "Bruno · Polonia · veinte años",
      );

      await page.getByRole("button", { name: "I’m ready · start speaking" }).click();
    }

    for (let i = 0; i < exam[section].questions.length; i++) {
      const q = exam[section].questions[i];

      await expect(page.getByRole("heading", { name: q.prompt, exact: true })).toBeVisible();

      if (section === 1) {
        await expect(page.getByRole("button", { name: /Show transcript/ })).toHaveCount(0);
      }

      // Listening Task 3 shows its shared endings in the run's order, not in question order.
      if (q.id.startsWith("mock-l3-")) {
        const shown = await page.locator(".answer-option > span:nth-child(2)").allTextContents();

        expect(shown).toEqual(shownOptions(q.options!, seed));
        expect(shown).not.toEqual(q.options);
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

  // Lucía found every point understandable, half a point each; the writing has no AI marks.
  await expect(page.getByText("Speaking", { exact: true }).locator("..")).toHaveText(
    "Speaking12.5/25",
  );

  await expect(page.getByText("Writing", { exact: true }).locator("..")).toHaveText(
    "WritingNot scored",
  );

  await expect(page.getByRole("spinbutton", { name: "Speaking score /25" })).toHaveCount(0);
  await page.getByRole("spinbutton", { name: "Writing score /25" }).fill("5");
  await expect(page.getByText(/Both groups meet 30/)).toBeVisible();
  await page.getByRole("spinbutton", { name: "Writing score /25" }).fill("4.99");
  await expect(page.getByText(/At least one group is below/)).toBeVisible();
  await expect.poll(async () => (await saved(page)).mockResults).toHaveLength(1);

  const [stored] = (await saved(page)).mockResults;

  expect(stored).toMatchObject({
    sections: [0, 1, 2, 3],
    reading: 25,
    listening: 25,
    speaking: 12.5,
    recorded: true,
  });

  expect(stored.writing).toBeUndefined();
  expect((await saved(page)).mockRun?.resultId).toBe(stored.id);

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
    writing: "Not scored",
    speaking: 12.5,
  });

  // The variants the finished exam took are seen, so the next exam takes others where the
  // task has any.
  const first = (await saved(page)).mockRun!.variants;

  expect(Object.keys((await saved(page)).seenVariants).sort()).toEqual(Object.values(first).sort());

  await page.getByRole("button", { name: "Return to exam overview" }).click();
  await expect(page.getByText("Your previous rehearsals")).toBeVisible();
  await expect(page.getByText("Reading 25/25")).toBeVisible();
  await expect(page.getByText("Listening 25/25")).toBeVisible();
  await expect(page.getByText("Writing ungraded")).toBeVisible();
  await expect(page.getByText("Speaking 12.5/25")).toBeVisible();
  await expect(page.getByText("Productive skills ungraded")).toHaveCount(0);
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await expect.poll(async () => (await saved(page)).mockRun?.stage).toBe("run");

  const second = (await saved(page)).mockRun!.variants;

  for (const task of mockTasks) {
    expect(second[task.id] === first[task.id]).toBe(task.variants.length === 1);
  }
});

test("practise speaking alone: oral prep, resume after a reload, and a result for speaking only", async ({
  page,
}) => {
  await page.goto("/exam");
  await page.getByRole("button", { name: "Practise speaking alone" }).click();
  await expect(page.getByRole("heading", { name: "A moment to find your words." })).toBeVisible();
  await expect(page.getByRole("timer")).toHaveText("10:00");
  await expect.poll(async () => (await saved(page)).mockRun?.sections).toEqual([3]);

  await page.reload();
  await expect(page.getByRole("heading", { name: "A moment to find your words." })).toBeVisible();

  await expect(page.getByRole("list", { name: "Exam sections" }).getByRole("listitem")).toHaveText([
    "1Speaking",
  ]);

  await page.getByRole("button", { name: "I’m ready · start speaking" }).click();
  await page.getByRole("button", { name: "Finish section", exact: true }).click();
  await page.getByRole("button", { name: "Finish & review", exact: true }).click();
  await page.getByRole("button", { name: "See my results", exact: true }).click();
  await expect(page.getByRole("list", { name: "Lucía's grades" })).toBeVisible();

  await expect
    .poll(async () => (await saved(page)).mockResults.map((r) => r.sections))
    .toEqual([[3]]);

  await expect
    .poll(async () => (await saved(page)).mockResults.map(({ id: _, ...result }) => result))
    .toEqual([{ sections: [3], recorded: true, responses: true, at: expect.any(String) }]);

  await page.getByRole("button", { name: "Return to exam overview" }).click();
  await expect(page.getByText("Speaking only")).toBeVisible();
  await expect(page.getByText("Speaking ungraded")).toBeVisible();
  await expect(page.getByText("Productive skills ungraded")).toHaveCount(0);
});

test("each rehearsal keeps its own writing to review after another rehearsal", async ({ page }) => {
  const finish = async (results: number) => {
    await page.getByRole("button", { name: "Finish section", exact: true }).click();
    await page.getByRole("button", { name: "Finish & review", exact: true }).click();
    await page.getByRole("button", { name: "See my results", exact: true }).click();
    await page.getByRole("button", { name: "Return to exam overview" }).click();

    await expect
      .poll(async () => {
        const { mockResults, mockRun } = await saved(page);

        return [mockResults.length, mockRun?.stage];
      })
      .toEqual([results, "intro"]);
  };

  await page.goto("/exam");
  await page.getByRole("button", { name: "Practise writing alone" }).click();
  await expect.poll(async () => (await saved(page)).mockRun?.stage).toBe("run");

  const [form] = examSections((await saved(page)).mockRun!.variants)[2].questions;

  await page.getByRole("textbox", { name: form.fields![0].label, exact: true }).fill("Bruno Nowak");
  await expect.poll(async () => (await saved(page)).mockRun?.drafts[form.id]).toContain("Bruno");
  await finish(1);
  await page.getByRole("button", { name: "Practise writing alone" }).click();
  await expect.poll(async () => (await saved(page)).mockRun?.stage).toBe("run");
  await finish(2);
  await page.reload();

  const rows = page
    .getByRole("heading", { name: "Your previous rehearsals" })
    .locator("xpath=following-sibling::div");

  const dialog = page.getByRole("dialog", { name: "Your responses" });
  // The test clock stands still, so both results share a date and either may be listed first.
  const texts: string[] = [];

  await expect(rows).toHaveCount(2);

  for (const row of [rows.nth(0), rows.nth(1)]) {
    await row.getByRole("button", { name: "View responses" }).click();
    await expect(dialog.getByText("Loading responses…")).toHaveCount(0);
    texts.push((await dialog.textContent()) ?? "");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  }

  const first = texts.find((text) => text.includes("Bruno Nowak")) ?? "";
  const second = texts.find((text) => text !== first) ?? "";

  expect(first).toContain(`${form.fields![0].label}: Bruno Nowak`);
  expect(first.match(/Nothing submitted/g)).toHaveLength(1);
  expect(second).not.toContain("Bruno Nowak");
  expect(second.match(/Nothing submitted/g)).toHaveLength(2);
});

test("timer expires during navigation and section confirmation can be cancelled", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-09-09T10:00:00+02:00") });
  await page.goto("/exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await page.getByRole("button", { name: "Finish section", exact: true }).click();
  await page.getByRole("button", { name: "Keep working" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/today");
  await page.clock.fastForward(45 * 60000);
  await page.goto("/exam");
  await expect(page.getByRole("heading", { name: "0 out of 25." })).toBeVisible();
  await expect(page.getByRole("timer")).toHaveCount(0);
});

test("listening permits two plays and writing draft survives reload and clearing", async ({
  page,
}) => {
  await page.goto("/exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await expect.poll(async () => (await saved(page)).mockRun?.stage).toBe("run");

  // The variants the exam builder chose for this run.
  const [form, open] = examSections((await saved(page)).mockRun!.variants)[2].questions;
  const field = page.getByRole("textbox", { name: form.fields![1].label, exact: true });

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
  await field.fill("polaca");
  await expect.poll(async () => (await saved(page)).mockRun?.drafts[form.id]).toContain("polaca");
  await page.reload();
  await expect(field).toHaveValue("polaca");
  await page.getByRole("button", { name: "Skip for now →" }).click();
  const input = page.getByRole("textbox", { name: "Your answer in Spanish" });

  await input.fill("Hola, soy Bruno.");
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

  // The marks stay with the run, so the results page scores the writing.
  await expect
    .poll(async () => (await saved(page)).mockRun?.marks)
    .toEqual({ [form.id]: 2, [letter.id]: 2 });
});

test("a rehearsal resumes after a reload, and a reset clears it", async ({ page }) => {
  await page.goto("/exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await expect.poll(async () => (await saved(page)).mockRun?.stage).toBe("run");

  // The variants the exam builder chose for this run.
  const [first, second] = examSections((await saved(page)).mockRun!.variants)[0].questions;

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
  await page.goto("/exam");
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

// #806: the run was saved at speaking Task 3, and Lucía's score of that talk has a fix for
// an item below correct on top of eight other corrections.
test("an exam reopened at speaking Task 3 keeps a long talk score and saves its result", async ({
  page,
}) => {
  const talk = (level: "correct" | "understandable") => ({
    grade: "good" as const,
    items: [{ id: "name", label: "Name", level }],
  });

  const corrections = Array.from({ length: 9 }, (_, i) => ({
    original: `error ${i}`,
    corrected: `fix ${i}`,
    explanation: "Explained.",
  }));

  const task3 = { ...talk("understandable"), corrections };

  await mockLiveTalk(page, task3);

  await seedProgress(page, {
    mockRun: {
      section: 3,
      index: 2,
      stage: "run",
      answers: {},
      deadline: Date.now() + 10 * 60000,
      started: new Date().toISOString(),
      drafts: {},
      topic: "home",
      talks: { "mock-s1": talk("correct"), "mock-s2": talk("correct") },
    },
  });

  await page.goto("/exam");

  const prompt = examSections(firstVariants)[3].questions[2].prompt;

  await expect(page.getByRole("heading", { name: prompt, exact: true })).toBeVisible();
  await talkToLucia(page);

  await expect.poll(async () => (await saved(page)).mockRun?.talks["mock-s3"]).toEqual(task3);
  await expect(page.getByRole("dialog", { name: "Progress not saved" })).toHaveCount(0);

  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Finish & review", exact: true }).click();
  await page.getByRole("button", { name: "See my results", exact: true }).click();

  await expect.poll(async () => (await saved(page)).mockResults).toHaveLength(1);
});
