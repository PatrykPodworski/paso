import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { emptyProgress } from "../data/progress";
import { PocketVocabulary } from "./PocketVocabulary";

it("searches unlocked vocabulary in either language and clears an empty result", () => {
  const p = emptyProgress();
  const onReview = vi.fn();
  const onAddWords = vi.fn();

  p.completed["u6-words"] = { score: 1, total: 1, at: "2026-01-01T00:00:00Z" };

  const { container } = render(
    <PocketVocabulary progress={p} onReview={onReview} onAddWords={onAddWords} onLearn={vi.fn()} />,
  );

  fireEvent.change(screen.getByRole("textbox", { name: "Search vocabulary" }), {
    target: { value: "COFFEE" },
  });

  expect(screen.getByText("el café")).toBeInTheDocument();
  expect(screen.getByText("coffee")).toBeInTheDocument();
  expect(onReview).not.toHaveBeenCalled();
  expect(onAddWords).not.toHaveBeenCalled();

  fireEvent.change(screen.getByRole("textbox", { name: "Search vocabulary" }), {
    target: { value: "zzzzzz" },
  });

  expect(screen.getByRole("heading", { name: "No word found yet." })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
  expect(container.querySelectorAll(".vocabulary-list li")).toHaveLength(8);
});
