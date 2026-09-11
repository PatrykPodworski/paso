import { test as base, expect, type Locator, type Page } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";
import { allLessons } from "../../src/data/curriculum";
import type { Question } from "../../src/data/types";
export const test = base.extend<{ blockExternal: void }>({
  blockExternal: [
    async ({ context }, provide) => {
      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.hostname !== "127.0.0.1" && url.protocol.startsWith("http")) {
          return route.abort("blockedbyclient");
        }
        return route.continue();
      });
      await provide();
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
export { expect };
// Everything that makes a screenshot reproducible and nothing that is specific to one
// page: kill motion, wait for webfonts, drop focus rings and hover state, scroll to the
// top. Shared by tests/visual/views.spec.ts and tests/visual/design-system.spec.ts.
// Set only by the Argos job in CI. When on, captures go to Argos, which compares them
// against baselines it generated on the same runner; when off, they go to the committed
// PNGs under tests/visual/baselines, which are macOS arm64 and are the local gate. Each
// is authoritative for its own context; neither validates the other.
const uploadToArgos = process.env.ARGOS_UPLOAD === "1";

export const capture = async (
  page: Page,
  name: string,
  { fullPage = false, element }: { fullPage?: boolean; element?: Locator } = {},
) => {
  if (uploadToArgos) {
    await argosScreenshot(page, name, element ? { element } : { fullPage });
    return;
  }
  if (element) {
    await expect(element).toHaveScreenshot(`${name}.png`);
    return;
  }
  await expect(page).toHaveScreenshot(`${name}.png`, { fullPage });
};

export const stabilise = async (page: Page) => {
  await page.addStyleTag({
    content:
      "*, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }",
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.mouse.move(0, 0);
};
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
    await page.getByRole("checkbox", { name: "I practised aloud", exact: false }).check();
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
