import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../App";
import { vocabulary } from "../data/curriculum";
import { emptyProgress, STORAGE_KEY, vocabularyReview } from "../data/progress";
import type { Progress } from "../data/types";

const now = "2026-09-09T12:00:00.000Z";
const tomorrow = "2026-09-10T12:00:00.000Z";
const words = vocabulary.filter((w) => w.unit === 1);
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole("button", { name }));
const saved = (): Progress => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
const count = (label: string, value: number) => {
  expect(
    within(screen.getByText(label, { exact: true }).parentElement!).getByRole("definition"),
  ).toHaveTextContent(String(value));
};
const progressWithDue = (due = words.length) => {
  const p = emptyProgress();
  p.completed["u1-words"] = { score: 8, total: 8, at: "2026-09-08T12:00:00Z" };
  words.slice(due).forEach((w) => {
    p.vocabularyReviews[w.es] = { level: 1, nextAt: tomorrow };
  });
  return p;
};
const mount = (p = progressWithDue()) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  window.location.hash = "#practice";
  return render(<App />);
};
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(now));
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => new Promise(() => {}));
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("includes every unlocked word and never grades revealing or leaving a card", () => {
  mount();
  count("To review", words.length);
  count("Total flashcards", words.length);
  count("Reviewed today", 0);
  expect(document.querySelectorAll(".vocabulary-list li")).toHaveLength(words.length);
  expect(screen.queryByText("el café")).not.toBeInTheDocument();
  click("Review flashcards");
  const dialog = screen.getByRole("dialog", { name: "Vocabulary review" });
  expect(within(dialog).getByRole("heading", { name: words[0].es })).toBeInTheDocument();
  expect(within(dialog).queryByText(words[0].en, { exact: true })).not.toBeInTheDocument();
  expect(within(dialog).queryByRole("button", { name: /Got it right/ })).not.toBeInTheDocument();
  click("Reveal answer");
  expect(within(dialog).getByText(words[0].en, { exact: true })).toBeInTheDocument();
  expect(within(dialog).getByText(words[0].memoryHint)).toBeInTheDocument();
  expect(saved().vocabularyReviews).toEqual({});
  click("Close vocabulary review");
  count("To review", words.length);
  count("Reviewed today", 0);
});

it("persists explicit right and wrong ratings with next dates and resumes only due cards", () => {
  const p = progressWithDue(2);
  p.vocabularyReviews[words[0].es] = { level: 2, nextAt: "2026-09-08T12:00:00Z" };
  p.vocabularyReviews[words[1].es] = { level: 4, nextAt: "2026-09-08T13:00:00Z" };
  mount(p);
  click("Review flashcards");
  click("Reveal answer");
  click(/Got it right/);
  expect(saved().vocabularyReviews[words[0].es]).toEqual({
    level: 3,
    reviewedAt: now,
    nextAt: "2026-09-16T12:00:00.000Z",
  });
  expect(screen.getByRole("status")).toHaveTextContent("Available to review in 7 days");
  expect(screen.getByRole("status").querySelector("time")).toHaveAttribute(
    "datetime",
    "2026-09-16T12:00:00.000Z",
  );
  expect(screen.queryByRole("button", { name: /Got it right/ })).not.toBeInTheDocument();
  expect(
    within(screen.getByRole("dialog")).queryByText(words[1].en, { exact: true }),
  ).not.toBeInTheDocument();
  click("Reveal answer");
  click(/Got it wrong/);
  expect(saved().vocabularyReviews[words[1].es]).toEqual({
    level: 0,
    reviewedAt: now,
    nextAt: "2026-09-09T12:10:00.000Z",
  });
  expect(screen.getByRole("status")).toHaveTextContent("Available to review in 10 min");
  click("Close vocabulary review");
  count("Reviewed today", 2);
  count("To review", 0);
  const persisted = saved();
  cleanup();
  mount(persisted);
  expect(screen.getByRole("button", { name: "Review flashcards" })).toBeDisabled();
  count("Scheduled", words.length);
  act(() => {
    vi.advanceTimersByTime(10 * 60_000);
  });
  count("To review", 1);
  click("Review flashcards");
  expect(
    within(screen.getByRole("dialog")).getByRole("heading", { name: words[1].es }),
  ).toBeInTheDocument();
});

it("reviews all due cards once, finishes with a summary, and counts unique cards reviewed today", () => {
  mount();
  click("Review flashcards");
  for (let index = 0; index < words.length; index++) {
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: words[index].es })).toBeInTheDocument();
    click("Reveal answer");
    click(index === 0 ? /Got it wrong/ : /Got it right/);
  }
  expect(screen.getByRole("heading", { name: "Your review is complete." })).toBeInTheDocument();
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(words.length));
  click("Back to vocabulary");
  count("To review", 0);
  count("Reviewed today", words.length);
  act(() => {
    vi.advanceTimersByTime(10 * 60_000);
  });
  click("Review flashcards");
  click("Reveal answer");
  click(/Got it right/);
  click("Close vocabulary review");
  count("Reviewed today", words.length);
  expect(saved().vocabularyReviews[words[0].es].level).toBe(1);
});

it("updates today's count and availability when returning to the tab on another day", () => {
  const p = progressWithDue(0);
  p.vocabularyReviews[words[0].es].reviewedAt = now;
  mount(p);
  count("Reviewed today", 1);
  vi.setSystemTime(new Date(tomorrow));
  act(() => {
    window.dispatchEvent(new Event("focus"));
  });
  count("Reviewed today", 0);
  count("To review", words.length);
});

it("spaces successful recall over 1, 3, 7, 14 and 30 days, caps the interval and resets missed words", () => {
  let previous;
  for (const days of [1, 3, 7, 14, 30, 30]) {
    previous = vocabularyReview(previous, true, now);
    expect(new Date(previous.nextAt).getTime() - new Date(now).getTime()).toBe(days * 86_400_000);
  }
  const missed = vocabularyReview(previous, false, now);
  expect(missed).toEqual({ level: 0, reviewedAt: now, nextAt: "2026-09-09T12:10:00.000Z" });
  expect(vocabularyReview(missed, true, now).nextAt).toBe(tomorrow);
});
