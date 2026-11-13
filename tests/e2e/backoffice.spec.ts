import { test, expect } from "../fixtures/app";
import { courseUnitNumber } from "../../src/data/path";

test("the backoffice opens unit 1's live talk without the tasks before it", async ({ page }) => {
  await page.goto("/backoffice");
  const nav = page.getByRole("navigation", { name: "Main navigation", includeHidden: true });

  await expect(nav.getByRole("button", { includeHidden: true })).toHaveText([
    "My learning space",
    "Learning path",
    "Practice studio",
    "Exam rehearsal",
    "The A1 guide",
  ]);

  await page
    .getByRole("region", { name: "Unit 1 · ¡Hola, mundo!" })
    .getByRole("button", { name: /Talk to Lucía/ })
    .click();

  const dialog = page.getByRole("dialog");

  await expect(dialog.getByText("1 / 1")).toBeVisible();
  await expect(dialog.getByText("Your first live talk is free.")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Start the talk" })).toBeVisible();
});

test("the backoffice flags clips and pictures by keyboard and copies their ids", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/backoffice");

  await page.getByRole("tab", { name: /Audio/ }).click();
  // la cocina is a course unit 4 clip, listed under that unit's path number.
  await page.getByRole("combobox", { name: "Unit" }).selectOption(`Unit ${courseUnitNumber(4)}`);
  await page.getByRole("searchbox", { name: "Search" }).fill("v6yukl");
  await page.getByRole("checkbox", { name: "Flawed: la cocina" }).press("Space");
  await expect(page.getByText(/^1 of \d+ shown · 1 flagged$/)).toBeVisible();

  await page.getByRole("tab", { name: /Images/ }).click();
  await page.getByRole("combobox", { name: "Unit" }).selectOption("Unit 1");
  await page.getByRole("checkbox", { name: /Select all visible/ }).press("Space");
  await expect(page.getByText(/^8 of \d+ shown · 8 flagged$/)).toBeVisible();
  await page.getByRole("checkbox", { name: "Flawed: adiós" }).click();

  await page.reload();
  await page.getByRole("tab", { name: /Images/ }).click();
  await page.getByRole("button", { name: "Copy 8 IDs" }).press("Enter");
  await expect(page.getByRole("status")).toHaveText("Copied 8 IDs.");

  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    [
      "audio:v6yukl",
      "image:hola.webp",
      "image:gracias.webp",
      "image:por-favor.webp",
      "image:buenos-dias.webp",
      "image:buenas-noches.webp",
      "image:hasta-luego.webp",
      "image:perdon.webp",
    ].join("\n"),
  );
});
