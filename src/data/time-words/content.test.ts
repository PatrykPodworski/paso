import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { isCorrect, normalize } from "../progress";
import { timeWordsLesson, timeWordsLessons, timeWordsQuestions } from "./timeWords";

const question = (id: string) => timeWordsQuestions.find((q) => q.id === id)!;

const wordOf = (id: string) => id.split("-").slice(0, 2).join("-");

const CORE = ["E01", "E03", "E04", "E05", "E06", "V11"];

const core = (word: string) => CORE.map((item) => `${word}-${item}`);

describe("time words content", () => {
  it("joins the exercise bank with ids no other exercise uses, and only the core items", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(timeWordsQuestions.map((q) => q.id)).toEqual([
      ...core("TM-T01"),
      "TM-T01-V03",
      ...core("TM-T02"),
      "TM-T02-V03",
      ...core("TM-T03"),
      "TM-T03-V03",
      ...core("TM-T04"),
      ...core("TM-T05"),
      ...core("TM-T06"),
    ]);

    expect(bank).toEqual(expect.arrayContaining(timeWordsQuestions.map((q) => q.id)));
    expect(bank).not.toContain("TM-T01-V12");
  });

  it("names only authored exercises in its lessons", () => {
    const authored = new Set(timeWordsQuestions.map((q) => q.id));

    for (const l of timeWordsLessons) {
      for (const id of [...l.recalled, ...l.base, ...l.variations]) {
        expect(authored, `${l.id} ${id}`).toContain(id);
      }
    }
  });

  it("offers each choice's answer once among unique options", () => {
    const choices = timeWordsQuestions.filter((q) => q.kind === "choice");

    expect(choices.map((q) => q.id)).toEqual([
      "TM-T01-E01",
      "TM-T01-E06",
      "TM-T01-V11",
      "TM-T02-E01",
      "TM-T02-E06",
      "TM-T02-V11",
      "TM-T03-E01",
      "TM-T03-E06",
      "TM-T03-V11",
      "TM-T04-E01",
      "TM-T04-E06",
      "TM-T04-V11",
      "TM-T05-E01",
      "TM-T05-E06",
      "TM-T05-V11",
      "TM-T06-E01",
      "TM-T06-E06",
      "TM-T06-V11",
    ]);

    for (const q of choices) {
      const answers = q.options!.filter((o) => o === q.answer);

      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      expect(answers, q.id).toHaveLength(1);
    }
  });

  it("gives every exercise two hints and feedback", () => {
    for (const q of timeWordsQuestions) {
      const blank = [...q.hints!, q.explanation].filter((text) => !text.trim());

      expect(q.hints, q.id).toHaveLength(2);
      expect(blank, q.id).toEqual([]);
    }
  });

  it("gives every exercise its Spanish to hear and a task apart from its sentence", () => {
    const missing = timeWordsQuestions
      .filter((q) => !q.pronunciation || !q.instruction)
      .map((q) => q.id);

    expect(missing).toEqual([]);

    expect(
      [
        "TM-T01-E01",
        "TM-T01-E04",
        "TM-T02-E05",
        "TM-T03-V11",
        "TM-T02-V03",
        "TM-T05-E04",
        "TM-T06-E05",
      ].map((id) => {
        const q = question(id);

        return [q.instruction, q.prompt, q.pronunciation];
      }),
    ).toEqual([
      ["Choose the English meaning", "hoy", "hoy"],
      [
        "Complete the gap. Today is Tuesday. Luis’s meeting is on Tuesday.",
        "Reunión de Luis: ___.",
        "Reunión de Luis: hoy.",
      ],
      [
        "Translate the calendar note into Spanish. Today is Tuesday. Coffee with Diego is on Wednesday.",
        "Coffee with Diego: tomorrow.",
        "Café con Diego: mañana.",
      ],
      [
        "Choose the word for the gap. Today is Tuesday. Breakfast with Tomás was on Monday.",
        "Desayuno con Tomás: ___.",
        "Desayuno con Tomás: ayer.",
      ],
      [
        "Complete the gap. Today is Tuesday. Coffee with Luis is on Wednesday.",
        "Café con Luis: ___.",
        "Café con Luis: mañana.",
      ],
      [
        "Complete the gap. Tomás has breakfast at 8:00. Pablo has breakfast at 7:00.",
        "Tomás desayuna a las ocho. Pablo desayuna ___.",
        "Tomás desayuna a las ocho. Pablo desayuna antes.",
      ],
      [
        "Translate into Spanish. Luis has breakfast at 8:00. Pablo has breakfast at 9:00.",
        "Pablo has breakfast later.",
        "Luis desayuna a las ocho. Pablo desayuna después.",
      ],
    ]);
  });

  it("uses each Spanish sentence once in a lesson", () => {
    for (const l of timeWordsLessons) {
      const sentences = timeWordsLesson(l.id)
        .questions.map((q) => q.pronunciation)
        .filter((text): text is string => !!text?.includes(" "));

      const repeated = sentences.filter((s, i) => sentences.indexOf(s) !== i);

      expect(sentences.length, l.id).toBeGreaterThan(0);
      expect(repeated, l.id).toEqual([]);
    }
  });

  it("keeps a translation's answer out of its task", () => {
    const translations = timeWordsQuestions.filter((q) => q.instruction?.startsWith("Translate"));

    expect(translations.map((q) => q.id)).toEqual([
      "TM-T01-E05",
      "TM-T02-E05",
      "TM-T03-E05",
      "TM-T04-E05",
      "TM-T05-E05",
      "TM-T06-E05",
    ]);

    for (const q of translations) {
      const task = normalize(`${q.instruction} ${q.prompt}`);
      const leaked = [q.answer, ...(q.accepted ?? [])].filter((a) => task.includes(normalize(a)));

      expect(leaked, q.id).toEqual([]);
    }
  });

  it("mixes words in every lesson", () => {
    const learning = timeWordsLessons.filter((l) => l.introduction);

    expect(learning.map((l) => l.id)).toEqual(["tm-m01", "tm-m02"]);

    for (const l of learning) {
      const words = new Set(l.base.map(wordOf));
      const [first, second] = l.base;
      const items = [first, second].map((id) => id.slice(-3));

      expect(words.size, l.id).toBeGreaterThanOrEqual(2);
      expect(words.size, l.id).toBeLessThanOrEqual(3);
      expect(items, l.id).toEqual(["E01", "E01"]);
      expect(wordOf(second), l.id).not.toBe(wordOf(first));
    }
  });

  it("accepts the calendar note with its article and verb, not with another time word", () => {
    expect(isCorrect(question("TM-T02-E05"), "el café con diego es mañana")).toBe(true);
    expect(isCorrect(question("TM-T02-E05"), "café con diego: hoy")).toBe(false);
    expect(isCorrect(question("TM-T03-E05"), "El desayuno con Diego fue ayer.")).toBe(true);
    expect(isCorrect(question("TM-T03-E05"), "El desayuno con Diego es ayer.")).toBe(false);
  });

  it("accepts the progressive with ahora and más temprano for antes, not another time word", () => {
    expect(isCorrect(question("TM-T04-E05"), "Ahora Diego está trabajando.")).toBe(true);
    expect(isCorrect(question("TM-T04-E05"), "Diego trabaja hoy.")).toBe(false);
    expect(isCorrect(question("TM-T05-E05"), "Luis estudia más temprano.")).toBe(true);
    expect(isCorrect(question("TM-T05-E05"), "Luis estudia después.")).toBe(false);
  });

  it("accepts después and luego in every typed T06 item, and más tarde in its translation", () => {
    expect(
      ["TM-T06-E03", "TM-T06-E04"].map((id) => [
        isCorrect(question(id), "después"),
        isCorrect(question(id), "luego"),
        isCorrect(question(id), "antes"),
      ]),
    ).toEqual([
      [true, true, false],
      [true, true, false],
    ]);

    expect(
      ["Pablo desayuna después.", "Pablo desayuna luego.", "Pablo desayuna más tarde."].map(
        (answer) => isCorrect(question("TM-T06-E05"), answer),
      ),
    ).toEqual([true, true, true]);

    expect(isCorrect(question("TM-T06-E05"), "Pablo desayuna antes.")).toBe(false);
  });

  it("rejects another time word in a gap", () => {
    expect(isCorrect(question("TM-T01-E04"), "mañana")).toBe(false);
    expect(isCorrect(question("TM-T01-E04"), "Hoy")).toBe(true);
    expect(isCorrect(question("TM-T02-E04"), "hoy")).toBe(false);
    expect(isCorrect(question("TM-T02-E04"), "Mañana")).toBe(true);
    expect(isCorrect(question("TM-T03-E04"), "mañana")).toBe(false);
    expect(isCorrect(question("TM-T03-E04"), "Ayer")).toBe(true);
  });
});
