import { describe, expect, it } from "vitest";
import type { Question } from "../../data/types";
import { questionClips } from "./questionClips";

const question = (fields: Partial<Question>): Question => ({
  id: "q",
  kind: "choice",
  skill: "reading",
  prompt: "Prompt",
  answer: "Yo soy Marta.",
  explanation: "",
  ...fields,
});

describe("question clips", () => {
  it("loads every word of a sentence to build and the sentence read after it", () => {
    const q = question({ kind: "order", tokens: ["Yo", "soy", "Marta."] });

    expect(questionClips(q, false)).toEqual(["Yo soy Marta.", "Yo", "soy", "Marta."]);
  });

  it("loads the listening audio, in an exam too", () => {
    const q = question({ kind: "listen", audio: "Hola, ¿qué tal?" });

    expect(questionClips(q, false)).toEqual(["Hola, ¿qué tal?"]);
    expect(questionClips(q, true)).toEqual(["Hola, ¿qué tal?"]);
  });

  it("loads the pronunciation and the reading passage outside an exam", () => {
    const q = question({ pronunciation: "Me llamo Ana.", passage: "Ana vive en Madrid." });

    expect(questionClips(q, false)).toEqual(["Me llamo Ana.", "Ana vive en Madrid."]);
  });

  it("loads no answer or passage audio in an exam or a writing task", () => {
    const q = question({ passage: "Ana vive en Madrid." });

    expect(questionClips(q, true)).toEqual([]);
    expect(questionClips({ ...q, kind: "write" }, false)).toEqual([]);
  });
});
