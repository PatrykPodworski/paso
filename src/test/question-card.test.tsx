import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QuestionCard } from "../components/QuestionCard";
import { stopAudio } from "../components/AudioButton";
import { allQuestions, visualQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import type { Question } from "../data/types";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  act(stopAudio);
  cleanup();
  vi.restoreAllMocks();
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const choice = allQuestions[0];
const wrong = choice.options!.find((o) => o !== choice.answer)!;
const listen = allQuestions.find((q) => q.kind === "listen")!;
const type = allQuestions.find((q) => q.id === "u1-o1")!;
const order = allQuestions.find((q) => q.kind === "order")!;
const writing = allQuestions.find((q) => q.id === "u1-o2")!;

const write = (text: string) =>
  fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });

const words = (n: number) => Array(n).fill("hola").join(" ");

describe("question card sections", () => {
  it("focuses the new heading and scrolls its dialog to the top when the question changes", () => {
    const dialog = document.body.appendChild(document.createElement("dialog"));

    dialog.setAttribute("open", "");
    const next = allQuestions[1];

    const { rerender } = render(<QuestionCard key={choice.id} q={choice} onSubmit={vi.fn()} />, {
      container: dialog,
    });

    expect(screen.getByRole("heading", { name: choice.prompt })).toHaveFocus();
    Object.defineProperty(dialog, "scrollTop", { value: 240, writable: true });
    rerender(<QuestionCard key={next.id} q={next} onSubmit={vi.fn()} />);
    expect(screen.getByRole("heading", { name: next.prompt })).toHaveFocus();
    expect(dialog.scrollTop).toBe(0);
  });

  it.each([
    ["cafe", "Illustrated café counter with coffee and bread"],
    ["town", "A neighborhood with a park, pharmacy and train station"],
    ["train", "A train waiting at a station"],
  ])("shows the %s scene illustration", (scene, alt) => {
    render(<QuestionCard q={visualQuestions.find((q) => q.image === scene)!} onSubmit={vi.fn()} />);

    expect(screen.getByRole("img", { name: alt })).toHaveAttribute(
      "src",
      `/illustrations/${scene}.svg`,
    );
  });

  it("shows the vocabulary illustration", () => {
    const q = allQuestions.find((question) => question.visual)!;

    render(<QuestionCard q={q} onSubmit={vi.fn()} />);

    expect(screen.getByRole("img", { name: "Vocabulary illustration" })).toHaveTextContent(
      q.visual!,
    );
  });

  it("shows the transcript and its assistance note only on request", () => {
    render(<QuestionCard q={listen} onSubmit={vi.fn()} />);
    expect(screen.queryByText(/Transcript assistance is recorded/)).not.toBeInTheDocument();
    click("Need a hand? Show transcript");

    expect(screen.getByText(/Transcript assistance is recorded/).parentElement).toHaveTextContent(
      listen.audio!,
    );

    click("Hide transcript");
    expect(screen.queryByText(/Transcript assistance is recorded/)).not.toBeInTheDocument();
  });

  it("marks the picked wrong option and reveals the right one", () => {
    render(<QuestionCard q={choice} onSubmit={vi.fn()} />);
    click(wrong);
    expect(screen.getByRole("button", { name: wrong })).toHaveClass("incorrect");
    expect(screen.getByRole("button", { name: wrong })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: choice.answer })).toHaveClass("correct");
    expect(screen.getByRole("button", { name: choice.answer })).not.toHaveClass("incorrect");
  });

  it.each([
    [3, false],
    [5, true],
  ])("lays out %i options in the wide grid: %s", (count, many) => {
    const options = ["uno", "dos", "tres", "cuatro", "cinco"].slice(0, count);

    render(<QuestionCard q={{ ...choice, options }} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "uno" }).parentElement!.classList.contains("many-options"),
    ).toBe(many);
  });

  it("hints at the empty sentence tray until the first word is picked", () => {
    render(<QuestionCard q={order} onSubmit={vi.fn()} />);
    expect(screen.getByText("Tap the words below to build your sentence…")).toBeInTheDocument();
    click(order.tokens![0]);

    expect(
      screen.queryByText("Tap the words below to build your sentence…"),
    ).not.toBeInTheDocument();
  });

  it.each([
    [3, "word-count outside"],
    [35, "word-count"],
    [45, "word-count outside"],
  ])("counts %i written words against the target", (n, className) => {
    render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
    write(words(n));
    expect(screen.getByText(`${n} / 30–40 words`)).toHaveAttribute("class", className);
  });

  it.each([
    ["an exam", choice, true, "Answers are reviewed after the section."],
    ["practice", writing, false, "A little imperfect Spanish is progress."],
    ["an objective question", type, false, "Take your time. Every mistake is a chance to learn."],
  ])("shows the footer note for %s", (_, q, exam, note) => {
    render(<QuestionCard q={q} exam={exam} onSubmit={vi.fn()} />);
    expect(screen.getByText(note)).toBeInTheDocument();
  });

  it("shows the learner's wrong answer next to the correct one", () => {
    render(<QuestionCard q={choice} onSubmit={vi.fn()} />);
    click(wrong);

    expect(screen.getByRole("status")).toHaveTextContent(
      `Your answer: ${wrong}Correct answer: ${choice.answer}`,
    );

    expect(screen.getByText("Added to your mistake review.")).toBeInTheDocument();
  });

  it("closes a correct objective answer with encouragement", () => {
    render(<QuestionCard q={choice} onSubmit={vi.fn()} />);
    click(choice.answer);
    expect(screen.getByRole("status")).not.toHaveTextContent("Your answer:");
    expect(screen.getByText("Keep taking those little steps.")).toBeInTheDocument();
  });

  it("offers the transcript after a listening answer and notes transcript assistance", () => {
    render(<QuestionCard q={listen} onSubmit={vi.fn()} />);
    click("Need a hand? Show transcript");
    click(listen.answer);

    expect(screen.getByText("Read the transcript").closest("details")).toHaveTextContent(
      listen.audio!,
    );

    expect(screen.getByText("Completed with transcript assistance.")).toBeInTheDocument();
  });

  it("counts ticked self-review points and hides the coming-soon note after review", () => {
    render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
    const note = "AI feedback on your writing and speaking is coming soon.";

    expect(screen.getByText(note)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: writing.checklist![0] }));
    fireEvent.click(screen.getByRole("checkbox", { name: writing.checklist![1] }));
    fireEvent.click(screen.getByRole("checkbox", { name: writing.checklist![1] }));
    fireEvent.click(screen.getByRole("checkbox", { name: writing.checklist![2] }));
    write(writing.answer);
    click("Review my practice");

    expect(
      screen.getByText(`2/${writing.checklist!.length} self-review points checked.`, {
        exact: false,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Your practice is saved.")).toBeInTheDocument();
    expect(screen.queryByText(note)).not.toBeInTheDocument();
  });

  it("shows which self-review points are ticked", () => {
    render(<QuestionCard q={writing} onSubmit={vi.fn()} />);

    const [first, second, third] = writing.checklist!.map((name) =>
      screen.getByRole("checkbox", { name }),
    );

    fireEvent.click(first);
    fireEvent.click(third);
    fireEvent.click(third);
    expect(first).toBeChecked();
    expect(second).not.toBeChecked();
    expect(third).not.toBeChecked();
  });

  it("hides the self-review checklist in the exam", () => {
    render(<QuestionCard q={formPractice} exam onSubmit={vi.fn()} />);
    expect(screen.queryByText("Your self-review checklist")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("flags a response above the word target", () => {
    render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
    write(words(45));
    click("Review my practice");

    expect(
      screen.getByText("You wrote 45 words. Practise keeping the response within 30–40 words."),
    ).toBeInTheDocument();
  });

  it("says when the pattern checks found nothing", () => {
    render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
    write(writing.answer);
    click("Review my practice");

    expect(
      screen.getByText(/No issue found by the small set of pattern checks/),
    ).toBeInTheDocument();
  });

  it("reviews writing without word limits or a checklist", () => {
    const open: Question = {
      ...writing,
      minWords: undefined,
      maxWords: undefined,
      checklist: undefined,
    };

    render(<QuestionCard q={open} onSubmit={vi.fn()} />);
    write(words(80));
    expect(screen.queryByText(/ words$/)).not.toBeInTheDocument();
    click("Review my practice");

    expect(
      screen.getByText("Your word count (80) is within the practice target."),
    ).toBeInTheDocument();

    expect(screen.getByText(/^0\/0 self-review points checked/)).toBeInTheDocument();
  });
});
