import { describe, expect, it } from "vitest";
import { resumeIndex } from "./resumeIndex";
import { allLessons } from "./curriculum";
import { askingLesson } from "./asking-questions/askingQuestions";
import { placementLesson } from "./placement/placement";
import { weekdaysLesson } from "./weekdays/weekdays";
import { emptySnapshot, questionState } from "../test/progress";
import type { Question } from "./types";

const lesson = { ...allLessons[0], questions: allLessons[0].questions.slice(0, 4) };

const answered = (count: number) => {
  const progress = emptySnapshot();

  for (const q of lesson.questions.slice(0, count)) {
    progress.questions[q.id] = questionState();
  }

  return progress;
};

it("opens an unfinished lesson at its first exercise without a stored answer", () => {
  expect(resumeIndex(lesson, answered(3))).toBe(3);
  expect(resumeIndex(lesson, answered(1))).toBe(1);
});

it("opens at a gap even when a later exercise has an answer", () => {
  const progress = answered(4);

  delete progress.questions[lesson.questions[1].id];
  expect(resumeIndex(lesson, progress)).toBe(1);
});

it("starts from the first exercise when nothing is left to answer or nothing was answered", () => {
  expect(resumeIndex(lesson, answered(0))).toBe(0);
  expect(resumeIndex(lesson, answered(4))).toBe(0);
});

it("starts a finished lesson over", () => {
  const progress = answered(3);

  progress.completed[lesson.id] = { score: 3, total: 4, at: "2026-09-09T08:00:00.000Z" };
  expect(resumeIndex(lesson, progress)).toBe(0);
});

it("starts a practice session from its first exercise", () => {
  expect(resumeIndex({ ...lesson, id: "practice-all" }, answered(3))).toBe(0);
});

it("reopens at the teaching cards just before the first exercise without a stored answer", () => {
  const card = (id: string): Question => ({
    id,
    kind: "teach",
    skill: "reading",
    prompt: "A new form",
    answer: "",
    explanation: "How the form works.",
  });

  const [a, b, c] = lesson.questions;
  const taught = { ...lesson, questions: [card("intro"), a, card("form"), b, c] };
  const progress = answered(1);

  expect(resumeIndex(taught, progress)).toBe(2);
  progress.questions[b.id] = questionState();
  expect(resumeIndex(taught, progress)).toBe(4);
  expect(resumeIndex(taught, answered(0))).toBe(0);
  expect(resumeIndex(taught, answered(4))).toBe(0);
});

describe("a lesson from the asking-questions set", () => {
  // L01 opens with its teaching card, then E01, E02 …
  const setLesson = askingLesson("aq-l01", () => 0);

  const answeredIds = (...ids: string[]) => {
    const progress = emptySnapshot();

    for (const id of ids) {
      progress.questions[id] = questionState();
    }

    return progress;
  };

  it("reopens an unfinished set lesson at its first exercise without a stored answer", () => {
    expect(resumeIndex(setLesson, answeredIds("AQ-T01-E01"))).toBe(2);
    expect(setLesson.questions[2].id).toBe("AQ-T01-E02");
  });

  it("reopens at the teaching card when only the card was passed", () => {
    expect(resumeIndex(setLesson, answeredIds())).toBe(0);
    expect(setLesson.questions[0].kind).toBe("teach");
  });

  it("starts a finished set lesson over", () => {
    const progress = answeredIds("AQ-T01-E01");

    expect(resumeIndex(setLesson, progress)).toBe(2);
    progress.completed[setLesson.id] = { score: 18, total: 18, at: "2026-11-09T08:00:00.000Z" };
    expect(resumeIndex(setLesson, progress)).toBe(0);
  });

  it("starts a practice session made of set questions from its first exercise", () => {
    const progress = answeredIds("AQ-T01-E01");

    const session = {
      ...setLesson,
      id: "practice-mistakes",
      questions: setLesson.questions.slice(1, 4),
    };

    expect(resumeIndex(setLesson, progress)).toBe(2);
    expect(resumeIndex(session, progress)).toBe(0);
  });
});

it("reopens an unfinished weekdays L01 with E01 answered at E02", () => {
  const l01 = weekdaysLesson("wd-l01", () => 0);
  const progress = emptySnapshot();

  progress.questions["WD-T01-E01"] = questionState();

  expect(l01.questions[resumeIndex(l01, progress)].id).toBe("WD-T01-E02");
});

it("reopens an unfinished placement L01 with E01 answered at E02", () => {
  const l01 = placementLesson("pl-l01", () => 0);
  const progress = emptySnapshot();

  progress.questions["SP-T01-E01"] = questionState();

  expect(l01.questions[resumeIndex(l01, progress)].id).toBe("SP-T01-E02");
});
