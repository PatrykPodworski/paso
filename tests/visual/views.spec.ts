import { test, expect, openLesson, answer, review } from "../fixtures/app";
import { allLessons, allQuestions, visualQuestions } from "../../src/data/curriculum";
import { emptyProgress } from "../../src/data/progress";
import { mockSections } from "../../src/data/mock";
import type { Page } from "@playwright/test";
const shot = async (page: Page, name: string) => {
  const stop = page.getByRole("button", { name: /^(Stop|Pause) audio$/ });
  if (await stop.isVisible()) {
    await stop.click();
  }
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
  const dialog = page.getByRole("dialog");
  const modal = (await dialog.count()) > 0;
  if (modal) {
    await dialog.evaluate((el) => (el.scrollTop = 0));
  }
  await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: !modal });
  if (modal && (await dialog.evaluate((el) => el.scrollHeight > el.clientHeight + 4))) {
    await dialog.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await expect(page).toHaveScreenshot(`${name}-bottom.png`, { fullPage: false });
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "No horizontal overflow",
  ).toBe(true);
};
for (const view of ["today", "path", "practice", "exam", "guide"]) {
  test(`view: ${view}`, async ({ page }) => {
    await page.goto(`/#${view}`);
    await shot(page, view);
  });
}
for (const skill of ["Reading", "Listening", "Writing", "Speaking"]) {
  test(`practice filter: ${skill}`, async ({ page }) => {
    await page.goto("/#practice");
    await page.getByRole("button", { name: skill, exact: true }).click();
    await shot(page, `practice-${skill.toLowerCase()}`);
  });
}
test("mistakes: empty and populated", async ({ page }) => {
  await page.goto("/#practice");
  await page.getByRole("button", { name: "My mistakes (0)" }).click();
  await shot(page, "mistakes-empty");
  await page.evaluate((p) => localStorage.setItem("paso-progress-v1", JSON.stringify(p)), {
    ...emptyProgress(),
    mistakes: [allQuestions[0].id],
  });
  await page.reload();
  await page.getByRole("button", { name: "My mistakes (1)" }).click();
  await page.getByText(allQuestions[0].prompt, { exact: true }).click();
  await shot(page, "mistakes-with-explanation");
});
test("vocabulary: overview, review, feedback and no results", async ({ page }) => {
  const p = emptyProgress();
  p.completed["u6-words"] = { at: "2026-01-01T00:00:00Z", score: 8, total: 8 };
  await page.addInitScript(
    (state) => localStorage.setItem("paso-progress-v1", JSON.stringify(state)),
    p,
  );
  await page.goto("/#practice");
  await shot(page, "vocabulary-overview");
  await page.getByRole("button", { name: "Review flashcards" }).click();
  await shot(page, "vocabulary-review");
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await shot(page, "vocabulary-flipped");
  await page.getByRole("button", { name: /Got it wrong/ }).click();
  await shot(page, "vocabulary-feedback");
  await page.getByRole("button", { name: "Close vocabulary review" }).click();
  await page.getByRole("textbox", { name: "Search vocabulary" }).fill("no-such-word");
  await shot(page, "vocabulary-empty");
});

test("preferences and reset confirmation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open your learning preferences" }).click();
  await shot(page, "preferences");
  await page.getByText("Start over", { exact: true }).click();
  await page.getByRole("button", { name: "Reset my progress", exact: true }).click();
  await shot(page, "preferences-reset");
});
test("mobile navigation drawer", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "Drawer is only a phone view");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await shot(page, "navigation-drawer");
});
test("personalized dashboard with completed lessons and activity", async ({ page }) => {
  const p = emptyProgress();
  p.name = "Ana";
  p.goal = 5;
  p.examDate = "2026-10-09";
  p.completed[allLessons[0].id] = { score: 7, total: 8, at: "2026-09-09T08:00:00Z" };
  p.attempts = allLessons[0].questions.map((q, i) => ({
    id: String(i),
    questionId: q.id,
    skill: q.skill,
    answer: q.answer,
    correct: i !== 0,
    at: "2026-09-09T08:00:00Z",
  }));
  p.mistakes = [allLessons[0].questions[0].id];
  await page.addInitScript((p) => localStorage.setItem("paso-progress-v1", JSON.stringify(p)), p);
  await page.goto("/");
  await shot(page, "dashboard-progress");
});
test("guide failing score groups and checklist", async ({ page }) => {
  await page.goto("/#guide");
  await page.getByRole("checkbox").first().check();
  await page.getByRole("slider").nth(2).fill("0");
  await shot(page, "guide-below-threshold");
});
test("question: choice, immediate error and memory hint", async ({ page }) => {
  const lesson = await openLesson(page, 0);
  await shot(page, "question-choice");
  await page.getByRole("button", { name: lesson.questions[0].options![1], exact: true }).click();
  await shot(page, "question-error");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  await shot(page, "question-listening");
  await page.getByRole("button", { name: "Need a hand? Show transcript" }).click();
  await shot(page, "question-transcript");
  await page.getByRole("button", { name: "Close lesson" }).click();
  await shot(page, "lesson-leave");
});
test("question: immediate vocabulary feedback for nombre and apellido", async ({ page }) => {
  const lesson = await openLesson(page, 4);
  await answer(page, lesson.questions[0]);
  await shot(page, "question-nombre-feedback");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await answer(page, lesson.questions[1]);
  await shot(page, "question-apellido-feedback");
});
test("question: completed grammar sentence and apellidos field pronunciation", async ({ page }) => {
  const grammar = await openLesson(page, 5);
  await answer(page, grammar.questions[0]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await answer(page, grammar.questions[1]);
  await shot(page, "question-grammar-feedback");
  await page.getByRole("button", { name: "Close lesson" }).click();
  await page.getByRole("button", { name: "Save & leave" }).click();
  const reading = await openLesson(page, 6);
  await answer(page, reading.questions[0]);
  await shot(page, "question-apellidos-reading-feedback");
});
test("lesson completion", async ({ page }) => {
  const l = await openLesson(page, 0);
  for (const q of l.questions) {
    await answer(page, q);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await shot(page, "lesson-complete");
});
test("question: sentence, typed answer, writing and coach feedback", async ({ page }) => {
  const l = await openLesson(page, 3);
  await shot(page, "question-order");
  await answer(page, l.questions[0]);
  const stop = page.getByRole("button", { name: "Stop audio" });
  if (await stop.isVisible()) {
    await stop.click();
  }
  await shot(page, "question-order-correct");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await shot(page, "question-type");
  await answer(page, l.questions[1]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("textbox").fill("Me llamo Ana. Soy veinte años.");
  await shot(page, "question-writing");
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByText(review.summary)).toBeVisible();
  await shot(page, "writing-coach-feedback");
});
test("question: form", async ({ page }) => {
  await page.goto("/#practice");
  await page.getByRole("button", { name: "Fill in your story", exact: false }).click();
  await page.getByRole("textbox", { name: "Nombre y apellidos" }).fill("Ana María López");
  await shot(page, "question-form");
});
test("question: image", async ({ page }) => {
  await page.goto("/#practice");
  await page.getByRole("button", { name: "Picture this", exact: false }).click();
  await shot(page, "question-image");
});
test("question: speaking and transcript feedback", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Find your voice", exact: false }).click();
  await shot(page, "question-speaking");
  await page
    .getByRole("textbox", { name: "Your spoken Spanish" })
    .fill("Me llamo Ana. Soy veinte años.");
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByText(review.summary)).toBeVisible();
  await shot(page, "speaking-coach-feedback");
});
test("coach unavailable state", async ({ page }) => {
  await page.route("**/api/coach/review", (route) =>
    route.fulfill({
      status: 503,
      json: { error: "The coach is unavailable. Your answer is saved; please try again." },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Find your voice", exact: false }).click();
  await page.getByRole("textbox", { name: "Your spoken Spanish" }).fill("Me llamo Ana.");
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByRole("button", { name: "Try Codex again" })).toBeVisible();
  await shot(page, "coach-error");
});
const examCases = [
  ["reading", 0, 0, "run"],
  ["listening", 1, 0, "run"],
  ["form", 2, 0, "run"],
  ["writing", 2, 1, "run"],
  ["oral-preparation", 3, 0, "prep"],
  ["speaking", 3, 0, "run"],
  ["reading-review", 0, 0, "review"],
  ["listening-review", 1, 0, "review"],
  ["writing-review", 2, 0, "review"],
  ["speaking-review", 3, 0, "review"],
  ["results", 3, 0, "done"],
] as const;
for (const [name, section, index, stage] of examCases) {
  test(`exam state: ${name}`, async ({ page }) => {
    const run = {
      section,
      index,
      stage,
      answers: { [mockSections[0].questions[0].id]: mockSections[0].questions[0].answer },
      deadline: new Date("2026-09-09T10:25:00+02:00").getTime(),
      started: "2026-09-09T08:00:00Z",
      drafts: {},
    };
    await page.addInitScript(
      (run) => localStorage.setItem("paso-mock-v1", JSON.stringify(run)),
      run,
    );
    await page.goto("/#exam");
    await shot(page, `exam-${name}`);
    if (name === "reading") {
      await page.getByRole("button", { name: "Finish section", exact: true }).click();
      await shot(page, "exam-finish-confirmation");
    }
    if (name === "results") {
      await page.getByRole("spinbutton", { name: "Writing score /25" }).fill("25");
      await page.getByRole("spinbutton", { name: "Speaking score /25" }).fill("25");
      await shot(page, "exam-results-entered-scores");
    }
  });
}

test("microphone denial and pending coach feedback", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException("Denied", "NotAllowedError");
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Find your voice", exact: false }).click();
  await page.getByRole("button", { name: "Record your answer" }).click();
  await expect(page.getByText(/Microphone access was declined/)).toBeVisible();
  await shot(page, "microphone-denied");
  await page.route("**/api/coach/review", () => {});
  await page.getByRole("textbox", { name: "Your spoken Spanish" }).fill("Me llamo Ana.");
  await page.getByRole("button", { name: "Review my practice" }).click();
  await expect(page.getByText("Reading your Spanish and checking the task…")).toBeVisible();
  await shot(page, "coach-loading");
});

test("illustrated scenarios in the picture studio", async ({ page }) => {
  await page.goto("/#practice");
  await page.getByRole("button", { name: "Picture this", exact: false }).click();
  const seen = new Set();
  for (const q of visualQuestions) {
    if (!seen.has(q.image)) {
      await shot(page, `scene-${q.image}`);
      seen.add(q.image);
    }
    await answer(page, q);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
});
