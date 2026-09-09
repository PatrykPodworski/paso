import { test as base, expect, type Page } from "@playwright/test";
import { allLessons } from "../../src/data/curriculum";
import type { Question } from "../../src/data/types";
import { review } from "../../src/test/coach-fixture";
export const test = base.extend<{ coachRequests: { path: string; body: string | null }[] }>({
  coachRequests: [
    async ({ context }, provide) => {
      const requests: { path: string; body: string | null }[] = [];
      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.hostname !== "127.0.0.1" && url.protocol.startsWith("http")) {
          return route.abort("blockedbyclient");
        }
        if (url.pathname.startsWith("/api/coach/")) {
          requests.push({ path: url.pathname, body: route.request().postData() });
          return route.fulfill({
            json: url.pathname.endsWith("transcribe")
              ? { text: "Me llamo Ana. Soy veinte años." }
              : { review },
          });
        }
        return route.continue();
      });
      await provide(requests);
    },
    { auto: true },
  ],
  page: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.clock.setFixedTime(new Date("2026-09-09T10:00:00+02:00"));
    await provide(page);
    expect(errors, "Uncaught browser errors").toEqual([]);
  },
});
export { expect, review };
export const openLesson = async (page: Page, index: number) => {
  await page.goto("/#path");
  const lesson = allLessons[index];
  const unit = page.locator(".unit-card").nth(Math.floor(index / 4));
  if ((await unit.locator(".unit-summary").getAttribute("aria-expanded")) !== "true") {
    await unit.locator(".unit-summary").click();
  }
  await unit.getByRole("button", { name: lesson.title, exact: false }).click();
  await expect(
    page.getByRole("heading", { name: lesson.questions[0].prompt, exact: true }),
  ).toBeVisible();
  return lesson;
};
export const answer = async (page: Page, q: Question, exam = false, wrong = false) => {
  if (q.options) {
    await page
      .getByRole("button", {
        name: wrong ? q.options.find((o) => o !== q.answer)! : q.answer,
        exact: true,
      })
      .click();
    return;
  } else if (q.kind === "order") {
    for (const word of q.answer.split(" ")) {
      await page
        .locator(".word-bank")
        .getByRole("button", { name: word, exact: true, disabled: false })
        .filter({ visible: true })
        .first()
        .click();
    }
    return;
  } else if (q.kind === "form") {
    for (const f of q.fields!) {
      await page.getByRole("textbox", { name: f.label, exact: true }).fill(f.example);
    }
  } else if (q.kind === "speak") {
    if (exam) {
      await page.getByRole("checkbox", { name: "I practised aloud", exact: false }).check();
    } else {
      await page
        .getByRole("textbox", { name: "Your spoken Spanish" })
        .fill("Me llamo Ana. Soy veinte años.");
    }
  } else {
    await page.getByRole("textbox", { name: "Your answer in Spanish" }).fill(q.answer);
  }
  await page
    .getByRole("button", {
      name: exam
        ? "Save answer"
        : ["write", "speak", "form"].includes(q.kind)
          ? "Review my practice"
          : "Check answer",
      exact: true,
    })
    .click();
};
export const closeLesson = async (page: Page) => {
  await page.getByRole("button", { name: "Close lesson" }).click();
  if (await page.getByRole("button", { name: "Save & leave" }).isVisible()) {
    await page.getByRole("button", { name: "Save & leave" }).click();
  }
};
export const stored = async (page: Page, key = "paso-progress-v1") =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), key);
