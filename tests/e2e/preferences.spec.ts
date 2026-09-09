import { test, expect, stored } from "../fixtures/app";

test("preferences persist, export contains actual progress, reset requires confirmation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open your learning preferences" }).click();
  await page.getByRole("textbox", { name: "What should we call you?" }).fill("  Ana  ");
  await page.getByRole("combobox", { name: "Your daily practice goal" }).selectOption("5");
  await page.getByLabel("Exam date").fill("2026-10-09");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Hola, Ana." })).toBeVisible();
  expect(await stored(page)).toMatchObject({ name: "Ana", goal: 5, examDate: "2026-10-09" });
  await page.getByRole("button", { name: "Open your learning preferences" }).click();
  const next = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export progress", exact: true }).click();
  const download = await next;
  expect(download.suggestedFilename()).toBe("paso-progress-2026-09-09.json");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) {
    chunks.push(chunk);
  }
  expect(JSON.parse(Buffer.concat(chunks).toString())).toMatchObject({ name: "Ana", goal: 5 });
  await page.getByText("Start over", { exact: true }).click();
  await page.getByRole("button", { name: "Reset my progress", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect((await stored(page)).name).toBe("Ana");
  await page.getByRole("button", { name: "Reset my progress", exact: true }).click();
  await page.getByRole("button", { name: "Clear my practice data" }).click();
  await expect(page.getByRole("heading", { name: "A good day to learn Spanish." })).toBeVisible();
  expect((await stored(page)).name).toBe("");
  expect(await stored(page, "paso-mock-v1")).toBeNull();
});

test("guide checklist persists and sliders require both passing groups", async ({ page }) => {
  await page.goto("/#guide");
  const first = page.getByRole("checkbox").first();
  await first.check();
  await page.reload();
  await expect(first).toBeChecked();
  await first.uncheck();
  const sliders = page.getByRole("slider");
  await sliders.nth(0).fill("25");
  await sliders.nth(1).fill("25");
  await sliders.nth(2).fill("0");
  await sliders.nth(3).fill("0");
  await expect(page.locator(".pass-verdict")).toContainText("do not meet the passing rule");
});

test("navigation, deep links, unknown routes and modal keyboard focus work", async ({
  page,
}, info) => {
  await page.goto("/#unknown");
  await expect(page.getByRole("heading", { name: "A good day to learn Spanish." })).toBeVisible();
  const labels = [
    "Learning path",
    "Practice studio",
    "Exam rehearsal",
    "The A1 guide",
    "My learning space",
  ];
  for (const label of labels) {
    if (info.project.name === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
    }
    await page.getByRole("button", { name: label, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  const open = page.getByRole("button", { name: "Open your learning preferences" });
  await open.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(open).toBeFocused();
});
