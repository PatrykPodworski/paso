import { describe, expect, it } from "vitest";
import { allLessons } from "./curriculum";
import { practiceSets } from "./practice-sets/index";
import type { Question } from "./types";

const WORDS: Record<string, number> = {
  cero: 0,
  un: 1,
  uno: 1,
  una: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  once: 11,
  doce: 12,
  trece: 13,
  catorce: 14,
  quince: 15,
  dieciséis: 16,
  diecisiete: 17,
  dieciocho: 18,
  diecinueve: 19,
  veinte: 20,
  veintiún: 21,
  veintiuno: 21,
  veintiuna: 21,
  veintidós: 22,
  veintitrés: 23,
  veinticuatro: 24,
  veinticinco: 25,
  veintiséis: 26,
  veintisiete: 27,
  veintiocho: 28,
  veintinueve: 29,
  treinta: 30,
  cuarenta: 40,
  cincuenta: 50,
  sesenta: 60,
  setenta: 70,
  ochenta: 80,
  noventa: 90,
  cien: 100,
  ciento: 100,
};

const HUNDREDS = ["dos", "tres", "cuatro", "quin", "seis", "sete", "ocho", "nove"];

for (const [i, stem] of HUNDREDS.entries()) {
  WORDS[`${stem}cientos`] = (i + 2) * 100;
  WORDS[`${stem}cientas`] = (i + 2) * 100;
}

// Words a learner can count through, outside the numbers: each entry lists the forms of one
// place in its sequence.
const PLACES = new Map<string, { name: string; index: number }>();

const sequence = (name: string, places: string[]) => {
  for (const [index, forms] of places.entries()) {
    for (const form of forms.split(" ")) {
      PLACES.set(form, { name, index });
    }
  }
};

sequence("day", [
  "lunes monday",
  "martes tuesday",
  "miércoles wednesday",
  "jueves thursday",
  "viernes friday",
  "sábado saturday",
  "domingo sunday",
]);

sequence("month", [
  "enero january",
  "febrero february",
  "marzo march",
  "abril april",
  "mayo may",
  "junio june",
  "julio july",
  "agosto august",
  "septiembre september",
  "octubre october",
  "noviembre november",
  "diciembre december",
]);

sequence("ordinal", [
  "primero primera primer",
  "segundo segunda",
  "tercero tercera tercer",
  "cuarto cuarta",
  "quinto quinta",
  "sexto sexta",
  "séptimo séptima",
  "octavo octava",
  "noveno novena",
  "décimo décima",
]);

const MULTIPLIERS: Record<string, number> = { mil: 1000, millón: 1_000_000, millones: 1_000_000 };

const isNumberWord = (word: string) =>
  Object.hasOwn(WORDS, word) || Object.hasOwn(MULTIPLIERS, word);

// The Spanish number the words start with, read up to un millón.
const numberFrom = (words: string[]) => {
  let total = 0;
  let current = 0;

  for (const word of words) {
    if (Object.hasOwn(WORDS, word)) {
      current += WORDS[word];
    } else if (Object.hasOwn(MULTIPLIERS, word)) {
      total += (current || 1) * MULTIPLIERS[word];
      current = 0;
    } else if (word !== "y") {
      break;
    }
  }

  return total + current;
};

// The number, day, month or ordinal the answer starts with: the first one written in digits or
// words.
const placeOf = (answer: string) => {
  const words = answer.toLowerCase().match(/[\p{L}\d]+(?:[.,]\d+)*/gu) ?? [];
  const at = words.findIndex((w) => /^\d/.test(w) || isNumberWord(w) || PLACES.has(w));
  const word = words[at];

  if (at === -1) {
    return undefined;
  }

  if (/^\d/.test(word)) {
    return { name: "number", index: Number(word.replace(/[.,]/g, "")) };
  }

  return PLACES.get(word) ?? { name: "number", index: numberFrom(words.slice(at)) };
};

// Three or more exercises in a row whose answers count up or down by one let the learner guess
// the next answer without reading the task.
const countingRuns = (questions: Question[]) => {
  const exercises = questions.filter((q) => q.kind !== "teach");
  const places = exercises.map((q) => placeOf(q.answer));
  const runs: string[] = [];
  let start = 0;
  let step = 0;

  const close = (end: number) => {
    if (end - start >= 3) {
      runs.push(
        exercises
          .slice(start, end)
          .map((q) => `${q.id} ${q.answer}`)
          .join(" → "),
      );
    }
  };

  for (let i = 1; i < exercises.length; i++) {
    const a = places[i - 1];
    const b = places[i];
    const next = a && b && a.name === b.name ? b.index - a.index : 0;

    if (Math.abs(next) === 1 && (i - start === 1 || next === step)) {
      step = next;
    } else {
      close(i);
      start = Math.abs(next) === 1 ? i - 1 : i;
      step = next;
    }
  }

  close(exercises.length);

  return runs;
};

// Every lesson in the order the learner meets it. A set lesson's order is the same on every
// opening, so its shuffled variations are checked as they are shown. When a shuffle lands three
// answers in counting order, swap two ids in the lesson's variations: the order changes with them.
const lessons = [
  ...allLessons.map((l) => ({ name: l.id, questions: l.questions })),
  ...practiceSets.flatMap((set) =>
    set.lessons.map((l) => ({ name: l.id, questions: set.lesson(l.id).questions })),
  ),
];

const reviews = practiceSets.flatMap((set) => set.lessons.filter((l) => !l.introduction));

describe("reading an answer's place in a sequence", () => {
  it.each([
    ["cinco", { name: "number", index: 5 }],
    ["Tengo diecinueve años.", { name: "number", index: 19 }],
    ["noventa y siete", { name: "number", index: 97 }],
    ["mil novecientos noventa y tres", { name: "number", index: 1993 }],
    ["dos mil cuatrocientas casas", { name: "number", index: 2400 }],
    ["La casa cuesta dos millones de euros.", { name: "number", index: 2_000_000 }],
    ["Luis has 2 phones.", { name: "number", index: 2 }],
    ["675 412 307", { name: "number", index: 675 }],
    ["El tren llega a las ocho y cuarto.", { name: "number", index: 8 }],
    ["Mi madre trabaja el lunes.", { name: "day", index: 0 }],
    ["Sunday", { name: "day", index: 6 }],
    ["el catorce de mayo", { name: "number", index: 14 }],
    ["Es en diciembre.", { name: "month", index: 11 }],
    ["la quinta planta", { name: "ordinal", index: 4 }],
    ["el primer piso", { name: "ordinal", index: 0 }],
    ["Desayuno con Diego hoy.", undefined],
  ])("%s", (answer, place) => {
    expect(placeOf(answer)).toEqual(place);
  });
});

describe("counting order", () => {
  it.each(lessons)("$name never asks three answers in counting order", ({ questions }) => {
    expect(countingRuns(questions)).toEqual([]);
  });

  // A review repeats a unit's items, which its content lists in teaching order.
  it.each(reviews)("review $id keeps every item among its shuffled variations", (l) => {
    expect(l.recalled).toEqual([]);
    expect(l.base).toEqual([]);
  });

  it("finds a run up or down, and only in one sequence", () => {
    const asking = (...answers: string[]) =>
      answers.map((answer, i) => ({ id: `Q${i}`, answer }) as Question);

    expect(countingRuns(asking("cinco", "seis", "siete", "seis"))).toEqual([
      "Q0 cinco → Q1 seis → Q2 siete",
    ]);

    expect(countingRuns(asking("jueves", "miércoles", "martes"))).toHaveLength(1);
    expect(countingRuns(asking("uno", "dos", "uno", "dos"))).toEqual([]);
    expect(countingRuns(asking("dos", "martes", "cuatro"))).toEqual([]);
    expect(countingRuns(asking("tres", "cuatro", "Monday", "Tuesday"))).toEqual([]);
  });
});
