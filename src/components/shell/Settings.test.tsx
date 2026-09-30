import { act, fireEvent, render, screen } from "@testing-library/react";
import { Blob as NodeBlob } from "node:buffer";
import { afterEach, expect, it, vi } from "vitest";
import { emptyProgress } from "../../data/progress";
import { Settings } from "./Settings";

afterEach(() => {
  vi.useRealTimers();
});

it("exports real progress and revokes the temporary URL", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-09T12:00:00Z"));
  vi.stubGlobal("Blob", NodeBlob);
  const p = emptyProgress();

  p.name = "Ana";
  const create = vi.fn((_blob: Blob) => "blob:export");

  vi.stubGlobal(
    "URL",
    Object.assign(class extends URL {}, { createObjectURL: create, revokeObjectURL: vi.fn() }),
  );

  const clicked = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

  render(<Settings progress={p} onSave={vi.fn()} onClose={vi.fn()} onReset={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Export progress" }));
  expect(create.mock.calls[0][0]).toBeInstanceOf(Blob);
  expect(create.mock.calls[0][0].type).toBe("application/json");
  expect(JSON.parse(await create.mock.calls[0][0].text())).toEqual(p);

  expect((clicked.mock.instances[0] as HTMLAnchorElement).download).toBe(
    "paso-progress-2026-09-09.json",
  );

  expect(clicked).toHaveBeenCalledOnce();
  act(() => vi.advanceTimersByTime(1000));
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:export");
});
