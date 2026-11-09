import { describe, expect, it } from "vitest";
import { randomFrom } from "../random";
import { askingLesson, askingUnits, lessonFrom } from "./askingQuestions";
import { l01 } from "./t01";

const variations = Array.from(
  { length: 12 },
  (_, i) => `AQ-T01-V${String(i + 1).padStart(2, "0")}`,
);

describe("asking questions lessons", () => {
  it("opens L01 on its introduction, then the base items in order, then every variation", () => {
    const lesson = askingLesson("aq-l01", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l01",
      title: "Asking for things",
      subtitle: "Learn one new question word",
    });

    expect(lesson.questions[0].kind).toBe("teach");

    expect(ids.slice(1, 6)).toEqual([
      "AQ-T01-E01",
      "AQ-T01-E02",
      "AQ-T01-E03",
      "AQ-T01-E04",
      "AQ-T01-E05",
    ]);

    expect([...ids.slice(6)].sort()).toEqual(variations);
  });

  it("draws a new variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l01", randomFrom(seed))
        .questions.slice(6)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("shows a form card just before the exercise it introduces", () => {
    const lesson = lessonFrom(
      {
        ...l01,
        recalled: ["AQ-T01-E06"],
        formCards: [{ before: "AQ-T01-E03", heading: "Qué before a noun", text: "¿Qué bebida?" }],
      },
      randomFrom(1),
    );

    expect(lesson.questions.slice(0, 6).map((q) => [q.id, q.kind])).toEqual([
      ["AQ-T01-E06", "choice"],
      ["AQ-T01-INTRO", "teach"],
      ["AQ-T01-E01", "choice"],
      ["AQ-T01-E02", "type"],
      ["AQ-T01-E03-FORM", "teach"],
      ["AQ-T01-E03", "order"],
    ]);
  });

  it("opens L02 on the recalled qué item, then cómo's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l02", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({ id: "aq-l02", title: "Asking how" });

    expect(ids.slice(0, 9)).toEqual([
      "AQ-T01-E04",
      "AQ-T02-INTRO",
      "AQ-T02-E01",
      "AQ-T02-E02",
      "AQ-T02-E03",
      "AQ-T02-E04",
      "AQ-T02-E05",
      "AQ-T01-E06",
      "AQ-T02-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Cómo te llamas?"),
    });

    expect([...ids.slice(9)].sort()).toEqual(variations.map((id) => id.replace("T01", "T02")));
  });

  it("draws a new L02 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l02", randomFrom(seed))
        .questions.slice(9)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L03 on the recalled cómo item, then dónde's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l03", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({ id: "aq-l03", title: "Asking where" });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T02-E04",
      "AQ-T03-INTRO",
      "AQ-T03-E01",
      "AQ-T03-E02",
      "AQ-T03-E03",
      "AQ-T03-E04",
      "AQ-T03-E05",
      "AQ-T03-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Dónde está el baño?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T03")));
  });

  it("draws a new L03 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l03", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L04 on the recalled dónde item, then cuándo's introduction, base items and variations", () => {
    const lesson = askingLesson("aq-l04", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({ id: "aq-l04", title: "Asking when" });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T03-E04",
      "AQ-T04-INTRO",
      "AQ-T04-E01",
      "AQ-T04-E02",
      "AQ-T04-E03",
      "AQ-T04-E04",
      "AQ-T04-E05",
      "AQ-T04-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Cuándo empieza la clase?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T04")));
  });

  it("draws a new L04 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l04", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens R01 on unit 1's base items, without an introduction, then eight variations", () => {
    const lesson = askingLesson("aq-r01", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-r01",
      title: "Review: unit 1",
      subtitle: "Review lessons 1–4",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T01-E04",
      "AQ-T02-E04",
      "AQ-T03-E04",
      "AQ-T04-E04",
      "AQ-T01-E06",
      "AQ-T02-E06",
      "AQ-T03-E06",
      "AQ-T04-E06",
    ]);

    expect([...ids.slice(8)].sort()).toEqual([
      "AQ-T01-V04",
      "AQ-T01-V10",
      "AQ-T02-V04",
      "AQ-T02-V10",
      "AQ-T03-V04",
      "AQ-T03-V10",
      "AQ-T04-V04",
      "AQ-T04-V10",
    ]);
  });

  it("draws a new R01 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-r01", randomFrom(seed))
        .questions.slice(8)
        .map((q) => q.id)
        .join(),
    );

    expect(new Set(orders).size).toBe(3);
  });

  it("opens L05 on the recalled cuándo item, then quién's introduction, base items with the quiénes card, and variations", () => {
    const lesson = askingLesson("aq-l05", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({ id: "aq-l05", title: "Asking who" });

    expect(ids.slice(0, 9)).toEqual([
      "AQ-T04-E04",
      "AQ-T05-INTRO",
      "AQ-T05-E01",
      "AQ-T05-E02",
      "AQ-T05-E03-FORM",
      "AQ-T05-E03",
      "AQ-T05-E04",
      "AQ-T05-E05",
      "AQ-T05-E06",
    ]);

    expect(lesson.questions[1]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Quién es? / ¿Quiénes son?"),
    });

    expect(lesson.questions[4]).toMatchObject({
      kind: "teach",
      explanation: expect.stringContaining("Example: ¿Quiénes son?"),
    });

    expect([...ids.slice(9)].sort()).toEqual(variations.map((id) => id.replace("T01", "T05")));
  });

  it("draws a new L05 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l05", randomFrom(seed))
        .questions.slice(9)
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
      title: "Review: unit 2",
      subtitle: "Review lessons 5–8",
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
      title: "Review: unit 3",
      subtitle: "Review lessons 9–12",
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

  it("lists unit 1 with L01 to L04 and R01, unit 2 with L05 to L08 and R02, unit 3 with L09 to L12 and R03, and unit 4 with L13 to L16", () => {
    expect(askingUnits.map((u) => [u.title, u.lessons.map((l) => l.id)])).toEqual([
      ["Unit 1", ["aq-l01", "aq-l02", "aq-l03", "aq-l04", "aq-r01"]],
      ["Unit 2", ["aq-l05", "aq-l06", "aq-l07", "aq-l08", "aq-r02"]],
      ["Unit 3", ["aq-l09", "aq-l10", "aq-l11", "aq-l12", "aq-r03"]],
      ["Unit 4", ["aq-l13", "aq-l14", "aq-l15", "aq-l16"]],
    ]);
  });
});
