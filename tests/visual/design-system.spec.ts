import { test, expect, stabilise, capture } from "../fixtures/app";
import { sections } from "../../src/design-system/sections";

// The whole-page baselines in views.spec.ts only ever capture the variants an app view
// happens to render. These per-section shots are what covers the rest: a disabled
// button, an error state, a size no screen currently uses.
test("gallery page", async ({ page }) => {
  await page.goto("/#design-system");
  await expect(page.getByRole("heading", { name: "Design system" })).toBeVisible();
  await stabilise(page);
  await capture(page, "design-system", { fullPage: true });
});

for (const { id, name } of sections) {
  test(`component: ${name}`, async ({ page }) => {
    await page.goto("/#design-system");
    await stabilise(page);
    await capture(page, `design-system-${id}`, { element: page.locator(`[data-section="${id}"]`) });
  });
}
