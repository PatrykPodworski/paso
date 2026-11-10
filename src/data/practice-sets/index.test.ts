import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { allLessons } from "../curriculum";
import { practiceSets, setLessons, setOf, setQuestions } from "./index";

const unique = (values: string[]) => new Set(values).size === values.length;

describe("practice sets", () => {
  it("gives every set its own id and route", () => {
    expect(practiceSets.map((s) => [s.id, s.route])).toEqual([
      ["asking-questions", "practice/questions"],
    ]);

    expect(unique(practiceSets.map((s) => s.id))).toBe(true);
    expect(unique(practiceSets.map((s) => s.route))).toBe(true);
  });

  it("gives every lesson an id no other set or course lesson uses", () => {
    const ids = [...allLessons, ...setLessons].map((l) => l.id);

    expect(setLessons.map((l) => l.id)).toEqual(expect.arrayContaining(["aq-l01", "aq-l02"]));
    expect(unique(ids)).toBe(true);
  });

  it("puts every set's exercises, and no teaching card, in the exercise bank once", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(setQuestions.filter((q) => q.kind === "teach")).toEqual([]);

    expect(setQuestions.map((q) => q.id)).toEqual(
      expect.arrayContaining(["AQ-T01-E01", "AQ-T02-V12"]),
    );

    expect(bank).toEqual(expect.arrayContaining(setQuestions.map((q) => q.id)));
    expect(unique(bank)).toBe(true);
  });

  it("finds the set of each set lesson and no set for a course lesson", () => {
    expect(setOf("aq-l02")?.id).toBe("asking-questions");

    for (const l of setLessons) {
      expect(setOf(l.id)?.lessons, l.id).toContain(l);
    }

    expect(setOf(allLessons[0].id)).toBeUndefined();
  });
});
