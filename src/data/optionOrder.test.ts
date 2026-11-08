import { describe, expect, it } from "vitest";
import { allQuestions } from "./curriculum";
import { mockQuestions, mockTasks } from "./mock";
import { shownOptions, shownTokens, withShownOptions, withShownTokens } from "./optionOrder";
import { isCorrect } from "./progress";
import type { Question } from "./types";

const SEEDS = Array.from({ length: 300 }, (_, i) => i * 7919);

// Listening Task 3, variant 1: the authored endings list its answers in question order.
const statements = mockTasks.find((t) => t.id === "l3")!.variants[0].questions;
const endings = statements[0].options!;
const vocabulary = allQuestions.find((q) => q.id === "u2-v0")!;
const banks = allQuestions.filter((q) => q.kind === "order");
const greeting = allQuestions.find((q) => q.id === "u1-o0")!;

const bank = (answer: string, tokens = answer.split(" ")): Question => ({
  id: "bank",
  kind: "order",
  skill: "writing",
  prompt: "Build the Spanish sentence.",
  answer,
  tokens,
  explanation: "",
});

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

describe("shownTokens", () => {
  it("never starts a word bank in a correct order and keeps every tile once", () => {
    expect(banks.map((q) => q.id)).toContain("u1-o0");

    for (const q of banks) {
      for (const seed of SEEDS) {
        const shown = shownTokens(q, seed);

        expect(isCorrect(q, shown.join(" ")), `${q.id} ${seed}`).toBe(false);
        expect(shown.toSorted()).toEqual(q.tokens!.toSorted());
      }
    }
  });

  it("does not start in an accepted order either", () => {
    const q = { ...bank("Yo soy Ana", ["Ana", "soy", "Yo"]), accepted: ["Ana soy yo"] };

    for (const seed of SEEDS) {
      expect(["Yo soy Ana", "Ana soy Yo"]).not.toContain(shownTokens(q, seed).join(" "));
    }
  });

  it("swaps a two-tile bank on every seed, though half the draws come out solved", () => {
    const q = bank("Hola Ana.");

    for (const seed of Array.from({ length: 3000 }, (_, i) => i)) {
      expect(shownTokens(q, seed)).toEqual(["Ana.", "Hola"]);
    }
  });

  it("puts every tile first on some attempt", () => {
    const firsts = new Set(SEEDS.map((seed) => shownTokens(greeting, seed)[0]));

    expect(firsts).toEqual(new Set(["Hola", "me", "llamo", "Tomás"]));
  });

  it("gives one attempt the same order on every call and other attempts other orders", () => {
    expect(shownTokens(greeting, 42)).toEqual(shownTokens({ ...greeting }, 42));

    const orders = new Set(SEEDS.slice(0, 40).map((seed) => shownTokens(greeting, seed).join()));

    // 4 tiles have 23 orders that are not the sentence.
    expect(orders.size).toBeGreaterThan(15);
  });

  it("keeps a bank whose every order is correct as it is", () => {
    expect(shownTokens(bank("Sí."), 7)).toEqual(["Sí."]);
    expect(shownTokens(bank("no no"), 7)).toEqual(["no", "no"]);
  });
});

describe("withShownTokens", () => {
  it("orders a word bank's tiles and keeps its answer", () => {
    const shown = withShownTokens(greeting, 7);

    expect(shown.tokens).toEqual(shownTokens(greeting, 7));
    expect(shown.tokens).not.toEqual(["Hola", "me", "llamo", "Tomás"]);
    expect(shown.answer).toBe("Hola me llamo Tomás");
    expect(shown.id).toBe("u1-o0");
  });

  it("returns a question without tiles as it is", () => {
    expect(withShownTokens(vocabulary, 7)).toBe(vocabulary);
  });
});
