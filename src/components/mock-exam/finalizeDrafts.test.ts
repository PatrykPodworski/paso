import { expect, it } from "vitest";
import { finalizeDrafts } from "./finalizeDrafts";
import { fresh } from "./useMockRun";

const writing = (patch: Partial<ReturnType<typeof fresh>>) => ({
  ...fresh(),
  section: 2,
  stage: "run" as const,
  ...patch,
});

it("saves an unsaved message draft as the answer", () => {
  const run = writing({ drafts: { "mock-w2": "Hola, Ana. Nos vemos el domingo." } });

  expect(finalizeDrafts(run).answers).toEqual({ "mock-w2": "Hola, Ana. Nos vemos el domingo." });
});

it("saves a form draft as the labelled text Save answer stores", () => {
  const run = writing({
    drafts: {
      "mock-w1": JSON.stringify({ "Nombre y apellidos": "Elena García", Ciudad: "Varsovia" }),
    },
  });

  expect(finalizeDrafts(run).answers).toEqual({
    "mock-w1":
      "Nombre y apellidos: Elena García\nNacionalidad: \nCiudad: Varsovia\nProfesión: \nLenguas: \nAficiones: ",
  });
});

it("replaces an older saved answer with the newer draft", () => {
  const run = writing({ answers: { "mock-w2": "Hola." }, drafts: { "mock-w2": "Hola, Ana." } });

  expect(finalizeDrafts(run).answers).toEqual({ "mock-w2": "Hola, Ana." });
});

it("leaves a question unanswered when its draft is empty after trimming", () => {
  const run = writing({
    answers: { "mock-w1": "Nombre y apellidos: Elena", "mock-w2": "Hola." },
    drafts: { "mock-w1": JSON.stringify({ Nacionalidad: " " }), "mock-w2": "  \n" },
  });

  expect(finalizeDrafts(run).answers).toEqual({});
});

it("keeps answers without a draft and ignores drafts outside the section's questions", () => {
  const run = writing({
    answers: { "mock-w2": "Hola.", "earlier-section": "B" },
    drafts: { prep: "nombre, edad" },
  });

  expect(finalizeDrafts(run)).toMatchObject({
    answers: { "mock-w2": "Hola.", "earlier-section": "B" },
    drafts: { prep: "nombre, edad" },
    stage: "run",
  });
});
