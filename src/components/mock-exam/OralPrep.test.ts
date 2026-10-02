import { act, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import { click, mount, now, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("can finish oral preparation early without consuming speaking time", () => {
  seed({ section: 3, stage: "prep" });
  mount();
  act(() => vi.advanceTimersByTime(1000));
  click("I’m ready · start speaking");
  expect(state()).toMatchObject({ stage: "run", deadline: now + 601000 });
  expect(screen.getByRole("timer")).toHaveTextContent("10:00");
});

it("shows only the first two speaking tasks and restores saved notes while preparing", () => {
  const [s1, s2, s3] = mockSections[3].questions;

  seed({ section: 3, stage: "prep", deadline: now + 600000, drafts: { prep: "mis notas" } });
  mount();
  expect(screen.getByText(s1.prompt)).toBeInTheDocument();
  expect(screen.getByText(s2.prompt)).toBeInTheDocument();
  expect(screen.queryByText(s3.prompt)).not.toBeInTheDocument();

  expect(screen.getByRole("textbox", { name: "Your preparation notes" })).toHaveValue("mis notas");
});
