import type { Page } from "@playwright/test";
import type { WritingReview } from "../../src/data/types";

// Stands in for the review-writing route: a fixed review per question id.
export const mockWritingReview = async (page: Page, reviews: Record<string, WritingReview>) => {
  await page.route("**/api/review-writing", (route) =>
    route.fulfill({ json: reviews[route.request().postDataJSON().questionId] }),
  );
};
