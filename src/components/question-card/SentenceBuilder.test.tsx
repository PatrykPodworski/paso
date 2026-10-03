import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { audioSources } from "../../data/audio-sources";
import { allQuestions } from "../../data/curriculum";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A passage player deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const order = allQuestions.find((q) => q.kind === "order")!;
const bank = () => within(screen.getByRole("group", { name: "Word bank" }));
const tray = () => within(screen.getByRole("group", { name: "Your sentence" }));

it("hints at the empty sentence tray until the first word is picked", () => {
  render(<QuestionCard q={order} onSubmit={vi.fn()} />);
  expect(screen.getByText("Tap the words below to build your sentence…")).toBeInTheDocument();
  click(order.tokens![0]);

  expect(screen.queryByText("Tap the words below to build your sentence…")).not.toBeInTheDocument();
});

it("requires all tiles, permits removal, and reads the correct sentence after a wrong order", () => {
  render(<QuestionCard q={order} onSubmit={vi.fn()} />);

  for (const token of order.tokens!) {
    fireEvent.click(bank().getByRole("button", { name: token }));
  }

  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(order.tokens!.length);
  expect(screen.getByRole("button", { name: "Check answer" })).toBeEnabled();

  fireEvent.click(tray().getAllByRole("button")[0]);
  expect(screen.getByRole("button", { name: "Check answer" })).toBeDisabled();
  fireEvent.click(bank().getByRole("button", { name: order.tokens![0] }));
  const beforeCheck = vi.mocked(HTMLMediaElement.prototype.play).mock.calls.length;

  click("Check answer");
  expect(screen.getByRole("heading", { name: "A good moment to learn." })).toBeInTheDocument();
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(beforeCheck + 1);
});

it("plays the tapped word before it lands in the sentence", () => {
  render(<QuestionCard q={order} onSubmit={vi.fn()} />);
  const token = order.tokens![0];

  fireEvent.click(bank().getByRole("button", { name: token }));
  const play = vi.mocked(HTMLMediaElement.prototype.play);

  expect(play).toHaveBeenCalledOnce();
  expect((play.mock.instances[0] as HTMLAudioElement).src).toContain(audioSources(token)[0]);
});

it("reads the final tapped word before the completed sentence", async () => {
  render(<QuestionCard q={order} onSubmit={vi.fn()} />);
  const words = order.answer.split(" ");

  for (const word of words) {
    fireEvent.click(bank().getByRole("button", { name: word }));
  }

  const play = vi.mocked(HTMLMediaElement.prototype.play);

  expect(play).toHaveBeenCalledTimes(words.length);
  fireEvent(play.mock.instances.at(-1) as HTMLAudioElement, new Event("ended"));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(words.length + 1));
});

it("auto-submits when the last chip completes the correct sentence, also after a removal", async () => {
  render(<QuestionCard q={order} onSubmit={vi.fn()} />);
  const words = order.answer.split(" ");

  for (const word of words.slice(0, -1)) {
    fireEvent.click(bank().getByRole("button", { name: word }));
  }

  const lastPlaced = words[words.length - 2];

  fireEvent.click(tray().getAllByRole("button").at(-1)!);

  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  fireEvent.click(bank().getByRole("button", { name: lastPlaced }));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  const beforeLast = vi.mocked(HTMLMediaElement.prototype.play).mock.calls.length;

  fireEvent.click(bank().getByRole("button", { name: words[words.length - 1] }));

  expect(screen.getByRole("heading", { name: "¡Muy bien! You’ve got it." })).toBeInTheDocument();
  // The final tap reads its own word, then the completed sentence once it ends.
  const play = vi.mocked(HTMLMediaElement.prototype.play);

  expect(play).toHaveBeenCalledTimes(beforeLast + 1);
  fireEvent(play.mock.instances.at(-1) as HTMLAudioElement, new Event("ended"));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(beforeLast + 2));
  expect(screen.queryByRole("button", { name: "Check answer" })).not.toBeInTheDocument();
});

it("each selected sentence tile is disabled until it is removed", () => {
  render(<QuestionCard q={order} onSubmit={vi.fn()} />);
  const buttons = bank().getAllByRole("button");

  fireEvent.click(buttons[0]);
  expect(buttons[0]).toBeDisabled();

  for (const b of buttons.slice(1)) {
    expect(b).toBeEnabled();
  }

  fireEvent.click(tray().getByRole("button"));
  expect(buttons[0]).toBeEnabled();
});

it("lets a learner build and correct sentence tiles", async () => {
  const submit = vi.fn();
  const q = allQuestions.find((q) => q.id === "u1-o0")!;

  render(<QuestionCard q={q} onSubmit={submit} />);
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

  for (const word of q.answer.split(" ")) {
    fireEvent.click(screen.getByRole("button", { name: word }));
  }

  expect(screen.getByText("¡Muy bien! You’ve got it.")).toBeInTheDocument();
  // Every tapped word is read, then the completed sentence once the last one ends.
  const words = q.answer.split(" ").length;
  const play = vi.mocked(HTMLMediaElement.prototype.play);

  expect(play).toHaveBeenCalledTimes(words);
  fireEvent(play.mock.instances.at(-1) as HTMLAudioElement, new Event("ended"));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(words + 1));
  expect(screen.queryByRole("button", { name: "Check answer" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(submit).toHaveBeenCalledWith(q.answer, true, false);
});
