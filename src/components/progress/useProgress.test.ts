import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { emptySnapshot } from "../../test/progress";
import { useProgress } from "./useProgress";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
let learners: string[];

beforeEach(() => {
  learners = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init: RequestInit) => {
      learners.push((init.headers as Record<string, string>)["x-learner-id"]);

      return Response.json({
        ...emptySnapshot(),
        xp: 5,
        checks: init.method === "POST" ? ["visa"] : [],
      });
    }),
  );
});

it("loads the snapshot for a learner id kept in this browser", async () => {
  const first = renderHook(() => useProgress());

  expect(first.result.current.snapshot).toBeNull();
  await waitFor(() => expect(first.result.current.snapshot?.xp).toBe(5));
  expect(first.result.current.storageError).toBe(false);
  first.unmount();

  const second = renderHook(() => useProgress());

  await waitFor(() => expect(second.result.current.snapshot?.xp).toBe(5));
  expect(learners[0]).toMatch(UUID);
  expect(new Set(learners)).toEqual(new Set([localStorage.getItem("paso-learner-v1")]));
});

it("shows the snapshot each write returns", async () => {
  const { result } = renderHook(() => useProgress());

  await waitFor(() => expect(result.current.snapshot?.checks).toEqual([]));
  act(() => result.current.actions.check("visa", true));
  await waitFor(() => expect(result.current.snapshot?.checks).toEqual(["visa"]));
});

it("uses one learner id for the visit and says so when browser storage is unavailable", async () => {
  vi.spyOn(localStorage, "getItem").mockImplementation(() => {
    throw new Error("SecurityError");
  });

  const { result } = renderHook(() => useProgress());

  await waitFor(() => expect(result.current.snapshot?.xp).toBe(5));
  expect(result.current.storageError).toBe(true);
  expect(learners[0]).toMatch(UUID);
});
