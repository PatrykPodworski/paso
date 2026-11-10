import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentMistakes, accentOnlyAnswer, isCorrect } from "../progress";
import { weekdaysLessons, weekdaysQuestions } from "./weekdays";

const ids = (prefix: string) =>
  weekdaysQuestions.map((q) => q.id).filter((id) => id.startsWith(prefix));

const question = (id: string) => weekdaysQuestions.find((q) => q.id === id)!;

const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

describe("weekdays content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(bank).toEqual(
      expect.arrayContaining([
        "WD-T01-E01",
        "WD-T01-V12",
        "WD-T02-E01",
        "WD-T02-E06",
        "WD-T02-V12",
        "WD-T03-E01",
        "WD-T03-E06",
        "WD-T03-V12",
        "WD-T04-E01",
        "WD-T04-E06",
        "WD-T04-V12",
        "WD-T05-E01",
        "WD-T05-E06",
        "WD-T05-V12",
        "WD-T06-E01",
        "WD-T06-E06",
        "WD-T06-V12",
        "WD-T07-E01",
        "WD-T07-E06",
        "WD-T07-V12",
      ]),
    );
  });

  it("names only authored exercises in its lessons", () => {
    const authored = new Set(weekdaysQuestions.map((q) => q.id));

    for (const l of weekdaysLessons) {
      for (const id of [...l.recalled, ...l.base, ...l.variations]) {
        expect(authored, `${l.id} ${id}`).toContain(id);
      }
    }
  });

  it("offers each choice's answer once among unique options", () => {
    const choices = weekdaysQuestions.filter((q) => q.kind === "choice");

    expect(choices.map((q) => q.id)).toEqual([
      "WD-T01-E01",
      "WD-T02-E01",
      "WD-T03-E01",
      "WD-T04-E01",
      "WD-T05-E01",
      "WD-T06-E01",
      "WD-T07-E01",
      ...ids("WD-G02"),
    ]);

    for (const q of choices) {
      const answers = q.options!.filter((o) => o === q.answer);

      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      expect(answers, q.id).toHaveLength(1);
    }
  });

  it("gives every exercise two hints and feedback", () => {
    for (const q of weekdaysQuestions) {
      const blank = [...q.hints!, q.explanation].filter((text) => !text.trim());

      expect(q.hints, q.id).toHaveLength(2);
      expect(blank, q.id).toEqual([]);
    }
  });

  it("gives every exercise but a written sentence its Spanish to hear", () => {
    const silent = weekdaysQuestions.filter((q) => !q.pronunciation).map((q) => q.id);

    expect(silent).toEqual([
      "WD-T01-E06",
      "WD-T01-V10",
      "WD-T01-V12",
      "WD-T02-E06",
      "WD-T02-V10",
      "WD-T02-V12",
      "WD-T03-E06",
      "WD-T03-V10",
      "WD-T03-V12",
      "WD-T04-E06",
      "WD-T04-V10",
      "WD-T04-V12",
      "WD-T05-E06",
      "WD-T05-V10",
      "WD-T05-V12",
      "WD-T06-E06",
      "WD-T06-V10",
      "WD-T06-V12",
      "WD-T07-E06",
      "WD-T07-V10",
      "WD-T07-V12",
    ]);

    expect(new Set(silent.map((id) => question(id).kind))).toEqual(new Set(["write"]));

    expect(
      [
        "WD-T01-E01",
        "WD-T01-E04",
        "WD-T01-V08",
        "WD-T02-E01",
        "WD-T02-E04",
        "WD-T02-V02",
        "WD-T03-E01",
        "WD-T03-E04",
        "WD-T03-V11",
        "WD-T04-E01",
        "WD-T04-E04",
        "WD-T04-V05",
        "WD-T05-E01",
        "WD-T05-E04",
        "WD-T05-V05",
        "WD-T06-E01",
        "WD-T06-E04",
        "WD-T06-V11",
        "WD-T07-E01",
        "WD-T07-E04",
        "WD-T07-V05",
      ].map((id) => question(id).pronunciation),
    ).toEqual([
      "lunes",
      "Hoy es lunes.",
      "Tu visita es el lunes.",
      "martes",
      "La clase es el martes.",
      "Pablo tiene una reunión el martes.",
      "miércoles",
      "La reunión es el miércoles.",
      "Pablo va al museo los miércoles.",
      "jueves",
      "La visita es el jueves.",
      "Luis tiene una reunión el jueves.",
      "viernes",
      "La cita es el viernes.",
      "El curso de Luis empieza el viernes.",
      "sábado",
      "Hoy es sábado.",
      "La tienda abre los sábados.",
      "domingo",
      "Hoy es domingo.",
      "Luis tiene una reunión el domingo.",
    ]);
  });

  it("authors six base items and twelve variations for lunes", () => {
    expect(ids("WD-T01-E")).toEqual([
      "WD-T01-E01",
      "WD-T01-E02",
      "WD-T01-E03",
      "WD-T01-E04",
      "WD-T01-E05",
      "WD-T01-E06",
    ]);

    expect(ids("WD-T01-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for martes", () => {
    expect(ids("WD-T02-E")).toEqual([
      "WD-T02-E01",
      "WD-T02-E02",
      "WD-T02-E03",
      "WD-T02-E04",
      "WD-T02-E05",
      "WD-T02-E06",
    ]);

    expect(ids("WD-T02-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for miércoles", () => {
    expect(ids("WD-T03-E")).toEqual([
      "WD-T03-E01",
      "WD-T03-E02",
      "WD-T03-E03",
      "WD-T03-E04",
      "WD-T03-E05",
      "WD-T03-E06",
    ]);

    expect(ids("WD-T03-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for jueves", () => {
    expect(ids("WD-T04-E")).toEqual([
      "WD-T04-E01",
      "WD-T04-E02",
      "WD-T04-E03",
      "WD-T04-E04",
      "WD-T04-E05",
      "WD-T04-E06",
    ]);

    expect(ids("WD-T04-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for viernes", () => {
    expect(ids("WD-T05-E")).toEqual([
      "WD-T05-E01",
      "WD-T05-E02",
      "WD-T05-E03",
      "WD-T05-E04",
      "WD-T05-E05",
      "WD-T05-E06",
    ]);

    expect(ids("WD-T05-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for sábado", () => {
    expect(ids("WD-T06-E")).toEqual([
      "WD-T06-E01",
      "WD-T06-E02",
      "WD-T06-E03",
      "WD-T06-E04",
      "WD-T06-E05",
      "WD-T06-E06",
    ]);

    expect(ids("WD-T06-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for domingo", () => {
    expect(ids("WD-T07-E")).toEqual([
      "WD-T07-E01",
      "WD-T07-E02",
      "WD-T07-E03",
      "WD-T07-E04",
      "WD-T07-E05",
      "WD-T07-E06",
    ]);

    expect(ids("WD-T07-V")).toHaveLength(12);
  });

  it("authors the 17 calendar items of the whole-week review", () => {
    expect(ids("WD-G").map((id) => [id, question(id).kind])).toEqual([
      ["WD-G01-C01", "type"],
      ["WD-G01-C02", "type"],
      ["WD-G01-C03", "type"],
      ["WD-G01-C04", "type"],
      ["WD-G01-C05", "type"],
      ["WD-G01-C06", "type"],
      ["WD-G01-C07", "type"],
      ["WD-G02-C01", "choice"],
      ["WD-G02-C02", "choice"],
      ["WD-G02-C03", "choice"],
      ["WD-G02-C04", "choice"],
      ["WD-G02-C05", "choice"],
      ["WD-G02-C06", "choice"],
      ["WD-G02-C07", "choice"],
      ["WD-G03", "order"],
      ["WD-G04-C01", "type"],
      ["WD-G04-C02", "type"],
    ]);
  });

  it("asks for each day once in a G01 gap and once in a G02 choice", () => {
    const answers = (prefix: string) => ids(prefix).map((id) => question(id).answer);

    expect(answers("WD-G01")).toEqual(days);
    expect(answers("WD-G02")).toEqual(days);
  });

  it("offers all seven days in each G02 choice", () => {
    for (const id of ids("WD-G02")) {
      expect(question(id).options!.toSorted(), id).toEqual(days.toSorted());
    }
  });

  it("builds the week from the seven day tiles of G03", () => {
    const g03 = question("WD-G03");

    expect(g03.tokens).toEqual(days);
    expect(g03.answer).toBe("lunes martes miércoles jueves viernes sábado domingo");
    expect(g03.pronunciation).toBe(g03.answer);
    expect(isCorrect(g03, g03.tokens!.join(" "))).toBe(true);
    expect(isCorrect(g03, "domingo lunes martes miércoles jueves viernes sábado")).toBe(false);
  });

  it("takes lunes after Sunday and domingo before Monday", () => {
    expect(isCorrect(question("WD-G04-C01"), "lunes")).toBe(true);
    expect(isCorrect(question("WD-G04-C01"), "martes")).toBe(false);
    expect(isCorrect(question("WD-G04-C02"), "domingo")).toBe(true);
    expect(isCorrect(question("WD-G04-C02"), "sábado")).toBe(false);
  });

  it("asks for every day both as Spanish to produce and as a meaning to recognise", () => {
    const typed = weekdaysQuestions.filter((q) => q.kind === "type").map((q) => q.answer);

    const meanings = weekdaysQuestions
      .filter((q) => q.prompt.startsWith("Choose the English meaning"))
      .map((q) => q.answer);

    expect(typed).toEqual(expect.arrayContaining(days));

    expect(meanings).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]);
  });

  it("accepts the full sentence without a capital or a full stop", () => {
    expect(isCorrect(question("WD-T01-E05"), "hoy es lunes")).toBe(true);
    expect(isCorrect(question("WD-T01-E05"), "hoy es martes")).toBe(false);
  });

  it("rejects another day in the lunes gap", () => {
    expect(isCorrect(question("WD-T01-E04"), "martes")).toBe(false);
    expect(isCorrect(question("WD-T01-E04"), "Lunes")).toBe(true);
  });

  it("rejects another day in the martes gap", () => {
    expect(isCorrect(question("WD-T02-E04"), "lunes")).toBe(false);
    expect(isCorrect(question("WD-T02-E04"), "Martes")).toBe(true);
  });

  it("rejects another day in the jueves gap", () => {
    expect(isCorrect(question("WD-T04-E04"), "miércoles")).toBe(false);
    expect(isCorrect(question("WD-T04-E04"), "Jueves")).toBe(true);
  });

  it("rejects another day in the viernes gap", () => {
    expect(isCorrect(question("WD-T05-E04"), "jueves")).toBe(false);
    expect(isCorrect(question("WD-T05-E04"), "Viernes")).toBe(true);
  });

  it("takes sábados, not sábado, for every Saturday", () => {
    expect(isCorrect(question("WD-T06-V09"), "sábados")).toBe(true);
    expect(isCorrect(question("WD-T06-V09"), "sábado")).toBe(false);
  });

  it("rejects another day in the domingo gap", () => {
    expect(isCorrect(question("WD-T07-E04"), "sábado")).toBe(false);
    expect(isCorrect(question("WD-T07-E04"), "Domingo")).toBe(true);
  });

  it("takes domingos, not domingo, for every Sunday", () => {
    expect(isCorrect(question("WD-T07-V09"), "domingos")).toBe(true);
    expect(isCorrect(question("WD-T07-V09"), "domingo")).toBe(false);
  });

  it("passes miercoles for the miércoles word and notes the missing é", () => {
    const e03 = question("WD-T03-E03");

    expect(isCorrect(e03, "miercoles")).toBe(true);
    expect(accentOnlyAnswer(e03, "miercoles")).toBe("miércoles");

    expect(accentMistakes(accentOnlyAnswer(e03, "miercoles")!, "miercoles")).toEqual({
      missing: ["é"],
      extra: [],
    });

    expect(accentOnlyAnswer(e03, "miércoles")).toBeUndefined();
    expect(isCorrect(e03, "martes")).toBe(false);
  });

  it("passes sabado for the sábado word and notes the missing á", () => {
    const e03 = question("WD-T06-E03");

    expect(isCorrect(e03, "sabado")).toBe(true);
    expect(accentOnlyAnswer(e03, "sabado")).toBe("sábado");

    expect(accentMistakes(accentOnlyAnswer(e03, "sabado")!, "sabado")).toEqual({
      missing: ["á"],
      extra: [],
    });

    expect(accentOnlyAnswer(e03, "sábado")).toBeUndefined();
    expect(isCorrect(e03, "viernes")).toBe(false);
  });
});
