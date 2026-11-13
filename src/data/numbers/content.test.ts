import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentOnlyAnswer, isCorrect } from "../progress";
import type { Question } from "../types";
import { numbersLesson, numbersLessons, numbersQuestions, numbersSet } from "./numbers";

const question = (id: string) => numbersQuestions.find((q) => q.id === id)!;

const HUNDREDS = [
  "ciento",
  "doscientos",
  "trescientos",
  "cuatrocientos",
  "quinientos",
  "seiscientos",
  "setecientos",
  "ochocientos",
  "novecientos",
];

// Every written form the set teaches, 0 to un millón: the other numbers are spelled from these.
const FORMS = new Set([
  ...(
    "cero uno un una dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce " +
    "quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintiún veintiuna " +
    "veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete veintiocho veintinueve " +
    "treinta cuarenta cincuenta sesenta setenta ochenta noventa cien mil millón millones"
  ).split(" "),
  ...HUNDREDS,
  ...HUNDREDS.slice(1).map((h) => h.replace(/os$/, "as")),
]);

// A word that starts like a number: a misspelt number (veintidos, dieciseis) is caught here.
const NUMBER_LIKE =
  /^(cero|uno?|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieci\p{L}*|veint\p{L}*|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien\p{L}*|\p{L}+cient[oa]s|mil|mill\p{L}+)$/u;

const NOUNS =
  /^(años?|teléfonos?|móvil(es)?|casas?|clases?|estudiantes|tiendas|parques|euros?|libros|sillas|ventanas|gramos|kilos?|litros?|botellas?|céntimos)$/;

const FEMININE = /^(casas?|clases?|tiendas|sillas|ventanas|botellas?)$/;

// The value of each word below mil; y adds nothing.
const UNITS = new Map<string, number>([
  ...(
    "cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince " +
    "dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro " +
    "veinticinco veintiséis veintisiete veintiocho veintinueve"
  )
    .split(" ")
    .map((w, i): [string, number] => [w, i]),
  ...["treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"].map(
    (w, i): [string, number] => [w, (i + 3) * 10],
  ),
  ["cien", 100],
  ...HUNDREDS.map((w, i): [string, number] => [w, (i + 1) * 100]),
  ["y", 0],
]);

// The words that multiply the group before them: tres mil, un millón.
const SCALES = new Map([
  ["mil", 1000],
  ["millón", 1_000_000],
  ["millones", 1_000_000],
]);

// Un, una, veintiún, veintiuna and the -as hundreds read as their masculine form.
const masculine = (word: string) =>
  word
    .replace(/^(un|una)$/, "uno")
    .replace(/^(veintiún|veintiuna)$/, "veintiuno")
    .replace(/as$/, "os");

// The number an answer names, as digits or words (un, una, veintiún, doscientas count too);
// undefined for a sentence or an English answer.
const valueOf = (answer: string): number | undefined => {
  if (/^[\d\u00a0]+$/.test(answer)) {
    return Number(answer.replace(/\u00a0/g, ""));
  }

  let total = 0;
  let group = 0;

  for (const w of answer.split(" ").map(masculine)) {
    const scale = SCALES.get(w);
    const unit = UNITS.get(w);

    if (scale !== undefined) {
      total += (group || 1) * scale;
      group = 0;
    } else if (unit !== undefined) {
      group += unit;
    } else {
      return undefined;
    }
  }

  return total + group;
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

  it("makes the hundreds agree with a feminine noun and puts de after millón", () => {
    for (const q of numbersQuestions) {
      for (const text of spanishOf(q)) {
        const ws = words(text);
        const masculine = ws.filter((w, i) => /cientos$/.test(w) && FEMININE.test(ws[i + 1] ?? ""));
        const bare = ws.filter((w, i) => /^mill/.test(w) && NOUNS.test(ws[i + 1] ?? ""));

        expect([...masculine, ...bare], `${q.id}: ${text}`).toEqual([]);
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

  // Units 1–5 teach numbers; unit 6 puts them to use, so its answers are times, prices and phone numbers.
  const realLife = new Set(numbersSet.units.at(-1)!.lessons.map((l) => l.id));

  it("mixes two or three new numbers in every learning lesson", () => {
    for (const l of numbersLessons.filter((x) => x.introduction && !realLife.has(x.id))) {
      const values = l.base.map((id) => valueOf(question(id).answer));
      const numbers = new Set(values.filter((v) => v !== undefined));

      expect(numbers.size, l.id).toBeGreaterThanOrEqual(2);
      expect(values[0], l.id).not.toBe(values[1]);
    }
  });

  it("mixes two situations in every real-life lesson from its first two exercises", () => {
    // An exercise id names its situation: NU-T43 is the hour, NU-T44 is y cuarto, y media and menos cuarto.
    const situation = (id: string) => id.slice(0, 6);

    for (const l of numbersLessons.filter((x) => x.introduction && realLife.has(x.id))) {
      expect(new Set(l.base.map(situation)).size, l.id).toBe(2);
      expect(situation(l.base[0]), l.id).not.toBe(situation(l.base[1]));
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

  it("writes 31 to 99 as three words with y una before a feminine noun, and 100 as cien", () => {
    expect(isCorrect(question("NU-T30-1205"), "treinta y un")).toBe(true);
    expect(isCorrect(question("NU-T30-1205"), "treinta y uno")).toBe(false);
    expect(isCorrect(question("NU-T30-1206"), "treinta y una")).toBe(true);
    expect(isCorrect(question("NU-T30-1206"), "treinta y un")).toBe(false);

    const books = question("NU-T30-1305");

    expect(isCorrect(books, "En la clase hay cuarenta y cuatro libros.")).toBe(true);
    expect(isCorrect(books, "Hay cuarentaicuatro libros en la clase.")).toBe(false);
    expect(isCorrect(question("NU-T31-E03"), "cien")).toBe(true);
    expect(isCorrect(question("NU-T31-E03"), "ciento")).toBe(false);
    expect(isCorrect(question("NU-T26-E04"), "sesenta")).toBe(true);
    expect(isCorrect(question("NU-T26-E04"), "setenta")).toBe(false);
  });

  it("says cien alone and ciento before more, and ciento una before a feminine noun", () => {
    expect(isCorrect(question("NU-T32-E03"), "ciento veinte")).toBe(true);
    expect(isCorrect(question("NU-T32-E03"), "cien veinte")).toBe(false);
    expect(isCorrect(question("NU-T32-V03"), "ciento cincuenta")).toBe(true);
    expect(isCorrect(question("NU-T32-E07"), "ciento una")).toBe(true);
    expect(isCorrect(question("NU-T32-E07"), "ciento un")).toBe(false);
  });

  it("makes the hundreds agree with the noun, and takes both for a bare number (#817)", () => {
    expect(isCorrect(question("NU-T33-E07"), "doscientas")).toBe(true);
    expect(isCorrect(question("NU-T33-E07"), "doscientos")).toBe(false);
    expect(isCorrect(question("NU-T33-E08"), "trescientas")).toBe(false);
    expect(isCorrect(question("NU-T33-E05"), "doscientos")).toBe(true);
    expect(isCorrect(question("NU-T33-E05"), "doscientas")).toBe(true);
    expect(isCorrect(question("NU-T37-R01"), "mil setecientas")).toBe(true);
  });

  it("spells quinientos, setecientos and novecientos, not by the rule", () => {
    expect(isCorrect(question("NU-T34-E05"), "quinientos")).toBe(true);
    expect(isCorrect(question("NU-T34-E05"), "cincocientos")).toBe(false);
    expect(isCorrect(question("NU-T35-E05"), "setecientos")).toBe(true);
    expect(isCorrect(question("NU-T35-E05"), "sietecientos")).toBe(false);
    expect(isCorrect(question("NU-T35-E06"), "novecientos")).toBe(true);
    expect(isCorrect(question("NU-T35-E06"), "nuevecientos")).toBe(false);
  });

  it("says mil, never un mil, and un millón de before a noun", () => {
    expect(isCorrect(question("NU-T36-E05"), "mil")).toBe(true);
    expect(isCorrect(question("NU-T36-E05"), "un mil")).toBe(false);
    expect(isCorrect(question("NU-T36-E06"), "tres mil")).toBe(true);
    expect(isCorrect(question("NU-T36-E06"), "tres miles")).toBe(false);
    expect(isCorrect(question("NU-T38-E04"), "un millón")).toBe(true);
    expect(isCorrect(question("NU-T38-E04"), "un millon")).toBe(true);
    expect(isCorrect(question("NU-T38-E09"), "La casa cuesta tres millones de euros.")).toBe(true);
    expect(isCorrect(question("NU-T38-E09"), "La casa cuesta tres millones euros.")).toBe(false);

    expect(
      isCorrect(question("NU-T38-E08"), "El piso cuesta un millón quinientos mil euros."),
    ).toBe(true);
  });

  it("reads a year as one number, and takes el uno or el primero for the 1st", () => {
    expect(isCorrect(question("NU-T39-E03"), "mil novecientos setenta y cinco")).toBe(true);
    expect(isCorrect(question("NU-T39-E03"), "diecinueve setenta y cinco")).toBe(false);
    expect(isCorrect(question("NU-T39-E03"), "mil novecientas setenta y cinco")).toBe(false);
    expect(isCorrect(question("NU-T41-E03"), "uno")).toBe(true);
    expect(isCorrect(question("NU-T41-E03"), "primero")).toBe(true);
    expect(isCorrect(question("NU-T41-E03"), "una")).toBe(false);
    expect(isCorrect(question("NU-T41-E07"), "Tengo una cita el primero de mayo.")).toBe(true);
    expect(isCorrect(question("NU-T41-E07"), "Tengo una cita el uno de junio.")).toBe(false);
  });

  it("takes y media or treinta and menos cuarto or cuarenta y cinco, with la una singular", () => {
    expect(isCorrect(question("NU-T44-E04"), "siete y media")).toBe(true);
    expect(isCorrect(question("NU-T44-E04"), "siete treinta")).toBe(true);
    expect(isCorrect(question("NU-T44-E04"), "siete y cuarto")).toBe(false);
    expect(isCorrect(question("NU-T44-E03"), "once menos cuarto")).toBe(true);
    expect(isCorrect(question("NU-T44-E03"), "diez cuarenta y cinco")).toBe(true);
    expect(isCorrect(question("NU-T44-E03"), "diez menos cuarto")).toBe(false);
    expect(isCorrect(question("NU-T44-E06"), "dieciséis treinta")).toBe(true);
    expect(isCorrect(question("NU-T43-R02"), "El autobús sale a la una.")).toBe(true);
    expect(isCorrect(question("NU-T43-R02"), "El autobús sale a las una.")).toBe(false);
  });

  it("takes a price with or without con and céntimos, and un euro before the noun", () => {
    const coffee = question("NU-T45-E02");

    expect(isCorrect(coffee, "un euro con cincuenta")).toBe(true);
    expect(isCorrect(coffee, "un euro cincuenta")).toBe(true);
    expect(isCorrect(coffee, "uno cincuenta")).toBe(true);
    expect(isCorrect(coffee, "un euro con cincuenta céntimos")).toBe(true);
    expect(isCorrect(coffee, "uno euro con cincuenta")).toBe(false);
    expect(isCorrect(coffee, "un euro con quince")).toBe(false);
    expect(isCorrect(question("NU-T46-E02"), "ochenta céntimos")).toBe(true);
  });

  it("takes a phone number digit by digit or in groups, with or without commas", () => {
    const phone = question("NU-T47-E05");

    expect(isCorrect(phone, "Mi teléfono es seis siete ocho nueve cero uno dos tres cuatro")).toBe(
      true,
    );

    expect(
      isCorrect(
        phone,
        "Mi número es seiscientos setenta y ocho, novecientos uno, doscientos treinta y cuatro.",
      ),
    ).toBe(true);

    expect(isCorrect(phone, "Mi teléfono es seis siete ocho nueve cero uno dos tres cinco")).toBe(
      false,
    );
  });

  it("says primer piso and primera planta, and makes gramos and botella agree", () => {
    expect(isCorrect(question("NU-T49-E05"), "primer")).toBe(true);
    expect(isCorrect(question("NU-T49-E05"), "primero")).toBe(false);
    expect(isCorrect(question("NU-T49-E03"), "segunda")).toBe(true);
    expect(isCorrect(question("NU-T49-E03"), "segundo")).toBe(false);
    const room = question("NU-T49-E06");

    expect(isCorrect(room, "Mi habitación está en el tercer piso.")).toBe(true);
    expect(isCorrect(room, "Mi habitación está en la tercer planta.")).toBe(false);

    const cheese = question("NU-T51-E07");

    expect(isCorrect(cheese, "Quiero doscientos cincuenta gramos de queso.")).toBe(true);
    expect(isCorrect(cheese, "Quiero doscientas cincuenta gramos de queso.")).toBe(false);
    expect(isCorrect(question("NU-T52-E03"), "una")).toBe(true);
    expect(isCorrect(question("NU-T52-E03"), "un")).toBe(false);
  });

  it("passes an answer that misses only an accent, with a note (ADR 0011)", () => {
    const address = question("NU-T08-V10");

    expect(isCorrect(address, "Vivo en la calle Sol, numero siete.")).toBe(true);

    expect(accentOnlyAnswer(address, "Vivo en la calle Sol, numero siete.")).toBe(
      "Vivo en la calle Sol, número siete.",
    );
  });
});
