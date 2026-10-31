import { allLessons } from "../../src/data/curriculum";
import { test, expect, answer, openLesson, saved } from "../fixtures/app";

const [first] = allLessons[0].questions;

test("an answer is saved online and kept after a reload", async ({ page }) => {
  await openLesson(page, 0);
  await answer(page, first, false, true);
  await expect(page.locator(".xp-stat")).toHaveText("5 XP");
  await page.reload();
  await expect(page.locator(".xp-stat")).toHaveText("5 XP");
  await page.goto("/#practice");
  await expect(page.getByRole("button", { name: "My mistakes (1)", exact: true })).toBeVisible();
});

test("an answer shows in Recent answers and as Last time after a reload", async ({ page }) => {
  await openLesson(page, 0);
  await answer(page, first, false, true);
  await expect(page.locator(".xp-stat")).toHaveText("5 XP");
  await page.reload();
  await page.goto("/#practice");
  const recent = page.getByRole("region", { name: "Recent answers" }).getByRole("listitem");

  await expect(recent).toHaveCount(1);
  await expect(recent).toContainText(first.prompt);
  await expect(recent).toContainText("Wrong");
  await openLesson(page, 0);
  await expect(page.getByText(/^Last time:/)).toContainText("Last time: Wrong");
});

test("a failed write shows Retry, and Retry saves it", async ({ page }) => {
  let refused = 0;

  await page.route("**/api/progress", (route) =>
    route.request().method() === "POST" && refused++ === 0
      ? route.fulfill({ status: 503, json: { error: "unavailable" } })
      : route.continue(),
  );

  await openLesson(page, 0);
  await answer(page, first);
  const dialog = page.getByRole("dialog", { name: "Progress not saved" });

  await expect(dialog).toBeVisible();
  expect((await saved(page)).recent).toEqual([]);
  await dialog.getByRole("button", { name: "Retry" }).click();
  await expect(dialog).toBeHidden();
  await expect.poll(async () => (await saved(page)).recent).toHaveLength(1);
  await expect(page.locator(".xp-stat")).toHaveText("5 XP");
});

test("a fresh browser finishes a lesson and keeps it without a passcode", async ({ page }) => {
  const passcodes: string[] = [];

  page.on("request", (request) => {
    const passcode = request.headers()["x-passcode"];

    if (request.url().endsWith("/api/progress") && passcode !== undefined) {
      passcodes.push(passcode);
    }
  });

  const lesson = await openLesson(page, 0);

  for (const q of lesson.questions) {
    await answer(page, q);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }

  await expect(page.getByRole("heading", { name: "Look at you go." })).toBeVisible();

  await expect
    .poll(async () => (await saved(page)).completed[lesson.id])
    .toMatchObject({ score: lesson.questions.length, total: lesson.questions.length });

  await page.reload();
  await expect(page.locator(".xp-stat")).toHaveText(`${lesson.questions.length * 5 + 20} XP`);
  await expect(page.getByRole("dialog")).toBeHidden();
  expect(passcodes).toEqual([]);
});
