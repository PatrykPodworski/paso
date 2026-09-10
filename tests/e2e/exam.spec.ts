import { test, expect, answer, stored } from "../fixtures/app";
import { mockSections } from "../../src/data/mock";

test("complete all 55 exam questions with section reviews, oral prep, score calculation and export", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/#exam");
  await page.getByRole("button", { name: "Start exam rehearsal" }).click();
  await expect(page.getByRole("timer")).toHaveText("45:00");
  for (let section = 0; section < 4; section++) {
    if (section === 3) {
      await expect(
        page.getByRole("heading", { name: "A moment to find your words." }),
      ).toBeVisible();
      await page
        .getByRole("textbox", { name: "Your preparation notes" })
        .fill("Ana · Polonia · veinte años");
      await page.reload();
      await expect(page.getByRole("textbox", { name: "Your preparation notes" })).toHaveValue(
        "Ana · Polonia · veinte años",
      );
      await page.getByRole("button", { name: "I’m ready · start speaking" }).click();
    }
    for (let i = 0; i < mockSections[section].questions.length; i++) {
      const q = mockSections[section].questions[i];
      await expect(page.getByRole("heading", { name: q.prompt, exact: true })).toBeVisible();
      if (section === 1) {
        await expect(page.getByRole("button", { name: /Show transcript/ })).toHaveCount(0);
      }
      await answer(page, q, true);
      if (section === 0 && i === 0) {
        await page.reload();
        await page.getByRole("button", { name: "← Previous question" }).click();
        await expect(page.getByRole("button", { name: q.answer, exact: true })).toHaveAttribute(
          "aria-pressed",
          "true",
        );
        await page.getByRole("button", { name: "Skip for now →" }).click();
      }
    }
    await expect(page.getByRole("alert")).toContainText("0 unanswered");
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
  expect((await stored(page)).mockResults).toHaveLength(1);
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
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.goto("/#today");
  await page.clock.fastForward(45 * 60000);
  await page.goto("/#exam");
  await expect(page.getByRole("heading", { name: "0 out of 25." })).toBeVisible();
  await expect(page.getByRole("timer")).toHaveCount(0);
});

test("listening permits two plays and writing draft survives reload and clearing", async ({
  page,
}) => {
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
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Nacionalidad" })).toHaveValue("polaca");
  await page.getByRole("button", { name: "Skip for now →" }).click();
  const input = page.getByRole("textbox", { name: "Your answer in Spanish" });
  await input.fill("Hola, soy Ana.");
  await page.getByRole("button", { name: "Save answer" }).click();
  await page.getByRole("button", { name: "Keep working" }).click();
  await input.clear();
  await page.reload();
  await expect(input).toHaveValue("");
});
