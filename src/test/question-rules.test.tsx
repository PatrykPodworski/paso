import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { QuestionCard } from "../components/QuestionCard";
import { LessonSession } from "../components/LessonSession";
import { Dialog } from "../components/Dialog";
import { audioSources } from "../data/audio-sources";
import { allQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import { emptyProgress } from "../data/progress";
import type { Question } from "../data/types";
let recordingProps: {
  onRecorded: (b: Blob) => void;
  onStart: () => void;
  onRecordingChange: (v: boolean) => void;
};
vi.mock("../components/Recorder", () => ({
  Recorder: (props: typeof recordingProps) => {
    recordingProps = props;
    return null;
  },
}));
const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const type = allQuestions.find((q) => q.kind === "type")!;
const order = allQuestions.find((q) => q.kind === "order")!;
const writing = allQuestions.find((q) => q.id === "u1-o2")!;
const speaking = allQuestions.find((q) => q.id === "u1-o3")!;
describe("exercise rules and submission modes", () => {
  it("requires non-whitespace typed text and Enter checks exactly once", () => {
    const evaluated = vi.fn();
    render(<QuestionCard q={type} onSubmit={vi.fn()} onEvaluated={evaluated} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "  " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(evaluated).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: type.answer } });
    fireEvent.keyDown(input, { key: "a" });
    expect(evaluated).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(evaluated).toHaveBeenCalledExactlyOnceWith(type.answer, true, false);
    expect(input).toBeDisabled();
  });
  it("inserts accents at the selected text and restores cursor focus", async () => {
    render(<QuestionCard q={type} onSubmit={vi.fn()} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "anos" } });
    input.setSelectionRange(1, 2);
    click("Insert ñ");
    expect(input).toHaveValue("años");
    await act(() => new Promise((r) => requestAnimationFrame(r)));
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input).toHaveFocus();
  });
  it("requires all tiles, permits removal, and reads the correct sentence after a wrong order", () => {
    render(<QuestionCard q={order} onSubmit={vi.fn()} />);
    const bank = document.querySelector(".word-bank")!;
    for (const token of order.tokens!) {
      fireEvent.click(within(bank as HTMLElement).getByRole("button", { name: token }));
    }
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(order.tokens!.length);
    expect(screen.getByRole("button", { name: "Check answer" })).toBeEnabled();
    const tray = document.querySelector(".sentence-tray")!;
    fireEvent.click(within(tray as HTMLElement).getAllByRole("button")[0]);
    expect(screen.getByRole("button", { name: "Check answer" })).toBeDisabled();
    fireEvent.click(within(bank as HTMLElement).getByRole("button", { name: order.tokens![0] }));
    const beforeCheck = vi.mocked(HTMLMediaElement.prototype.play).mock.calls.length;
    click("Check answer");
    expect(screen.getByRole("heading", { name: "A good moment to learn." })).toBeInTheDocument();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(beforeCheck + 1);
  });
  it("plays the tapped word before it lands in the sentence", () => {
    render(<QuestionCard q={order} onSubmit={vi.fn()} />);
    const bank = document.querySelector(".word-bank")!;
    const token = order.tokens![0];
    fireEvent.click(within(bank as HTMLElement).getByRole("button", { name: token }));
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    expect(play).toHaveBeenCalledOnce();
    expect((play.mock.instances[0] as HTMLAudioElement).src).toContain(audioSources(token)[0]);
  });
  it("reads the final tapped word before the completed sentence", async () => {
    render(<QuestionCard q={order} onSubmit={vi.fn()} />);
    const bank = document.querySelector(".word-bank")!;
    const words = order.answer.split(" ");
    for (const word of words) {
      fireEvent.click(within(bank as HTMLElement).getByRole("button", { name: word }));
    }
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    expect(play).toHaveBeenCalledTimes(words.length);
    fireEvent(play.mock.instances.at(-1) as HTMLAudioElement, new Event("ended"));
    await waitFor(() => expect(play).toHaveBeenCalledTimes(words.length + 1));
  });
  it("auto-submits when the last chip completes the correct sentence, also after a removal", async () => {
    render(<QuestionCard q={order} onSubmit={vi.fn()} />);
    const bank = document.querySelector(".word-bank")!;
    const tray = document.querySelector(".sentence-tray")!;
    const words = order.answer.split(" ");
    for (const word of words.slice(0, -1)) {
      fireEvent.click(within(bank as HTMLElement).getByRole("button", { name: word }));
    }
    const lastPlaced = words[words.length - 2];
    fireEvent.click(
      within(tray as HTMLElement)
        .getAllByRole("button")
        .at(-1)!,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.click(within(bank as HTMLElement).getByRole("button", { name: lastPlaced }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    const beforeLast = vi.mocked(HTMLMediaElement.prototype.play).mock.calls.length;
    fireEvent.click(
      within(bank as HTMLElement).getByRole("button", { name: words[words.length - 1] }),
    );
    expect(screen.getByRole("heading", { name: "¡Muy bien! You’ve got it." })).toBeInTheDocument();
    // The final tap reads its own word, then the completed sentence once it ends.
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    expect(play).toHaveBeenCalledTimes(beforeLast + 1);
    fireEvent(play.mock.instances.at(-1) as HTMLAudioElement, new Event("ended"));
    await waitFor(() => expect(play).toHaveBeenCalledTimes(beforeLast + 2));
    expect(screen.queryByRole("button", { name: "Check answer" })).not.toBeInTheDocument();
  });
  it.each(["{broken", "null", "[]", "4", '{"Nacionalidad":8}'])(
    "rejects malformed form draft %s",
    (draft) => {
      render(<QuestionCard q={formPractice} draft={draft} onSubmit={vi.fn()} />);
      expect(
        screen.getAllByRole("textbox").every((input) => (input as HTMLInputElement).value === ""),
      ).toBe(true);
      expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
    },
  );
  it("preserves form labels and refuses whitespace-only fields", () => {
    const onDraft = vi.fn(),
      evaluated = vi.fn();
    render(
      <QuestionCard
        q={formPractice}
        onDraft={onDraft}
        onSubmit={vi.fn()}
        onEvaluated={evaluated}
      />,
    );
    for (const f of formPractice.fields!) {
      fireEvent.change(screen.getByRole("textbox", { name: f.label }), {
        target: { value: f.example },
      });
    }
    const f = formPractice.fields![0];
    fireEvent.change(screen.getByRole("textbox", { name: f.label }), { target: { value: " " } });
    expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox", { name: f.label }), { target: { value: "Ana" } });
    click("Review my practice");
    expect(evaluated.mock.calls[0]).toEqual([
      expect.stringContaining(`${f.label}: Ana\nNacionalidad:`),
      null,
      false,
    ]);
    expect(JSON.parse(onDraft.mock.calls.at(-1)![0])[f.label]).toBe("Ana");
  });
  it.each([
    [29, "Your response is short"],
    [30, "Your word count (30) is within the practice target."],
    [40, "Your word count (40) is within the practice target."],
    [41, "keeping"],
  ])("explains the writing target boundary at %s words", (n, message) => {
    render(<QuestionCard q={writing} onSubmit={vi.fn()} draft={Array(n).fill("hola").join(" ")} />);
    click("Review my practice");
    expect(screen.getByText((text) => text.includes(message))).toBeInTheDocument();
  });
  it("checklist-only speaking submits ungraded practice", () => {
    const evaluated = vi.fn();
    render(<QuestionCard q={speaking} onSubmit={vi.fn()} onEvaluated={evaluated} />);
    const checkbox = screen.getByRole("checkbox", { name: speaking.checklist![0] });
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
    fireEvent.click(checkbox);
    click("Review my practice");
    expect(evaluated.mock.calls[0][1]).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Let’s reflect on your answer" }),
    ).toBeInTheDocument();
  });
  it("blocks review while recording and enables it after the take", () => {
    render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);
    act(() => {
      recordingProps.onStart();
      recordingProps.onRecordingChange(true);
    });
    expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
    act(() => {
      recordingProps.onRecordingChange(false);
      recordingProps.onRecorded(new Blob(["voice"]));
    });
    expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
  });
});
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

describe("lesson completion and dialog contracts", () => {
  it("records objective, assisted and creative answers without conflating their scores", () => {
    const choice = { ...allQuestions[0], audio: "Hola." };
    const qs: Question[] = [choice, { ...type, answer: "correcto" }, writing];
    const done = vi.fn(),
      attempt = vi.fn(),
      close = vi.fn(),
      draft = vi.fn();
    render(
      <LessonSession
        lesson={{
          id: "lesson",
          title: "Lesson",
          subtitle: "",
          minutes: 4,
          icon: "book",
          questions: qs,
        }}
        progress={emptyProgress()}
        onClose={close}
        onComplete={done}
        onAttempt={attempt}
        onDraft={draft}
      />,
    );
    click("Need a hand? Show transcript");
    click(choice.answer);
    expect(attempt).toHaveBeenCalledOnce();
    expect(attempt.mock.calls[0][0]).toMatchObject({
      questionId: choice.id,
      skill: choice.skill,
      correct: true,
      assisted: true,
      answer: choice.answer,
    });
    expect(attempt.mock.calls[0][0].id).toBeTruthy();
    expect(Number.isNaN(Date.parse(attempt.mock.calls[0][0].at))).toBe(false);
    click("Continue");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "incorrecto" } });
    click("Check answer");
    click("Continue");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Hola, Ana." } });
    expect(draft).toHaveBeenLastCalledWith(writing.id, "Hola, Ana.");
    click("Review my practice");
    click("Continue");
    expect(done).toHaveBeenCalledExactlyOnceWith(1, 2);
    expect(screen.getByText("1 answers used transcript assistance.")).toBeInTheDocument();
    expect(screen.getByText(/Your mistakes are waiting/)).toBeInTheDocument();
    click("Back to my journey");
    expect(close).toHaveBeenCalledOnce();
  });
  it("closes an untouched lesson immediately", () => {
    const close = vi.fn();
    render(
      <LessonSession
        lesson={{
          id: "lesson",
          title: "Lesson",
          subtitle: "",
          minutes: 4,
          icon: "book",
          questions: [type],
        }}
        progress={emptyProgress()}
        onClose={close}
        onComplete={vi.fn()}
        onAttempt={vi.fn()}
        onDraft={vi.fn()}
      />,
    );
    click("Close lesson");
    expect(close).toHaveBeenCalledOnce();
  });
  it("prevents native Escape closure, uses the latest callback, and restores focus and body scrolling", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    document.body.style.overflow = "auto";
    const first = vi.fn(),
      latest = vi.fn();
    const { rerender, unmount } = render(
      <Dialog label="Example" onClose={first}>
        Hello
      </Dialog>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Dialog label="Example" onClose={latest}>
        Hello
      </Dialog>,
    );
    const event = new Event("cancel", { cancelable: true });
    act(() => screen.getByRole("dialog").dispatchEvent(event));
    expect(event.defaultPrevented).toBe(true);
    expect(latest).toHaveBeenCalledOnce();
    expect(first).not.toHaveBeenCalled();
    unmount();
    expect(document.body.style.overflow).toBe("auto");
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});

it("rejects a mixed valid/invalid form draft as a whole", () => {
  render(
    <QuestionCard
      q={formPractice}
      draft={JSON.stringify({ Nacionalidad: "polaca", "Nombre y apellidos": 8 })}
      onSubmit={vi.fn()}
    />,
  );
  expect(
    screen.getAllByRole("textbox").every((input) => (input as HTMLInputElement).value === ""),
  ).toBe(true);
});
it("counts only form values toward the writing target", () => {
  render(<QuestionCard q={formPractice} onSubmit={vi.fn()} />);
  const values = [
    "Ana María López",
    "polaca",
    "Varsovia",
    "profesora de música",
    "polaco inglés español",
    "leer y escuchar música",
  ];
  for (const [i, field] of formPractice.fields!.entries()) {
    fireEvent.change(screen.getByRole("textbox", { name: field.label }), {
      target: { value: values[i] },
    });
  }
  expect(
    screen.getByText("15 words · target 15–25. Use fictional personal details."),
  ).toBeInTheDocument();
});
it("stores a placeholder answer for a practised-aloud submission", () => {
  const submitted = vi.fn();
  render(<QuestionCard q={speaking} onSubmit={submitted} />);
  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  click("Review my practice");
  click("Continue");
  expect(submitted).toHaveBeenCalledWith(
    "Practised aloud. Audio must be reviewed from the downloaded recording.",
    null,
    false,
  );
});

it.each([
  [allQuestions[0], "A small step forward"],
  [allQuestions.find((q) => q.kind === "listen")!, "Listen closely"],
  [order, "Build a sentence"],
  [type, "A small step forward"],
  [writing, "Your turn"],
  [speaking, "Your turn"],
  [formPractice, "Your turn"],
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
it("each selected sentence tile is disabled until it is removed", () => {
  const { container } = render(<QuestionCard q={order} onSubmit={vi.fn()} />);
  const buttons = Array.from(container.querySelectorAll(".word-bank button"));
  fireEvent.click(buttons[0]);
  expect(buttons[0]).toBeDisabled();
  for (const b of buttons.slice(1)) {
    expect(b).toBeEnabled();
  }
  fireEvent.click(container.querySelector(".sentence-tray button")!);
  expect(buttons[0]).toBeEnabled();
});

it("returns to the editable state when revising an answer", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} draft="Hola, Ana." />);
  click("Review my practice");
  expect(
    screen.getByRole("heading", { name: "Let’s reflect on your answer" }),
  ).toBeInTheDocument();
  click("Revise my answer");
  expect(screen.getByRole("textbox")).toBeEnabled();
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeInTheDocument();
});
it("unchecking one self-review point retains the others", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
  const boxes = screen.getAllByRole("checkbox");
  fireEvent.click(boxes[0]);
  fireEvent.click(boxes[1]);
  fireEvent.click(boxes[0]);
  expect(boxes[0]).not.toBeChecked();
  expect(boxes[1]).toBeChecked();
});
it("a new recording clears the practised flag and blocks review", () => {
  render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);
  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
  act(() => recordingProps.onStart());
  expect(screen.getByRole("checkbox", { name: /I practised aloud/ })).not.toBeChecked();
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
});
