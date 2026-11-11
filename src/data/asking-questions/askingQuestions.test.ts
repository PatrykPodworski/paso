import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { askingLesson, askingUnits, lessonFrom } from "./askingQuestions";
import { m01 } from "./m01";

const variations = Array.from(
  { length: 12 },
  (_, i) => `AQ-T01-V${String(i + 1).padStart(2, "0")}`,
);

const ordersOf = (id: string, from: number) =>
  [1, 2, 3].map((seed) =>
    askingLesson(id, randomFrom(seed))
      .questions.slice(from)
      .map((q) => q.id)
      .join(),
  );

describe("asking questions lessons", () => {
  it("opens M01 on its introduction, then its base items in order, then its variations", () => {
    const lesson = askingLesson("aq-m01", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-m01",
      title: "What and how",
      subtitle: "Learn two question words: qué, cómo",
    });

    expect(lesson.questions[0]).toMatchObject({
      id: "AQ-M01-INTRO",
      kind: "teach",
      prompt: "New question words: qué, cómo",
    });

    expect(ids.slice(1, 9)).toEqual([
      "AQ-T01-N01",
      "AQ-T02-N01",
      "AQ-T01-N02",
      "AQ-T02-N02",
      "AQ-T01-N03",
      "AQ-T02-E02",
      "AQ-T01-N04",
      "AQ-T02-N03",
    ]);

    expect([...ids.slice(9)].sort()).toEqual([
      "AQ-T01-N05",
      "AQ-T01-N06",
      "AQ-T01-N07",
      "AQ-T01-N08",
      "AQ-T02-N04",
      "AQ-T02-N05",
      "AQ-T02-N06",
      "AQ-T02-N07",
    ]);

    expect(new Set(ordersOf("aq-m01", 9)).size).toBe(3);
  });

  it("shows a form card just before the exercise it introduces", () => {
    const lesson = lessonFrom(
      {
        ...m01,
        formCards: [{ before: "AQ-T01-N02", heading: "Qué before a noun", text: "¿Qué bebida?" }],
      },
      randomFrom(1),
    );

    expect(lesson.questions.slice(0, 6).map((q) => [q.id, q.kind])).toEqual([
      ["AQ-M01-INTRO", "teach"],
      ["AQ-T01-N01", "choice"],
      ["AQ-T02-N01", "choice"],
      ["AQ-T01-N02-FORM", "teach"],
      ["AQ-T01-N02", "choice"],
      ["AQ-T02-N02", "choice"],
    ]);
  });

  it("opens M02 on its introduction, then its base items in order, then its variations", () => {
    const lesson = askingLesson("aq-m02", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-m02",
      title: "Where and when",
      subtitle: "Learn dónde and cuándo, mixed with qué and cómo",
    });

    expect(lesson.questions[0]).toMatchObject({
      id: "AQ-M02-INTRO",
      kind: "teach",
      prompt: "New question words: dónde, cuándo",
    });

    expect(ids.slice(1, 9)).toEqual([
      "AQ-T03-N01",
      "AQ-T04-N01",
      "AQ-T03-N02",
      "AQ-T04-N02",
      "AQ-T03-E02",
      "AQ-T04-V01",
      "AQ-T03-N03",
      "AQ-T04-N03",
    ]);

    expect([...ids.slice(9)].sort()).toEqual([
      "AQ-M02-X01",
      "AQ-M02-X02",
      "AQ-M02-X03",
      "AQ-M02-X04",
      "AQ-T03-N04",
      "AQ-T03-N05",
      "AQ-T03-N06",
      "AQ-T03-N07",
      "AQ-T04-N04",
      "AQ-T04-N05",
      "AQ-T04-N06",
      "AQ-T04-N07",
    ]);

    expect(new Set(ordersOf("aq-m02", 9)).size).toBe(3);
  });

  it("opens MR01 without an introduction on its twelve items in a drawn order", () => {
    const lesson = askingLesson("aq-mr01", randomFrom(1));

    expect(lesson).toMatchObject({
      id: "aq-mr01",
      title: "Unit review",
      subtitle: "Review this unit's lessons",
    });

    expect(lesson.questions.map((q) => q.id).sort()).toEqual([
      "AQ-T01-N09",
      "AQ-T01-N10",
      "AQ-T01-N11",
      "AQ-T02-N08",
      "AQ-T02-N09",
      "AQ-T02-N10",
      "AQ-T03-N08",
      "AQ-T03-N09",
      "AQ-T03-N10",
      "AQ-T04-N08",
      "AQ-T04-N09",
      "AQ-T04-N10",
    ]);

    expect(new Set(ordersOf("aq-mr01", 0)).size).toBe(3);
  });

  it("opens L05 on quién's introduction, then base items with the quiénes card, and variations", () => {
    const lesson = askingLesson("aq-l05", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({ id: "aq-l05", title: "Asking who" });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T05-INTRO",
      "AQ-T05-E01",
      "AQ-T05-E02",
      "AQ-T05-E03-FORM",
      "AQ-T05-E03",
      "AQ-T05-E04",
      "AQ-T05-E05",
      "AQ-T05-E06",
    ]);

    expect(lesson.questions[0]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Quién es? / ¿Quiénes son?"),
    });

    expect(lesson.questions[3]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Quiénes son?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T05")));
  });

  it("draws a new L05 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l05", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L06 on the recalled quiénes item, then cuál's introduction, base items with the cuáles card, and variations", () => {
    const lesson = askingLesson("aq-l06", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({ id: "aq-l06", title: "Asking which one" });

    expect(ids.slice(0, 9)).toEqual([
      "AQ-T05-E04",
      "AQ-T06-INTRO",
      "AQ-T06-E01",
      "AQ-T06-E02",
      "AQ-T06-E03-FORM",
      "AQ-T06-E03",
      "AQ-T06-E04",
      "AQ-T06-E05",
      "AQ-T06-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Cuál de estos dos quieres?"),
    });

    expect(lesson.questions[4]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Cuáles de estos tres quieres?"),
    });

    expect([...ids.slice(9)].sort()).toEqual(variations.map((id) => id.replace("T01", "T06")));
  });

  it("draws a new L06 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l06", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L07 on the recalled cuál item, then cuánto's introduction, base items with three form cards, and variations", () => {
    const lesson = askingLesson("aq-l07", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({ id: "aq-l07", title: "Asking how much and how many" });

    expect(ids.slice(0, 11)).toEqual([
      "AQ-T06-E04",
      "AQ-T07-INTRO",
      "AQ-T07-E01",
      "AQ-T07-E02-FORM",
      "AQ-T07-E02",
      "AQ-T07-E03-FORM",
      "AQ-T07-E03",
      "AQ-T07-E04-FORM",
      "AQ-T07-E04",
      "AQ-T07-E05",
      "AQ-T07-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining(
        "Example: ¿Cuánto cuesta? / ¿Cuánta agua quieres? / ¿Cuántos libros tienes? / ¿Cuántas entradas quieres?",
      ),
    });

    expect([3, 5, 7].map((i) => lesson.questions[i])).toMatchObject([
      { kind: "teach", prompt: "New form: cuánta" },
      { kind: "teach", prompt: "New form: cuántos" },
      { kind: "teach", prompt: "New form: cuántas" },
    ]);

    expect([...ids.slice(11)].sort()).toEqual(variations.map((id) => id.replace("T01", "T07")));
  });

  it("draws a new L07 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l07", randomFrom(seed))
        .questions.slice(11)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L08 on the recalled cuántas item, then por qué's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l08", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l08",
      title: "Asking why",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T07-E04",
      "AQ-T08-INTRO",
      "AQ-T08-E01",
      "AQ-T08-E02",
      "AQ-T08-E03",
      "AQ-T08-E04",
      "AQ-T08-E05",
      "AQ-T08-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: por qué",
      explanation: expect.stringContaining("Example: ¿Por qué estudias español?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T08")));
  });

  it("draws a new L08 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l08", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens R02 on unit 2's base items, without an introduction, then eight variations", () => {
    const lesson = askingLesson("aq-r02", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-r02",
      title: "Unit review",
      subtitle: "Review this unit's lessons",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T05-E04",
      "AQ-T06-E04",
      "AQ-T07-E04",
      "AQ-T08-E04",
      "AQ-T05-E06",
      "AQ-T06-E06",
      "AQ-T07-E06",
      "AQ-T08-E06",
    ]);

    expect([...ids.slice(8)].sort()).toEqual([
      "AQ-T05-V04",
      "AQ-T05-V10",
      "AQ-T06-V04",
      "AQ-T06-V10",
      "AQ-T07-V04",
      "AQ-T07-V10",
      "AQ-T08-V04",
      "AQ-T08-V10",
    ]);
  });

  it("draws a new R02 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-r02", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L09 on the recalled por qué item, then a qué hora's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l09", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l09",
      title: "Asking what time",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T08-E04",
      "AQ-T09-INTRO",
      "AQ-T09-E01",
      "AQ-T09-E02",
      "AQ-T09-E03",
      "AQ-T09-E04",
      "AQ-T09-E05",
      "AQ-T09-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: a qué hora",
      explanation: expect.stringContaining("Example: ¿A qué hora empieza la clase?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T09")));
  });

  it("draws a new L09 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l09", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L10 on the recalled a qué hora item, then de dónde's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l10", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l10",
      title: "Asking where from",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T09-E04",
      "AQ-T10-INTRO",
      "AQ-T10-E01",
      "AQ-T10-E02",
      "AQ-T10-E03",
      "AQ-T10-E04",
      "AQ-T10-E05",
      "AQ-T10-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: de dónde",
      explanation: expect.stringContaining("Example: ¿De dónde eres?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T10")));
  });

  it("draws a new L10 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l10", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L11 on the recalled de dónde item, then adónde's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l11", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l11",
      title: "Asking where to",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T10-E04",
      "AQ-T11-INTRO",
      "AQ-T11-E01",
      "AQ-T11-E02",
      "AQ-T11-E03",
      "AQ-T11-E04",
      "AQ-T11-E05",
      "AQ-T11-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: adónde / a dónde",
      explanation: expect.stringContaining("Example: ¿Adónde vas?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T11")));
  });

  it("draws a new L11 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l11", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L12 on the recalled adónde item, then con quién's introduction, base items with the con quiénes card, and variations", () => {
    const lesson = askingLesson("aq-l12", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l12",
      title: "Asking who with",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 9)).toEqual([
      "AQ-T11-E04",
      "AQ-T12-INTRO",
      "AQ-T12-E01",
      "AQ-T12-E02",
      "AQ-T12-E03-FORM",
      "AQ-T12-E03",
      "AQ-T12-E04",
      "AQ-T12-E05",
      "AQ-T12-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: con quién / con quiénes",
      explanation: expect.stringContaining("Example: ¿Con quién vas?"),
    });

    expect(lesson.questions[4]).toMatchObject({
      kind: "teach",
      prompt: "New form: con quiénes",
      explanation: expect.stringContaining("Example: ¿Con quiénes vas?"),
    });

    expect([...ids.slice(9)].sort()).toEqual(variations.map((id) => id.replace("T01", "T12")));
  });

  it("draws a new L12 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l12", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens R03 on unit 3's base items, without an introduction, then eight variations", () => {
    const lesson = askingLesson("aq-r03", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-r03",
      title: "Unit review",
      subtitle: "Review this unit's lessons",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T09-E04",
      "AQ-T10-E04",
      "AQ-T11-E04",
      "AQ-T12-E04",
      "AQ-T09-E06",
      "AQ-T10-E06",
      "AQ-T11-E06",
      "AQ-T12-E06",
    ]);

    expect([...ids.slice(8)].sort()).toEqual([
      "AQ-T09-V04",
      "AQ-T09-V10",
      "AQ-T10-V04",
      "AQ-T10-V10",
      "AQ-T11-V04",
      "AQ-T11-V10",
      "AQ-T12-V04",
      "AQ-T12-V10",
    ]);
  });

  it("draws a new R03 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-r03", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L13 on the recalled con quién item, then de quién's introduction, base items with the de quiénes card, and variations", () => {
    const lesson = askingLesson("aq-l13", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l13",
      title: "Asking whose",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 9)).toEqual([
      "AQ-T12-E04",
      "AQ-T13-INTRO",
      "AQ-T13-E01",
      "AQ-T13-E02",
      "AQ-T13-E03-FORM",
      "AQ-T13-E03",
      "AQ-T13-E04",
      "AQ-T13-E05",
      "AQ-T13-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: de quién / de quiénes",
      explanation: expect.stringContaining("Example: ¿De quién es este libro?"),
    });

    expect(lesson.questions[4]).toMatchObject({
      kind: "teach",
      prompt: "New form: de quiénes",
      explanation: expect.stringContaining("Example: ¿De quiénes es este libro?"),
    });

    expect([...ids.slice(9)].sort()).toEqual(variations.map((id) => id.replace("T01", "T13")));
  });

  it("draws a new L13 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l13", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L14 on the recalled de quién item, then desde cuándo's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l14", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l14",
      title: "Asking since when",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T13-E04",
      "AQ-T14-INTRO",
      "AQ-T14-E01",
      "AQ-T14-E02",
      "AQ-T14-E03",
      "AQ-T14-E04",
      "AQ-T14-E05",
      "AQ-T14-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: desde cuándo",
      explanation: expect.stringContaining("Example: ¿Desde cuándo vives aquí?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T14")));
  });

  it("draws a new L14 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l14", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L15 on the recalled desde cuándo item, then hasta cuándo's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l15", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l15",
      title: "Asking until when",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T14-E04",
      "AQ-T15-INTRO",
      "AQ-T15-E01",
      "AQ-T15-E02",
      "AQ-T15-E03",
      "AQ-T15-E04",
      "AQ-T15-E05",
      "AQ-T15-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: hasta cuándo",
      explanation: expect.stringContaining("Example: ¿Hasta cuándo estás en Madrid?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T15")));
  });

  it("draws a new L15 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l15", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L16 on the recalled hasta cuándo item, then cada cuánto's introduction, base items with the cada cuánto tiempo card, and variations", () => {
    const lesson = askingLesson("aq-l16", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l16",
      title: "Asking how often",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 9)).toEqual([
      "AQ-T15-E04",
      "AQ-T16-INTRO",
      "AQ-T16-E01",
      "AQ-T16-E02-FORM",
      "AQ-T16-E02",
      "AQ-T16-E03",
      "AQ-T16-E04",
      "AQ-T16-E05",
      "AQ-T16-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: cada cuánto",
      explanation: expect.stringContaining("Example: ¿Cada cuánto vienes?"),
    });

    expect(lesson.questions[3]).toMatchObject({
      kind: "teach",
      prompt: "New form: cada cuánto tiempo",
      explanation: expect.stringContaining("Example: ¿Cada cuánto tiempo vienes?"),
    });

    expect([...ids.slice(9)].sort()).toEqual(variations.map((id) => id.replace("T01", "T16")));
  });

  it("draws a new L16 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l16", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L17 on the recalled cada cuánto item, then para qué's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l17", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l17",
      title: "Asking what for",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T16-E04",
      "AQ-T17-INTRO",
      "AQ-T17-E01",
      "AQ-T17-E02",
      "AQ-T17-E03",
      "AQ-T17-E04",
      "AQ-T17-E05",
      "AQ-T17-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: para qué",
      explanation: expect.stringContaining("Example: ¿Para qué usas el móvil?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T17")));
  });

  it("draws a new L17 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l17", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L18 on the recalled para qué item, then por dónde's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l18", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l18",
      title: "Asking which way",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T17-E04",
      "AQ-T18-INTRO",
      "AQ-T18-E01",
      "AQ-T18-E02",
      "AQ-T18-E03",
      "AQ-T18-E04",
      "AQ-T18-E05",
      "AQ-T18-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      prompt: "New question word: por dónde",
      explanation: expect.stringContaining("Example: ¿Por dónde vas al centro?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T18")));
  });

  it("draws a new L18 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l18", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens R04 on unit 4's base items, without an introduction, then twelve variations", () => {
    const lesson = askingLesson("aq-r04", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-r04",
      title: "Unit review",
      subtitle: "Review this unit's lessons",
    });

    expect(ids.slice(0, 12)).toEqual([
      "AQ-T13-E04",
      "AQ-T14-E04",
      "AQ-T15-E04",
      "AQ-T16-E04",
      "AQ-T17-E04",
      "AQ-T18-E04",
      "AQ-T13-E06",
      "AQ-T14-E06",
      "AQ-T15-E06",
      "AQ-T16-E06",
      "AQ-T17-E06",
      "AQ-T18-E06",
    ]);

    expect([...ids.slice(12)].sort()).toEqual([
      "AQ-T13-V04",
      "AQ-T13-V10",
      "AQ-T14-V04",
      "AQ-T14-V10",
      "AQ-T15-V04",
      "AQ-T15-V10",
      "AQ-T16-V04",
      "AQ-T16-V10",
      "AQ-T17-V04",
      "AQ-T17-V10",
      "AQ-T18-V04",
      "AQ-T18-V10",
    ]);
  });

  it("draws a new R04 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-r04", randomFrom(seed))
        .questions.slice(12)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("lists unit 1 with M01, M02 and MR01, unit 2 with L05 to L08 and R02, unit 3 with L09 to L12 and R03, and unit 4 with L13 to L18 and R04", () => {
    expect(askingUnits.map((u) => [u.id, u.lessons.map((l) => l.id)])).toEqual([
      ["aq-u1", ["aq-m01", "aq-m02", "aq-mr01"]],
      ["aq-u2", ["aq-l05", "aq-l06", "aq-l07", "aq-l08", "aq-r02"]],
      ["aq-u3", ["aq-l09", "aq-l10", "aq-l11", "aq-l12", "aq-r03"]],
      ["aq-u4", ["aq-l13", "aq-l14", "aq-l15", "aq-l16", "aq-l17", "aq-l18", "aq-r04"]],
    ]);
  });
});
