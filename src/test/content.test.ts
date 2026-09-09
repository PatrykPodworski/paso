import { describe, expect, it } from "vitest";
import type { Question } from "../data/types";
const taskSizes = (qs: Question[]) => {
  const counts = new Map<string, number>();
  for (const q of qs) {
    counts.set(q.task!, (counts.get(q.task!) || 0) + 1);
  }
  return [...counts.values()];
};
import {
  allLessons,
  allQuestions,
  foundations,
  units,
  vocabulary,
  visualQuestions,
} from "../data/curriculum";
import { formPractice, mockQuestions, mockSections } from "../data/mock";
import { countWords } from "../data/progress";
import { audioKey } from "../data/audio";
import { audioSources } from "../data/audio-sources";
import { existsSync, readFileSync, statSync } from "node:fs";
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
  it("has 96 different vocabulary entries", () => {
    expect(vocabulary).toHaveLength(96);
    expect(new Set(vocabulary.map((w) => w.es)).size).toBe(96);
  });
  it("keeps every message model within the official task-2 word target", () => {
    for (const q of questions.filter((q) => q.kind === "write")) {
      expect(countWords(q.answer), q.id).toBeGreaterThanOrEqual(q.minWords!);
      expect(countWords(q.answer), q.id).toBeLessThanOrEqual(q.maxWords!);
    }
  });
  it("matches the official task distributions and time limits", () => {
    expect(mockSections.map((s) => s.questions.length)).toEqual([25, 25, 2, 3]);
    expect(mockSections.map((s) => s.minutes)).toEqual([45, 25, 25, 10]);
    expect(taskSizes(mockSections[0].questions)).toEqual([5, 6, 6, 8]);
    expect(taskSizes(mockSections[1].questions)).toEqual([5, 5, 8, 7]);
  });
  it("bundles every listening clip and practice pronunciation as nonempty local audio", () => {
    const phrases = [
      ...new Set(
        questions
          .flatMap((q) => [
            q.audio,
            ...(["speak", "write", "order"].includes(q.kind) ? [q.answer] : []),
          ])
          .filter((x): x is string => !!x)
          .concat(
            [...allQuestions, ...foundations, ...visualQuestions, formPractice].map(
              (q) => q.pronunciation || q.audio || q.passage || q.answer,
            ),
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
});
