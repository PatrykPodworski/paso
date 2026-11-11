import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { allLessons } from "../curriculum";
import { practiceSets, setLessons, setOf, setQuestions } from "./index";

const unique = (values: string[]) => new Set(values).size === values.length;

describe("practice sets", () => {
  it("gives every set its own id and route", () => {
    expect(practiceSets.map((s) => [s.id, s.route])).toEqual([
      ["asking-questions", "practice/questions"],
      ["weekdays", "practice/weekdays"],
      ["placement", "practice/placement"],
      ["time-words", "practice/time-words"],
    ]);

    expect(unique(practiceSets.map((s) => s.id))).toBe(true);
    expect(unique(practiceSets.map((s) => s.route))).toBe(true);
  });

  it("gives every lesson an id no other set or course lesson uses", () => {
    const ids = [...allLessons, ...setLessons].map((l) => l.id);

    expect(setLessons.map((l) => l.id)).toEqual(
      expect.arrayContaining(["aq-l01", "aq-l02", "wd-m01", "pl-m01", "tm-l01"]),
    );

    expect(unique(ids)).toBe(true);
  });

  it("puts every set's exercises, and no teaching card, in the exercise bank once", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(setQuestions.filter((q) => q.kind === "teach")).toEqual([]);

    expect(setQuestions.map((q) => q.id)).toEqual(
      expect.arrayContaining([
        "AQ-T01-E01",
        "AQ-T02-V12",
        "WD-T01-E01",
        "WD-T01-V12",
        "SP-T01-N01",
        "SP-M02-X03",
        "TM-T01-E01",
        "TM-T01-V12",
      ]),
    );

    expect(bank).toEqual(expect.arrayContaining(setQuestions.map((q) => q.id)));
    expect(unique(bank)).toBe(true);
  });

  it("finds the set of each set lesson and no set for a course lesson", () => {
    expect(setOf("aq-l02")?.id).toBe("asking-questions");
    expect(setOf("wd-m01")?.id).toBe("weekdays");
    expect(setOf("pl-m01")?.id).toBe("placement");
    expect(setOf("tm-l01")?.id).toBe("time-words");

    for (const l of setLessons) {
      expect(setOf(l.id)?.lessons, l.id).toContain(l);
    }

    expect(setOf(allLessons[0].id)).toBeUndefined();
  });

  it("places every set unit after a course unit, never before an earlier unit of the set", () => {
    expect(practiceSets.map((s) => s.units.map((u) => u.after))).toEqual([
      [9, 9, 10, 11],
      [5, 5],
      [4, 4, 4],
      [5, 5, 5, 5],
    ]);

    for (const set of practiceSets) {
      const afters = set.units.map((u) => u.after);

      expect(
        afters.every((a) => a >= 1 && a <= 12),
        set.id,
      ).toBe(true);

      expect(afters, set.id).toEqual([...afters].sort((a, b) => a - b));
    }
  });

  it("names no unit or lesson number in a set lesson's title or subtitle", () => {
    const numbered = setLessons
      .flatMap((l) => [l.title, l.subtitle])
      .filter((text) => /\bunit \d|\blessons? \d/i.test(text));

    expect(setLessons.find((l) => l.id === "aq-r01")).toMatchObject({
      title: "Unit review",
      subtitle: "Review this unit's lessons",
    });

    expect(numbered).toEqual([]);
  });
});
