import { describe, expect, it } from "vitest";
import { allQuestions } from "./curriculum";
import { mockQuestions } from "./mock";
import { shownOptions, withShownOptions } from "./optionOrder";

const SEEDS = Array.from({ length: 300 }, (_, i) => i * 7919);

// Listening Task 3: the authored endings list its answers in question order.
const statements = mockQuestions.filter((q) => q.id.startsWith("mock-l3-"));
const endings = statements[0].options!;
const vocabulary = allQuestions.find((q) => q.id === "u2-v0")!;

describe("shownOptions", () => {
  it("keeps every option once, so an answer is checked by its text", () => {
    for (const seed of SEEDS.slice(0, 20)) {
      expect(shownOptions(endings, seed).toSorted()).toEqual(endings.toSorted());
    }
  });

  it("gives one attempt the same order on every call", () => {
    expect(shownOptions(endings, 42)).toEqual(shownOptions([...endings], 42));
  });

  it("does not show Task 3's endings in the order of their questions", () => {
    for (const seed of SEEDS.slice(0, 20)) {
      expect(shownOptions(endings, seed)).not.toEqual(endings);
    }
  });

  it("gives other attempts other orders", () => {
    const orders = new Set(SEEDS.slice(0, 20).map((seed) => shownOptions(endings, seed).join()));

    expect(orders.size).toBeGreaterThan(15);
  });

  it("shows a shared list in one order for every question of the task", () => {
    const orders = new Set(statements.map((q) => shownOptions(q.options!, 7).join()));

    expect(orders).toEqual(new Set([shownOptions(endings, 7).join()]));
  });

  it("orders two different lists of one attempt independently", () => {
    const three = ["a", "b", "c"];
    const four = ["a", "b", "c", "d"];

    const differ = SEEDS.filter(
      (seed) => shownOptions(three, seed).join() !== shownOptions(four, seed).slice(0, 3).join(),
    );

    expect(differ.length).toBeGreaterThan(SEEDS.length / 2);
  });

  it("puts a three-option answer at each position about equally often", () => {
    const positions = [0, 0, 0];

    for (const seed of SEEDS) {
      positions[shownOptions(vocabulary.options!, seed).indexOf(vocabulary.answer)]++;
    }

    for (const count of positions) {
      expect(count).toBeGreaterThan(SEEDS.length / 5);
    }
  });

  it("keeps letters A–I alphabetical, since they name the lettered texts of the passage", () => {
    const letters = mockQuestions.find((q) => q.id === "mock-r2-0")!.options!;

    expect(letters).toEqual("ABCDEFGHI".split(""));
    expect(shownOptions(letters, 7)).toEqual(letters);
  });

  it("shuffles a list that only starts with letters", () => {
    const labelled = ["A.", "B.", "C.", "D.", "E.", "F."];

    expect(
      SEEDS.slice(0, 5).some((seed) => shownOptions(labelled, seed).join() !== labelled.join()),
    ).toBe(true);
  });
});

describe("withShownOptions", () => {
  it("orders a question's options and keeps its answer", () => {
    const shown = withShownOptions(statements[2], 7);

    expect(shown.options).toEqual(shownOptions(endings, 7));
    expect(shown.answer).toBe(statements[2].answer);
    expect(shown.id).toBe(statements[2].id);
  });

  it("returns a question without options as it is", () => {
    const order = allQuestions.find((q) => q.kind === "order")!;

    expect(withShownOptions(order, 7)).toBe(order);
  });
});
