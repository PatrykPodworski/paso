import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QuestionCard } from "../components/QuestionCard";
import { allQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import App from "../App";
import { LessonSession } from "../components/LessonSession";
import { emptyProgress } from "../data/progress";
import type { Question } from "../data/types";
import { audioSources } from "../data/audio-sources";
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("learning interactions", () => {
  it.each(["first name", "address"])(
    "selecting %s immediately checks once and pronounces el nombre",
    (choice) => {
      const q = allQuestions.find((question) => question.id === "u2-v0")!;
      const evaluated = vi.fn(),
        submit = vi.fn();
      render(<QuestionCard q={q} onSubmit={submit} onEvaluated={evaluated} />);
      expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
      expect(screen.queryByRole("button", { name: "Check answer" })).not.toBeInTheDocument();
      const option = screen.getByRole("button", { name: choice });
      fireEvent.click(option);
      fireEvent.click(option);
      expect(evaluated).toHaveBeenCalledExactlyOnceWith(choice, choice === "first name", false);
      expect(submit).not.toHaveBeenCalled();
      expect(option).toBeDisabled();
      const plays = vi.mocked(HTMLMediaElement.prototype.play);
      expect(plays).toHaveBeenCalledOnce();
      expect((plays.mock.contexts[0] as HTMLAudioElement).src).toContain(
        audioSources("el nombre")[0],
      );
      expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    },
  );
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
  it.each([
    ["u1-g0", "soy", "Yo soy Marta."],
    ["u2-g1", "Dónde", "¿Dónde vives? — En Málaga."],
    ["u2-g2", "dieciséis", "dieciséis"],
    ["u2-r0", "Ruiz López", "apellidos"],
    ["u7-g1", "To the left.", "A la izquierda."],
    ["u1-o1", "wrong answer", "Soy de Polonia."],
  ])("reads the Spanish teaching phrase for %s", (id, choice, expected) => {
    const q = allQuestions.find((question) => question.id === id)!;
    render(<QuestionCard q={q} onSubmit={vi.fn()} />);
    if (q.options) {
      fireEvent.click(screen.getByRole("button", { name: choice }));
    } else {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: choice } });
      fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    }
    const plays = vi.mocked(HTMLMediaElement.prototype.play);
    expect(plays).toHaveBeenCalledOnce();
    expect((plays.mock.contexts[0] as HTMLAudioElement).src).toContain(audioSources(expected)[0]);
    expect(document.querySelector(".question-heading")).toContainElement(
      screen.getByRole("button", { name: "Stop audio" }),
    );
  });
  it("starts each listening question on entry and cancels the previous clip", async () => {
    const first = allQuestions.find((q) => q.id === "u1-v1")!;
    const second = allQuestions.find((q) => q.id === "u1-v3")!;
    const { rerender, unmount } = render(
      <QuestionCard key={first.id} q={first} onSubmit={vi.fn()} />,
    );
    const plays = vi.mocked(HTMLMediaElement.prototype.play);
    expect(plays).toHaveBeenCalledOnce();
    expect((plays.mock.contexts[0] as HTMLAudioElement).src).toContain(audioSources("adiós")[0]);
    rerender(<QuestionCard key={second.id} q={second} onSubmit={vi.fn()} />);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledOnce();
    expect(plays).toHaveBeenCalledTimes(2);
    expect((plays.mock.contexts[1] as HTMLAudioElement).src).toContain(
      audioSources("por favor")[0],
    );
    unmount();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(2);
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
  it("checks a wrong choice immediately and advances only after Continue", () => {
    const submit = vi.fn();
    const q = allQuestions[0];
    render(<QuestionCard q={q} onSubmit={submit} />);
    expect(screen.queryByRole("button", { name: "Check answer" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: q.options![1] }));
    expect(screen.getByText("A good moment to learn.")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(submit).toHaveBeenCalledWith(q.options![1], false, false);
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
  it("keeps writing practice ungraded and supplies targeted corrections", () => {
    const submit = vi.fn();
    render(<QuestionCard q={allQuestions.find((q) => q.id === "u1-o2")!} onSubmit={submit} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hola, soy 20 años. Me gusta las manzanas." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Review my practice" }));
    expect(screen.getByText(/For age, use tener/)).toBeInTheDocument();
    expect(screen.getByText(/Check gustar/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(submit.mock.calls[0][1]).toBeNull();
  });
  it("requires all form fields before reviewing", () => {
    render(<QuestionCard q={formPractice} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
    for (const field of formPractice.fields!) {
      fireEvent.change(screen.getByRole("textbox", { name: field.label }), {
        target: { value: "Una respuesta" },
      });
    }
    expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
  });
  it("renders a truthful fresh dashboard and the full learning path", () => {
    window.location.hash = "today";
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "A good day to learn Spanish." }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Learning path" }));
    expect(
      screen.getByText(
        "12 units · 48 lessons · 264 exercises. Explore freely, or follow the path.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ready for your next chapter" }),
    ).toBeInTheDocument();
  });
  it("records feedback immediately so closing it cannot lose a mistake", () => {
    const evaluated = vi.fn();
    const q = allQuestions[0];
    render(<QuestionCard q={q} onSubmit={vi.fn()} onEvaluated={evaluated} />);
    fireEvent.click(screen.getByRole("button", { name: q.options![1] }));
    expect(evaluated).toHaveBeenCalledWith(q.options![1], false, false);
  });
  it("remembers transcript assistance even after hiding the transcript", () => {
    const evaluated = vi.fn();
    const q = allQuestions.find((q) => q.kind === "listen")!;
    render(<QuestionCard q={q} onSubmit={vi.fn()} onEvaluated={evaluated} />);
    fireEvent.click(screen.getByRole("button", { name: "Need a hand? Show transcript" }));
    fireEvent.click(screen.getByRole("button", { name: "Hide transcript" }));
    fireEvent.click(screen.getByRole("button", { name: q.answer }));
    expect(evaluated).toHaveBeenCalledWith(q.answer, true, true);
  });
  it("restores a saved form draft without losing field labels", () => {
    const draft = JSON.stringify(
      Object.fromEntries(formPractice.fields!.map((f) => [f.label, "Una respuesta"])),
    );
    render(<QuestionCard q={formPractice} draft={draft} onSubmit={vi.fn()} />);
    expect(screen.getByRole("textbox", { name: "Nacionalidad" })).toHaveValue("Una respuesta");
    expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
  });
  it.each([allQuestions[0], allQuestions.find((q) => q.id === "u1-o1")!])(
    "starts a fresh objective attempt without its previous answer: $id",
    (q) => {
      const progress = emptyProgress();
      progress.drafts[q.id] = q.answer;
      const saveDraft = vi.fn();
      render(
        <LessonSession
          lesson={{
            id: "test",
            title: "Test",
            subtitle: "",
            icon: "book",
            minutes: 2,
            questions: [q],
          }}
          progress={progress}
          onClose={vi.fn()}
          onAttempt={vi.fn()}
          onComplete={vi.fn()}
          onDraft={saveDraft}
        />,
      );
      if (q.kind === "type") {
        expect(screen.getByRole("textbox")).toHaveValue("");
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Un intento" } });
      } else {
        expect(screen.getByRole("button", { name: q.answer })).toHaveAttribute(
          "aria-pressed",
          "false",
        );
        fireEvent.click(screen.getByRole("button", { name: q.answer }));
      }
      expect(saveDraft).not.toHaveBeenCalled();
    },
  );
  it("keeps an in-progress answer when cancelling the leave dialog", () => {
    const questions: Question[] = [allQuestions[0], allQuestions.find((q) => q.id === "u1-o1")!];
    render(
      <LessonSession
        lesson={{ id: "test", title: "Test", subtitle: "", icon: "book", minutes: 2, questions }}
        progress={emptyProgress()}
        onClose={vi.fn()}
        onAttempt={vi.fn()}
        onComplete={vi.fn()}
        onDraft={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: questions[0].answer }));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Soy de" } });
    fireEvent.click(screen.getByRole("button", { name: "Close lesson" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep learning" }));
    expect(screen.getByRole("textbox")).toHaveValue("Soy de");
  });
  it("still restores longer writing drafts in a new practice session", () => {
    const q = allQuestions.find((q) => q.id === "u1-o2")!;
    const progress = emptyProgress();
    progress.drafts[q.id] = "Hola, me llamo Julia.";
    render(
      <LessonSession
        lesson={{
          id: "test",
          title: "Test",
          subtitle: "",
          icon: "book",
          minutes: 2,
          questions: [q],
        }}
        progress={progress}
        onClose={vi.fn()}
        onAttempt={vi.fn()}
        onComplete={vi.fn()}
        onDraft={vi.fn()}
      />,
    );
    expect(screen.getByRole("textbox")).toHaveValue(progress.drafts[q.id]);
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
});
