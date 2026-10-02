import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { KEY, click, mount, run, seed, setupMockExam } from "../../test/mockExam";
import { fresh, load } from "./useMockRun";

setupMockExam();

it.each([
  "{bad",
  "null",
  JSON.stringify(run({ section: -1 })),
  JSON.stringify(run({ section: 4 })),
  JSON.stringify(run({ section: 0.5 })),
  JSON.stringify(run({ stage: "unknown" })),
  JSON.stringify(run({ answers: null })),
])("recovers invalid saved state %s", (raw) => {
  localStorage.setItem(KEY, raw);
  mount();
  expect(screen.getByRole("button", { name: "Start exam rehearsal" })).toBeInTheDocument();
});

it("keeps working with a visible warning if browser persistence fails", () => {
  vi.spyOn(localStorage, "setItem").mockImplementation(() => {
    throw new Error("full");
  });

  mount();
  expect(screen.getByRole("status")).toHaveTextContent("could not save");
  click("Start exam rehearsal");
  expect(screen.getByRole("timer")).toHaveTextContent("45:00");
});

it.each([-1, 25, 1.5])("recovers an out-of-range stored question index %s", (index) => {
  seed({ index });
  mount();
  expect(screen.getByRole("button", { name: "Start exam rehearsal" })).toBeInTheDocument();
});

it("restores a valid saved run and fills fields older saves lack", () => {
  localStorage.setItem(
    "paso-mock-v1",
    JSON.stringify({ section: 1, index: 2, stage: "run", answers: { a: "b" } }),
  );

  expect(load()).toEqual({ ...fresh(), section: 1, index: 2, stage: "run", answers: { a: "b" } });
});
