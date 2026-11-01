import { test as base, expect, type Locator, type Page } from "@playwright/test";
import { allLessons } from "../../src/data/curriculum";
import { mockQuestions } from "../../src/data/mock";
import type { ProgressSnapshot, Question } from "../../src/data/types";
import { answerTalk } from "./live";
import { type ProgressSeed, seedWrites } from "./progressSeed";

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

    // A lesson writing task needs a review to move on; a test that cares registers its own.
    await page.route("**/api/review-writing", (route) =>
      route.fulfill({
        json: { wordCount: 0, coverage: [], corrections: [], revised: "", grade: "perfect" },
      }),
    );

    await page.clock.setFixedTime(new Date("2026-09-09T10:00:00+02:00"));
    await provide(page);
    expect(errors, "Uncaught browser errors").toEqual([]);
  },
});

export { expect };

// Captures land in screenshots/ for inspection. With VISUAL_COMPARE set they are compared
// with screenshots/baseline/ instead, which a run with --update-snapshots=all writes.
export const capture = async (
  page: Page,
  name: string,
  { fullPage = false, element }: { fullPage?: boolean; element?: Locator } = {},
) => {
  if (process.env.VISUAL_COMPARE) {
    await (element
      ? expect(element).toHaveScreenshot(`${name}.png`)
      : expect(page).toHaveScreenshot(`${name}.png`, { fullPage }));

    return;
  }

  const path = `screenshots/${test.info().project.name}/${name}.png`;

  await (element ? element.screenshot({ path }) : page.screenshot({ path, fullPage }));
};

// Everything that makes a screenshot reproducible and nothing that is specific to one
// page: kill motion, wait for webfonts, drop focus rings and hover state, scroll to the
// top. Shared by tests/visual/views.spec.ts and tests/visual/design-system.spec.ts.
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

const submitLabel = (q: Question, exam: boolean) =>
  exam ? "Save answer" : ["write", "form"].includes(q.kind) ? "Review my practice" : "Check answer";

// A lesson writing task asks for the passcode until one gets a review.
const fillPasscode = async (page: Page, q: Question, exam: boolean) => {
  const passcode = page.getByLabel("Passcode");

  if (!exam && ["write", "form"].includes(q.kind) && (await passcode.isVisible())) {
    await passcode.fill("olé");
  }
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
  } else if (q.kind === "live") {
    await answerTalk(page);

    return;
  } else {
    await page.getByRole("textbox", { name: "Your answer in Spanish" }).fill(q.answer);
  }

  await fillPasscode(page, q, exam);
  await page.getByRole("button", { name: submitLabel(q, exam), exact: true }).click();
};

export const closeLesson = async (page: Page) => {
  await page.getByRole("button", { name: "Close lesson" }).click();

  if (await page.getByRole("button", { name: "Save & leave" }).isVisible()) {
    await page.getByRole("button", { name: "Save & leave" }).click();
  }
};

// Opens the exam page with a mock run saved at the given point. The deadline is after
// the fixed clock, so the section timer runs.
export const resumeMockExam = async (
  page: Page,
  { section, index, stage }: { section: number; index: number; stage: string },
) => {
  const run = {
    section,
    index,
    stage,
    // The first reading question. The visual compare runs this fixture against the base app too,
    // so it uses only what both versions of the mock data export.
    answers: { [mockQuestions[0].id]: mockQuestions[0].answer },
    deadline: new Date("2026-09-09T10:25:00+02:00").getTime(),
    started: "2026-09-09T08:00:00Z",
    drafts: {},
  };

  await seedProgress(page, { mockRun: run });

  await page.goto("/#exam");
};

export const stored = async (page: Page, key: string) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), key);

// The learner's progress as the dev server's API stores it.
export const saved = async (page: Page): Promise<ProgressSnapshot> => {
  const learner = await page.evaluate(() => localStorage.getItem("paso-learner-v1"));

  const response = await page.request.get("/api/progress", {
    headers: { "x-learner-id": learner! },
  });

  return response.json();
};

// Stores a seed on the dev server for a new learner, and makes every page load of this
// test use that learner. The base app in the visual compare may still read progress from
// paso-progress-v1 and its mock run from paso-mock-v1, so the seed is kept there too.
export const seedProgress = async (page: Page, seed: Partial<ProgressSeed>) => {
  const learner = crypto.randomUUID();
  const timeZone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);

  for (const data of seedWrites(seed, timeZone)) {
    const response = await page.request.post("/api/progress", {
      headers: { "x-learner-id": learner },
      data,
    });

    expect(response.ok(), `seed ${data.action}: ${await response.text()}`).toBe(true);
  }

  await page.addInitScript(
    ({ learner, seed: { mockRun, ...progress } }) => {
      localStorage.setItem("paso-learner-v1", learner);
      localStorage.setItem("paso-progress-v1", JSON.stringify(progress));

      if (mockRun) {
        localStorage.setItem("paso-mock-v1", JSON.stringify(mockRun));
      }
    },
    { learner, seed },
  );
};
