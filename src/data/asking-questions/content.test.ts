import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentOnlyAnswer, isCorrect, normalize } from "../progress";
import type { Question } from "../types";
import { askingLesson, askingLessons, askingQuestions } from "./askingQuestions";

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
        "AQ-T13-N01",
        "AQ-T13-N09",
        "AQ-T14-N01",
        "AQ-T14-N09",
        "AQ-T15-N01",
        "AQ-T15-N09",
        "AQ-T16-N01",
        "AQ-T16-N09",
        "AQ-T17-N01",
        "AQ-T17-N09",
        "AQ-T18-N01",
        "AQ-T18-N09",
        "AQ-M07-X01",
        "AQ-M07-X03",
        "AQ-M08-X01",
        "AQ-M08-X03",
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

  it("gives every exercise its Spanish question to hear", () => {
    const silent = askingQuestions.filter((q) => !q.pronunciation).map((q) => q.id);

    expect(silent).toEqual([]);

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
      "AQ-T13-N03": "¿De quiénes es esta casa?",
      "AQ-T14-N06": "¿Desde cuándo estás aquí?",
      "AQ-T15-N07": "¿Hasta cuándo están Pablo y Luis en el museo?",
      "AQ-T16-N08": "¿Cada cuánto van Pablo y Luis al parque?",
      "AQ-M07-X02": "¿A qué hora tienes clase?",
      "AQ-T17-N06": "¿Para qué quieres el pan?",
      "AQ-T18-N07": "¿Por dónde van Pablo y Luis al hotel?",
      "AQ-M08-X03": "¿Adónde vas mañana?",
    };

    expect(
      Object.fromEntries(Object.keys(spoken).map((id) => [id, pronunciation.get(id)])),
    ).toEqual(spoken);
  });
});

const LESSONS = askingLessons.map((l) => l.id);

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

describe("asking questions lessons", () => {
  it("uses each Spanish sentence once in a lesson", () => {
    for (const id of LESSONS) {
      const sentences = exercisesOf(id).flatMap(sentencesOf);
      const repeated = sentences.filter((t, i) => sentences.indexOf(t) !== i);

      expect(repeated, id).toEqual([]);
    }
  });

  it("keeps a translation's answer out of its task", () => {
    for (const id of LESSONS) {
      for (const q of exercisesOf(id).filter((q) => q.questionMarks)) {
        const task = normalize(`${q.instruction} ${q.context ?? ""} ${q.prompt}`);
        const given = sentencesOf(q).filter((t) => task.includes(t));

        expect(given, q.id).toEqual([]);
        expect(q.prompt, q.id).not.toContain("___");
      }
    }
  });

  it("shows every task apart from its sentence", () => {
    for (const id of LESSONS) {
      for (const q of exercisesOf(id)) {
        expect(q.instruction, q.id).toMatch(/^[A-Z]/);
        expect(q.prompt, q.id).not.toMatch(/^(Choose|Complete|Write|Translate|Put|Arrange)\b/);
      }
    }
  });

  it("puts every item in one lesson", () => {
    const named = askingLessons.flatMap((l) => [...l.recalled, ...l.base, ...l.variations]);

    for (const id of LESSONS) {
      const twice = exercisesOf(id)
        .map((q) => q.id)
        .filter((item) => named.filter((n) => n === item).length !== 1);

      expect(twice, id).toEqual([]);
    }
  });

  it("has no writing task", () => {
    const kinds = new Set(LESSONS.flatMap(exercisesOf).map((q) => q.kind));

    expect([...kinds].sort()).toEqual(["choice", "order", "type"]);
  });

  it("mixes earlier words into every lesson after the first", () => {
    const learning = LESSONS.filter((id) => askingLesson(id).questions[0].kind === "teach");

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

  it("lists each new word of an introduction card on its own row", () => {
    for (const id of LESSONS) {
      const intro = askingLesson(id).questions.find((q) => q.id.endsWith("-INTRO"));

      if (intro) {
        const words = intro.prompt.split(": ")[1].split(", ");

        expect(
          intro.teach?.terms?.map((t) => t.es),
          id,
        ).toEqual(words);
      }
    }
  });

  it("gives every form card a rule and translated examples instead of a paragraph", () => {
    const forms = LESSONS.flatMap((id) =>
      askingLesson(id).questions.filter((q) => q.id.endsWith("-FORM")),
    );

    for (const q of forms) {
      expect(q.explanation, q.id).toBe("");
      expect(q.teach?.rule, q.id).toMatch(/^[A-Z].*\.$/);
      expect(q.teach?.examples?.length, q.id).toBeGreaterThan(0);
    }

    expect(forms.map((q) => q.id)).toEqual([
      "AQ-T05-N03-FORM",
      "AQ-T06-N03-FORM",
      "AQ-T07-N03-FORM",
      "AQ-T12-N03-FORM",
      "AQ-T16-N03-FORM",
      "AQ-T13-N03-FORM",
    ]);
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

  it("accepts the how-often translation with tiempo or tú and rejects cuándo", () => {
    const q = question("AQ-T16-N04");

    expect([
      isCorrect(q, "¿Cada cuánto tiempo vas al museo?"),
      isCorrect(q, "¿Cada cuánto vas tú al museo?"),
      isCorrect(q, "¿Cuándo vas al museo?"),
    ]).toEqual([true, true, false]);
  });

  it("accepts cada cuánto with or without tiempo, notes a missing accent and rejects cuándo", () => {
    const q = question("AQ-T16-N03");

    expect([
      isCorrect(q, "cada cuánto"),
      isCorrect(q, "cada cuánto tiempo"),
      isCorrect(q, "cada cuanto"),
      isCorrect(q, "cuándo"),
    ]).toEqual([true, true, true, false]);

    expect(accentOnlyAnswer(q, "cada cuanto")).toBe("cada cuánto");
  });

  it("accepts hasta cuándo for an end point and rejects desde cuándo", () => {
    const q = question("AQ-T15-N04");

    expect([
      isCorrect(q, "¿Hasta cuándo estás en Madrid?"),
      isCorrect(q, "¿Desde cuándo estás en Madrid?"),
    ]).toEqual([true, false]);
  });

  it("accepts para qué for a purpose and rejects por qué", () => {
    const q = question("AQ-T17-N04");

    expect([
      isCorrect(q, "¿Para qué usas la mochila?"),
      isCorrect(q, "¿Por qué usas la mochila?"),
    ]).toEqual([true, false]);
  });

  it("accepts por dónde for a route and rejects adónde", () => {
    const q = question("AQ-T18-N04");

    expect([
      isCorrect(q, "¿Por dónde vas a la estación?"),
      isCorrect(q, "¿Adónde vas a la estación?"),
    ]).toEqual([true, false]);
  });

  it("accepts de quiénes for several owners and rejects the singular", () => {
    const q = question("AQ-T13-N03");

    expect([isCorrect(q, "de quiénes"), isCorrect(q, "de quién")]).toEqual([true, false]);
  });

  it("accepts cuánto for a price and rejects cuántas", () => {
    const q = question("AQ-M07-X03");

    expect([
      isCorrect(q, "¿Cuánto cuestan las camisetas?"),
      isCorrect(q, "¿Cuántas cuestan las camisetas?"),
    ]).toEqual([true, false]);
  });
});
