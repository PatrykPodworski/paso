import { test, expect, stabilise } from "../fixtures/app";
import { sections } from "../../src/design-system/sections";

// The whole-page baselines in views.spec.ts only ever capture the variants an app view
// happens to render. These per-section shots are what covers the rest: a disabled
// button, an error state, a size no screen currently uses.
test("gallery page", async ({ page }) => {
  await page.goto("/#design-system");
  await expect(page.getByRole("heading", { name: "Design system" })).toBeVisible();
  await stabilise(page);
  await expect(page).toHaveScreenshot("design-system.png", { fullPage: true });
});

for (const { id, name } of sections) {
  test(`component: ${name}`, async ({ page }) => {
    await page.goto("/#design-system");
    await stabilise(page);
    await expect(page.locator(`[data-section="${id}"]`)).toHaveScreenshot(
      `design-system-${id}.png`,
    );
  });
}
