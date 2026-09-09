import { test, expect, answer, stored } from "../fixtures/app";
import { allQuestions, foundations, visualQuestions } from "../../src/data/curriculum";
import { formPractice } from "../../src/data/mock";
const bank = [...allQuestions, ...foundations, formPractice, ...visualQuestions];
for (const skill of ["reading", "listening", "writing", "speaking"] as const) {
  test(`complete focused ${skill} practice without advancing the learning path`, async ({
    page,
  }) => {
    await page.goto("/#practice");
    await page
      .getByRole("button", { name: skill[0].toUpperCase() + skill.slice(1), exact: true })
      .click();
    await page.getByRole("button", { name: `Start ${skill} practice`, exact: true }).click();
    const questions = bank
      .filter((q) => q.skill === skill)
      .slice(0, ["writing", "speaking"].includes(skill) ? 4 : 8);
    for (const q of questions) {
      await expect(page.getByRole("heading", { name: q.prompt, exact: true })).toBeVisible();
      await answer(page, q);
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    }
    await expect(page.getByRole("heading", { name: "Look at you go." })).toBeVisible();
    const progress = await stored(page);
    expect(Object.keys(progress.completed)).toEqual([]);
    expect(progress.attempts).toHaveLength(questions.length);
    expect(progress.attempts.every((a: { skill: string }) => a.skill === skill)).toBe(true);
  });
}
for (const [title, questions] of [
  ["Picture this", visualQuestions],
  ["The foundation lab", foundations],
] as const) {
  test(`complete ${title} and revisit with fresh answers`, async ({ page }) => {
    await page.goto("/#practice");
    await page.getByRole("button", { name: title, exact: false }).click();
    for (const q of questions) {
      await answer(page, q);
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    }
    await expect(page.getByRole("heading", { name: "Look at you go." })).toBeVisible();
    await page.getByRole("button", { name: "Back to my journey" }).click();
    await page.getByRole("button", { name: title, exact: false }).click();
    await expect(page.getByRole("button", { name: "Check answer" })).toHaveCount(0);
    await expect(page.locator(".answer-option[aria-pressed=true]")).toHaveCount(0);
  });
}
test("daily mix prioritizes questions not yet answered", async ({ page }) => {
  await page.goto("/#practice");
  await page.getByRole("button", { name: "Start my daily mix" }).click();
  await answer(page, bank[0]);
  await page.getByRole("button", { name: "Close lesson" }).click();
  await page.getByRole("button", { name: "Start my daily mix" }).click();
  await expect(page.getByRole("heading", { name: bank[1].prompt, exact: true })).toBeVisible();
});
