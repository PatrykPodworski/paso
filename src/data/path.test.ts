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
import { placementLessons } from "./placement/placement";
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
  ["tm-l01", "tm-l02", "tm-l03", "tm-l04", "tm-r01"],
  ["tm-l05", "tm-l06", "tm-l07", "tm-l08", "tm-r02"],
  ["tm-l09", "tm-l10", "tm-l11", "tm-l12", "tm-r03"],
  ["tm-l13", "tm-l14", "tm-l15", "tm-l16", "tm-r04"],
];

const timeWordsComplete: PracticeSet = {
  ...timeWordsSet,
  units: timeWordsSet.units.map((u, i) => ({ ...u, lessons: TIME_WORDS[i].map(stub) })),
};

const complete = pathModel(units, [askingQuestionsSet, weekdaysComplete, timeWordsComplete]);

it("puts every set unit right after the course unit it builds on, with Weekdays and Time words complete", () => {
  expect(complete.pathUnits.map((u) => [u.number, u.id])).toEqual([
    [1, "u1"],
    [2, "u2"],
    [3, "u3"],
    [4, "u4"],
    [5, "u5"],
    [6, "wd-u1"],
    [7, "wd-u2"],
    [8, "tm-u1"],
    [9, "tm-u2"],
    [10, "tm-u3"],
    [11, "tm-u4"],
    [12, "u6"],
    [13, "u7"],
    [14, "u8"],
    [15, "u9"],
    [16, "aq-u1"],
    [17, "aq-u2"],
    [18, "u10"],
    [19, "aq-u3"],
    [20, "u11"],
    [21, "aq-u4"],
    [22, "u12"],
  ]);

  expect(complete.pathLessons).toHaveLength(93);
  expect(complete.pathPlace("aq-mr01")).toEqual({ unit: 16, lesson: 3 });
  expect(complete.courseUnitNumber(6)).toBe(12);
  expect(complete.pathUnitNumber("aq-u3")).toBe(19);
});

it("puts the time-words unit with L01 right after the Weekdays units", () => {
  expect(pathUnits.slice(7, 10).map((u) => [u.number, u.id])).toEqual([
    [8, "wd-u2"],
    [9, "tm-u1"],
    [10, "u6"],
  ]);

  expect(pathPlace("tm-l01")).toEqual({ unit: 9, lesson: 1 });
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
    eyebrow: "Part 1 of 4",
    title: "Time words",
    subtitle: "hoy, mañana, ayer, ahora",
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

it("puts the first placement unit right after course unit 4 and adds its lesson to the path", () => {
  const withoutPlacement = pathModel(
    units,
    practiceSets.filter((s) => s.id !== "placement"),
  );

  expect(pathUnits.slice(3, 6).map((u) => [u.number, u.id])).toEqual([
    [4, "u4"],
    [5, "pl-u1"],
    [6, "u5"],
  ]);

  expect(pathUnits.find((u) => u.id === "pl-u1")).toMatchObject({
    icon: "map",
    eyebrow: "Part 1 of 4",
    title: "Where things are",
    subtitle: "en, dentro de, fuera de, encima de",
  });

  expect(pathPlace("pl-l01")).toEqual({ unit: 5, lesson: 1 });
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
  expect(pathPlace(units[3].lessons[1].id)).toEqual({ unit: 4, lesson: 2 });
  expect(pathPlace(units[0].lessons[0].id)).toEqual({ unit: 1, lesson: 1 });
  expect(pathPlace("wd-m03")).toEqual({ unit: 8, lesson: 1 });
  expect(pathPlace("aq-mr01")).toEqual({ unit: 14, lesson: 3 });
});

it("gives a practice session no place on the path", () => {
  expect(pathPlace("practice-all")).toBeUndefined();
});

it("shows a course unit under its path number", () => {
  expect(courseUnitNumber(1)).toBe(1);
  expect(courseUnitNumber(4)).toBe(4);
  expect(courseUnitNumber(5)).toBe(6);
  expect(courseUnitNumber(6)).toBe(10);
  expect(courseUnitNumber(12)).toBe(20);
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
