import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";
import type { Question } from "../../data/types";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A shared listening recording deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const choice = allQuestions[0];
const wrong = choice.options!.find((o) => o !== choice.answer)!;
const listen = allQuestions.find((q) => q.kind === "listen")!;
const writing = allQuestions.find((q) => q.id === "u1-o2")!;

// What a screen reader reads in each answer of the comparison, which hides the marked copies.
const readAnswers = () =>
  screen.getAllByRole("definition").map((answer) =>
    [...answer.children]
      .filter((part) => part.getAttribute("aria-hidden") !== "true")
      .map((part) => part.textContent)
      .join(""),
  );

it("shows the learner's wrong answer next to the correct one", () => {
  render(<QuestionCard q={choice} onSubmit={vi.fn()} />);
  click(wrong);

  expect(screen.getAllByRole("term").map((label) => label.textContent)).toEqual([
    "Your answer:",
    "Correct answer:",
  ]);

  expect(readAnswers()[0]).toMatch(new RegExp(`^${wrong} Differences: `));
  expect(readAnswers()[1]).toBe(choice.answer);

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

it.each([
  ["u2-v0", () => fireEvent.click(screen.getByRole("button", { name: "first name" }))],
  [
    "u1-o1",
    () => {
      fireEvent.change(screen.getByLabelText("Your answer in Spanish"), {
        target: { value: "Soy de Polonia." },
      });

      fireEvent.keyDown(screen.getByLabelText("Your answer in Spanish"), { key: "Enter" });
    },
  ],
])("focuses Continue after checking %s so Enter moves on", (id, answer) => {
  const q = allQuestions.find((question) => question.id === id)!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} />);
  answer();
  expect(screen.getByRole("button", { name: "Continue" })).toHaveFocus();
});

it("leaves writing to the AI review", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} draft="Hola, soy 20 años." />);
  expect(screen.getByText(/Your answer goes to OpenRouter/)).toBeInTheDocument();
});

const typed = (q: Question, answer: string) => {
  render(<QuestionCard q={q} onSubmit={vi.fn()} />);

  fireEvent.change(screen.getByLabelText("Your answer in Spanish"), { target: { value: answer } });
  fireEvent.keyDown(screen.getByLabelText("Your answer in Spanish"), { key: "Enter" });

  return screen.getByRole("status");
};

const typeQuestion = (answer: string, extra: Partial<Question> = {}): Question => ({
  id: "t-1",
  kind: "type",
  skill: "writing",
  prompt: "Write it in Spanish.",
  answer,
  explanation: "The generic explanation.",
  ...extra,
});

it("passes a typed answer that misses only its accents and notes the accents", () => {
  const status = typed(typeQuestion("¿Quién eres?"), "quien eres");

  expect(status).toHaveTextContent("¡Muy bien!");
  expect(status).toHaveTextContent("The generic explanation.");
  expect(status).toHaveTextContent("Missing accent on é.");

  expect(readAnswers()).toEqual([
    "quien eres Differences: “quien” should be “Quién”.",
    "¿Quién eres?",
  ]);

  expect(screen.getByText("Added to your mistake review.")).toBeInTheDocument();
});

it.each([
  ["quien eres", true],
  ["Quién eres", false],
])("reports %s as passed, with a note: %s", (answer, noted) => {
  const onEvaluated = vi.fn();

  render(
    <QuestionCard q={typeQuestion("¿Quién eres?")} onSubmit={vi.fn()} onEvaluated={onEvaluated} />,
  );

  fireEvent.change(screen.getByLabelText("Your answer in Spanish"), { target: { value: answer } });
  fireEvent.keyDown(screen.getByLabelText("Your answer in Spanish"), { key: "Enter" });

  expect(onEvaluated.mock.calls).toEqual([[answer, true, false, undefined, noted]]);
});

it("names every missing accent", () => {
  const status = typed(
    typeQuestion("¿Quién eres?", { accepted: ["¿Y tú quién eres?"] }),
    "y tu quien eres",
  );

  expect(status).toHaveTextContent("Missing accents on ú, é.");
});

it.each([
  ["Que tengas un buen día.", "Qué tengas un buen día", "Extra accent on é."],
  ["¿Dónde está la estación?", "¿Dóndé está la estación?", "Extra accent on é."],
  [
    "¿Dónde está la estación?",
    "Dondé esta la estación",
    "Missing accents on ó, á; extra accent on é.",
  ],
])("passes %s typed as %s and names the accent mistakes", (expected, answer, note) => {
  const status = typed(typeQuestion(expected), answer);

  expect(status).toHaveTextContent("¡Muy bien!");
  expect(status).toHaveTextContent(note);
});

it("marks the mistake in a wrong typed answer", () => {
  typed(typeQuestion("Mi madre trabaja el lunes."), "Mi madre tabaja el lunes");

  expect(readAnswers()).toEqual([
    "Mi madre tabaja el lunes Differences: “tabaja” should be “trabaja”.",
    "Mi madre trabaja el lunes.",
  ]);
});

it("compares a wrong typed answer with the accepted answer nearest to it", () => {
  typed(
    typeQuestion("Mi amiga está en casa.", { accepted: ["Mi amigo está en casa."] }),
    "Mi amigo esta en kasa",
  );

  expect(readAnswers()[1]).toBe("Mi amigo está en casa.");
});

it("leaves the comparison off a correct answer", () => {
  typed(typeQuestion("¿Quién eres?"), "Quién eres");

  expect(screen.queryByRole("term")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("¡Muy bien!");
});

it("leaves the accent note off an exact answer", () => {
  const status = typed(typeQuestion("¿Quién eres?"), "Quién eres");

  expect(status).toHaveTextContent("¡Muy bien!");
  expect(status).not.toHaveTextContent("Missing accent");
  expect(screen.getByText("Keep taking those little steps.")).toBeInTheDocument();
});

it.each([
  ["nino", "niño"],
  ["porque estudias español", "¿Por qué estudias español?"],
])("marks %s wrong with the generic explanation", (answer, expected) => {
  const status = typed(typeQuestion(expected), answer);

  expect(status).toHaveTextContent("The generic explanation.");
  expect(status).not.toHaveTextContent("Missing accent");
  expect(screen.getByText("Added to your mistake review.")).toBeInTheDocument();
});

it("notes the missing ¿ ? on a correct answer to a full Spanish question", () => {
  const status = typed(typeQuestion("¿Qué quieres?", { questionMarks: true }), "Qué quieres");

  expect(status).toHaveTextContent("¡Muy bien!");

  expect(status).toHaveTextContent("Spanish questions open with ¿ and close with ?: ¿Qué quieres?");
  expect(screen.getByText("Added to your mistake review.")).toBeInTheDocument();
});

it("leaves the ¿ ? note off an unflagged question", () => {
  const status = typed(typeQuestion("¿Qué quieres?"), "Qué quieres");

  expect(status).toHaveTextContent("¡Muy bien!");
  expect(status).not.toHaveTextContent("Spanish questions open with");
  expect(screen.getByText("Keep taking those little steps.")).toBeInTheDocument();
});

it("marks a chosen option that differs only by accents wrong", () => {
  render(
    <QuestionCard
      q={typeQuestion("Él", { kind: "choice", options: ["Él", "El"] })}
      onSubmit={vi.fn()}
    />,
  );

  click("El");

  expect(screen.getByRole("status")).toHaveTextContent("The generic explanation.");
  expect(screen.getByRole("status")).not.toHaveTextContent("Missing accent");
  expect(screen.getByText("Added to your mistake review.")).toBeInTheDocument();
});

it("notes both the accent and the ¿ ? on a full Spanish question", () => {
  const status = typed(typeQuestion("¿Qué quieres?", { questionMarks: true }), "Que quieres");

  expect(status).toHaveTextContent("¡Muy bien!");
  expect(status).toHaveTextContent("Missing accent on é.");
  expect(status).toHaveTextContent("Spanish questions open with ¿ and close with ?: ¿Qué quieres?");
});

it("leaves the ¿ ? note off a wrong answer to a full Spanish question", () => {
  const status = typed(typeQuestion("¿Qué quieres?", { questionMarks: true }), "Que quiere");

  expect(status).toHaveTextContent("A good moment to learn.");
  expect(status).not.toHaveTextContent("Spanish questions open with");
});

it("leaves the ¿ ? note off a chosen option, which the learner cannot punctuate", () => {
  render(
    <QuestionCard
      q={typeQuestion("Qué quieres", {
        kind: "choice",
        options: ["Qué quieres", "Quién eres"],
        questionMarks: true,
      })}
      onSubmit={vi.fn()}
    />,
  );

  click("Qué quieres");

  expect(screen.getByRole("status")).toHaveTextContent("¡Muy bien!");
  expect(screen.getByRole("status")).not.toHaveTextContent("Spanish questions open with");
});
