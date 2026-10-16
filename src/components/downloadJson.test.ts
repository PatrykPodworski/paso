import { Blob as NodeBlob } from "node:buffer";
import { afterEach, expect, it, vi } from "vitest";
import { downloadJson } from "./downloadJson";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("saves the value as indented JSON under the given name and revokes the URL after a second", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("Blob", NodeBlob);
  const create = vi.fn((_blob: Blob) => "blob:file");
  const revoke = vi.fn();

  vi.stubGlobal(
    "URL",
    Object.assign(class extends URL {}, { createObjectURL: create, revokeObjectURL: revoke }),
  );

  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

  downloadJson({ name: "Ana", goal: 10 }, "paso-test.json");

  expect(await create.mock.calls[0][0].text()).toBe('{\n  "name": "Ana",\n  "goal": 10\n}');
  const anchor = click.mock.instances[0] as HTMLAnchorElement;

  expect(anchor.getAttribute("href")).toBe("blob:file");
  expect(anchor.download).toBe("paso-test.json");
  vi.advanceTimersByTime(999);
  expect(revoke).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(revoke).toHaveBeenCalledWith("blob:file");
});
