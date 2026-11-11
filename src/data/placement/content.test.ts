import { describe, expect, it } from "vitest";
import { exerciseBank } from "../../components/practice";
import { accentMistakes, accentOnlyAnswer, isCorrect } from "../progress";
import { exerciseCount } from "../practice-sets/lesson";
import { placementLesson, placementLessons, placementQuestions } from "./placement";

const question = (id: string) => placementQuestions.find((q) => q.id === id)!;

const learningLessons = placementLessons.filter((l) => l.introduction);

const isSentence = (text: string) => text.trim().endsWith(".");

const wordingsOf = (q: (typeof placementQuestions)[number]) =>
  [q.answer, ...(q.accepted ?? [])].filter(isSentence);

const lowered = (text: string) => text.toLocaleLowerCase("es");

const repeatedIn = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i);

// The nouns course units 1–4 teach; a translation glosses none of them.
const TAUGHT_NOUNS = [
  "libro",
  "móvil",
  "teléfono",
  "mesa",
  "silla",
  "puerta",
  "lámpara",
  "ventana",
  "sofá",
  "cama",
  "tienda",
  "escuela",
  "parque",
  "estación",
];

describe("placement content", () => {
  it("joins the exercise bank with ids no other exercise uses", () => {
    const bank = exerciseBank.map((q) => q.id);

    expect(new Set(bank).size).toBe(bank.length);

    expect(bank).toEqual(
      expect.arrayContaining([
        "SP-T01-N01",
        "SP-T01-N07",
        "SP-T03-N07",
        "SP-T04-N01",
        "SP-T05-N07",
        "SP-M02-X01",
        "SP-M02-X03",
      ]),
    );

    expect(bank.filter((id) => /^SP-T0\d-[EV]\d\d$/.test(id))).toEqual([]);
  });

  it("puts every exercise in exactly one learning lesson", () => {
    expect(placementQuestions).toHaveLength(113);

    const owned = learningLessons.flatMap((l) => [...l.recalled, ...l.base, ...l.variations]);

    expect([...owned].sort()).toEqual(placementQuestions.map((q) => q.id).sort());
  });

  it("names only authored exercises in its lessons", () => {
    const authored = new Set(placementQuestions.map((q) => q.id));
    const named = placementLessons.flatMap((l) => [...l.recalled, ...l.base, ...l.variations]);

    expect(named).toHaveLength(141);

    for (const id of named) {
      expect(authored, id).toContain(id);
    }
  });

  it("asks about at least two phrases in every learning lesson", () => {
    const phrases = learningLessons.map((l) => [
      l.id,
      [
        ...new Set(
          placementLesson(l.id)
            .questions.filter((q) => q.kind !== "teach")
            .map((q) => q.id.slice(0, 6)),
        ),
      ].sort(),
    ]);

    expect(phrases).toEqual([
      ["pl-m01", ["SP-T01", "SP-T02", "SP-T03"]],
      ["pl-m02", ["SP-M02", "SP-T04", "SP-T05"]],
      ["pl-m03", ["SP-M03", "SP-T06", "SP-T07", "SP-T14"]],
      ["pl-m04", ["SP-M04", "SP-T08", "SP-T09"]],
      ["pl-m05", ["SP-M05", "SP-T10", "SP-T11"]],
      ["pl-m06", ["SP-M06", "SP-T12", "SP-T13"]],
    ]);
  });

  it("never says, asks or accepts the same Spanish sentence twice in one lesson", () => {
    for (const l of placementLessons) {
      const lesson = placementLesson(l.id);
      const exercises = lesson.questions.filter((q) => q.kind !== "teach");
      const cards = lesson.questions.filter((q) => q.kind === "teach");

      const spoken = exercises.map((q) => q.pronunciation!);
      const wordings = exercises.flatMap((q) => [...new Set(wordingsOf(q).map(lowered))]);
      const cardSentences = cards.flatMap((c) => c.explanation.match(/[A-Z][^.:]* está [^.]*\./g)!);

      expect(exercises, l.id).toHaveLength(exerciseCount(l));
      expect(repeatedIn(spoken), l.id).toEqual([]);
      expect(repeatedIn(wordings), l.id).toEqual([]);

      expect(
        cardSentences.filter((s) => spoken.includes(s)),
        l.id,
      ).toEqual([]);
    }
  });

  it("keeps the Spanish frame and the answer out of every translation", () => {
    const translations = placementQuestions.filter(
      (q) => q.kind === "type" && isSentence(q.answer),
    );

    expect(translations.map((q) => q.id)).toEqual([
      "SP-T01-N05",
      "SP-T02-N05",
      "SP-T03-N05",
      "SP-T01-N06",
      "SP-T02-N06",
      "SP-T03-N06",
      "SP-T04-N05",
      "SP-T05-N05",
      "SP-T04-N06",
      "SP-T05-N06",
      "SP-M02-X01",
      "SP-M02-X03",
      "SP-T06-N05",
      "SP-T07-N05",
      "SP-T14-N05",
      "SP-T06-N06",
      "SP-T07-N06",
      "SP-T14-N06",
      "SP-M03-X01",
      "SP-M03-X03",
      "SP-T08-N05",
      "SP-T09-N05",
      "SP-T08-N06",
      "SP-T09-N06",
      "SP-M04-X01",
      "SP-M04-X03",
      "SP-T10-N05",
      "SP-T11-N05",
      "SP-T10-N06",
      "SP-T11-N06",
      "SP-M05-X01",
      "SP-M05-X03",
      "SP-T12-N05",
      "SP-T13-N05",
      "SP-T12-N06",
      "SP-T13-N06",
      "SP-M06-X01",
      "SP-M06-X03",
    ]);

    for (const q of translations) {
      const shown = `${q.instruction} ${q.prompt}`;

      expect(shown, q.id).not.toContain("___");
      expect(shown, q.id).not.toContain(q.answer);
      expect(q.instruction, q.id).toMatch(/^Translate into Spanish\./);
    }
  });

  it("glosses no noun the course units before the set teach", () => {
    const glossed = placementQuestions.flatMap((q) =>
      (q.instruction!.split("Words: ")[1] ?? "")
        .split(/[;.]/)
        .map((gloss) => gloss.split(" = ")[1]?.split(" ").pop())
        .filter((noun) => noun !== undefined),
    );

    expect([...new Set(glossed)].sort()).toEqual([
      "armario",
      "banco",
      "biblioteca",
      "billete",
      "bolsa",
      "caja",
      "cajón",
      "farmacia",
      "maleta",
      "mochila",
      "oficina",
      "taza",
      "teatro",
    ]);

    expect(glossed.filter((noun) => TAUGHT_NOUNS.includes(noun))).toEqual([]);
  });

  it("asks for no open sentence and gives every exercise its task and its Spanish to hear", () => {
    expect(new Set(placementQuestions.map((q) => q.kind))).toEqual(new Set(["choice", "type"]));

    for (const q of placementQuestions) {
      expect(q.instruction?.trim(), q.id).toBeTruthy();
      expect(q.pronunciation?.trim(), q.id).toBeTruthy();
    }

    expect(
      ["SP-T01-N01", "SP-T01-N02", "SP-T03-N04", "SP-T05-N07", "SP-M02-X02"].map((id) => [
        question(id).instruction,
        question(id).prompt,
        question(id).pronunciation,
      ]),
    ).toEqual([
      [
        "Choose the English meaning of “en”.",
        "La mochila está en la mesa.",
        "La mochila está en la mesa.",
      ],
      ["Write the Spanish phrase. Give the phrase only, not a sentence.", "in or on", "en"],
      [
        "Complete the gap. The book is outside the drawer.",
        "El libro está ___ cajón.",
        "El libro está fuera del cajón.",
      ],
      [
        "Choose the scene this sentence describes.",
        "La mochila está debajo de la silla.",
        "La mochila está debajo de la silla.",
      ],
      [
        "Complete the gap. The cup is outside the backpack.",
        "La taza está ___ la mochila.",
        "La taza está fuera de la mochila.",
      ],
    ]);
  });

  it("offers each choice's answer once among unique options", () => {
    const choices = placementQuestions.filter((q) => q.kind === "choice");

    expect(choices.map((q) => q.id)).toEqual([
      "SP-T01-N01",
      "SP-T02-N01",
      "SP-T03-N01",
      "SP-T01-N07",
      "SP-T02-N07",
      "SP-T03-N07",
      "SP-T04-N01",
      "SP-T05-N01",
      "SP-T04-N07",
      "SP-T05-N07",
      "SP-T06-N01",
      "SP-T07-N01",
      "SP-T14-N01",
      "SP-T06-N07",
      "SP-T07-N07",
      "SP-T14-N07",
      "SP-T08-N01",
      "SP-T09-N01",
      "SP-T08-N07",
      "SP-T09-N07",
      "SP-T10-N01",
      "SP-T11-N01",
      "SP-T10-N07",
      "SP-T11-N07",
      "SP-T12-N01",
      "SP-T13-N01",
      "SP-T12-N07",
      "SP-T13-N07",
    ]);

    for (const q of choices) {
      const answers = q.options!.filter((o) => o === q.answer);

      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      expect(answers, q.id).toHaveLength(1);
    }
  });

  it("gives every exercise two hints and feedback", () => {
    for (const q of placementQuestions) {
      const blank = [...q.hints!, q.explanation].filter((text) => !text.trim());

      expect(q.hints, q.id).toHaveLength(2);
      expect(blank, q.id).toEqual([]);
    }
  });

  it("names no unit or lesson number in a lesson's title or subtitle", () => {
    const texts = placementLessons.flatMap((l) => [l.title, l.subtitle]);

    expect(texts).toEqual([
      "In, inside and outside",
      "en, dentro de and fuera de",
      "On top of and under",
      "encima de and debajo de",
      "Unit review",
      "Review this unit's lessons",
      "In front, behind and opposite",
      "delante de, detrás de and enfrente de",
      "Next to and between",
      "al lado de and entre",
      "Unit review",
      "Review this unit's lessons",
      "Near and far",
      "cerca de and lejos de",
      "Left and right",
      "a la izquierda de and a la derecha de",
      "Unit review",
      "Review this unit's lessons",
    ]);

    expect(texts.filter((text) => /\bunit \d|\blessons? \d/i.test(text))).toEqual([]);
  });

  it("takes the inside translation with en as well as dentro de", () => {
    const n05 = question("SP-T02-N05");

    expect(isCorrect(n05, "El libro está dentro de la maleta.")).toBe(true);
    expect(isCorrect(n05, "El libro está en la maleta.")).toBe(true);
    expect(isCorrect(n05, "El libro está fuera de la maleta.")).toBe(false);
  });

  it("takes en and sobre, and not encima de, in a gap before el", () => {
    const n04 = question("SP-T01-N04");

    expect(isCorrect(n04, "en")).toBe(true);
    expect(isCorrect(n04, "sobre")).toBe(true);
    expect(isCorrect(n04, "encima de")).toBe(false);
  });

  it("takes dentro del and en el, and not dentro de, in the gap before a masculine noun", () => {
    const n04 = question("SP-T02-N04");

    expect(isCorrect(n04, "dentro del")).toBe(true);
    expect(isCorrect(n04, "en el")).toBe(true);
    expect(isCorrect(n04, "dentro de")).toBe(false);
    expect(isCorrect(n04, "dentro de el")).toBe(false);
  });

  it("takes delante del, and not delante de, in the gap before a masculine noun", () => {
    const n04 = question("SP-T06-N04");

    expect(isCorrect(n04, "delante del")).toBe(true);
    expect(isCorrect(n04, "delante de")).toBe(false);
    expect(isCorrect(n04, "detrás del")).toBe(false);
  });

  it("takes the in-front-of translation with móvil or teléfono, and not with detrás de", () => {
    const n05 = question("SP-T06-N05");

    expect(isCorrect(n05, "El móvil está delante de la puerta.")).toBe(true);
    expect(isCorrect(n05, "El teléfono está delante de la puerta.")).toBe(true);
    expect(isCorrect(n05, "El móvil está detrás de la puerta.")).toBe(false);
  });

  it("takes al lado del and junto al, and not al lado de, in the gap before a masculine noun", () => {
    const n04 = question("SP-T08-N04");

    expect(isCorrect(n04, "al lado del")).toBe(true);
    expect(isCorrect(n04, "junto al")).toBe(true);
    expect(isCorrect(n04, "al lado de")).toBe(false);
    expect(isCorrect(n04, "entre")).toBe(false);
  });

  it("takes the next-to translation with al lado de or junto a, and not with entre", () => {
    const n05 = question("SP-T08-N05");

    expect(isCorrect(n05, "El billete está al lado de la puerta.")).toBe(true);
    expect(isCorrect(n05, "El billete está junto a la puerta.")).toBe(true);
    expect(isCorrect(n05, "El billete está detrás de la puerta.")).toBe(false);
  });

  it("takes cerca del, and not cerca de or lejos del, in the gap before a masculine noun", () => {
    const n04 = question("SP-T10-N04");

    expect(isCorrect(n04, "cerca del")).toBe(true);
    expect(isCorrect(n04, "cerca de")).toBe(false);
    expect(isCorrect(n04, "lejos del")).toBe(false);
  });

  it("takes the near translation with cerca de, and not with lejos de", () => {
    const n05 = question("SP-T10-N05");

    expect(isCorrect(n05, "El libro está cerca de la mesa.")).toBe(true);
    expect(isCorrect(n05, "El libro está lejos de la mesa.")).toBe(false);
  });

  it("names the viewer in every left-or-right gap and translation", () => {
    const sided = placementQuestions.filter(
      (q) => q.kind === "type" && /^SP-T1[23]-N0[3-6]$/.test(q.id),
    );

    expect(
      sided.map((q) => [q.id, q.instruction!.match(/You are looking at [^.]*\./)?.[0]]),
    ).toEqual([
      ["SP-T12-N03", "You are looking at the book and the bed."],
      ["SP-T13-N03", "You are looking at the book and the box."],
      ["SP-T12-N04", "You are looking at the ticket and the bench."],
      ["SP-T13-N04", "You are looking at the phone and the cupboard."],
      ["SP-T12-N05", "You are looking at the phone and the chair."],
      ["SP-T13-N05", "You are looking at the backpack and the lamp."],
      ["SP-T12-N06", "You are looking at the backpack and the sofa."],
      ["SP-T13-N06", "You are looking at the bag and the cupboard."],
    ]);
  });

  it("takes a la izquierda del, and not a la izquierda de or a la derecha del, in the gap before a masculine noun", () => {
    const n04 = question("SP-T12-N04");

    expect(isCorrect(n04, "a la izquierda del")).toBe(true);
    expect(isCorrect(n04, "a la izquierda de")).toBe(false);
    expect(isCorrect(n04, "a la derecha del")).toBe(false);
  });

  it("takes the left-of translation with móvil or teléfono, and not with a la derecha de", () => {
    const n05 = question("SP-T12-N05");

    expect(isCorrect(n05, "El móvil está a la izquierda de la silla.")).toBe(true);
    expect(isCorrect(n05, "El teléfono está a la izquierda de la silla.")).toBe(true);
    expect(isCorrect(n05, "El móvil está a la derecha de la silla.")).toBe(false);
  });

  it("passes a translation without its accents and notes them", () => {
    const n05 = question("SP-T03-N05");

    expect(isCorrect(n05, "el movil esta fuera de la caja")).toBe(true);

    expect(accentOnlyAnswer(n05, "el movil esta fuera de la caja")).toBe(
      "El móvil está fuera de la caja.",
    );

    expect(
      accentMistakes("El móvil está fuera de la caja.", "el movil esta fuera de la caja"),
    ).toEqual({ missing: ["ó", "á"], extra: [] });

    expect(accentOnlyAnswer(n05, "El móvil está fuera de la caja.")).toBeUndefined();
  });
});
