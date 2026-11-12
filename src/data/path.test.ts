import { expect, it } from "vitest";
import { askingQuestionsSet } from "./asking-questions/askingQuestions";
import { allLessons, units } from "./curriculum";
import {
  courseUnitNumber,
  pathLessons,
  pathModel,
  pathPlace,
  pathUnitNumber,
  pathUnits,
} from "./path";
import { numbersSet } from "./numbers/numbers";
import { placementLessons, placementSet } from "./placement/placement";
import { practiceSets, setLessons } from "./practice-sets/index";
import type { PracticeSet } from "./practice-sets/practiceSet";
import type { SetLesson } from "./practice-sets/setLesson";
import { timeWordsSet } from "./time-words/timeWords";
import { weekdaysSet } from "./weekdays/weekdays";

const stub = (id: string): SetLesson => ({
  id,
  title: id,
  subtitle: "",
  recalled: [],
  base: [],
  formCards: [],
  variations: [],
});

const WEEKDAYS = [
  ["wd-m01", "wd-m02", "wd-mr01"],
  ["wd-m03", "wd-mr02"],
];

const weekdaysComplete: PracticeSet = {
  ...weekdaysSet,
  units: weekdaysSet.units.map((u, i) => ({ ...u, lessons: WEEKDAYS[i].map(stub) })),
};

const TIME_WORDS = [
  ["tm-m01", "tm-m02", "tm-m03", "tm-r01"],
  ["tm-m04", "tm-m05", "tm-m06", "tm-r02"],
];

const timeWordsComplete: PracticeSet = {
  ...timeWordsSet,
  units: timeWordsSet.units.map((u, i) => ({ ...u, lessons: TIME_WORDS[i].map(stub) })),
};

const NUMBERS = [
  ["nu-m01", "nu-m02", "nu-m03", "nu-m04", "nu-r01"],
  ["nu-m05", "nu-m06", "nu-m07", "nu-m08", "nu-r02"],
  ["nu-m09", "nu-m10", "nu-m11", "nu-r03"],
  ["nu-m12", "nu-m13", "nu-m14", "nu-m15", "nu-r04"],
];

const numbersComplete: PracticeSet = {
  ...numbersSet,
  units: numbersSet.units.map((u, i) => ({ ...u, lessons: NUMBERS[i].map(stub) })),
};

const completeSets = [
  askingQuestionsSet,
  weekdaysComplete,
  placementSet,
  timeWordsComplete,
  numbersComplete,
];

const complete = pathModel(units, completeSets);

it("puts every set unit right after the course unit it builds on, with Weekdays, Time words and Numbers complete and the placement units so far", () => {
  expect(complete.pathUnits.map((u) => [u.number, u.id])).toEqual([
    [1, "u1"],
    [2, "u2"],
    [3, "nu-u1"],
    [4, "nu-u2"],
    [5, "u3"],
    [6, "nu-u3"],
    [7, "u4"],
    [8, "pl-u1"],
    [9, "pl-u2"],
    [10, "pl-u3"],
    [11, "nu-u4"],
    [12, "u5"],
    [13, "wd-u1"],
    [14, "wd-u2"],
    [15, "tm-u1"],
    [16, "tm-u2"],
    [17, "u6"],
    [18, "u7"],
    [19, "u8"],
    [20, "u9"],
    [21, "aq-u1"],
    [22, "aq-u2"],
    [23, "u10"],
    [24, "aq-u3"],
    [25, "u11"],
    [26, "aq-u4"],
    [27, "u12"],
  ]);

  expect(complete.pathLessons).toHaveLength(
    allLessons.length + completeSets.flatMap((s) => s.units.flatMap((u) => u.lessons)).length,
  );

  expect(complete.pathPlace("nu-r01")).toEqual({ unit: 3, lesson: 5 });
  expect(complete.pathPlace("nu-m11")).toEqual({ unit: 6, lesson: 3 });
  expect(complete.pathPlace("nu-r04")).toEqual({ unit: 11, lesson: 5 });
  expect(complete.pathPlace("tm-r02")).toEqual({ unit: 16, lesson: 4 });
  expect(complete.pathPlace("aq-mr01")).toEqual({ unit: 21, lesson: 3 });
  expect(complete.pathPlace("aq-mr02")).toEqual({ unit: 22, lesson: 3 });
  expect(complete.pathPlace("aq-mr03")).toEqual({ unit: 24, lesson: 3 });
  expect(complete.pathPlace("aq-mr04")).toEqual({ unit: 26, lesson: 3 });
  expect(complete.courseUnitNumber(6)).toBe(17);
  expect(complete.pathUnitNumber("aq-u3")).toBe(24);
});

// The live path: these tests name each unit by its neighbours, so a set unit added earlier on
// the path changes no expectation here; the complete-path test above holds the numbers.
const unitsFrom = (id: string, count: number) => {
  const at = pathUnits.findIndex((u) => u.id === id);

  return pathUnits.slice(at, at + count).map((u) => u.id);
};

it("puts the time-words units right after the Weekdays units", () => {
  expect(unitsFrom("wd-u2", 4)).toEqual(["wd-u2", "tm-u1", "tm-u2", "u6"]);
  expect(pathPlace("tm-m01")).toEqual({ unit: pathUnitNumber("tm-u1"), lesson: 1 });
  expect(pathPlace("tm-m04")).toEqual({ unit: pathUnitNumber("tm-u2"), lesson: 1 });
});

it("puts the first Numbers unit right after course unit 2", () => {
  expect(unitsFrom("u2", 4)).toEqual(["u2", "nu-u1", "nu-u2", "u3"]);

  expect(pathUnits.find((u) => u.id === "nu-u1")).toMatchObject({
    icon: "layers",
    eyebrow: "Part 1 of 4",
    title: "Numbers",
    subtitle: "cero to siete",
  });

  expect(pathPlace("nu-m01")).toEqual({ unit: 3, lesson: 1 });
  expect(pathPlace("nu-r01")).toEqual({ unit: 3, lesson: 5 });
  expect(pathPlace("nu-m05")).toEqual({ unit: 4, lesson: 1 });
  expect(pathPlace("nu-r02")).toEqual({ unit: 4, lesson: 5 });
});

it("leaves out a set unit without lessons and gives it no number", () => {
  const empty: PracticeSet = {
    ...weekdaysSet,
    units: weekdaysSet.units.map((u, i) => ({
      ...u,
      lessons: i === 0 ? [] : WEEKDAYS[i].map(stub),
    })),
  };

  const path = pathModel(units, [askingQuestionsSet, empty]);

  expect(path.pathUnits.slice(4, 9).map((u) => [u.number, u.id])).toEqual([
    [5, "u5"],
    [6, "wd-u2"],
    [7, "u6"],
    [8, "u7"],
    [9, "u8"],
  ]);

  expect(path.pathUnitNumber("wd-u1")).toBeUndefined();
  expect(path.pathPlace("wd-m03")).toEqual({ unit: 6, lesson: 1 });
});

it("shows a set unit with the set's icon and name, its part and what it teaches", () => {
  const unit = pathUnits.find((u) => u.id === "aq-u1")!;

  expect(unit).toMatchObject({
    icon: "people",
    eyebrow: "Part 1 of 4",
    title: "Asking questions",
    subtitle: "qué, cómo, dónde, cuándo",
    goals: [],
  });

  expect(unit.tip).toBeUndefined();
  expect(unit.example).toBeUndefined();
  expect(pathUnits.find((u) => u.id === "wd-u2")!.eyebrow).toBe("Part 2 of 2");

  expect(pathUnits.find((u) => u.id === "tm-u1")).toMatchObject({
    icon: "sun",
    eyebrow: "Part 1 of 2",
    title: "Time words",
    subtitle: "hoy, ahora, antes, temprano and more",
  });
});

it("shows a set lesson with its own title and minutes, and opens the set's lesson", () => {
  const lesson = pathLessons.find((l) => l.id === "aq-m01")!;

  expect(lesson).toMatchObject({
    title: "What and how",
    subtitle: "Learn two question words: qué, cómo",
    minutes: 8,
    icon: "spark",
  });

  expect(lesson.lesson().id).toBe("aq-m01");
  expect(lesson.lesson().questions.map((q) => q.id)).toContain("AQ-T01-N01");
});

it("puts the placement units with lessons right after course unit 4 and adds their lessons to the path", () => {
  const withoutPlacement = pathModel(
    units,
    practiceSets.filter((s) => s.id !== "placement"),
  );

  expect(unitsFrom("u4", 4)).toEqual(["u4", "pl-u1", "pl-u2", "pl-u3"]);

  expect(pathUnits.find((u) => u.id === "pl-u1")).toMatchObject({
    icon: "map",
    eyebrow: "Part 1 of 3",
    title: "Where things are",
    subtitle: "en, dentro de, fuera de, encima de, debajo de",
  });

  const first = pathUnitNumber("pl-u1")!;

  expect(pathPlace("pl-m01")).toEqual({ unit: first, lesson: 1 });
  expect(pathPlace("pl-mr01")).toEqual({ unit: first, lesson: 3 });
  expect(pathPlace("pl-m03")).toEqual({ unit: first + 1, lesson: 1 });
  expect(pathPlace("pl-m05")).toEqual({ unit: first + 2, lesson: 1 });
  expect(pathLessons).toHaveLength(withoutPlacement.pathLessons.length + placementLessons.length);
});

it("numbers the units on the path from 1 without gaps", () => {
  expect(pathUnits.map((u) => u.number)).toEqual(
    Array.from({ length: pathUnits.length }, (_, i) => i + 1),
  );
});

it("places every set unit on the path after the course unit it builds on", () => {
  for (const set of practiceSets) {
    for (const u of set.units.filter((su) => su.lessons.length)) {
      const before = pathUnits.slice(0, pathUnitNumber(u.id)! - 1).reverse();

      expect(before.find((p) => /^u\d+$/.test(p.id))?.id, u.id).toBe(`u${u.after}`);
    }
  }
});

it("holds every course and set lesson once", () => {
  const ids = pathLessons.map((l) => l.id);

  expect(new Set(ids).size).toBe(ids.length);
  expect([...ids].sort()).toEqual([...allLessons, ...setLessons].map((l) => l.id).sort());
  expect(pathLessons[5].lesson()).toBe(units[1].lessons[1]);
});

it("numbers a path lesson by its path unit and its position in that unit", () => {
  expect(pathPlace(units[3].lessons[1].id)).toEqual({ unit: pathUnitNumber("u4"), lesson: 2 });
  expect(pathPlace(units[0].lessons[0].id)).toEqual({ unit: 1, lesson: 1 });
  expect(pathPlace("wd-m03")).toEqual({ unit: pathUnitNumber("wd-u2"), lesson: 1 });
  expect(pathPlace("aq-mr01")).toEqual({ unit: pathUnitNumber("aq-u1"), lesson: 3 });
});

it("gives a practice session no place on the path", () => {
  expect(pathPlace("practice-all")).toBeUndefined();
});

it("shows a course unit under its path number", () => {
  expect(courseUnitNumber(1)).toBe(1);

  for (const n of [2, 4, 5, 6, 12]) {
    expect(courseUnitNumber(n), `u${n}`).toBe(pathUnitNumber(`u${n}`));
  }

  expect(courseUnitNumber(12)).toBe(pathUnits.length);
});

it("counts the set lessons' own exercises and no teaching card", () => {
  const firstWeekdaysUnit: PracticeSet = {
    ...weekdaysSet,
    units: weekdaysSet.units.map((u, i) => (i === 0 ? u : { ...u, lessons: [] })),
  };

  // L01, L02 and R01 own 21, 20 and 22 exercises, past L01's and L02's intro and form cards.
  expect(pathModel(units, []).pathExerciseCount).toBe(281);
  expect(pathModel(units, [firstWeekdaysUnit]).pathExerciseCount).toBe(281 + 21 + 20 + 22);
});
