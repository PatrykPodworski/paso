import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";
import { formPractice, mockQuestions } from "../../data/mock";

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
  // A shared listening recording deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const writing = allQuestions.find((q) => q.id === "u1-o2")!;
const speaking = mockQuestions.find((q) => q.kind === "speak")!;

const write = (text: string) =>
  fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });

it("counts ticked self-review points and hides the coming-soon note after review", () => {
  render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);
  const note = "AI feedback on your speaking is coming soon.";

  expect(screen.getByText(note)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("checkbox", { name: speaking.checklist![0] }));
  fireEvent.click(screen.getByRole("checkbox", { name: speaking.checklist![1] }));
  fireEvent.click(screen.getByRole("checkbox", { name: speaking.checklist![1] }));
  fireEvent.click(screen.getByRole("checkbox", { name: speaking.checklist![2] }));
  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  click("Review my practice");

  expect(
    screen.getByText(`2/${speaking.checklist!.length} self-review points checked.`, {
      exact: false,
    }),
  ).toBeInTheDocument();

  expect(screen.getByText("Your practice is saved.")).toBeInTheDocument();
  expect(screen.queryByText(note)).not.toBeInTheDocument();
});

it("shows which self-review points are ticked", () => {
  render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);

  const [first, second, third] = speaking.checklist!.map((name) =>
    screen.getByRole("checkbox", { name }),
  );

  fireEvent.click(first);
  fireEvent.click(third);
  fireEvent.click(third);
  expect(first).toBeChecked();
  expect(second).not.toBeChecked();
  expect(third).not.toBeChecked();
});

it("gives writing no self-review checklist and no coming-soon note", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
  write(writing.answer);
  expect(screen.queryByText("Your self-review checklist")).not.toBeInTheDocument();
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  expect(screen.queryByText(/coming soon/)).not.toBeInTheDocument();
  click("Review my practice");
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
});

it("hides the self-review checklist in the exam", () => {
  render(<QuestionCard q={formPractice} exam onSubmit={vi.fn()} />);
  expect(screen.queryByText("Your self-review checklist")).not.toBeInTheDocument();
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
});

it("speaking requires the practised-aloud attestation, not checklist ticks alone", () => {
  const evaluated = vi.fn();

  render(<QuestionCard q={speaking} onSubmit={vi.fn()} onEvaluated={evaluated} />);
  fireEvent.click(screen.getByRole("checkbox", { name: speaking.checklist![0] }));
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
  click("Review my practice");

  expect(evaluated).toHaveBeenCalledExactlyOnceWith(
    "Practised aloud. Audio must be reviewed from the downloaded recording.",
    null,
    false,
  );
});

it("blocks review while recording and enables it after the take", () => {
  render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);

  act(() => {
    recordingProps.onStart();
    recordingProps.onRecordingChange(true);
  });

  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();

  act(() => {
    recordingProps.onRecordingChange(false);
    recordingProps.onRecorded(new Blob(["voice"]));
  });

  expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
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

it("unchecking one self-review point retains the others", () => {
  render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);
  const [first, second] = speaking.checklist!.map((name) => screen.getByRole("checkbox", { name }));

  fireEvent.click(first);
  fireEvent.click(second);
  fireEvent.click(first);
  expect(first).not.toBeChecked();
  expect(second).toBeChecked();
});

it("a new recording clears the practised flag and blocks review", () => {
  render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);
  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
  act(() => recordingProps.onStart());
  expect(screen.getByRole("checkbox", { name: /I practised aloud/ })).not.toBeChecked();
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
});
