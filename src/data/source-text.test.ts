import { describe, expect, it } from "vitest";

import { allQuestions, foundations, visualQuestions } from "./curriculum";
import { formPractice, mockQuestions } from "./mock";
import { setQuestions } from "./practice-sets/index";
import type { Question } from "./types";

const questions: Question[] = [
  ...allQuestions,
  ...foundations,
  ...visualQuestions,
  formPractice,
  ...mockQuestions,
  ...setQuestions,
];

// A comprehension question may repeat a short phrase of its text ("¿A qué hora empieza la
// clase…?"); a run this long is a quoted sentence.
const MAX_SHARED = 39;

const flat = (text: string) => text.replace(/\s+/g, " ").toLowerCase();

// The longest run of characters both texts contain.
const sharedRun = (a: string, b: string) => {
  const [x, y] = [flat(a), flat(b)];
  let best = "";
  let previous = new Array<number>(y.length + 1).fill(0);

  for (let i = 1; i <= x.length; i++) {
    const current = new Array<number>(y.length + 1).fill(0);

    for (let j = 1; j <= y.length; j++) {
      if (x[i - 1] === y[j - 1]) {
        current[j] = previous[j - 1] + 1;

        if (current[j] > best.length) {
          best = x.slice(i - current[j], i);
        }
      }
    }

    previous = current;
  }

  return best;
};

describe("text shown in its own box", () => {
  it("finds the longest run two texts share, ignoring case and line breaks", () => {
    expect(sharedRun("Your friend writes: “Hola.\nEl domingo voy.”", "hola. el domingo")).toBe(
      "hola. el domingo",
    );
  });

  it("is not repeated in the task, instruction or prompt", () => {
    const repeats = questions.flatMap((q) =>
      (["passage", "audio"] as const).flatMap((box) =>
        (["task", "instruction", "prompt"] as const)
          .filter((field) => q[box] && q[field])
          .map((field) => [q.id, field, sharedRun(q[box]!, q[field]!)])
          .filter(([, , run]) => run.length > MAX_SHARED),
      ),
    );

    expect(repeats).toEqual([]);
  });
});
