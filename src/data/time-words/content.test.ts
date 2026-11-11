import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { isCorrect, normalize } from "../progress";
import { timeWordsLesson, timeWordsLessons, timeWordsQuestions } from "./timeWords";

const question = (id: string) => timeWordsQuestions.find((q) => q.id === id)!;

const wordOf = (id: string) => id.split("-").slice(0, 2).join("-");

// E01 and E03 say the word alone, and a word such as por la mañana holds spaces too.
const isWordItem = (id: string) => /-E0[13]$/.test(id);

const CORE = ["E01", "E03", "E04", "E05", "E06", "V11"];

const core = (word: string) => CORE.map((item) => `${word}-${item}`);

describe("time words content", () => {
  it("joins the exercise bank with ids no other exercise uses, and only the core items", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(timeWordsQuestions.map((q) => q.id)).toEqual([
      ...core("TM-T01"),
      "TM-T01-V03",
      "TM-T01-V04",
      "TM-T01-V09",
      "TM-T01-V10",
      ...core("TM-T02"),
      "TM-T02-V03",
      "TM-T02-V04",
      "TM-T02-V09",
      "TM-T02-V10",
      ...core("TM-T03"),
      "TM-T03-V03",
      "TM-T03-V04",
      "TM-T03-V09",
      "TM-T03-V10",
      ...core("TM-T04"),
      "TM-T04-V03",
      "TM-T04-V04",
      "TM-T04-V09",
      "TM-T04-V10",
      ...core("TM-T05"),
      "TM-T05-V03",
      "TM-T05-V04",
      "TM-T05-V09",
      "TM-T05-V10",
      ...core("TM-T06"),
      "TM-T06-V03",
      "TM-T06-V09",
      "TM-T06-V10",
      ...core("TM-T07"),
      "TM-T07-V03",
      "TM-T07-V04",
      "TM-T07-V09",
      "TM-T07-V10",
      ...core("TM-T08"),
      "TM-T08-V03",
      "TM-T08-V04",
      "TM-T08-V09",
      "TM-T08-V10",
      ...core("TM-T09"),
      "TM-T09-V03",
      "TM-T09-V09",
      "TM-T09-V10",
      ...core("TM-T10"),
      "TM-T10-V03",
      "TM-T10-V04",
      "TM-T10-V09",
      "TM-T10-V10",
      ...core("TM-T11"),
      "TM-T11-V03",
      "TM-T11-V09",
      "TM-T11-V10",
      ...core("TM-T12"),
      "TM-T12-V03",
      "TM-T12-V09",
      "TM-T12-V10",
      ...core("TM-T13"),
      "TM-T13-V03",
      "TM-T13-V09",
      "TM-T13-V10",
      ...core("TM-T14"),
      "TM-T14-V03",
      "TM-T14-V09",
      "TM-T14-V10",
      ...core("TM-T15"),
      "TM-T15-V09",
      "TM-T15-V10",
      ...core("TM-T16"),
      "TM-T16-V09",
      "TM-T16-V10",
      "TM-G01",
      "TM-G02",
      "TM-G03",
      "TM-G04",
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
      "TM-T07-E01",
      "TM-T07-E06",
      "TM-T07-V11",
      "TM-T08-E01",
      "TM-T08-E06",
      "TM-T08-V11",
      "TM-T09-E01",
      "TM-T09-E06",
      "TM-T09-V11",
      "TM-T10-E01",
      "TM-T10-E06",
      "TM-T10-V11",
      "TM-T11-E01",
      "TM-T11-E06",
      "TM-T11-V11",
      "TM-T12-E01",
      "TM-T12-E06",
      "TM-T12-V11",
      "TM-T13-E01",
      "TM-T13-E06",
      "TM-T13-V11",
      "TM-T14-E01",
      "TM-T14-E06",
      "TM-T14-V11",
      "TM-T15-E01",
      "TM-T15-E06",
      "TM-T15-V11",
      "TM-T16-E01",
      "TM-T16-E06",
      "TM-T16-V11",
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
        "TM-T08-E04",
        "TM-T11-E04",
        "TM-T09-E05",
        "TM-T14-E04",
        "TM-T13-E05",
        "TM-T15-E04",
        "TM-T16-E05",
        "TM-G01",
        "TM-G04",
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
      [
        "Complete the gap. Pablo usually has breakfast at 9:00. Today he has breakfast at 12:00.",
        "Hoy Pablo desayuna ___.",
        "Hoy Pablo desayuna tarde.",
      ],
      [
        "Complete the gap. I am in class at 22:00.",
        "Yo estoy en clase ___.",
        "Yo estoy en clase por la noche.",
      ],
      [
        "Translate into Spanish. Diego reads at 9:00.",
        "Diego reads in the morning.",
        "Diego lee por la mañana.",
      ],
      [
        "Complete the gap. I eat at the office on none of the 7 days this week.",
        "Yo ___ como en la oficina.",
        "Yo nunca como en la oficina.",
      ],
      [
        "Translate into Spanish. Luis has bread for breakfast on 2 of the 7 days this week.",
        "Luis sometimes has bread for breakfast.",
        "Luis a veces desayuna pan.",
      ],
      [
        "Complete the gap. Luis is at the office from 8:00 to 15:00. Say when it starts.",
        "Luis está en la oficina ___ las ocho.",
        "Luis está en la oficina desde las ocho.",
      ],
      [
        "Translate into Spanish. Luis studies from 13:00 to 15:00. Say when it ends.",
        "Luis studies until 15:00.",
        "Luis estudia hasta las tres.",
      ],
      ["Put the words in time order", "From the earliest day to the latest", "ayer hoy mañana"],
      ["Put the words in order", "From the most often to the least often", "siempre a veces nunca"],
    ]);
  });

  it("uses each Spanish sentence once in a lesson", () => {
    for (const l of timeWordsLessons) {
      const sentences = timeWordsLesson(l.id)
        .questions.filter((q) => !isWordItem(q.id))
        .map((q) => q.pronunciation)
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
      "TM-T01-V04",
      "TM-T01-V10",
      "TM-T02-E05",
      "TM-T02-V04",
      "TM-T02-V10",
      "TM-T03-E05",
      "TM-T03-V04",
      "TM-T03-V10",
      "TM-T04-E05",
      "TM-T04-V04",
      "TM-T04-V10",
      "TM-T05-E05",
      "TM-T05-V04",
      "TM-T05-V10",
      "TM-T06-E05",
      "TM-T06-V10",
      "TM-T07-E05",
      "TM-T07-V04",
      "TM-T07-V10",
      "TM-T08-E05",
      "TM-T08-V04",
      "TM-T08-V10",
      "TM-T09-E05",
      "TM-T09-V10",
      "TM-T10-E05",
      "TM-T10-V04",
      "TM-T10-V10",
      "TM-T11-E05",
      "TM-T11-V10",
      "TM-T12-E05",
      "TM-T12-V10",
      "TM-T13-E05",
      "TM-T13-V10",
      "TM-T14-E05",
      "TM-T14-V10",
      "TM-T15-E05",
      "TM-T15-V10",
      "TM-T16-E05",
      "TM-T16-V10",
    ]);

    for (const q of translations) {
      const task = normalize(`${q.instruction} ${q.prompt}`);
      const leaked = [q.answer, ...(q.accepted ?? [])].filter((a) => task.includes(normalize(a)));

      expect(leaked, q.id).toEqual([]);
    }
  });

  it("mixes words in every lesson", () => {
    const learning = timeWordsLessons.filter((l) => l.introduction);

    expect(learning.map((l) => l.id)).toEqual([
      "tm-m01",
      "tm-m02",
      "tm-m03",
      "tm-m04",
      "tm-m05",
      "tm-m06",
    ]);

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

  it("accepts pronto and más temprano in every T07 translation, not tarde", () => {
    expect(
      [
        ["TM-T07-E05", "Diego se acuesta"],
        ["TM-T07-V04", "Luis se acuesta"],
        ["TM-T07-V10", "Luis come"],
      ].map(([id, sentence]) =>
        [
          `Hoy ${sentence} temprano.`,
          `Hoy ${sentence} pronto.`,
          `${sentence} más temprano hoy.`,
          `Hoy ${sentence} tarde.`,
        ].map((answer) => isCorrect(question(id), answer)),
      ),
    ).toEqual([
      [true, true, true, false],
      [true, true, true, false],
      [true, true, true, false],
    ]);
  });

  it("accepts más tarde in every T08 translation, not temprano", () => {
    expect(
      [
        ["TM-T08-E05", "Luis se acuesta"],
        ["TM-T08-V04", "Pablo se acuesta"],
        ["TM-T08-V10", "Diego se acuesta"],
      ].map(([id, sentence]) =>
        [`Hoy ${sentence} tarde.`, `${sentence} más tarde hoy.`, `Hoy ${sentence} temprano.`].map(
          (answer) => isCorrect(question(id), answer),
        ),
      ),
    ).toEqual([
      [true, true, false],
      [true, true, false],
      [true, true, false],
    ]);
  });

  it("accepts the day part at either end and de noche for por la noche, not another day part", () => {
    expect(
      [
        ["TM-T09-E05", "Por la mañana Diego lee."],
        ["TM-T09-E05", "Diego lee por la tarde."],
        ["TM-T10-E05", "Por la tarde Luis lee."],
        ["TM-T10-E05", "Luis lee tarde."],
        ["TM-T11-E05", "Pablo lee de noche."],
        ["TM-T11-E05", "De noche Pablo lee."],
        ["TM-T11-E05", "Pablo lee por la mañana."],
      ].map(([id, answer]) => isCorrect(question(id), answer)),
    ).toEqual([true, false, true, false, true, true, false]);
  });

  it("accepts the frequency word before or after the verb and no … nunca, not another frequency word", () => {
    expect(
      [
        ["TM-T12-E05", "Diego desayuna siempre pan."],
        ["TM-T12-E05", "Diego a veces desayuna pan."],
        ["TM-T13-E05", "A veces Luis desayuna pan."],
        ["TM-T13-E05", "Luis desayuna pan a veces."],
        ["TM-T13-E05", "Luis nunca desayuna pan."],
        ["TM-T14-E05", "Pablo no desayuna nunca pan."],
        ["TM-T14-E05", "Pablo no desayuna pan nunca."],
        ["TM-T14-E05", "Pablo desayuna nunca pan."],
        ["TM-T14-E05", "Pablo siempre desayuna pan."],
      ].map(([id, answer]) => isCorrect(question(id), answer)),
    ).toEqual([true, false, true, true, false, true, true, false, false]);
  });

  it("accepts desde and hasta at the start of the sentence, not the other word", () => {
    expect(
      [
        ["TM-T15-E05", "Desde las cuatro Diego estudia."],
        ["TM-T15-E05", "Diego estudia hasta las cuatro."],
        ["TM-T15-V10", "Desde las ocho Luis está en casa."],
        ["TM-T16-E05", "Hasta las tres Luis estudia."],
        ["TM-T16-E05", "Luis estudia desde las tres."],
        ["TM-T16-V10", "Hasta las seis Diego estudia."],
      ].map(([id, answer]) => isCorrect(question(id), answer)),
    ).toEqual([true, false, true, true, false, true]);
  });

  it("offers mañana and tarde alone among the day parts, and marks them wrong", () => {
    expect(
      [
        ["TM-T09-V11", "mañana"],
        ["TM-T10-V11", "tarde"],
      ].map(([id, word]) => [
        question(id).options!.includes(word),
        isCorrect(question(id), word),
        isCorrect(question(id), question(id).answer),
      ]),
    ).toEqual([
      [true, false, true],
      [true, false, true],
    ]);
  });

  it("builds each order item's answer from its tiles, authored out of order", () => {
    expect(
      ["TM-G01", "TM-G02", "TM-G03", "TM-G04"].map((id) => {
        const q = question(id);

        return [q.kind, q.tokens, q.answer, isCorrect(q, q.tokens!.join(" "))];
      }),
    ).toEqual([
      ["order", ["mañana", "ayer", "hoy"], "ayer hoy mañana", false],
      ["order", ["luego", "Desayuno", "trabajo", "y"], "Desayuno y luego trabajo", false],
      [
        "order",
        ["por la noche", "por la mañana", "por la tarde"],
        "por la mañana por la tarde por la noche",
        false,
      ],
      ["order", ["nunca", "siempre", "a veces"], "siempre a veces nunca", false],
    ]);

    expect(isCorrect(question("TM-G01"), "ayer hoy mañana")).toBe(true);
    expect(isCorrect(question("TM-G02"), "Desayuno y luego trabajo")).toBe(true);
    expect(isCorrect(question("TM-G03"), "por la mañana por la tarde por la noche")).toBe(true);
    expect(isCorrect(question("TM-G04"), "siempre a veces nunca")).toBe(true);
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
