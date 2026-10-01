import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";
import { formPractice } from "../../data/mock";

let recordingProps: {
  onRecorded: (b: Blob) => void;
  onStart: () => void;
  onRecordingChange: (v: boolean) => void;
};

vi.mock("./Recorder", () => ({
  Recorder: (props: typeof recordingProps) => {
    recordingProps = props;

    return null;
  },
}));

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A passage player deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const type = allQuestions.find((q) => q.kind === "type")!;
const order = allQuestions.find((q) => q.kind === "order")!;
const writing = allQuestions.find((q) => q.id === "u1-o2")!;
const speaking = allQuestions.find((q) => q.id === "u1-o3")!;

// All productive and objective save paths run against the actual component.
for (const q of [type, writing, speaking, formPractice]) {
  it(`exam isolation: ${q.kind}`, () => {
    const submitted = vi.fn(),
      evaluated = vi.fn();

    render(<QuestionCard q={q} exam onSubmit={submitted} onEvaluated={evaluated} />);

    if (q.kind === "form") {
      for (const f of q.fields!) {
        fireEvent.change(screen.getByRole("textbox", { name: f.label }), {
          target: { value: f.example },
        });
      }
    } else if (q.kind === "speak") {
      act(() => {
        recordingProps.onStart();
        recordingProps.onRecorded(new Blob(["speech"]));
      });
    } else {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: q.answer } });
    }

    click("Save answer");
    expect(submitted).toHaveBeenCalledOnce();
    expect(submitted.mock.calls[0][1]).toBe(q.kind === "type" ? true : null);
    expect(evaluated).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();

    expect(
      screen.queryByRole("heading", { name: "Let’s reflect on your answer" }),
    ).not.toBeInTheDocument();
  });
}

it.each([
  [allQuestions[0], "A small step forward"],
  [allQuestions.find((q) => q.kind === "listen")!, "Listen closely"],
  [order, "Build a sentence"],
  [type, "A small step forward"],
  [writing, "Your turn"],
  [speaking, "Your turn"],
  [formPractice, "Your turn"],
  // fallow-ignore-next-line complexity -- moved unchanged from src/test/question-rules.test.tsx (#190: move, don't rewrite)
])("renders only the appropriate controls for exercise case %#", (q, description) => {
  const { container } = render(<QuestionCard q={q} onSubmit={vi.fn()} />);

  expect(container.querySelector(".question-kind")).toHaveTextContent(
    `${q.skill} / ${description}`,
  );

  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);

  expect(screen.queryAllByRole("textbox")).toHaveLength(
    q.kind === "form" ? q.fields!.length : ["write", "type"].includes(q.kind) ? 1 : 0,
  );

  if (q.kind === "write" || q.kind === "type") {
    expect(screen.getByRole("textbox").tagName).toBe(q.kind === "write" ? "TEXTAREA" : "INPUT");
  }

  expect(container.querySelectorAll(".sentence-builder")).toHaveLength(q.kind === "order" ? 1 : 0);
  expect(container.querySelectorAll(".answer-option")).toHaveLength(q.options?.length || 0);

  expect(container.querySelectorAll(".self-checks")).toHaveLength(
    ["write", "speak", "form"].includes(q.kind) ? 1 : 0,
  );

  expect(container.querySelectorAll(".model-answer")).toHaveLength(0);
  expect(container.querySelectorAll(".feedback")).toHaveLength(0);
});

it("selecting a listening answer keeps the original playback running without restarting", async () => {
  const q = allQuestions.find((question) => question.id === "u1-a0")!;
  const evaluated = vi.fn();

  render(<QuestionCard q={q} onSubmit={vi.fn()} onEvaluated={evaluated} />);
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole("button", { name: q.answer }));
  expect(evaluated).toHaveBeenCalledExactlyOnceWith(q.answer, true, false);
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();
  expect(HTMLMediaElement.prototype.pause).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Stop audio" })).toBeInTheDocument();
});

it("saves an exam choice immediately without revealing or playing the answer", () => {
  const q = allQuestions[0];

  const submitted = vi.fn(),
    evaluated = vi.fn();

  render(<QuestionCard q={q} exam onSubmit={submitted} onEvaluated={evaluated} />);
  expect(screen.queryByRole("button", { name: "Save answer" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: q.answer }));
  expect(submitted).toHaveBeenCalledExactlyOnceWith(q.answer, true, false);
  expect(evaluated).not.toHaveBeenCalled();
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  expect(screen.queryByText(q.explanation)).not.toBeInTheDocument();
});

it("records feedback immediately so closing it cannot lose a mistake", () => {
  const evaluated = vi.fn();
  const q = allQuestions[0];

  render(<QuestionCard q={q} onSubmit={vi.fn()} onEvaluated={evaluated} />);
  fireEvent.click(screen.getByRole("button", { name: q.options![1] }));
  expect(evaluated).toHaveBeenCalledWith(q.options![1], false, false);
});

it("checks the numbered choice option when its digit is pressed", () => {
  const q = allQuestions.find((question) => question.id === "u2-v0")!;
  const evaluated = vi.fn();

  render(<QuestionCard q={q} onSubmit={vi.fn()} onEvaluated={evaluated} />);
  const first = q.options![0];

  expect(screen.getByRole("button", { name: first })).toHaveTextContent("1");
  fireEvent.keyDown(window, { key: "1", metaKey: true });
  expect(evaluated).not.toHaveBeenCalled();
  fireEvent.keyDown(window, { key: "1" });
  expect(evaluated).toHaveBeenCalledExactlyOnceWith(first, first === q.answer, false);
  fireEvent.keyDown(window, { key: "2" });
  expect(evaluated).toHaveBeenCalledOnce();
});

it("adds the numbered word to the tray and ignores a repeat of the same digit", () => {
  const q = allQuestions.find((question) => question.kind === "order")!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} />);
  fireEvent.keyDown(window, { key: "2" });
  fireEvent.keyDown(window, { key: "2" });
  const tray = screen.getByLabelText("Your sentence");

  expect(within(tray).getAllByRole("button")).toHaveLength(1);
  expect(tray).toHaveTextContent(q.tokens![1]);
});
