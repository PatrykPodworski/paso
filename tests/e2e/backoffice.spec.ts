import { test, expect } from "../fixtures/app";

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
