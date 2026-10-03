import { fireEvent, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { mockSections } from "../../data/mock";
import { click, mount, now, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("stores only objective results once and requires both human scores before a verdict", () => {
  const answers = Object.fromEntries(
    [...mockSections[0].questions, ...mockSections[1].questions].map((q) => [q.id, q.answer]),
  );

  seed({ section: 3, stage: "review", answers });
  const { onResult } = mount();

  click("See my results");

  expect(onResult).toHaveBeenCalledExactlyOnceWith({
    at: new Date(now).toISOString(),
    reading: 25,
    listening: 25,
  });

  expect(screen.getAllByText("Human review")).toHaveLength(2);
  expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();

  const writing = screen.getByRole("spinbutton", { name: "Writing score /25" }),
    speaking = screen.getByRole("spinbutton", { name: "Speaking score /25" });

  fireEvent.change(writing, { target: { value: "5" } });
  expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  fireEvent.change(speaking, { target: { value: "5" } });
  expect(screen.getByText(/Both groups meet 30/)).toBeInTheDocument();
  fireEvent.change(speaking, { target: { value: "4.99" } });
  expect(screen.getByText(/At least one group is below/)).toBeInTheDocument();

  for (const value of ["-1", "25.01", ""]) {
    fireEvent.change(speaking, { target: { value } });
    expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  }

  fireEvent.change(speaking, { target: { value: "25" } });
  fireEvent.change(writing, { target: { value: "26" } });
  expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  click("Return to exam overview");
  expect(state().stage).toBe("intro");
  expect(state().answers).toEqual({});
  expect(onResult).toHaveBeenCalledOnce();
});

it.each([
  [0, 0],
  [0, 25],
  [25, 0],
  [25, 25],
])("accepts inclusive human score limits %s and %s", (writing, speaking) => {
  seed({ section: 3, stage: "done" });
  mount();

  fireEvent.change(screen.getByRole("spinbutton", { name: "Writing score /25" }), {
    target: { value: String(writing) },
  });

  fireEvent.change(screen.getByRole("spinbutton", { name: "Speaking score /25" }), {
    target: { value: String(speaking) },
  });

  expect(screen.queryByText(/A pass cannot be determined/)).not.toBeInTheDocument();
  expect(screen.getByText(/At least one group is below/)).toBeInTheDocument();
});

it("rejects negative and excessive writing scores independently", () => {
  seed({ section: 3, stage: "done" });
  mount();

  fireEvent.change(screen.getByRole("spinbutton", { name: "Speaking score /25" }), {
    target: { value: "25" },
  });

  for (const value of ["-1", "25.01", ""]) {
    fireEvent.change(screen.getByRole("spinbutton", { name: "Writing score /25" }), {
      target: { value },
    });

    expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  }
});

it("shows the objective scores on the results page", () => {
  const answers = Object.fromEntries(
    mockSections[0].questions.slice(0, 3).map((q) => [q.id, q.answer]),
  );

  seed({ section: 3, stage: "done", answers });
  mount();
  expect(screen.getByText("Reading").parentElement).toHaveTextContent("Reading3/25");
  expect(screen.getByText("Listening").parentElement).toHaveTextContent("Listening0/25");
  expect(screen.queryByRole("timer")).not.toBeInTheDocument();
});
