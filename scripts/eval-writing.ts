// Marks each sample in writing-evals/samples.json the way api/review-writing.ts does and
// compares the DELE band with the expected one. Exits 1 when any band differs.
// Rerun it after changing the writing prompt, the schema or OPENROUTER_MODEL.
import { readFileSync } from "node:fs";
import { modelReview, openRouter, presetReview } from "../api/_lib/writing-review.ts";
import { writingTaskOf } from "../api/_lib/writing-tasks.ts";
import { answerWords } from "../src/data/progress.ts";

type Sample = {
  id: string;
  questionId: string;
  answer: string;
  expected: number;
  rationale: string;
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

    return { sample, wordCount, mark: review?.mark };
  }),
);

const off = rows.filter(({ sample, mark }) => mark?.band !== sample.expected);

console.log(
  `${rows.length} samples on ${provider.model}: ${rows.length - off.length} as expected, ${off.length} off`,
);

console.log(["", "sample", "words", "expected", "got", "reason"].join("\t"));

for (const { sample, wordCount, mark } of rows) {
  console.log(
    [
      mark?.band === sample.expected ? "ok" : "OFF",
      sample.id,
      wordCount,
      sample.expected,
      mark?.band ?? "-",
      mark?.reason ?? "No review: the request failed.",
    ].join("\t"),
  );
}

process.exit(off.length ? 1 : 0);
