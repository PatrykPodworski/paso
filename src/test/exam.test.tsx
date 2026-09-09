import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MockExam } from "../components/MockExam";
import { emptyProgress } from "../data/progress";
import { mockSections } from "../data/mock";
import { Blob as NodeBlob } from "node:buffer";
const KEY = "paso-mock-v1";
const now = new Date("2026-09-09T10:00:00Z").getTime();
const run = (patch: Record<string, unknown> = {}) => ({
  section: 0,
  index: 0,
  stage: "run",
  answers: {},
  deadline: now + 45000,
  started: new Date(now).toISOString(),
  drafts: {},
  ...patch,
});
const seed = (patch: Record<string, unknown> = {}) =>
  localStorage.setItem(KEY, JSON.stringify(run(patch)));
const state = () => JSON.parse(localStorage.getItem(KEY)!);
const mount = () => {
  const onResult = vi.fn();
  return { ...render(<MockExam progress={emptyProgress()} onResult={onResult} />), onResult };
};
const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.useFakeTimers();
  vi.setSystemTime(now);
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("No AI in exam");
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("exam rehearsal state machine", () => {
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
  it("starts a new 45-minute reading section and persists its deadline", () => {
    mount();
    click("Start exam rehearsal");
    expect(screen.getByRole("timer")).toHaveTextContent("45:00");
    expect(state()).toMatchObject({
      section: 0,
      index: 0,
      stage: "run",
      deadline: now + 45 * 60000,
      started: new Date(now).toISOString(),
      answers: {},
    });
    expect(screen.getByRole("button", { name: "← Previous question" })).toBeDisabled();
  });
  it("saves an answer, permits previous/skip navigation and hides corrections until review", () => {
    seed();
    mount();
    const first = mockSections[0].questions[0];
    click(first.answer);
    expect(state().answers[first.id]).toBe(first.answer);
    expect(state().index).toBe(1);
    expect(screen.queryByText(first.explanation)).not.toBeInTheDocument();
    click("← Previous question");
    expect(screen.getByRole("button", { name: first.answer })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    click("Skip for now →");
    expect(state().index).toBe(1);
    click("Finish section");
    expect(screen.getByRole("alert")).toHaveTextContent("24 unanswered");
    click("Keep working");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(state().stage).toBe("run");
  });
  it("counts correct answers only, reveals models after locking, and starts listening at 25 minutes", () => {
    const [a, b] = mockSections[0].questions;
    seed({ answers: { [a.id]: a.answer, [b.id]: "wrong" } });
    mount();
    click("Finish section");
    click("Finish & review");
    expect(screen.getByRole("heading", { name: "1 out of 25." })).toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    expect(screen.getByText(a.explanation)).toBeInTheDocument();
    click("Continue to listening");
    expect(state()).toMatchObject({
      section: 1,
      index: 0,
      stage: "run",
      deadline: now + 25 * 60000,
    });
    expect(screen.getByRole("timer")).toHaveTextContent("25:00");
    expect(screen.queryByRole("button", { name: /Show transcript/ })).not.toBeInTheDocument();
  });
  it("automatically ends a section exactly at its deadline and dismisses confirmation", () => {
    seed({ deadline: now + 2000 });
    mount();
    expect(screen.getByRole("timer")).toHaveTextContent("00:02");
    click("Finish section");
    act(() => vi.advanceTimersByTime(1000));
    expect(state().stage).toBe("run");
    act(() => vi.advanceTimersByTime(1000));
    expect(state().stage).toBe("review");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "0 out of 25." })).toBeInTheDocument();
  });
  it("honours an expired deadline when returning to the page", () => {
    seed({ deadline: now - 1 });
    mount();
    expect(state().stage).toBe("review");
  });
  it.each([0, 1])(
    "last-question save or skip opens confirmation without going out of bounds: %s",
    (mode) => {
      const questions = mockSections[0].questions;
      seed({ index: questions.length - 1 });
      mount();
      if (mode === 0) {
        click(questions.at(-1)!.answer);
      } else {
        click("Skip for now →");
      }
      expect(state().index).toBe(24);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    },
  );
  it("saves form drafts as JSON and submits labelled content without model grading", () => {
    seed({ section: 2, deadline: now + 25 * 60000 });
    mount();
    const q = mockSections[2].questions[0];
    for (const f of q.fields!) {
      fireEvent.change(screen.getByRole("textbox", { name: f.label }), {
        target: { value: f.example },
      });
    }
    expect(JSON.parse(state().drafts[q.id])).toEqual(
      Object.fromEntries(q.fields!.map((f) => [f.label, f.example])),
    );
    click("Save answer");
    expect(state().answers[q.id]).toContain("Nacionalidad:");
    expect(state().index).toBe(1);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("keeps a cleared writing draft empty when revisiting an already submitted response", () => {
    const q = mockSections[2].questions[1];
    seed({ section: 2, index: 1, answers: { [q.id]: "Old answer" }, drafts: { [q.id]: "" } });
    mount();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
  it("starts oral preparation, persists notes, then gives a separate ten minutes to speak", () => {
    seed({ section: 2, stage: "review" });
    mount();
    click("Continue to speaking preparation");
    expect(state()).toMatchObject({ section: 3, index: 0, stage: "prep", deadline: now + 600000 });
    expect(screen.getByRole("timer")).toHaveTextContent("10:00");
    fireEvent.change(screen.getByRole("textbox", { name: "Your preparation notes" }), {
      target: { value: "nombre, edad" },
    });
    expect(state().drafts.prep).toBe("nombre, edad");
    act(() => vi.advanceTimersByTime(600000));
    expect(state()).toMatchObject({ stage: "run", deadline: now + 1200000 });
    expect(screen.getByRole("timer")).toHaveTextContent("10:00");
    expect(screen.getByRole("button", { name: "Save answer" })).toBeDisabled();
  });
  it("can finish oral preparation early without consuming speaking time", () => {
    seed({ section: 3, stage: "prep" });
    mount();
    act(() => vi.advanceTimersByTime(1000));
    click("I’m ready · start speaking");
    expect(state()).toMatchObject({ stage: "run", deadline: now + 601000 });
    expect(screen.getByRole("timer")).toHaveTextContent("10:00");
  });
  it("stores only objective results once and requires both human scores before a verdict", () => {
    const answers = Object.fromEntries(
      [...mockSections[0].questions, ...mockSections[1].questions].map((q) => [q.id, q.answer]),
    );
    seed({ section: 3, stage: "review", answers });
    const { onResult } = mount();
    click("See my results");
    expect(onResult).toHaveBeenCalledExactlyOnceWith({
      at: new Date(now).toISOString(),
      reading: 25,
      listening: 25,
    });
    expect(screen.getAllByText("Human review")).toHaveLength(2);
    expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
    const writing = screen.getByRole("spinbutton", { name: "Writing score /25" }),
      speaking = screen.getByRole("spinbutton", { name: "Speaking score /25" });
    fireEvent.change(writing, { target: { value: "5" } });
    expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
    fireEvent.change(speaking, { target: { value: "5" } });
    expect(screen.getByText(/Both groups meet 30/)).toBeInTheDocument();
    fireEvent.change(speaking, { target: { value: "4.99" } });
    expect(screen.getByText(/At least one group is below/)).toBeInTheDocument();
    for (const value of ["-1", "25.01", ""]) {
      fireEvent.change(speaking, { target: { value } });
      expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
    }
    fireEvent.change(speaking, { target: { value: "25" } });
    fireEvent.change(writing, { target: { value: "26" } });
    expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
    click("Return to exam overview");
    expect(state().stage).toBe("intro");
    expect(state().answers).toEqual({});
    expect(onResult).toHaveBeenCalledOnce();
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
});
it.each([-1, 25, 1.5])("recovers an out-of-range stored question index %s", (index) => {
  seed({ index });
  mount();
  expect(screen.getByRole("button", { name: "Start exam rehearsal" })).toBeInTheDocument();
});
it.each([
  [0, 0],
  [0, 25],
  [25, 0],
  [25, 25],
])("accepts inclusive human score limits %s and %s", (writing, speaking) => {
  seed({ section: 3, stage: "done" });
  mount();
  fireEvent.change(screen.getByRole("spinbutton", { name: "Writing score /25" }), {
    target: { value: String(writing) },
  });
  fireEvent.change(screen.getByRole("spinbutton", { name: "Speaking score /25" }), {
    target: { value: String(speaking) },
  });
  expect(screen.queryByText(/A pass cannot be determined/)).not.toBeInTheDocument();
  expect(screen.getByText(/At least one group is below/)).toBeInTheDocument();
});
it("rejects negative and excessive writing scores independently", () => {
  seed({ section: 3, stage: "done" });
  mount();
  fireEvent.change(screen.getByRole("spinbutton", { name: "Speaking score /25" }), {
    target: { value: "25" },
  });
  for (const value of ["-1", "25.01", ""]) {
    fireEvent.change(screen.getByRole("spinbutton", { name: "Writing score /25" }), {
      target: { value },
    });
    expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  }
});
it("exports objective scores with all responses and revokes the temporary URL", async () => {
  vi.stubGlobal("Blob", NodeBlob);
  const create = vi.fn((_blob: Blob) => "blob:exam");
  vi.stubGlobal(
    "URL",
    Object.assign(class extends URL {}, { createObjectURL: create, revokeObjectURL: vi.fn() }),
  );
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  const question = mockSections[0].questions[0];
  seed({ section: 3, stage: "done", answers: { [question.id]: question.answer } });
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Export responses for review" }));
  expect(create.mock.calls[0][0].type).toBe("application/json");
  const exported = JSON.parse(await create.mock.calls[0][0].text());
  expect(exported).toMatchObject({
    reading: 1,
    listening: 0,
    writing: "Requires human assessment",
    speaking: "Requires human assessment",
  });
  expect(exported.responses).toHaveLength(55);
  expect(exported.responses[0]).toMatchObject({
    response: question.answer,
    prompt: question.prompt,
    model: question.answer,
    explanation: question.explanation,
    task: question.task,
    skill: "Reading",
  });
  expect(exported.responses.slice(1).every((r: { response: string }) => r.response === "")).toBe(
    true,
  );
  expect((click.mock.instances[0] as HTMLAnchorElement).download).toBe("paso-exam-responses.json");
  expect(click).toHaveBeenCalledOnce();
  act(() => vi.advanceTimersByTime(1000));
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:exam");
});
