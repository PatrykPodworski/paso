import { describe, expect, it } from "vitest";
import { spokenText } from "./audio";
import type { Question } from "./types";

const question = (fields: Partial<Question>): Question => ({
  id: "q",
  kind: "choice",
  skill: "reading",
  prompt: "Prompt",
  answer: "la respuesta",
  explanation: "",
  ...fields,
});

describe("spokenText", () => {
  it("speaks the pronunciation first", () => {
    expect(
      spokenText(question({ pronunciation: "hola", audio: "el audio", passage: "el texto" })),
    ).toBe("hola");
  });

  it("falls back to the listening audio, then the passage, then the answer", () => {
    expect(spokenText(question({ audio: "el audio", passage: "el texto" }))).toBe("el audio");
    expect(spokenText(question({ passage: "el texto" }))).toBe("el texto");
    expect(spokenText(question({}))).toBe("la respuesta");
  });

  it("skips empty fields", () => {
    expect(spokenText(question({ pronunciation: "", audio: "", passage: "el texto" }))).toBe(
      "el texto",
    );
  });
});
