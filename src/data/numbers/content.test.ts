import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentOnlyAnswer, isCorrect } from "../progress";
import type { Question } from "../types";
import { numbersLesson, numbersLessons, numbersQuestions } from "./numbers";

const question = (id: string) => numbersQuestions.find((q) => q.id === id)!;

// Every written form the set teaches, 1 to 100: the y numbers 31–99 are spelled from these.
const FORMS = new Set(
  (
    "cero uno un una dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce " +
    "quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintiún veintiuna " +
    "veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete veintiocho veintinueve " +
    "treinta cuarenta cincuenta sesenta setenta ochenta noventa cien"
  ).split(" "),
);

// A word that starts like a number: a misspelt number (veintidos, dieciseis) is caught here.
const NUMBER_LIKE =
  /^(cero|uno?|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieci\p{L}*|veint\p{L}*|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien\p{L}*)$/u;

const NOUNS =
  /^(años?|teléfonos?|móvil(es)?|casas?|clases?|estudiantes|tiendas|parques|euros|libros|sillas|ventanas)$/;

const VALUES: Record<string, number> = Object.fromEntries(
  (
    "cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince " +
    "dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro " +
    "veinticinco veintiséis veintisiete veintiocho veintinueve"
  )
    .split(" ")
    .map((w, i) => [w, i]),
);

const TENS: Record<string, number> = {
  treinta: 30,
  cuarenta: 40,
  cincuenta: 50,
  sesenta: 60,
  setenta: 70,
  ochenta: 80,
  noventa: 90,
  cien: 100,
};

// The number an answer names, as digits or words (un, una, veintiún count as 1 and 21);
// undefined for a sentence or an English answer.
const valueOf = (answer: string) => {
  if (/^\d+$/.test(answer)) {
    return Number(answer);
  }

  const [tens, y, unit, ...rest] = answer
    .replace(/^(un|una)$/, "uno")
    .replace(/^veintiún|^veintiuna$/, "veintiuno")
    .split(" ");

  if (rest.length || (y && y !== "y")) {
    return undefined;
  }

  const first = TENS[tens] ?? VALUES[tens];
  const second = unit ? VALUES[unit.replace(/^(un|una)$/, "uno")] : 0;

  return first === undefined || second === undefined ? undefined : first + second;
};

const words = (s: string) => s.toLocaleLowerCase("es").match(/\p{L}+/gu) ?? [];

// The Spanish of an exercise: what it says after answering and, when typed, what it expects.
const spanishOf = (q: Question) => [
  q.pronunciation ?? "",
  ...(q.kind === "type" ? [q.answer, ...(q.accepted ?? [])] : []),
];

describe("numbers content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);
    expect(bank).toEqual(expect.arrayContaining(numbersQuestions.map((q) => q.id)));
  });

  it("puts every exercise in exactly one lesson, and names only authored exercises", () => {
    const named = numbersLessons.flatMap((l) => [...l.recalled, ...l.base, ...l.variations]);

    expect([...named].sort()).toEqual(numbersQuestions.map((q) => q.id).sort());
  });

  it("offers each choice's answer once among three unique options", () => {
    for (const q of numbersQuestions.filter((x) => x.kind === "choice")) {
      expect(new Set(q.options).size, q.id).toBe(3);

      expect(
        q.options!.filter((o) => o === q.answer),
        q.id,
      ).toHaveLength(1);
    }
  });

  it("gives every exercise two hints and one line of feedback", () => {
    for (const q of numbersQuestions) {
      expect(q.hints, q.id).toHaveLength(2);

      expect(
        [...q.hints!, q.explanation].filter((t) => !t.trim()),
        q.id,
      ).toEqual([]);

      expect(q.explanation, q.id).not.toMatch(/\n|your answer|correct answer/i);
    }
  });

  it("gives every exercise its Spanish to hear and a task of one sentence (#816)", () => {
    for (const q of numbersQuestions) {
      expect(q.pronunciation, q.id).toBeTruthy();
      expect(q.instruction, q.id).toMatch(/^[^.?!]+$/);
    }
  });

  it("writes every number in Spanish as words, with its accents", () => {
    for (const q of numbersQuestions) {
      for (const text of spanishOf(q)) {
        expect(text, q.id).not.toMatch(/\d/);

        const misspelt = words(text).filter((w) => NUMBER_LIKE.test(w) && !FORMS.has(w));

        expect(misspelt, q.id).toEqual([]);
      }
    }
  });

  it("shortens uno before a noun: un año, una casa, veintiún años, never uno años", () => {
    for (const q of numbersQuestions) {
      for (const text of spanishOf(q)) {
        const ws = words(text);
        const before = ws.filter((w, i) => /uno$/.test(w) && NOUNS.test(ws[i + 1] ?? ""));

        expect(before, `${q.id}: ${text}`).toEqual([]);
      }
    }
  });

  it("shows a translation's numbers as digits and asks for them in words", () => {
    const translations = numbersQuestions.filter((q) => q.instruction?.startsWith("Translate"));

    expect(translations.length).toBeGreaterThan(0);

    for (const q of translations) {
      expect(q.prompt, q.id).toMatch(/\d/);
      expect(q.instruction, q.id).toMatch(/in words/);
    }
  });

  it("gives a gap its English situation as the context, apart from the Spanish frame", () => {
    const gaps = numbersQuestions.filter((q) => q.context);

    expect(gaps.length).toBeGreaterThan(0);

    for (const q of gaps) {
      expect(q.prompt, q.id).toContain("___");
      expect(q.context, q.id).not.toContain("___");
    }
  });

  it("mixes two or three new numbers in every learning lesson", () => {
    for (const l of numbersLessons.filter((x) => x.introduction)) {
      const values = l.base.map((id) => valueOf(question(id).answer));
      const numbers = new Set(values.filter((v) => v !== undefined));

      expect(numbers.size, l.id).toBeGreaterThanOrEqual(2);
      expect(values[0], l.id).not.toBe(values[1]);
    }
  });

  it("uses a card's example sentences in no exercise of its lesson", () => {
    for (const l of numbersLessons) {
      const questions = numbersLesson(l.id).questions;
      const cards = questions.filter((q) => q.kind === "teach");

      const examples = cards.flatMap((c) => [
        ...(c.teach?.terms ?? []).flatMap((t) => (t.example ? [t.example.es] : [])),
        ...(c.teach?.examples ?? []).map((e) => e.es),
      ]);

      const said = new Set(questions.map((q) => q.pronunciation));

      expect(
        examples.filter((e) => said.has(e)),
        l.id,
      ).toEqual([]);
    }
  });

  it("checks un and una by the noun: un año, una clase", () => {
    expect(isCorrect(question("NU-T02-E04"), "un")).toBe(true);
    expect(isCorrect(question("NU-T02-E04"), "uno")).toBe(false);
    expect(isCorrect(question("NU-T02-V04"), "una")).toBe(true);
    expect(isCorrect(question("NU-T02-V04"), "un")).toBe(false);
  });

  it("accepts the other correct wordings of a translation, not another number", () => {
    const students = question("NU-T03-E05");

    expect(isCorrect(students, "Somos dos estudiantes.")).toBe(true);
    expect(isCorrect(students, "Nosotras somos dos estudiantes")).toBe(true);
    expect(isCorrect(students, "Somos doce estudiantes.")).toBe(false);
    expect(isCorrect(students, "Somos 2 estudiantes.")).toBe(false);

    expect(isCorrect(question("NU-T03-V10"), "En mi familia somos dos.")).toBe(true);
    expect(isCorrect(question("NU-T02-E05"), "Pablo tiene un móvil.")).toBe(true);
    expect(isCorrect(question("NU-T02-E05"), "Pablo tiene uno teléfono.")).toBe(false);

    expect(isCorrect(question("NU-T08-V10"), "Vivo en el número siete de la calle Sol.")).toBe(
      true,
    );
  });

  it("tells doce from dos and takes usted for you", () => {
    expect(isCorrect(question("NU-T13-E04"), "doce")).toBe(true);
    expect(isCorrect(question("NU-T13-E04"), "dos")).toBe(false);
    expect(isCorrect(question("NU-T12-V10"), "Tú tienes once años.")).toBe(true);
    expect(isCorrect(question("NU-T12-V10"), "Usted tiene once años.")).toBe(true);
    expect(isCorrect(question("NU-T12-V10"), "Tú tienes uno años.")).toBe(false);
  });

  it("shortens veintiuno to veintiún before a masculine noun and veintiuna before a feminine one", () => {
    expect(isCorrect(question("NU-T22-E07"), "veintiún")).toBe(true);
    expect(isCorrect(question("NU-T22-E07"), "veintiuno")).toBe(false);
    expect(isCorrect(question("NU-T22-E08"), "veintiuna")).toBe(true);
    expect(isCorrect(question("NU-T22-E08"), "veintiún")).toBe(false);
    expect(isCorrect(question("NU-T22-E08"), "veintiuno")).toBe(false);
    expect(isCorrect(question("NU-T22-E10"), "Hay veintiún parques en Sevilla.")).toBe(true);
    expect(isCorrect(question("NU-T22-E10"), "En Sevilla hay veinte y un parques.")).toBe(false);
  });

  it("passes dieciséis and veintidós without their accents, with a note", () => {
    expect(accentOnlyAnswer(question("NU-T17-E03"), "dieciseis")).toBe("dieciséis");
    expect(accentOnlyAnswer(question("NU-T22-E04"), "veintidos")).toBe("veintidós");
    expect(isCorrect(question("NU-T22-E04"), "veinte y dos")).toBe(false);
  });

  it("passes an answer that misses only an accent, with a note (ADR 0011)", () => {
    const address = question("NU-T08-V10");

    expect(isCorrect(address, "Vivo en la calle Sol, numero siete.")).toBe(true);

    expect(accentOnlyAnswer(address, "Vivo en la calle Sol, numero siete.")).toBe(
      "Vivo en la calle Sol, número siete.",
    );
  });
});
