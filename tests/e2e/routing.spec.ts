import { test, expect } from "../fixtures/app";

const title = {
  today: "A good day to learn Spanish.",
  path: "Every step has a story.",
  practice: "Your practice studio.",
  exam: "Meet the exam.",
  guide: "Your guide to DELE A1.",
  backoffice: "Every task, one click away.",
  "design-system": "Design system",
};

for (const [path, heading] of Object.entries(title)) {
  test(`a deep link to /${path} opens that page`, async ({ page }) => {
    await page.goto(`/${path}`);
    await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(heading);
    await expect(page).toHaveURL(new RegExp(`/${path}$`));
  });
}

test("back and forward retrace the pages and their URLs", async ({ page }, info) => {
  const mobile = info.project.name === "mobile";

  const visits = [
    ["Learning path", "path"],
    ["Practice studio", "practice"],
    ["Exam rehearsal", "exam"],
    ["The A1 guide", "guide"],
  ] as const;

  const expectPage = async (path: keyof typeof title) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(title[path]);
    await expect(page).toHaveURL(new RegExp(`/${path}$`));
  };

  await page.goto("/today");

  for (const [label, path] of visits) {
    if (mobile) {
      await page.getByRole("button", { name: "Open navigation" }).click();
    }

    await page.getByRole("button", { name: label, exact: true }).click();
    await expectPage(path);
  }

  for (const path of ["exam", "practice", "path", "today"] as const) {
    await page.goBack();
    await expectPage(path);
  }

  for (const [, path] of visits) {
    await page.goForward();
    await expectPage(path);
  }

  if (mobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.goBack();
    await expectPage("exam");
    await expect(page.getByRole("button", { name: "Close navigation" })).toHaveCount(0);
  }
});
