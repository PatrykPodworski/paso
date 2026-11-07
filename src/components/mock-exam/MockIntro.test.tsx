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

  expect(screen.getAllByText("Writing not recorded")).toHaveLength(2);
  expect(screen.getAllByText("Speaking not recorded")).toHaveLength(2);
  expect(screen.queryByText(/ungraded/)).not.toBeInTheDocument();
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
    expect.stringContaining("Speaking onlySpeaking not recorded"),
  ]);

  expect(screen.queryByText(/^Listening \d+\/25$/)).not.toBeInTheDocument();
  expect(screen.queryByText(/ungraded/)).not.toBeInTheDocument();
});

it("shows zeros, partial scores and ungraded sections without a blanket label", () => {
  mount({
    ...emptySnapshot(),
    mockResults: [
      {
        id: "partial",
        at: "2026-01-03T10:00:00Z",
        sections: [0, 2],
        reading: 4,
        recorded: true,
      },
      {
        id: "zeros",
        at: "2026-01-04T10:00:00Z",
        sections: [0, 1, 2, 3],
        reading: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
        recorded: true,
      },
      {
        id: "scored",
        at: "2026-01-05T10:00:00Z",
        sections: [3],
        speaking: 12.5,
        recorded: true,
      },
      {
        id: "ungraded",
        at: "2026-01-06T10:00:00Z",
        sections: [2, 3],
        recorded: true,
      },
    ],
  });

  const rows = [
    ...screen.getByRole("heading", { name: "Your previous rehearsals" }).parentElement!.children,
  ]
    .slice(1)
    .map((row) => row.textContent);

  expect(rows[0]).toContain("Writing, Speaking only");
  expect(rows[0]).toContain("Writing ungraded");
  expect(rows[0]).toContain("Speaking ungraded");
  expect(rows[0]).not.toContain("Reading");

  expect(rows[1]).toContain("Speaking only");
  expect(rows[1]).toContain("Speaking 12.5/25");
  expect(rows[1]).not.toContain("ungraded");

  expect(rows[2]).toContain("Reading 0/25");
  expect(rows[2]).toContain("Listening 0/25");
  expect(rows[2]).toContain("Writing 0/25");
  expect(rows[2]).toContain("Speaking 0/25");

  expect(rows[3]).toContain("Reading, Writing only");
  expect(rows[3]).toContain("Reading 4/25");
  expect(rows[3]).toContain("Writing ungraded");
  expect(rows[3]).not.toContain("Listening");
  expect(rows[3]).not.toContain("Speaking");

  expect(screen.queryByText("Productive skills ungraded")).not.toBeInTheDocument();
});
