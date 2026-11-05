import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { firstVariants } from "../../data/mock";
import { emptySnapshot } from "../../test/progress";
import { MockIntro } from "./MockIntro";

const mount = (progress = emptySnapshot(), onStart = vi.fn()) =>
  render(<MockIntro progress={progress} variants={firstVariants} onStart={onStart} />);

it("introduces every section and lists previous rehearsals newest first", () => {
  mount({
    ...emptySnapshot(),
    mockResults: [
      {
        id: "first",
        at: "2026-01-05T10:00:00Z",
        sections: [0, 1, 2, 3],
        reading: 10,
        listening: 12,
      },
      {
        id: "second",
        at: "2026-02-05T10:00:00Z",
        sections: [0, 1, 2, 3],
        reading: 20,
        listening: 22,
      },
    ],
  });

  expect(screen.getAllByText("25 questions · 4 tasks")).toHaveLength(2);
  expect(screen.getByText("2 tasks")).toBeInTheDocument();
  expect(screen.getByText("3 tasks")).toBeInTheDocument();

  expect(screen.getAllByText(/^Reading \d+\/25$/).map((e) => e.textContent)).toEqual([
    "Reading 20/25",
    "Reading 10/25",
  ]);

  expect(screen.getAllByText(/^Listening \d+\/25$/).map((e) => e.textContent)).toEqual([
    "Listening 22/25",
    "Listening 12/25",
  ]);

  expect(screen.queryByRole("timer")).not.toBeInTheDocument();
});

it("hides the history panel before the first rehearsal", () => {
  mount();

  expect(
    screen.queryByRole("heading", { name: "Your previous rehearsals" }),
  ).not.toBeInTheDocument();
});

it("marks a section seen before when the exam it starts repeats one of its variants", () => {
  mount({
    ...emptySnapshot(),
    seenVariants: { "r3-v1": "2026-09-01T10:00:00.000Z", "s2-v1": "2026-09-01T10:00:00.000Z" },
  });

  const status = (title: string) =>
    within(screen.getByRole("heading", { name: title }).closest("article")!).getByText(
      /^(New|Seen before)$/,
    ).textContent;

  expect(["Reading", "Listening", "Writing", "Speaking"].map(status)).toEqual([
    "Seen before",
    "New",
    "New",
    "Seen before",
  ]);
});

it("starts the full exam or any one section alone", () => {
  const onStart = vi.fn();

  mount(emptySnapshot(), onStart);
  fireEvent.click(screen.getByRole("button", { name: "Start exam rehearsal" }));

  for (const title of ["Reading", "Listening", "Writing", "Speaking"]) {
    fireEvent.click(screen.getByRole("button", { name: `Practise ${title.toLowerCase()} alone` }));
  }

  expect(onStart.mock.calls).toEqual([[[0, 1, 2, 3]], [[0]], [[1]], [[2]], [[3]]]);
});

it("names the section of a one-section rehearsal and shows only the scores it has", () => {
  mount({
    ...emptySnapshot(),
    mockResults: [
      { id: "speaking", at: "2026-01-05T10:00:00Z", sections: [3] },
      { id: "reading", at: "2026-02-05T10:00:00Z", sections: [0], reading: 18 },
    ],
  });

  const rows = screen.getAllByText(/ only$/).map((label) => label.closest("div")!.textContent);

  expect(rows).toEqual([
    expect.stringContaining("Reading onlyReading 18/25"),
    expect.stringContaining("Speaking only"),
  ]);

  expect(screen.queryByText(/^Listening \d+\/25$/)).not.toBeInTheDocument();
});
