import { expect, it } from "vitest";
import type { MockRun } from "../../data/types";
import { draftAnswers } from "./draftAnswers";

const writing = (patch: Partial<MockRun>): MockRun => ({
  section: 2,
  index: 0,
  stage: "run",
  answers: {},
  deadline: 0,
  started: "",
  drafts: {},
  scores: {},
  talks: {},
  ...patch,
});

it("turns an unsaved message draft into the answer", () => {
  const run = writing({ drafts: { "mock-w2": "Hola, Ana. Nos vemos el domingo." } });

  expect(draftAnswers(run)).toEqual({ "mock-w2": "Hola, Ana. Nos vemos el domingo." });
});

it("turns a form draft into the labelled text Save answer stores", () => {
  const run = writing({
    drafts: {
      "mock-w1": JSON.stringify({ "Nombre y apellidos": "Elena García", Ciudad: "Varsovia" }),
    },
  });

  expect(draftAnswers(run)).toEqual({
    "mock-w1":
      "Nombre y apellidos: Elena García\nNacionalidad: \nCiudad: Varsovia\nProfesión: \nLenguas: \nAficiones: ",
  });
});

it("replaces an older saved answer with the newer draft", () => {
  const run = writing({ answers: { "mock-w2": "Hola." }, drafts: { "mock-w2": "Hola, Ana." } });

  expect(draftAnswers(run)).toEqual({ "mock-w2": "Hola, Ana." });
});

it("clears an answer whose draft is empty after trimming", () => {
  const run = writing({
    answers: { "mock-w1": "Nombre y apellidos: Elena", "mock-w2": "Hola." },
    drafts: { "mock-w1": JSON.stringify({ Nacionalidad: " " }), "mock-w2": "  \n" },
  });

  expect(draftAnswers(run)).toEqual({ "mock-w1": "", "mock-w2": "" });
});

it("leaves answers without a draft alone and ignores drafts outside the section", () => {
  const run = writing({ answers: { "mock-w2": "Hola." }, drafts: { prep: "nombre, edad" } });

  expect(draftAnswers(run)).toEqual({});
});

it("keeps a long form answer within what the server stores", () => {
  const run = writing({ drafts: { "mock-w1": JSON.stringify({ Aficiones: "a".repeat(4000) }) } });

  expect(draftAnswers(run)["mock-w1"]).toHaveLength(4000);
});
