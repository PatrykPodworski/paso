// Reviews each sample in writing-evals/samples.json the way api/review-writing.ts does and
// compares the result with the expected one: the DELE band of an exam task, or passed, partly
// or failed for a practice task. Exits 1 when any result differs.
// Rerun it after changing the writing prompt, the schema or OPENROUTER_MODEL.
import { readFileSync } from "node:fs";
import { modelReview, openRouter, presetReview } from "../api/_lib/writing-review.ts";
import { writingTaskOf } from "../api/_lib/writing-tasks.ts";
import { answerWords } from "../src/data/progress.ts";
import type { WritingReview } from "../src/data/types.ts";

type Sample = {
  id: string;
  questionId: string;
  answer: string;
  expected: number | "passed" | "partly" | "failed";
  rationale: string;
};

const RESULTS: Record<string, string> = { perfect: "passed", good: "partly", bad: "failed" };

// The band of an exam review, or the result a practice review's grade came from.
const resultOf = (review: WritingReview | null) => {
  if (!review) {
    return undefined;
  }

  return review.mark ? review.mark.band : RESULTS[review.grade ?? ""];
};

const reasonOf = (review: WritingReview | null) => {
  if (!review) {
    return "No review: the request failed.";
  }

  const met = review.coverage.filter((c) => c.met).length;

  return review.mark?.reason ?? `${met}/${review.coverage.length} points met.`;
};

const samples: Sample[] = JSON.parse(
  readFileSync(new URL("writing-evals/samples.json", import.meta.url), "utf8"),
);

const provider = openRouter();

if ("missing" in provider) {
  console.error(
    `The writing evals call OpenRouter: set ${provider.missing.join(" and ")} in the environment or .env.local.`,
  );

  process.exit(1);
}

const rows = await Promise.all(
  samples.map(async (sample) => {
    const task = writingTaskOf(sample.questionId);

    if (!task) {
      throw new Error(`Sample ${sample.id} names an unknown task: ${sample.questionId}`);
    }

    const answer = sample.answer.trim();
    const wordCount = answerWords(task, answer);

    const review =
      presetReview(task, wordCount) ?? (await modelReview(provider, task, answer, wordCount));

    return { sample, wordCount, got: resultOf(review), reason: reasonOf(review) };
  }),
);

const off = rows.filter(({ sample, got }) => got !== sample.expected);

console.log(
  `${rows.length} samples on ${provider.model}: ${rows.length - off.length} as expected, ${off.length} off`,
);

console.log(["", "sample", "words", "expected", "got", "reason"].join("\t"));

for (const { sample, wordCount, got, reason } of rows) {
  console.log(
    [
      got === sample.expected ? "ok" : "OFF",
      sample.id,
      wordCount,
      sample.expected,
      got ?? "-",
      reason,
    ].join("\t"),
  );
}

process.exit(off.length ? 1 : 0);
