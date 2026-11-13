import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { exerciseCount } from "../practice-sets/lesson";
import { accentMistakes, accentOnlyAnswer, isCorrect, normalize } from "../progress";
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
        "WD-T01-N08",
        "WD-T02-E01",
        "WD-T02-N02",
        "WD-T02-N08",
        "WD-T03-E01",
        "WD-T03-N02",
        "WD-T03-N08",
        "WD-T04-E01",
        "WD-T04-N02",
        "WD-T04-N08",
        "WD-T05-E01",
        "WD-T05-N02",
        "WD-T05-N08",
        "WD-T06-E01",
        "WD-T06-N02",
        "WD-T07-E01",
        "WD-T07-N02",
        "WD-T07-N08",
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

  it("gives every exercise its Spanish to hear", () => {
    expect(weekdaysQuestions.filter((q) => !q.pronunciation).map((q) => q.id)).toEqual([]);

    expect(
      [
        "WD-T01-E01",
        "WD-T01-E04",
        "WD-T02-E01",
        "WD-T02-E04",
        "WD-T02-N03",
        "WD-T03-E01",
        "WD-T03-E04",
        "WD-T03-V11",
        "WD-T04-E01",
        "WD-T04-E04",
        "WD-T05-E01",
        "WD-T05-E04",
        "WD-T06-E01",
        "WD-T06-E04",
        "WD-T07-E01",
        "WD-T07-E04",
      ].map((id) => question(id).pronunciation),
    ).toEqual([
      "lunes",
      "Hoy es lunes.",
      "martes",
      "La clase es el martes.",
      "Tengo clase el martes.",
      "miércoles",
      "La reunión es el miércoles.",
      "Pablo va al museo los miércoles.",
      "jueves",
      "La visita es el jueves.",
      "viernes",
      "La cita es el viernes.",
      "sábado",
      "Hoy es sábado.",
      "domingo",
      "Hoy es domingo.",
    ]);
  });

  it("drops the old lesson ids", () => {
    const old = [
      "wd-l01",
      "wd-l02",
      "wd-l03",
      "wd-l04",
      "wd-l05",
      "wd-l06",
      "wd-l07",
      "wd-r01",
      "wd-r02",
      "wd-r03",
    ];

    expect(weekdaysLessons.map((l) => l.id)).toEqual([
      "wd-m01",
      "wd-m02",
      "wd-mr01",
      "wd-m03",
      "wd-mr02",
    ]);

    expect(weekdaysLessons.filter((l) => old.includes(l.id))).toEqual([]);
  });

  it("drops the replaced ids", () => {
    const replaced = ["E05", "E06", "V02", "V04", "V06", "V08", "V10", "V12"];
    const authored = weekdaysQuestions.map((q) => q.id);

    expect(authored.filter((id) => replaced.includes(id.slice(-3)))).toEqual([]);
    expect(authored.filter((id) => /-N0\d$/.test(id))).toHaveLength(39);
  });

  it("has no writing task", () => {
    expect(new Set(weekdaysQuestions.map((q) => q.kind))).toEqual(
      new Set(["choice", "type", "order"]),
    );
  });

  it("shows every task apart from its sentence", () => {
    expect(weekdaysQuestions.filter((q) => !q.instruction).map((q) => q.id)).toEqual([]);

    const q = question("WD-T01-E04");

    expect([q.instruction, q.context, q.prompt]).toEqual([
      "Complete the gap",
      "A displayed calendar says Monday, not the actual date.",
      "Hoy es ___.",
    ]);
  });

  it("keeps a translation's answer out of its task", () => {
    const translations = weekdaysQuestions.filter((q) =>
      q.instruction?.startsWith("Translate into Spanish"),
    );

    expect(translations).toHaveLength(39);

    for (const q of translations) {
      const task = [q.instruction!, q.context ?? "", q.prompt].map(normalize);

      for (const wording of [q.answer, ...(q.accepted ?? [])].map(normalize)) {
        expect(
          task.filter((text) => text.includes(wording)),
          `${q.id} ${wording}`,
        ).toEqual([]);
      }
    }
  });

  it("uses each sentence once in a lesson", () => {
    const dayPhrase =
      /\b(?:(?:todos )?los |el |cada )?(?:lunes|martes|miércoles|jueves|viernes|sábados?|domingos?)\b/g;

    for (const l of weekdaysLessons) {
      const sentences = [...l.recalled, ...l.base, ...l.variations]
        .filter((id) => !id.startsWith("WD-G"))
        .map((id) => normalize(question(id).pronunciation!))
        .filter((text) => text.includes(" "))
        .map((text) => text.replace(dayPhrase, "").replace(/\s+/g, " ").trim());

      expect(
        sentences.filter((text, i) => sentences.indexOf(text) !== i),
        l.id,
      ).toEqual([]);
    }
  });

  it("puts every exercise in exactly one lesson", () => {
    const owned = weekdaysLessons.flatMap((l) => [...l.recalled, ...l.base, ...l.variations]);

    expect(owned).toHaveLength(107);
    expect(owned.toSorted()).toEqual(weekdaysQuestions.map((q) => q.id).toSorted());
  });

  it("sizes the lessons", () => {
    expect(weekdaysLessons.map((l) => [l.id, exerciseCount(l)])).toEqual([
      ["wd-m01", 21],
      ["wd-m02", 20],
      ["wd-mr01", 22],
      ["wd-m03", 21],
      ["wd-mr02", 23],
    ]);
  });

  it("introduces each group's days together", () => {
    const opening = (id: string, length: number) =>
      weekdaysLessons.find((l) => l.id === id)!.base.slice(0, length);

    expect(opening("wd-m01", 3)).toEqual(["WD-T01-E01", "WD-T02-E01", "WD-T03-E01"]);
    expect(opening("wd-m02", 2)).toEqual(["WD-T04-E01", "WD-T05-E01"]);
    expect(opening("wd-m03", 2)).toEqual(["WD-T06-E01", "WD-T07-E01"]);
  });

  it("offers each group's days in its E01 choices", () => {
    expect(
      ids("WD-")
        .filter((id) => id.endsWith("-E01"))
        .map((id) => question(id).options),
    ).toEqual([
      ["Monday", "Tuesday", "Wednesday"],
      ["Tuesday", "Monday", "Wednesday"],
      ["Wednesday", "Monday", "Tuesday"],
      ["Thursday", "Friday", "Wednesday"],
      ["Friday", "Thursday", "Tuesday"],
      ["Saturday", "Sunday", "Friday"],
      ["Sunday", "Saturday", "Monday"],
    ]);
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
      .filter((q) => q.instruction === "Choose the English meaning")
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
    expect(isCorrect(question("WD-T01-N01"), "mi madre trabaja el lunes")).toBe(true);
    expect(isCorrect(question("WD-T01-N01"), "mi madre trabaja el martes")).toBe(false);
  });

  it("accepts every correct wording of a translation", () => {
    const n02 = question("WD-T01-N02");

    expect(isCorrect(n02, "los lunes desayuno en casa")).toBe(true);
    expect(isCorrect(n02, "yo desayuno en casa todos los lunes")).toBe(true);
    expect(isCorrect(n02, "desayuno en casa cada lunes")).toBe(true);
    expect(isCorrect(n02, "desayuno en casa el lunes")).toBe(false);

    expect(isCorrect(question("WD-T06-N02"), "desayuno en casa los sabados")).toBe(true);
    expect(isCorrect(question("WD-T06-N02"), "desayuno en casa los sábado")).toBe(false);

    expect(isCorrect(question("WD-T02-N08"), "tú tienes una clase cada martes")).toBe(true);
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
