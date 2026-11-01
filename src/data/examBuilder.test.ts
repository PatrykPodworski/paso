import { describe, expect, it } from "vitest";
import { buildExam } from "./examBuilder";
import { examSections, firstVariants, mockTasks } from "./mock";
import type { MockTask } from "./types";

// A variant is written as "id:theme:name,name"; its questions do not matter to the builder.
const task = (id: string, ...variants: string[]): MockTask => ({
  id,
  variants: variants.map((v) => {
    const [variantId, theme, names = ""] = v.split(":");

    return { id: variantId, theme, names: names ? names.split(",") : [], questions: [] };
  }),
});

const SEEDS = Array.from({ length: 200 }, (_, i) => i * 7919);

const pools = [
  task("a", "a1:food", "a2:travel", "a3:home", "a4:work"),
  task("b", "b1:shopping", "b2:school", "b3:sport", "b4:music"),
  task("c", "c1:city", "c2:weather", "c3:family", "c4:health"),
];

describe("the exam builder", () => {
  it("gives the same exam for the same seed", () => {
    for (const seed of SEEDS) {
      expect(buildExam({ seed, tasks: pools })).toEqual(buildExam({ seed, tasks: pools }));
    }
  });

  it("picks one variant of each task, with every variant reachable", () => {
    const exams = SEEDS.map((seed) => buildExam({ seed, tasks: pools }));

    for (const exam of exams) {
      expect(Object.keys(exam)).toEqual(["a", "b", "c"]);
      expect(exam.a).toMatch(/^a\d$/);
      expect(exam.b).toMatch(/^b\d$/);
      expect(exam.c).toMatch(/^c\d$/);
    }

    expect(new Set(exams.map((e) => e.a))).toEqual(new Set(["a1", "a2", "a3", "a4"]));
    expect(new Set(exams.map((e) => e.c))).toEqual(new Set(["c1", "c2", "c3", "c4"]));
  });

  it("takes variant 1 of every task while each pool holds only variant 1", () => {
    expect(buildExam({ seed: 42 })).toEqual(firstVariants);

    expect(examSections(buildExam({ seed: 42 })).map((s) => s.questions.length)).toEqual([
      25, 25, 2, 3,
    ]);
  });

  it("never picks two variants with the same theme", () => {
    const tasks = [
      task("a", "a1:food", "a2:travel"),
      task("b", "b1:Food"),
      task("c", "c1:travel", "c2:home"),
    ];

    for (const seed of SEEDS) {
      expect(buildExam({ seed, tasks })).toEqual({ a: "a2", b: "b1", c: "c2" });
    }
  });

  it("never repeats a character name, even when a smaller pool comes later", () => {
    const tasks = [
      task("a", "a1:food:Ana,Luis", "a2:travel:Marta", "a3:home:Pablo"),
      task("b", "b1:school:Marta", "b2:work:pablo"),
      task("c", "c1:sport:Luis"),
    ];

    for (const seed of SEEDS) {
      const exam = buildExam({ seed, tasks });

      expect(exam.c).toBe("c1");
      expect([exam.a, exam.b].sort()).toEqual(exam.a === "a2" ? ["a2", "b2"] : ["a3", "b1"]);
    }
  });

  it("finds the only exam without repeats deep in the search", () => {
    const tasks = [
      task("a", "a1:x", "a2:y", "a3:z"),
      task("b", "b1:x", "b2:y", "b3:z"),
      task("c", "c1:x", "c2:y", "c3:w"),
      task("d", "d1:x", "d2:y", "d3:z"),
    ];

    for (const seed of SEEDS) {
      const exam = buildExam({ seed, tasks });

      expect(exam.c).toBe("c3");

      expect(new Set([exam.a, exam.b, exam.d].map((id) => id[1]))).toEqual(
        new Set(["1", "2", "3"]),
      );
    }
  });

  it("prefers unseen variants", () => {
    const seen = new Map([
      ["a1", 5],
      ["a2", 1],
      ["a4", 9],
    ]);

    for (const seed of SEEDS) {
      expect(buildExam({ seed, seen, tasks: pools }).a).toBe("a3");
    }
  });

  it("falls back to the least recently seen variant once all are seen", () => {
    const seen = new Map([
      ["a1", 5],
      ["a2", 1],
      ["a3", 3],
      ["a4", 9],
    ]);

    for (const seed of SEEDS) {
      expect(buildExam({ seed, seen, tasks: pools }).a).toBe("a2");
    }
  });

  it("takes a seen variant over a repeated theme", () => {
    const tasks = [task("a", "a1:food", "a2:travel"), task("b", "b1:food")];

    for (const seed of SEEDS) {
      expect(buildExam({ seed, seen: new Map([["a2", 1]]), tasks }).a).toBe("a2");
    }
  });

  it("keeps a chosen variant and picks the rest around it", () => {
    const tasks = [task("a", "a1:food", "a2:travel"), task("b", "b1:food", "b2:travel")];

    for (const seed of SEEDS) {
      expect(buildExam({ seed, chosen: { a: "a1" }, tasks })).toEqual({ a: "a1", b: "b2" });
    }
  });

  it("picks for the tasks of one section only", () => {
    const reading = mockTasks.filter((t) => t.id.startsWith("r"));

    expect(buildExam({ seed: 3, tasks: reading })).toEqual({
      r1: "r1-v1",
      r2: "r2-v1",
      r3: "r3-v1",
      r4: "r4-v1",
    });
  });

  it("refuses a chosen variant the task does not have", () => {
    expect(() => buildExam({ seed: 1, chosen: { a: "b1" }, tasks: pools })).toThrow(
      "Task a has no variant b1",
    );
  });

  it("repeats as little as it can when every exam repeats something", () => {
    const tasks = [
      task("a", "a1:food:Ana"),
      task("b", "b1:food:Ana", "b2:food:Luis"),
      task("c", "c1:home:Luis", "c2:home:Marta", "c3:food"),
    ];

    for (const seed of SEEDS) {
      expect(buildExam({ seed, tasks })).toEqual({ a: "a1", b: "b2", c: "c2" });
    }
  });

  it("stops searching after the limit and settles for the fewest repeats", () => {
    // Taking the unseen "a1" leaves nine tasks to share eight themes. Proving that impossible
    // takes far more tries than the limit, so the search gives up before it reaches "a2",
    // which would have given an exam without repeats.
    const themes = ["x0", "x1", "x2", "x3", "x4", "x5", "x6", "x7", "y"];

    const tasks = [
      task("a", "a1:y", "a2:z"),
      ...Array.from({ length: 9 }, (_, i) => task(`t${i}`, ...themes.map((t) => `t${i}${t}:${t}`))),
    ];

    const seen = new Map([["a2", 1], ...themes.map((_, i) => [`t${i}y`, 1] as const)]);
    const exam = buildExam({ seed: 1, seen, tasks });

    expect(exam.a).toBe("a1");
    expect(Object.keys(exam)).toEqual(tasks.map((t) => t.id));
  });
});
