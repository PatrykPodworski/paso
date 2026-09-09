import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuestionCard } from "../components/QuestionCard";
import { allQuestions } from "../data/curriculum";
import type { CoachReview } from "../data/coach";

const review: CoachReview = {
  summary: "Your introduction is clear. Check how you express age.",
  strengths: ["You introduced yourself."],
  corrections: [
    {
      original: "Soy veinte años",
      corrected: "Tengo veinte años",
      explanation: "Use tener for age.",
    },
  ],
  coverage: [{ point: "Give your name", met: true, feedback: "You introduced yourself as Ana." }],
  improvedAnswer: "Hola, me llamo Ana. Tengo veinte años.",
  nextStep: "Practise the phrase Tengo veinte años.",
};
afterEach(() => vi.unstubAllGlobals());
describe("Codex learning feedback", () => {
  it("sends the learner's writing only on review and displays personalized corrections", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ review })));
    vi.stubGlobal("fetch", fetcher);
    render(<QuestionCard q={allQuestions.find((q) => q.id === "u1-o2")!} onSubmit={vi.fn()} />);
    const answer = "Hola, me llamo Ana. Soy veinte años.";
    fireEvent.change(screen.getByRole("textbox"), { target: { value: answer } });
    expect(fetcher).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Review my practice" }));
    await screen.findByText(review.summary);
    expect(screen.getByText("Tengo veinte años")).toBeInTheDocument();
    expect(JSON.parse(fetcher.mock.calls[0][1]!.body as string)).toEqual({
      questionId: "u1-o2",
      answer,
    });
    fireEvent.click(screen.getByRole("button", { name: "Revise my answer" }));
    expect(screen.getByRole("textbox")).toBeEnabled();
    expect(screen.getByRole("textbox")).toHaveValue(answer);
  });
  it("allows an explicit retry after a service error without losing the answer", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Codex is temporarily unavailable." }), {
          status: 503,
        }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ review })));
    vi.stubGlobal("fetch", fetcher);
    render(<QuestionCard q={allQuestions.find((q) => q.id === "u1-o2")!} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Hola, me llamo Ana." } });
    fireEvent.click(screen.getByRole("button", { name: "Review my practice" }));
    await screen.findByText("Codex is temporarily unavailable.");
    expect(fetcher).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Try Codex again" }));
    await screen.findByText(review.summary);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("reviews the editable speaking transcript and identifies the limits of text feedback", async () => {
    const spokenReview = {
      ...review,
      coverage: [
        {
          point: "My words were understandable",
          met: null,
          feedback: "Replay your recording to check this point.",
        },
      ],
    };
    const fetcher = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify({ review: spokenReview })),
    );
    vi.stubGlobal("fetch", fetcher);
    render(<QuestionCard q={allQuestions.find((q) => q.id === "u1-o3")!} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Your spoken Spanish" }), {
      target: { value: "Me llamo Ana. Tengo veinte años." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Review my practice" }));
    await waitFor(() => expect(fetcher).toHaveBeenCalledOnce());
    await screen.findByText(review.summary);
    expect(JSON.parse(fetcher.mock.calls[0][1]!.body as string).answer).toBe(
      "Me llamo Ana. Tengo veinte años.",
    );
    expect(screen.getByText(/Pronunciation and spoken fluency need listening/)).toBeInTheDocument();
    expect(screen.getByText("Self-review needed:")).toBeInTheDocument();
  });
});
