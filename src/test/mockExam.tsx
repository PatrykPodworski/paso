import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { ProgressExam } from "./ProgressExam";
import type { MockRunPatch } from "../data/types";
import { savedProgress, seedProgress, settle, setupProgressApi } from "./progressApi";

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

// A run the server keeps for a new learner.
export const seed = (patch: Record<string, unknown> = {}) =>
  seedProgress({ mockRun: run(patch) as MockRunPatch });

// The run as the server keeps it.
export const state = async () => {
  await settle();

  return (await savedProgress()).mockRun!;
};

export const mount = async () => {
  const view = render(<ProgressExam />);

  await settle();

  return view;
};

// Leaves the exam page and opens it again, as a reload does.
export const remount = async () => {
  cleanup();
  await settle();

  return mount();
};

export const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

export const setupMockExam = () => {
  setupProgressApi();

  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
};
