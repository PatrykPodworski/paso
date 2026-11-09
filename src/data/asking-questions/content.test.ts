import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentOnlyAnswer, isCorrect } from "../progress";
import { askingLessons, askingQuestions } from "./askingQuestions";

const ids = (prefix: string) =>
  askingQuestions.map((q) => q.id).filter((id) => id.startsWith(prefix));

describe("asking questions content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(bank).toEqual(
      expect.arrayContaining([
        "AQ-T01-E01",
        "AQ-T01-V12",
        "AQ-T02-E01",
        "AQ-T02-V12",
        "AQ-T03-E01",
        "AQ-T03-V12",
        "AQ-T04-E01",
        "AQ-T04-V12",
        "AQ-T05-E01",
        "AQ-T05-V12",
        "AQ-T06-E01",
        "AQ-T06-V12",
        "AQ-T07-E01",
        "AQ-T07-V12",
        "AQ-T08-E01",
        "AQ-T08-V12",
        "AQ-T09-E01",
        "AQ-T09-V12",
        "AQ-T10-E01",
        "AQ-T10-V12",
        "AQ-T11-E01",
        "AQ-T11-V12",
        "AQ-T12-E01",
        "AQ-T12-V12",
        "AQ-T13-E01",
        "AQ-T13-V12",
        "AQ-T14-E01",
        "AQ-T14-V12",
        "AQ-T15-E01",
        "AQ-T15-V12",
        "AQ-T16-E01",
        "AQ-T16-V12",
        "AQ-T17-E01",
        "AQ-T17-V12",
        "AQ-T18-E01",
        "AQ-T18-V12",
      ]),
    );
  });

  it("names only authored exercises in its lessons", () => {
    const authored = new Set(askingQuestions.map((q) => q.id));

    for (const l of askingLessons) {
      for (const id of [...l.recalled, ...l.base, ...l.variations]) {
        expect(authored, `${l.id} ${id}`).toContain(id);
      }
    }
  });

  it("offers each choice's answer once among unique options", () => {
    for (const q of askingQuestions.filter((q) => q.kind === "choice")) {
      const answers = q.options!.filter((o) => o === q.answer);

      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      expect(answers, q.id).toHaveLength(1);
    }
  });

  it("builds each order answer from the words of its tiles", () => {
    for (const q of askingQuestions.filter((q) => q.kind === "order")) {
      const words = q.tokens!.flatMap((t) => t.split(" "));

      expect(words.sort(), q.id).toEqual(q.answer.split(" ").sort());
    }
  });

  it("gives every exercise two hints and feedback", () => {
    for (const q of askingQuestions) {
      const blank = [...q.hints!, q.explanation].filter((text) => !text.trim());

      expect(q.hints, q.id).toHaveLength(2);
      expect(blank, q.id).toEqual([]);
    }
  });

  it("authors six base items and twelve variations for qué", () => {
    expect(ids("AQ-T01-E")).toEqual([
      "AQ-T01-E01",
      "AQ-T01-E02",
      "AQ-T01-E03",
      "AQ-T01-E04",
      "AQ-T01-E05",
      "AQ-T01-E06",
    ]);

    expect(ids("AQ-T01-V")).toHaveLength(12);
  });

  it("authors six base items and twelve variations for cómo", () => {
    expect(ids("AQ-T02-E")).toEqual([
      "AQ-T02-E01",
      "AQ-T02-E02",
      "AQ-T02-E03",
      "AQ-T02-E04",
      "AQ-T02-E05",
      "AQ-T02-E06",
    ]);

    expect(ids("AQ-T02-V")).toHaveLength(12);
  });

  it("accepts cómo, notes a missing accent and rejects qué in a cómo cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T02-V08")!;

    expect([isCorrect(q, "Cómo"), isCorrect(q, "qué")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "como")).toBe("cómo");
  });

  it("accepts the typed cómo question and rejects one that asks for a thing", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T02-V10")!;

    expect(isCorrect(q, "¿Cómo vas al hotel?")).toBe(true);
    expect(isCorrect(q, "¿Qué vas al hotel?")).toBe(false);
  });

  it("authors six base items and twelve variations for dónde", () => {
    expect(ids("AQ-T03-E")).toEqual([
      "AQ-T03-E01",
      "AQ-T03-E02",
      "AQ-T03-E03",
      "AQ-T03-E04",
      "AQ-T03-E05",
      "AQ-T03-E06",
    ]);

    expect(ids("AQ-T03-V")).toHaveLength(12);
  });

  it("accepts dónde, notes a missing accent and rejects qué in a dónde cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T03-V08")!;

    expect([isCorrect(q, "Dónde"), isCorrect(q, "qué")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "donde")).toBe("dónde");
  });

  it("accepts the typed dónde question and rejects one that asks for a thing", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T03-V10")!;

    expect(isCorrect(q, "¿Dónde está la mochila?")).toBe(true);
    expect(isCorrect(q, "¿Qué está la mochila?")).toBe(false);
  });

  it("authors six base items and twelve variations for cuándo", () => {
    expect(ids("AQ-T04-E")).toEqual([
      "AQ-T04-E01",
      "AQ-T04-E02",
      "AQ-T04-E03",
      "AQ-T04-E04",
      "AQ-T04-E05",
      "AQ-T04-E06",
    ]);

    expect(ids("AQ-T04-V")).toHaveLength(12);
  });

  it("accepts cuándo, notes a missing accent and rejects dónde in a cuándo cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T04-V01")!;

    expect([isCorrect(q, "Cuándo"), isCorrect(q, "dónde")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "cuando")).toBe("cuándo");
  });

  it("accepts the typed cuándo question and rejects one that asks for a place", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T04-V10")!;

    expect(isCorrect(q, "¿Cuándo empieza la visita?")).toBe(true);
    expect(isCorrect(q, "¿Dónde empieza la visita?")).toBe(false);
  });

  it("authors six base items and twelve variations for quién / quiénes", () => {
    expect(ids("AQ-T05-E")).toEqual([
      "AQ-T05-E01",
      "AQ-T05-E02",
      "AQ-T05-E03",
      "AQ-T05-E04",
      "AQ-T05-E05",
      "AQ-T05-E06",
    ]);

    expect(ids("AQ-T05-V")).toHaveLength(12);
  });

  it("accepts quiénes, notes a missing accent and rejects quién in a plural cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T05-V02")!;

    expect([isCorrect(q, "Quiénes"), isCorrect(q, "quién")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "quienes")).toBe("quiénes");
  });

  it("accepts the typed quiénes question and rejects the singular one", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T05-V05")!;

    expect(isCorrect(q, "¿Quiénes vienen mañana?")).toBe(true);
    expect(isCorrect(q, "¿Quién vienen mañana?")).toBe(false);
  });

  it("authors six base items and twelve variations for cuál / cuáles", () => {
    expect(ids("AQ-T06-E")).toEqual([
      "AQ-T06-E01",
      "AQ-T06-E02",
      "AQ-T06-E03",
      "AQ-T06-E04",
      "AQ-T06-E05",
      "AQ-T06-E06",
    ]);

    expect(ids("AQ-T06-V")).toHaveLength(12);
  });

  it("accepts cuáles, notes a missing accent and rejects cuál in a plural-choice cloze", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T06-V02")!;

    expect([isCorrect(q, "Cuáles"), isCorrect(q, "cuál")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "cuales")).toBe("cuáles");
  });

  it("accepts the typed cuáles question and rejects the singular one", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T06-V05")!;

    expect(isCorrect(q, "¿Cuáles de estos tres quiere Pablo?")).toBe(true);
    expect(isCorrect(q, "¿Cuál de estos tres quiere Pablo?")).toBe(false);
  });

  it("authors six base items and twelve variations for cuánto / cuánta / cuántos / cuántas", () => {
    expect(ids("AQ-T07-E")).toEqual([
      "AQ-T07-E01",
      "AQ-T07-E02",
      "AQ-T07-E03",
      "AQ-T07-E04",
      "AQ-T07-E05",
      "AQ-T07-E06",
    ]);

    expect(ids("AQ-T07-V")).toHaveLength(12);
  });

  it("accepts cuánta for a feminine mass noun, notes a missing accent and rejects cuánto", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T07-E02")!;

    expect([isCorrect(q, "Cuánta"), isCorrect(q, "cuánto")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "cuanta")).toBe("cuánta");
  });

  it("keeps the price cuánto invariant before a plural verb", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T07-V07")!;

    expect([isCorrect(q, "cuánto"), isCorrect(q, "cuántas")]).toEqual([true, false]);
  });

  it("accepts the typed price question and rejects one that agrees with entrada", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T07-V05")!;

    expect(isCorrect(q, "¿Cuánto cuesta la entrada?")).toBe(true);
    expect(isCorrect(q, "¿Cuánta cuesta la entrada?")).toBe(false);
  });

  it("authors six base items and twelve variations for por qué", () => {
    expect(ids("AQ-T08-E")).toEqual([
      "AQ-T08-E01",
      "AQ-T08-E02",
      "AQ-T08-E03",
      "AQ-T08-E04",
      "AQ-T08-E05",
      "AQ-T08-E06",
    ]);

    expect(ids("AQ-T08-V")).toHaveLength(12);
  });

  it("accepts por qué, notes a missing accent and rejects the reply connector porque", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T08-V01")!;

    expect([isCorrect(q, "Por qué"), isCorrect(q, "porque")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "por que")).toBe("por qué");
  });

  it("accepts the typed por qué question and rejects one that asks for a time", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T08-V11")!;

    expect(isCorrect(q, "¿Por qué viene Luis mañana?")).toBe(true);
    expect(isCorrect(q, "¿Cuándo viene Luis mañana?")).toBe(false);
  });

  it("authors six base items and twelve variations for a qué hora", () => {
    expect(ids("AQ-T09-E")).toEqual([
      "AQ-T09-E01",
      "AQ-T09-E02",
      "AQ-T09-E03",
      "AQ-T09-E04",
      "AQ-T09-E05",
      "AQ-T09-E06",
    ]);

    expect(ids("AQ-T09-V")).toHaveLength(12);
  });

  it("accepts a qué hora, notes a missing accent and rejects qué alone", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T09-V01")!;

    expect([isCorrect(q, "A qué hora"), isCorrect(q, "qué")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "a que hora")).toBe("a qué hora");
  });

  it("accepts the typed a qué hora question and rejects the broader cuándo one", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T09-E04")!;

    expect(isCorrect(q, "¿A qué hora sale el tren?")).toBe(true);
    expect(isCorrect(q, "¿Cuándo sale el tren?")).toBe(false);
  });

  it("authors six base items and twelve variations for de dónde", () => {
    expect(ids("AQ-T10-E")).toEqual([
      "AQ-T10-E01",
      "AQ-T10-E02",
      "AQ-T10-E03",
      "AQ-T10-E04",
      "AQ-T10-E05",
      "AQ-T10-E06",
    ]);

    expect(ids("AQ-T10-V")).toHaveLength(12);
  });

  it("accepts de dónde, notes a missing accent and rejects dónde alone", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T10-V01")!;

    expect([isCorrect(q, "De dónde"), isCorrect(q, "dónde")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "de donde")).toBe("de dónde");
  });

  it("accepts the typed origin question and rejects the current-location one", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T10-E04")!;

    expect(isCorrect(q, "¿De dónde eres?")).toBe(true);
    expect(isCorrect(q, "¿Dónde estás?")).toBe(false);
  });

  it("authors six base items and twelve variations for adónde", () => {
    expect(ids("AQ-T11-E")).toEqual([
      "AQ-T11-E01",
      "AQ-T11-E02",
      "AQ-T11-E03",
      "AQ-T11-E04",
      "AQ-T11-E05",
      "AQ-T11-E06",
    ]);

    expect(ids("AQ-T11-V")).toHaveLength(12);
  });

  it("accepts both destination spellings in every adónde cloze and rejects de dónde", () => {
    for (const id of ["AQ-T11-E02", "AQ-T11-V01", "AQ-T11-V02", "AQ-T11-V07", "AQ-T11-V08"]) {
      const q = askingQuestions.find((q) => q.id === id)!;

      expect(
        [isCorrect(q, "Adónde"), isCorrect(q, "a dónde"), isCorrect(q, "de dónde")],
        id,
      ).toEqual([true, true, false]);
    }
  });

  it("notes a missing accent on either destination spelling", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T11-V01")!;

    expect([accentOnlyAnswer(q, "adonde"), accentOnlyAnswer(q, "a donde")]).toEqual([
      "adónde",
      "a dónde",
    ]);
  });

  it.each([
    ["AQ-T11-E04", "¿A dónde vas?", "¿De dónde vas?"],
    ["AQ-T11-V04", "¿A dónde vas?", "¿De dónde vas?"],
    ["AQ-T11-V05", "¿A dónde va Pablo?", "¿De dónde va Pablo?"],
    ["AQ-T11-V10", "¿A dónde va el tren?", "¿De dónde va el tren?"],
    ["AQ-T11-V11", "¿A dónde vas en autobús?", "¿De dónde vas en autobús?"],
  ])(
    "accepts the two-word destination question in %s and rejects the origin one",
    (id, two, origin) => {
      const q = askingQuestions.find((q) => q.id === id)!;

      expect([isCorrect(q, two), isCorrect(q, origin)]).toEqual([true, false]);
    },
  );

  it("authors six base items and twelve variations for con quién", () => {
    expect(ids("AQ-T12-E")).toEqual([
      "AQ-T12-E01",
      "AQ-T12-E02",
      "AQ-T12-E03",
      "AQ-T12-E04",
      "AQ-T12-E05",
      "AQ-T12-E06",
    ]);

    expect(ids("AQ-T12-V")).toHaveLength(12);
  });

  it("accepts con quién, notes a missing accent and rejects quién without con", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T12-V01")!;

    expect([isCorrect(q, "Con quién"), isCorrect(q, "quién")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "con quien")).toBe("con quién");
  });

  it("accepts the plural con quiénes for several companions and rejects the singular", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T12-V08")!;

    expect([isCorrect(q, "con quiénes"), isCorrect(q, "con quién")]).toEqual([true, false]);
  });

  it("accepts the typed companion question and rejects one that asks who is going", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T12-E04")!;

    expect(isCorrect(q, "¿Con quién vas?")).toBe(true);
    expect(isCorrect(q, "¿Quién va?")).toBe(false);
  });

  it("authors six base items and twelve variations for de quién", () => {
    expect(ids("AQ-T13-E")).toEqual([
      "AQ-T13-E01",
      "AQ-T13-E02",
      "AQ-T13-E03",
      "AQ-T13-E04",
      "AQ-T13-E05",
      "AQ-T13-E06",
    ]);

    expect(ids("AQ-T13-V")).toHaveLength(12);
  });

  it("accepts de quién, notes a missing accent and rejects quién without de", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T13-V01")!;

    expect([isCorrect(q, "De quién"), isCorrect(q, "quién")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "de quien")).toBe("de quién");
  });

  it("keeps de quién for one owner of plural objects and de quiénes for several owners", () => {
    const one = askingQuestions.find((q) => q.id === "AQ-T13-V02")!;
    const several = askingQuestions.find((q) => q.id === "AQ-T13-V07")!;

    expect([isCorrect(one, "de quién"), isCorrect(one, "de quiénes")]).toEqual([true, false]);

    expect([isCorrect(several, "de quiénes"), isCorrect(several, "de quién")]).toEqual([
      true,
      false,
    ]);
  });

  it("accepts the typed ownership question and rejects one that asks for origin", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T13-E04")!;

    expect(isCorrect(q, "¿De quién es este libro?")).toBe(true);
    expect(isCorrect(q, "¿De dónde es este libro?")).toBe(false);
  });

  it("authors six base items and twelve variations for desde cuándo", () => {
    expect(ids("AQ-T14-E")).toEqual([
      "AQ-T14-E01",
      "AQ-T14-E02",
      "AQ-T14-E03",
      "AQ-T14-E04",
      "AQ-T14-E05",
      "AQ-T14-E06",
    ]);

    expect(ids("AQ-T14-V")).toHaveLength(12);
  });

  it("accepts desde cuándo, notes a missing accent and rejects cuándo without desde", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T14-V01")!;

    expect([isCorrect(q, "Desde cuándo"), isCorrect(q, "cuándo")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "desde cuando")).toBe("desde cuándo");
  });

  it("accepts the typed start-point question and rejects one that asks when", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T14-E04")!;

    expect(isCorrect(q, "¿Desde cuándo trabajas aquí?")).toBe(true);
    expect(isCorrect(q, "¿Cuándo trabajas aquí?")).toBe(false);
  });

  it("authors six base items and twelve variations for hasta cuándo", () => {
    expect(ids("AQ-T15-E")).toEqual([
      "AQ-T15-E01",
      "AQ-T15-E02",
      "AQ-T15-E03",
      "AQ-T15-E04",
      "AQ-T15-E05",
      "AQ-T15-E06",
    ]);

    expect(ids("AQ-T15-V")).toHaveLength(12);
  });

  it("accepts hasta cuándo, notes a missing accent and rejects desde cuándo", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T15-V01")!;

    expect([isCorrect(q, "Hasta cuándo"), isCorrect(q, "desde cuándo")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "hasta cuando")).toBe("hasta cuándo");
  });

  it("accepts the typed end-point question and rejects one that asks the start", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T15-E04")!;

    expect(isCorrect(q, "¿Hasta cuándo trabajas hoy?")).toBe(true);
    expect(isCorrect(q, "¿Desde cuándo trabajas hoy?")).toBe(false);
  });

  it("authors six base items and twelve variations for cada cuánto", () => {
    expect(ids("AQ-T16-E")).toEqual([
      "AQ-T16-E01",
      "AQ-T16-E02",
      "AQ-T16-E03",
      "AQ-T16-E04",
      "AQ-T16-E05",
      "AQ-T16-E06",
    ]);

    expect(ids("AQ-T16-V")).toHaveLength(12);
  });

  it("accepts cada cuánto with or without tiempo in every cada cuánto cloze and rejects cuándo", () => {
    for (const id of ["AQ-T16-E02", "AQ-T16-V01", "AQ-T16-V02", "AQ-T16-V07", "AQ-T16-V08"]) {
      const q = askingQuestions.find((q) => q.id === id)!;

      expect(
        [isCorrect(q, "Cada cuánto"), isCorrect(q, "cada cuánto tiempo"), isCorrect(q, "cuándo")],
        id,
      ).toEqual([true, true, false]);
    }
  });

  it("notes a missing accent on either cada cuánto form", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T16-V01")!;

    expect([accentOnlyAnswer(q, "cada cuanto"), accentOnlyAnswer(q, "cada cuanto tiempo")]).toEqual(
      ["cada cuánto", "cada cuánto tiempo"],
    );
  });

  it.each([
    ["AQ-T16-E04", "¿Cada cuánto tiempo vas al centro?", "¿Cuándo vas al centro?"],
    ["AQ-T16-V04", "¿Cada cuánto tiempo vas al museo?", "¿Cuándo vas al museo?"],
    ["AQ-T16-V05", "¿Cada cuánto tiempo estudia Pablo español?", "¿Cuándo estudia Pablo español?"],
    ["AQ-T16-V10", "¿Cada cuánto tiempo compra Luis leche?", "¿Cuándo compra Luis leche?"],
    ["AQ-T16-V11", "¿Cada cuánto tiempo tienes clase?", "¿Cuándo tienes clase?"],
  ])(
    "accepts the question with tiempo in %s and rejects the one-event cuándo question",
    (id, longer, once) => {
      const q = askingQuestions.find((q) => q.id === id)!;

      expect([isCorrect(q, longer), isCorrect(q, once)]).toEqual([true, false]);
    },
  );

  it("authors six base items and twelve variations for para qué", () => {
    expect(ids("AQ-T17-E")).toEqual([
      "AQ-T17-E01",
      "AQ-T17-E02",
      "AQ-T17-E03",
      "AQ-T17-E04",
      "AQ-T17-E05",
      "AQ-T17-E06",
    ]);

    expect(ids("AQ-T17-V")).toHaveLength(12);
  });

  it("accepts para qué, notes a missing accent and rejects por qué", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T17-V01")!;

    expect([isCorrect(q, "Para qué"), isCorrect(q, "por qué")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "para que")).toBe("para qué");
  });

  it("accepts the typed purpose question and rejects the broad reason question", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T17-E04")!;

    expect(isCorrect(q, "¿Para qué usas este libro?")).toBe(true);
    expect(isCorrect(q, "¿Por qué usas este libro?")).toBe(false);
  });

  it("authors six base items and twelve variations for por dónde", () => {
    expect(ids("AQ-T18-E")).toEqual([
      "AQ-T18-E01",
      "AQ-T18-E02",
      "AQ-T18-E03",
      "AQ-T18-E04",
      "AQ-T18-E05",
      "AQ-T18-E06",
    ]);

    expect(ids("AQ-T18-V")).toHaveLength(12);
  });

  it("accepts por dónde, notes a missing accent and rejects adónde", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T18-V01")!;

    expect([isCorrect(q, "Por dónde"), isCorrect(q, "adónde")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "por donde")).toBe("por dónde");
  });

  it("accepts the typed route question and rejects the destination question", () => {
    const q = askingQuestions.find((q) => q.id === "AQ-T18-E04")!;

    expect(isCorrect(q, "¿Por dónde vas al hotel?")).toBe(true);
    expect(isCorrect(q, "¿Adónde vas al hotel?")).toBe(false);
  });

  it("gives every exercise but a written dialogue its Spanish question to hear", () => {
    const silent = askingQuestions.filter((q) => !q.pronunciation).map((q) => q.id);

    expect(silent).toEqual([
      "AQ-T01-E05",
      "AQ-T01-V06",
      "AQ-T01-V12",
      "AQ-T02-E05",
      "AQ-T02-V06",
      "AQ-T02-V12",
      "AQ-T03-E05",
      "AQ-T03-V06",
      "AQ-T03-V12",
      "AQ-T04-E05",
      "AQ-T04-V06",
      "AQ-T04-V12",
      "AQ-T05-E05",
      "AQ-T05-V06",
      "AQ-T05-V12",
      "AQ-T06-E05",
      "AQ-T06-V06",
      "AQ-T06-V12",
      "AQ-T07-E05",
      "AQ-T07-V06",
      "AQ-T07-V12",
      "AQ-T08-E05",
      "AQ-T08-V06",
      "AQ-T08-V12",
      "AQ-T09-E05",
      "AQ-T09-V06",
      "AQ-T09-V12",
      "AQ-T10-E05",
      "AQ-T10-V06",
      "AQ-T10-V12",
      "AQ-T11-E05",
      "AQ-T11-V06",
      "AQ-T11-V12",
      "AQ-T12-E05",
      "AQ-T12-V06",
      "AQ-T12-V12",
      "AQ-T13-E05",
      "AQ-T13-V06",
      "AQ-T13-V12",
      "AQ-T14-E05",
      "AQ-T14-V06",
      "AQ-T14-V12",
      "AQ-T15-E05",
      "AQ-T15-V06",
      "AQ-T15-V12",
      "AQ-T16-E05",
      "AQ-T16-V06",
      "AQ-T16-V12",
      "AQ-T17-E05",
      "AQ-T17-V06",
      "AQ-T17-V12",
      "AQ-T18-E05",
      "AQ-T18-V06",
      "AQ-T18-V12",
    ]);

    expect(askingQuestions.find((q) => q.id === "AQ-T01-V08")?.pronunciation).toBe(
      "¿Qué bebida quiere Luis?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T02-V08")?.pronunciation).toBe(
      "¿Cómo va Luis al centro?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T03-V01")?.pronunciation).toBe(
      "¿Dónde está la entrada?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T04-V02")?.pronunciation).toBe(
      "¿Cuándo viene Pablo?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T05-V08")?.pronunciation).toBe(
      "¿Quiénes estudian español?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T06-V08")?.pronunciation).toBe(
      "¿Cuáles de estas tres quiere Pablo?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T07-V02")?.pronunciation).toBe(
      "¿Cuánta leche quiere Pablo?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T08-V02")?.pronunciation).toBe(
      "¿Por qué estudia Pablo en casa?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T09-V02")?.pronunciation).toBe(
      "¿A qué hora viene Pablo?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T10-V01")?.pronunciation).toBe(
      "¿De dónde es Pablo?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T11-V01")?.pronunciation).toBe(
      "¿Adónde va Pablo?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T12-V01")?.pronunciation).toBe(
      "¿Con quién va Pablo?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T13-V02")?.pronunciation).toBe(
      "¿De quién son estas entradas?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T14-V01")?.pronunciation).toBe(
      "¿Desde cuándo vive Pablo en Madrid?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T15-V07")?.pronunciation).toBe(
      "¿Hasta cuándo están Pablo y Luis en Madrid?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T16-V08")?.pronunciation).toBe(
      "¿Cada cuánto van Pablo y Luis en autobús?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T17-V08")?.pronunciation).toBe(
      "¿Para qué usan Pablo y Luis esta sala?",
    );

    expect(askingQuestions.find((q) => q.id === "AQ-T18-V07")?.pronunciation).toBe(
      "¿Por dónde van Pablo y Luis al hotel?",
    );
  });
});
