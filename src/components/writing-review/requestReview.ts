import type { WritingReview } from "../../data/types";

export type ReviewResult = { review: WritingReview } | { error: string };

const PROBLEMS: Record<string, string> = {
  passcode: "That passcode is not right.",
  passcode_tries: "Too many wrong passcodes today.",
};

export const problemOf = (code: string) =>
  PROBLEMS[code] ?? "Feedback is not available right now. Your answer is saved; try again later.";

export const requestReview = async (
  questionId: string,
  answer: string,
  passcode: string,
): Promise<ReviewResult> => {
  try {
    const response = await fetch("/api/review-writing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer, passcode }),
    });

    const body = await response.json();

    return response.ok ? { review: body as WritingReview } : { error: String(body.error) };
  } catch {
    return { error: "unavailable" };
  }
};
