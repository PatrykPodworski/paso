import { describe, expect, it } from "vitest";

import {
  allLessons,
  allQuestions,
  foundations,
  units,
  vocabulary,
  visualQuestions,
} from "./curriculum";
import { formPractice, mockExam, mockQuestions, mockTasks, mockTopics, topicTalks } from "./mock";
import { countWords } from "./progress";
import { audioKey, spokenText } from "./audio";
import { audioSources } from "./audio-sources";
import { existsSync, readFileSync, statSync } from "node:fs";
import words from "./words.json";
import examples from "./examples.json";
import { taskOf } from "../../api/_lib/talk-tasks/index";

const questions = [
  ...allQuestions,
  ...foundations,
  ...visualQuestions,
  formPractice,
  ...mockQuestions,
];

describe("original curriculum integrity", () => {
  it("contains a substantial learning path with every skill in each unit", () => {
    expect(units).toHaveLength(12);
    expect(allLessons).toHaveLength(48);
    expect(allQuestions.length).toBeGreaterThan(250);

    for (const u of units) {
      expect(new Set(u.lessons.flatMap((l) => l.questions).map((q) => q.skill)).size).toBe(4);
    }
  });

  it("uses unique IDs and answer choices with exactly one correct option", () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);

    for (const q of questions) {
      expect(q.explanation.length, `${q.id}: answer explanation`).toBeGreaterThan(10);

      expect(
        q.explanation.length + (q.memoryHint?.length || 0),
        `${q.id}: learning feedback`,
      ).toBeGreaterThan(30);

      if (q.options) {
        expect(
          q.options.filter((o) => o === q.answer),
          q.id,
        ).toHaveLength(1);

        expect(new Set(q.options).size, q.id).toBe(q.options.length);
      }

      if (q.kind === "order") {
        expect([...q.tokens!].sort()).toEqual(q.answer.split(" ").sort());
      }
    }
  });

  it("runs every unit's speaking as a live talk that the server knows", () => {
    const speaking = units.map((u) =>
      u.lessons.flatMap((l) => l.questions).find((q) => q.id.endsWith("-o3"))!,
    );

    expect(speaking.map((q) => q.kind)).toEqual(Array(12).fill("live"));

    expect(speaking.map((q) => q.talk)).toEqual([
      "u1",
      "u2",
      "u3",
      "u4",
      "u5",
      "u6",
      "u7",
      "u8",
      "u9",
      "u10",
      "u11",
      "u12",
    ]);

    expect(speaking[11].prompt).toMatch(/^Talk to Lucía\b/);
    expect(speaking[11].prompt).toMatch(/short exam rehearsal/);
    expect(speaking[11].prompt).toMatch(/full oral exam is in the mock exam/);

    for (const q of speaking) {
      expect(taskOf(q.talk)?.id, q.id).toBe(q.talk);
      expect(q.checklist, q.id).toBeUndefined();
    }
  });

  it("runs the mock exam's speaking as three live talks, two of them on the picked topic", () => {
    const speaking = mockExam[3].tasks.flatMap((t) => t.variants[0].questions);

    expect(speaking.map((q) => q.kind)).toEqual(["live", "live", "live"]);
    expect(speaking.map((q) => q.talk)).toEqual(["mock-s1", "mock-s2", "mock-s3"]);

    expect(speaking.map((q) => q.task)).toEqual([
      "Task 1 · Personal presentation · 1–2 min",
      "Task 2 · A familiar topic · 2–3 min",
      "Task 3 · Conversation · 3–4 min",
    ]);

    expect(taskOf("mock-s1")?.limitSeconds).toBe(150);
    expect(topicTalks).toEqual(["mock-s2", "mock-s3"]);
    expect(mockTopics.map((t) => t.id)).toEqual(["home", "studies", "freeTime"]);

    for (const talk of topicTalks) {
      expect(taskOf(talk), talk).toBeUndefined();

      for (const topic of mockTopics) {
        expect(taskOf(talk, topic.id)?.id, `${talk} ${topic.id}`).toBe(talk);
      }
    }

    for (const q of speaking) {
      expect(q.checklist, q.id).toBeUndefined();
      expect(q.audio, q.id).toBeUndefined();
    }
  });

  it("has 96 different vocabulary entries", () => {
    expect(vocabulary).toHaveLength(96);
    expect(new Set(vocabulary.map((w) => w.es)).size).toBe(96);
  });

  it("gives every unit word a memory hint", () => {
    expect(vocabulary.filter((w) => !w.memoryHint)).toEqual([]);
  });

  it("asks a unit's words in lesson order, not topic order", () => {
    expect(units[2].lessons[0].questions.map((q) => q.pronunciation)).toEqual([
      "la madre",
      "el padre",
      "la hermana",
      "el hermano",
      "la abuela",
      "el hijo",
      "la amiga",
      "la familia",
    ]);
  });

  it("keeps every message model within the official task-2 word target", () => {
    for (const q of questions.filter((q) => q.kind === "write")) {
      expect(countWords(q.answer), q.id).toBeGreaterThanOrEqual(q.minWords!);
      expect(countWords(q.answer), q.id).toBeLessThanOrEqual(q.maxWords!);
    }
  });

  it("matches the official task distributions and time limits in every variant", () => {
    const official = [
      [5, 6, 6, 8],
      [5, 5, 8, 7],
      [1, 1],
      [1, 2],
    ];

    expect(mockExam.map((s) => s.minutes)).toEqual([45, 25, 25, 10]);
    expect(mockExam.map((s) => s.tasks.length)).toEqual(official.map((sizes) => sizes.length));

    mockExam.forEach((s, i) =>
      s.tasks.forEach((t, j) => {
        expect(t.variants.length, t.id).toBeGreaterThan(0);

        for (const v of t.variants) {
          expect(v.questions.length, v.id).toBe(official[i][j]);
        }
      }),
    );
  });

  it("names every variant after its task, once, with a theme", () => {
    const variants = mockTasks.flatMap((t) => t.variants.map((v) => [t.id, v] as const));

    for (const [task, v] of variants) {
      expect(v.id).toMatch(new RegExp(`^${task}-v\\d+$`));
      expect(v.theme.trim(), v.id).not.toBe("");
    }

    expect(new Set(variants.map(([, v]) => v.id)).size).toBe(variants.length);
    expect(new Set(mockQuestions.map((q) => q.id)).size).toBe(mockQuestions.length);
  });

  it("gives each reading task six variants, each a single text with its characters in it", () => {
    const reading = mockExam[0].tasks;

    expect(reading.map((t) => t.variants.length)).toEqual([6, 6, 6, 6]);

    for (const v of reading.flatMap((t) => t.variants)) {
      const passages = new Set(v.questions.map((q) => q.passage));

      expect(passages.size, v.id).toBe(1);

      for (const name of v.names) {
        expect(v.questions[0].passage, `${v.id}: ${name}`).toContain(name);
      }
    }
  });

  it("matches each reading situation to a different one of nine texts", () => {
    for (const t of mockExam[0].tasks.filter((t) => ["r2", "r3"].includes(t.id))) {
      for (const v of t.variants) {
        const passage = v.questions[0].passage!;

        expect(
          passage.split("\n\n").map((text) => text[0]),
          v.id,
        ).toEqual([..."ABCDEFGHI"]);

        expect(new Set(v.questions.map((q) => q.answer)).size, v.id).toBe(v.questions.length);
      }
    }
  });

  it("bundles every listening clip and practice pronunciation as nonempty local audio", () => {
    const phrases = [
      ...new Set(
        questions
          .flatMap((q) => [q.audio, ...(["write", "order"].includes(q.kind) ? [q.answer] : [])])
          .filter((x): x is string => !!x)
          .concat(
            [...allQuestions, ...foundations, ...visualQuestions, formPractice]
              .filter((q) => q.kind !== "live")
              .map(spokenText),
            vocabulary.map((w) => w.es),
            units.map((u) => u.example),
            ["Poco a poco."],
          ),
      ),
    ];

    expect(new Set(phrases.map(audioKey)).size).toBe(phrases.length);
    const manifest = JSON.parse(readFileSync("public/audio/manifest.json", "utf8"));

    for (const text of phrases) {
      const path = `public/audio/${audioKey(text)}.m4a`;

      expect(existsSync(path), text).toBe(true);
      expect(statSync(path).size, text).toBeGreaterThan(1000);
      expect(manifest[audioKey(text)]).toBe(text);

      for (const src of audioSources(text)) {
        expect(src.startsWith("/audio/"), text).toBe(true);
        expect(existsSync(`public${src}`), text).toBe(true);
        expect(statSync(`public${src}`).size, text).toBeGreaterThan(1000);
      }
    }
  });

  it("bundles every referenced scene illustration", () => {
    for (const q of questions.filter((q) => q.image)) {
      expect(existsSync(`public/illustrations/${q.image}.svg`)).toBe(true);
    }
  });

  it("bundles every word picture under its slug and keeps the emoji as a fallback", () => {
    const pictured = words.flatMap((t) => t.words).filter((w) => w.picture);

    expect(pictured.length).toBeGreaterThan(0);

    for (const w of pictured) {
      const slug = String(("key" in w && w.key) || w.es)
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/ /g, "-");

      expect(w.picture, w.es).toBe(slug);
      expect(w.visual, w.es).toBeTruthy();
      expect(existsSync(`public/illustrations/words/${w.picture}.webp`), w.es).toBe(true);
    }
  });
});

describe("topic vocabulary examples", () => {
  const ids = words.flatMap((t) => t.words.map((w) => ("key" in w && w.key) || w.es));

  it("gives every card exactly one example, keyed by card ID", () => {
    expect(Object.keys(examples).sort()).toEqual([...ids].sort());
  });

  it("keeps every example a short, punctuated sentence with a translation", () => {
    for (const { es, en } of Object.values(examples)) {
      expect(es).toMatch(/[.?!]$/);
      expect(es.includes("?")).toBe(es.includes("¿"));
      expect(countWords(es)).toBeLessThanOrEqual(12);
      expect(en.trim()).not.toBe("");
    }
  });
});
