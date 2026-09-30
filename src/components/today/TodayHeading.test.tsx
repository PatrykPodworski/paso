import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { emptyProgress } from "../../data/progress";
import { TodayHeading } from "./TodayHeading";

afterEach(() => {
  vi.useRealTimers();
});

it.each([
  ["2026-09-08", "Keep your Spanish growing"],
  ["2026-09-09", "Your exam day"],
  ["2026-09-10", "1 days to your exam"],
])("calculates the local exam countdown for %s", (date, label) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 9, 12));
  const p = emptyProgress();

  p.examDate = date;
  render(<TodayHeading progress={p} openSettings={vi.fn()} />);
  expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
});

it.each([
  [11, "BUENOS DÍAS"],
  [12, "BUENAS TARDES"],
  [19, "BUENAS TARDES"],
  [20, "BUENAS NOCHES"],
])("uses the appropriate local greeting at %s", (hour, label) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 9, hour as number));
  render(<TodayHeading progress={emptyProgress()} openSettings={vi.fn()} />);
  expect(screen.getByText(new RegExp(label as string))).toBeInTheDocument();
});
