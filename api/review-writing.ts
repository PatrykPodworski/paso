import { answerWords } from "../src/data/progress.ts";
import { json } from "./_lib/limits.js";
import { passcodeRefusal } from "./_lib/passcode.js";
import { modelReview, presetReview } from "./_lib/writing-review.js";
import { writingTaskOf } from "./_lib/writing-tasks.js";

const MAX_CHARACTERS = 2000;

export const POST = async (request: Request) => {
  const parsed: unknown = await request.json().catch(() => ({}));

  const body = (typeof parsed === "object" && parsed !== null ? parsed : {}) as {
    questionId?: unknown;
    answer?: unknown;
    passcode?: unknown;
  };

  const task = writingTaskOf(body.questionId);
  const answer = typeof body.answer === "string" ? body.answer.trim() : undefined;

  if (!task) {
    return json({ error: "task" }, 400);
  }

  if (answer === undefined || answer.length > MAX_CHARACTERS) {
    return json({ error: "answer" }, 400);
  }

  const refusal = await passcodeRefusal(
    request,
    typeof body.passcode === "string" ? body.passcode : "",
  );

  if (refusal) {
    return refusal;
  }

  const wordCount = answerWords(task, answer);
  const preset = presetReview(task, wordCount);

  if (preset) {
    return json(preset, 200);
  }

  const key = process.env.OPENROUTER_API_KEY;

  if (!key) {
    return json({ error: "unavailable" }, 503);
  }

  const review = await modelReview(key, task, answer, wordCount);

  return review ? json(review, 200) : json({ error: "upstream" }, 502);
};
