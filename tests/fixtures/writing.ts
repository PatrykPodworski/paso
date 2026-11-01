import type { Page } from "@playwright/test";
import type { Grade, WritingReview } from "../../src/data/types";

// Stands in for the review-writing route: a fixed review per question id.
export const mockWritingReview = async (page: Page, reviews: Record<string, WritingReview>) => {
  await page.route("**/api/review-writing", (route) =>
    route.fulfill({ json: reviews[route.request().postDataJSON().questionId] }),
  );
};

// A review of "Me llamo Ana. Soy veinte años." that misses the first point.
export const writingReview = (checklist: string[], grade: Grade): WritingReview => ({
  wordCount: 6,
  coverage: checklist.map((point, i) => ({
    point,
    met: i > 0,
    feedback: i > 0 ? "Covered." : "Add a greeting and a farewell.",
  })),
  corrections: [
    { original: "Soy veinte años", corrected: "Tengo veinte años", explanation: "Use tener." },
  ],
  revised: "Hola. Me llamo Ana. Tengo veinte años. Adiós.",
  grade,
});
