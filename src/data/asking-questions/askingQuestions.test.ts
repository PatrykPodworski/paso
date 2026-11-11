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

  it("opens M03 on its introduction, then its base items in order, with the form cards just before AQ-T05-N03 and AQ-T06-N03, then its variations", () => {
    const lesson = askingLesson("aq-m03", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-m03",
      title: "Who and which",
      subtitle: "Learn quién and cuál, mixed with earlier words",
    });

    expect(lesson.questions[0]).toMatchObject({
      id: "AQ-M03-INTRO",
      kind: "teach",
      prompt: "New question words: quién, cuál",
    });

    expect(lesson.questions.slice(1, 11).map((q) => [q.id, q.kind])).toEqual([
      ["AQ-T05-N01", "choice"],
      ["AQ-T06-N01", "choice"],
      ["AQ-T05-N02", "choice"],
      ["AQ-T06-N02", "choice"],
      ["AQ-T05-N03-FORM", "teach"],
      ["AQ-T05-N03", "type"],
      ["AQ-T06-N03-FORM", "teach"],
      ["AQ-T06-N03", "type"],
      ["AQ-T05-N04", "type"],
      ["AQ-T06-N04", "type"],
    ]);

    expect([...ids.slice(11)].sort()).toEqual([
      "AQ-M03-X01",
      "AQ-M03-X02",
      "AQ-M03-X03",
      "AQ-M03-X04",
      "AQ-T05-N05",
      "AQ-T05-N06",
      "AQ-T05-N07",
      "AQ-T05-N08",
      "AQ-T06-N05",
      "AQ-T06-N06",
      "AQ-T06-N07",
      "AQ-T06-N08",
    ]);

    expect(new Set(ordersOf("aq-m03", 11)).size).toBe(3);
  });

  it("opens M04 on its introduction, then its base items in order, with the form card just before AQ-T07-N03, then its variations", () => {
    const lesson = askingLesson("aq-m04", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-m04",
      title: "How much and why",
      subtitle: "Learn cuánto and por qué, mixed with earlier words",
    });

    expect(lesson.questions[0]).toMatchObject({
      id: "AQ-M04-INTRO",
      kind: "teach",
      prompt: "New question words: cuánto, por qué",
    });

    expect(lesson.questions.slice(1, 10).map((q) => [q.id, q.kind])).toEqual([
      ["AQ-T07-N01", "choice"],
      ["AQ-T08-N01", "choice"],
      ["AQ-T07-N02", "choice"],
      ["AQ-T08-N02", "choice"],
      ["AQ-T07-N03-FORM", "teach"],
      ["AQ-T07-N03", "type"],
      ["AQ-T08-N03", "type"],
      ["AQ-T07-N04", "type"],
      ["AQ-T08-N04", "type"],
    ]);

    expect([...ids.slice(10)].sort()).toEqual([
      "AQ-M04-X01",
      "AQ-M04-X02",
      "AQ-M04-X03",
      "AQ-M04-X04",
      "AQ-T07-N05",
      "AQ-T07-N06",
      "AQ-T07-N07",
      "AQ-T07-N08",
      "AQ-T08-N05",
      "AQ-T08-N06",
      "AQ-T08-N07",
      "AQ-T08-N08",
    ]);

    expect(new Set(ordersOf("aq-m04", 10)).size).toBe(3);
  });

  it("opens MR02 without an introduction on its twelve items in a drawn order", () => {
    const lesson = askingLesson("aq-mr02", randomFrom(1));

    expect(lesson).toMatchObject({
      id: "aq-mr02",
      title: "Unit review",
      subtitle: "Review this unit's lessons",
    });

    expect(lesson.questions.map((q) => q.id).sort()).toEqual([
      "AQ-T05-N09",
      "AQ-T05-N10",
      "AQ-T05-N11",
      "AQ-T06-N09",
      "AQ-T06-N10",
      "AQ-T06-N11",
      "AQ-T07-N09",
      "AQ-T07-N10",
      "AQ-T07-N11",
      "AQ-T08-N09",
      "AQ-T08-N10",
      "AQ-T08-N11",
    ]);

    expect(new Set(ordersOf("aq-mr02", 0)).size).toBe(3);
  });

  it("opens M05 on its introduction, then its base items in order, then its variations", () => {
    const lesson = askingLesson("aq-m05", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-m05",
      title: "Where from and where to",
      subtitle: "Learn de dónde and adónde, mixed with earlier words",
    });

    expect(lesson.questions[0]).toMatchObject({
      id: "AQ-M05-INTRO",
      kind: "teach",
      prompt: "New question words: de dónde, adónde",
    });

    expect(lesson.questions.slice(1, 9).map((q) => [q.id, q.kind])).toEqual([
      ["AQ-T10-N01", "choice"],
      ["AQ-T11-N01", "choice"],
      ["AQ-T10-N02", "choice"],
      ["AQ-T11-N02", "choice"],
      ["AQ-T10-N03", "type"],
      ["AQ-T11-N03", "type"],
      ["AQ-T10-N04", "type"],
      ["AQ-T11-N04", "type"],
    ]);

    expect([...ids.slice(9)].sort()).toEqual([
      "AQ-M05-X01",
      "AQ-M05-X02",
      "AQ-M05-X03",
      "AQ-M05-X04",
      "AQ-T10-N05",
      "AQ-T10-N06",
      "AQ-T10-N07",
      "AQ-T10-N08",
      "AQ-T11-N05",
      "AQ-T11-N06",
      "AQ-T11-N07",
      "AQ-T11-N08",
    ]);

    expect(new Set(ordersOf("aq-m05", 9)).size).toBe(3);
  });

  it("opens M06 on its introduction, then its base items in order, with the form card just before AQ-T12-N03, then its variations", () => {
    const lesson = askingLesson("aq-m06", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-m06",
      title: "What time and who with",
      subtitle: "Learn a qué hora and con quién, mixed with earlier words",
    });

    expect(lesson.questions[0]).toMatchObject({
      id: "AQ-M06-INTRO",
      kind: "teach",
      prompt: "New question words: a qué hora, con quién",
    });

    expect(lesson.questions.slice(1, 10).map((q) => [q.id, q.kind])).toEqual([
      ["AQ-T09-N01", "choice"],
      ["AQ-T12-N01", "choice"],
      ["AQ-T09-N02", "choice"],
      ["AQ-T12-N02", "choice"],
      ["AQ-T09-N03", "type"],
      ["AQ-T12-N03-FORM", "teach"],
      ["AQ-T12-N03", "type"],
      ["AQ-T09-N04", "type"],
      ["AQ-T12-N04", "type"],
    ]);

    expect([...ids.slice(10)].sort()).toEqual([
      "AQ-M06-X01",
      "AQ-M06-X02",
      "AQ-M06-X03",
      "AQ-M06-X04",
      "AQ-T09-N05",
      "AQ-T09-N06",
      "AQ-T09-N07",
      "AQ-T09-N08",
      "AQ-T12-N05",
      "AQ-T12-N06",
      "AQ-T12-N07",
      "AQ-T12-N08",
    ]);

    expect(new Set(ordersOf("aq-m06", 10)).size).toBe(3);
  });

  it("opens MR03 without an introduction on its twelve items in a drawn order", () => {
    const lesson = askingLesson("aq-mr03", randomFrom(1));

    expect(lesson).toMatchObject({
      id: "aq-mr03",
      title: "Unit review",
      subtitle: "Review this unit's lessons",
    });

    expect(lesson.questions.map((q) => q.id).sort()).toEqual([
      "AQ-T09-N09",
      "AQ-T09-N10",
      "AQ-T09-N11",
      "AQ-T10-N09",
      "AQ-T10-N10",
      "AQ-T10-N11",
      "AQ-T11-N09",
      "AQ-T11-N10",
      "AQ-T11-N11",
      "AQ-T12-N09",
      "AQ-T12-N10",
      "AQ-T12-N11",
    ]);

    expect(new Set(ordersOf("aq-mr03", 0)).size).toBe(3);
  });

  it("opens L13 on de quién's introduction, base items with the de quiénes card, and variations", () => {
    const lesson = askingLesson("aq-l13", randomFrom(1));
    const ids = lesson.questions.map((q) => q.id);

    expect(lesson).toMatchObject({
      id: "aq-l13",
      title: "Asking whose",
      subtitle: "Learn one new question word",
    });

    expect(ids.slice(0, 8)).toEqual([
      "AQ-T13-INTRO",
      "AQ-T13-E01",
      "AQ-T13-E02",
      "AQ-T13-E03-FORM",
      "AQ-T13-E03",
      "AQ-T13-E04",
      "AQ-T13-E05",
      "AQ-T13-E06",
    ]);

    expect(lesson.questions[0]).toMatchObject({
      kind: "teach",
      prompt: "New question word: de quién / de quiénes",
      explanation: expect.stringContaining("Example: ¿De quién es este libro?"),
    });

    expect(lesson.questions[3]).toMatchObject({
      kind: "teach",
      prompt: "New form: de quiénes",
      explanation: expect.stringContaining("Example: ¿De quiénes es este libro?"),
    });

    expect([...ids.slice(8)].sort()).toEqual(variations.map((id) => id.replace("T01", "T13")));
  });

  it("draws a new L13 variation order each time the lesson opens", () => {
    const orders = [1, 2, 3].map((seed) =>
      askingLesson("aq-l13", randomFrom(seed))
        .questions.slice(8)
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

  it("lists unit 1 with M01, M02 and MR01, unit 2 with M03, M04 and MR02, unit 3 with M05, M06 and MR03, and unit 4 with L13 to L18 and R04", () => {
    expect(askingUnits.map((u) => [u.id, u.lessons.map((l) => l.id)])).toEqual([
      ["aq-u1", ["aq-m01", "aq-m02", "aq-mr01"]],
      ["aq-u2", ["aq-m03", "aq-m04", "aq-mr02"]],
      ["aq-u3", ["aq-m05", "aq-m06", "aq-mr03"]],
      ["aq-u4", ["aq-l13", "aq-l14", "aq-l15", "aq-l16", "aq-l17", "aq-l18", "aq-r04"]],
    ]);
  });
});
