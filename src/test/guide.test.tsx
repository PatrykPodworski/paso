import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Guide } from "../components/Guide";
import { emptyProgress } from "../data/progress";
import { requirementGroups, sources } from "../data/research";

it("changes only the selected skill and combines the correct score pairs", () => {
  const { container } = render(<Guide progress={emptyProgress()} onCheck={vi.fn()} />);
  const labels = ["Reading", "Writing", "Listening", "Speaking"];
  const sliders = labels.map((label) => screen.getByRole("slider", { name: new RegExp(label) }));
  const values = [25, 5, 24, 6];
  for (let index = 0; index < sliders.length; index++) {
    fireEvent.change(sliders[index], { target: { value: String(values[index]) } });
    sliders.forEach((slider, other) =>
      expect(slider).toHaveValue(String(other <= index ? values[other] : 15)),
    );
  }
  expect(container.querySelectorAll(".passing-groups b")[0]).toHaveTextContent("30/50");
  expect(container.querySelectorAll(".passing-groups b")[1]).toHaveTextContent("30/50");
  expect(screen.getByRole("status")).toHaveTextContent(
    "These example scores meet the passing rule.",
  );
  fireEvent.change(sliders[1], { target: { value: "4" } });
  expect(screen.getByRole("status")).toHaveTextContent("do not meet the passing rule");
  expect(sliders[0]).toHaveValue("25");
  expect(sliders[2]).toHaveValue("24");
});
it("counts only recognized completed readiness checks against the full inventory", () => {
  const progress = emptyProgress();
  progress.checks = [
    requirementGroups[0].items[0][0],
    requirementGroups[1].items[0][0],
    "removed-check",
  ];
  const { rerender } = render(<Guide progress={progress} onCheck={vi.fn()} />);
  const count = requirementGroups.reduce((total, group) => total + group.items.length, 0);
  expect(screen.getByText(`2/${count} checked`)).toBeInTheDocument();
  expect(
    screen.getAllByRole("checkbox").filter((input) => (input as HTMLInputElement).checked),
  ).toHaveLength(2);
  rerender(<Guide progress={emptyProgress()} onCheck={vi.fn()} />);
  expect(screen.getByText(`0/${count} checked`)).toBeInTheDocument();
});
it("numbers the primary sources from 01", () => {
  const { container } = render(<Guide progress={emptyProgress()} onCheck={vi.fn()} />);
  expect([...container.querySelectorAll(".source-number")].map((n) => n.textContent)).toEqual(
    sources.map((_, index) => String(index + 1).padStart(2, "0")),
  );
});
