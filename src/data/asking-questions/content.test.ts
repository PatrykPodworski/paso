import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentOnlyAnswer, isCorrect, normalize } from "../progress";
import type { Question } from "../types";
import { askingLesson, askingLessons, askingQuestions } from "./askingQuestions";

const ids = (prefix: string) =>
  askingQuestions.map((q) => q.id).filter((id) => id.startsWith(prefix));

describe("asking questions content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(bank).toEqual(
      expect.arrayContaining([
        "AQ-T01-N01",
        "AQ-T01-N11",
        "AQ-T02-E02",
        "AQ-T02-N10",
        "AQ-T03-E02",
        "AQ-T03-N10",
        "AQ-T04-V01",
        "AQ-T04-N10",
        "AQ-M02-X01",
        "AQ-M02-X04",
        "AQ-T05-N01",
        "AQ-T05-N11",
        "AQ-T06-N01",
        "AQ-T06-N11",
        "AQ-T07-N01",
        "AQ-T07-N11",
        "AQ-T08-N01",
        "AQ-T08-N11",
        "AQ-M03-X01",
        "AQ-M03-X04",
        "AQ-M04-X01",
        "AQ-M04-X04",
        "AQ-T09-N01",
        "AQ-T09-N11",
        "AQ-T10-N01",
        "AQ-T10-N11",
        "AQ-T11-N01",
        "AQ-T11-N11",
        "AQ-T12-N01",
        "AQ-T12-N11",
        "AQ-M05-X01",
        "AQ-M05-X04",
        "AQ-M06-X01",
        "AQ-M06-X04",
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

    const pronunciation = new Map(askingQuestions.map((q) => [q.id, q.pronunciation]));

    const spoken = {
      "AQ-T01-N05": "¿Qué compra Luis?",
      "AQ-T02-N04": "¿Cómo se llama tu amigo?",
      "AQ-T03-N05": "¿Dónde está la estación?",
      "AQ-T04-N08": "¿Cuándo viene Pablo?",
      "AQ-M02-X03": "¿Cómo estás hoy?",
      "AQ-T05-N06": "¿Quién estudia español?",
      "AQ-T06-N02": "¿Cuál es tu móvil?",
      "AQ-M03-X04": "¿Cuándo vienes a casa?",
      "AQ-T07-N09": "¿Cuánta leche quieres?",
      "AQ-T08-N11": "¿Por qué estás en casa?",
      "AQ-T09-N06": "¿A qué hora empieza la reunión?",
      "AQ-T10-N05": "¿De dónde sale el tren?",
      "AQ-M05-X02": "¿Dónde está Pablo?",
      "AQ-T11-N11": "¿Adónde vas a pie?",
      "AQ-T12-N02": "¿Con quién vas al cine?",
      "AQ-M06-X03": "¿Quién viene a clase?",
      "AQ-T13-V02": "¿De quién son estas entradas?",
      "AQ-T14-V01": "¿Desde cuándo vive Pablo en Madrid?",
      "AQ-T15-V07": "¿Hasta cuándo están Pablo y Luis en Madrid?",
      "AQ-T16-V08": "¿Cada cuánto van Pablo y Luis en autobús?",
      "AQ-T17-V08": "¿Para qué usan Pablo y Luis esta sala?",
      "AQ-T18-V07": "¿Por dónde van Pablo y Luis al hotel?",
    };

    expect(
      Object.fromEntries(Object.keys(spoken).map((id) => [id, pronunciation.get(id)])),
    ).toEqual(spoken);
  });
});

// The lessons rebuilt under #755; each rework slice adds its lessons.
const REWORKED = [
  "aq-m01",
  "aq-m02",
  "aq-mr01",
  "aq-m03",
  "aq-m04",
  "aq-mr02",
  "aq-m05",
  "aq-m06",
  "aq-mr03",
];

const exercisesOf = (id: string) => askingLesson(id).questions.filter((q) => q.kind !== "teach");

// The Spanish sentences an item speaks or accepts as a typed question.
const sentencesOf = (q: Question) =>
  [q.pronunciation, ...(q.questionMarks ? (q.accepted ?? []) : [])]
    .filter((t) => t !== undefined)
    .map(normalize);

// The question words a lesson's introduction and form cards name: "New question words: quién /
// quiénes, cuál", "New forms: cuánta, cuántos, cuántas".
const wordsOf = (id: string) =>
  askingLesson(id)
    .questions.filter((q) => q.kind === "teach")
    .flatMap((q) => q.prompt.split(": ")[1].split(/, | \/ /))
    .map(normalize);

const question = (id: string) => askingQuestions.find((q) => q.id === id)!;

describe("reworked asking questions lessons", () => {
  it("uses each Spanish sentence once in a lesson", () => {
    for (const id of REWORKED) {
      const sentences = exercisesOf(id).flatMap(sentencesOf);
      const repeated = sentences.filter((t, i) => sentences.indexOf(t) !== i);

      expect(repeated, id).toEqual([]);
    }
  });

  it("keeps a translation's answer out of its task", () => {
    for (const id of REWORKED) {
      for (const q of exercisesOf(id).filter((q) => q.questionMarks)) {
        const task = normalize(`${q.instruction} ${q.prompt}`);
        const given = sentencesOf(q).filter((t) => task.includes(t));

        expect(given, q.id).toEqual([]);
        expect(q.prompt, q.id).not.toContain("___");
      }
    }
  });

  it("shows every task apart from its sentence", () => {
    for (const id of REWORKED) {
      for (const q of exercisesOf(id)) {
        expect(q.instruction, q.id).toMatch(/^[A-Z]/);
        expect(q.prompt, q.id).not.toMatch(/^(Choose|Complete|Write|Translate|Put|Arrange)\b/);
      }
    }
  });

  it("puts every item in one lesson", () => {
    const named = askingLessons.flatMap((l) => [...l.recalled, ...l.base, ...l.variations]);

    for (const id of REWORKED) {
      const twice = exercisesOf(id)
        .map((q) => q.id)
        .filter((item) => named.filter((n) => n === item).length !== 1);

      expect(twice, id).toEqual([]);
    }
  });

  it("has no writing task", () => {
    const kinds = new Set(REWORKED.flatMap(exercisesOf).map((q) => q.kind));

    expect([...kinds].sort()).toEqual(["choice", "order", "type"]);
  });

  it("mixes earlier words into every lesson after the first", () => {
    const learning = REWORKED.filter((id) => askingLesson(id).questions[0].kind === "teach");

    const startsWith = (words: string[]) => (t: string) => words.some((w) => t.startsWith(`${w} `));

    for (const [n, id] of learning.entries()) {
      const own = wordsOf(id);
      const earlier = learning.slice(0, n).flatMap(wordsOf);

      const mixedIn = exercisesOf(id)
        .map((q) => q.id)
        .filter((q) => q.startsWith(`AQ-${id.slice(3).toUpperCase()}-X`));

      const earlierWords = exercisesOf(id)
        .filter((q) => {
          const t = normalize(q.pronunciation!);

          return startsWith(earlier)(t) && !startsWith(own)(t);
        })
        .map((q) => q.id);

      expect(earlierWords.sort(), id).toEqual(mixedIn.sort());

      if (n > 0) {
        expect(mixedIn, id).not.toEqual([]);
      }
    }
  });

  it("accepts the typed where question with or without tú and notes a missing accent", () => {
    const q = question("AQ-T03-N03");

    expect([
      isCorrect(q, "¿Dónde vives tú?"),
      isCorrect(q, "¿Dónde vives?"),
      isCorrect(q, "¿Cuándo vives?"),
    ]).toEqual([true, true, false]);

    expect(accentOnlyAnswer(q, "¿Donde vives?")).toBe("¿Dónde vives?");
  });

  it("accepts cuándo, notes a missing accent and rejects dónde in a cuándo gap", () => {
    const q = question("AQ-T04-V01");

    expect([isCorrect(q, "cuándo"), isCorrect(q, "Cuándo"), isCorrect(q, "dónde")]).toEqual([
      true,
      true,
      false,
    ]);

    expect(accentOnlyAnswer(q, "cuando")).toBe("cuándo");
  });

  it("accepts qué before a noun and rejects cuál", () => {
    const q = question("AQ-T01-N08");

    expect([
      isCorrect(q, "¿Qué bebida quieres?"),
      isCorrect(q, "¿Qué bebida quieres tú?"),
      isCorrect(q, "¿Cuál bebida quieres?"),
    ]).toEqual([true, true, false]);
  });

  it("accepts teléfono for móvil and rejects ser for a location", () => {
    const q = question("AQ-T03-N07");

    expect([
      isCorrect(q, "¿Dónde está mi teléfono?"),
      isCorrect(q, "¿Dónde está mi móvil?"),
      isCorrect(q, "¿Dónde es mi móvil?"),
    ]).toEqual([true, true, false]);
  });

  it("accepts the phone number question with móvil and rejects qué with ser", () => {
    const q = question("AQ-T06-N04");

    expect([
      isCorrect(q, "¿Cuál es tu número de móvil?"),
      isCorrect(q, "¿Qué es tu número de teléfono?"),
    ]).toEqual([true, false]);
  });

  it("accepts quiénes, notes a missing accent and rejects quién in a plural gap", () => {
    const q = question("AQ-T05-N03");

    expect([isCorrect(q, "quiénes"), isCorrect(q, "quién")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "quienes")).toBe("quiénes");
  });

  it("accepts cuánta before a feminine noun and rejects cuánto", () => {
    const q = question("AQ-T07-N04");

    expect([isCorrect(q, "¿Cuánta agua quieres?"), isCorrect(q, "¿Cuánto agua quieres?")]).toEqual([
      true,
      false,
    ]);
  });

  it("accepts por qué, notes a missing accent and rejects the reply connector porque", () => {
    const q = question("AQ-T08-N03");

    expect([isCorrect(q, "por qué"), isCorrect(q, "porque")]).toEqual([true, false]);
    expect(accentOnlyAnswer(q, "por que")).toBe("por qué");
  });

  it("accepts a second word order for the why question and rejects para qué", () => {
    const q = question("AQ-T08-N07");

    expect([
      isCorrect(q, "¿Por qué Pablo está en casa?"),
      isCorrect(q, "¿Para qué está Pablo en casa?"),
    ]).toEqual([true, false]);
  });

  it("accepts both destination spellings in the where-to translation and rejects dónde and de dónde", () => {
    const q = question("AQ-T11-N04");

    expect([
      isCorrect(q, "¿A dónde vas?"),
      isCorrect(q, "¿Adónde vas tú?"),
      isCorrect(q, "¿Dónde vas?"),
      isCorrect(q, "¿De dónde vas?"),
    ]).toEqual([true, true, false, false]);

    expect(accentOnlyAnswer(q, "¿Adonde vas?")).toBe("¿Adónde vas?");
  });

  it("accepts adónde and a dónde, notes a missing accent and rejects dónde in a destination gap", () => {
    const q = question("AQ-T11-N03");

    expect([isCorrect(q, "adónde"), isCorrect(q, "a dónde"), isCorrect(q, "dónde")]).toEqual([
      true,
      true,
      false,
    ]);

    expect(accentOnlyAnswer(q, "a donde")).toBe("a dónde");
  });

  it("accepts con quién or con quiénes when the English leaves the number open and rejects quién alone", () => {
    const q = question("AQ-T12-N04");

    expect([
      isCorrect(q, "¿Con quiénes vives?"),
      isCorrect(q, "¿Con quién vives tú?"),
      isCorrect(q, "¿Quién vives?"),
    ]).toEqual([true, true, false]);
  });

  it("accepts con quiénes for several companions and rejects the singular", () => {
    const q = question("AQ-T12-N03");

    expect([isCorrect(q, "con quiénes"), isCorrect(q, "con quién")]).toEqual([true, false]);
  });

  it("accepts a qué hora for a clock time and rejects cuándo", () => {
    const q = question("AQ-T09-N04");

    expect([
      isCorrect(q, "¿A qué hora abre el museo?"),
      isCorrect(q, "¿Cuándo abre el museo?"),
    ]).toEqual([true, false]);
  });
});
