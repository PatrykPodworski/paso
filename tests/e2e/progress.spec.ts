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

test("the passcode is asked once and sent with every request", async ({ page }) => {
  const sent: (string | undefined)[] = [];

  await page.route("**/api/progress", async (route) => {
    const passcode = await route.request().headerValue("x-passcode");

    sent.push(passcode ?? undefined);

    return passcode === "ol%C3%A9"
      ? route.continue()
      : route.fulfill({ status: 401, json: { error: "passcode" } });
  });

  await page.goto("/");
  const gate = page.getByRole("dialog", { name: "Enter the passcode" });

  await gate.getByLabel("Passcode").fill("wrong");
  await gate.getByRole("button", { name: "Continue" }).click();
  await expect(gate.getByText("That passcode is not right.")).toBeVisible();
  await gate.getByLabel("Passcode").fill("olé");
  await gate.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "A good day to learn Spanish." })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "A good day to learn Spanish." })).toBeVisible();
  await expect(gate).toBeHidden();
  expect(sent).toEqual([undefined, "wrong", "ol%C3%A9", "ol%C3%A9"]);
});
