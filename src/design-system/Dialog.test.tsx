import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";
import { stopAudio } from "../components/audio/playback";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A passage player deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

it("prevents native Escape closure, uses the latest callback, and restores focus", () => {
  const trigger = document.createElement("button");

  document.body.append(trigger);
  trigger.focus();

  const first = vi.fn(),
    latest = vi.fn();

  const { rerender, unmount } = render(
    <Dialog label="Example" onClose={first}>
      Hello
    </Dialog>,
  );

  rerender(
    <Dialog label="Example" onClose={latest}>
      Hello
    </Dialog>,
  );

  const event = new Event("cancel", { cancelable: true });

  act(() => screen.getByRole("dialog").dispatchEvent(event));
  expect(event.defaultPrevented).toBe(true);
  expect(latest).toHaveBeenCalledOnce();
  expect(first).not.toHaveBeenCalled();
  unmount();
  expect(trigger).toHaveFocus();
  trigger.remove();
});
