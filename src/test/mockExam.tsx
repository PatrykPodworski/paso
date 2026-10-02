import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { MockExam } from "../components/mock-exam/MockExam";
import { emptyProgress } from "../data/progress";

export const KEY = "paso-mock-v1";
export const now = new Date("2026-09-09T10:00:00Z").getTime();

export const run = (patch: Record<string, unknown> = {}) => ({
  section: 0,
  index: 0,
  stage: "run",
  answers: {},
  deadline: now + 45000,
  started: new Date(now).toISOString(),
  drafts: {},
  ...patch,
});

export const seed = (patch: Record<string, unknown> = {}) =>
  localStorage.setItem(KEY, JSON.stringify(run(patch)));

export const state = () => JSON.parse(localStorage.getItem(KEY)!);

export const mount = (progress = emptyProgress()) => {
  const onResult = vi.fn();

  return { ...render(<MockExam progress={progress} onResult={onResult} />), onResult };
};

export const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

export const setupMockExam = () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.useFakeTimers();
    vi.setSystemTime(now);

    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        throw new Error("No AI in exam");
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
};
