import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCoach, useTranscription } from "../hooks/useCoach";
import { coachReviewSchema } from "../data/coach";
import { review } from "./coach-fixture";
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const deferred = () => {
  let resolve!: (r: Response) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<Response>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
afterEach(() => vi.unstubAllGlobals());
describe("coach response contract", () => {
  it("preserves three-valued coverage without inventing a grade", () => {
    expect(coachReviewSchema.parse(review)).toEqual(review);
    expect(coachReviewSchema.parse({ ...review, score: 100 })).not.toHaveProperty("score");
  });
  it.each(["summary", "nextStep", "improvedAnswer"] as const)("requires nonempty %s", (key) => {
    expect(coachReviewSchema.safeParse({ ...review, [key]: "" }).success).toBe(false);
    expect(coachReviewSchema.safeParse({ ...review, [key]: undefined }).success).toBe(false);
  });
  it.each([
    ["summary", 1200],
    ["nextStep", 1200],
    ["improvedAnswer", 8000],
  ] as const)("bounds %s at %s characters", (key, n) => {
    expect(coachReviewSchema.safeParse({ ...review, [key]: "x".repeat(n) }).success).toBe(true);
    expect(coachReviewSchema.safeParse({ ...review, [key]: "x".repeat(n + 1) }).success).toBe(
      false,
    );
  });
  it.each([
    ["strengths", 3],
    ["corrections", 8],
    ["coverage", 10],
  ] as const)("bounds %s at %s items", (key, n) => {
    expect(
      coachReviewSchema.safeParse({ ...review, [key]: Array(n).fill(review[key][0]) }).success,
    ).toBe(true);
    expect(
      coachReviewSchema.safeParse({ ...review, [key]: Array(n + 1).fill(review[key][0]) }).success,
    ).toBe(false);
  });
  it.each(["original", "corrected", "explanation"])("requires correction %s", (key) =>
    expect(
      coachReviewSchema.safeParse({
        ...review,
        corrections: [{ ...review.corrections[0], [key]: "" }],
      }).success,
    ).toBe(false),
  );
  it.each([{ met: "yes" }, { point: "" }, { feedback: "" }])(
    "rejects malformed coverage %j",
    (patch) =>
      expect(
        coachReviewSchema.safeParse({ ...review, coverage: [{ ...review.coverage[0], ...patch }] })
          .success,
      ).toBe(false),
  );
});
describe("request lifecycle", () => {
  it.each(["coach", "transcription"] as const)(
    "keeps the replacement %s request pending when a cancelled request settles",
    async (kind) => {
      const old = deferred();
      const current = deferred();
      const fetcher = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
      vi.stubGlobal("fetch", fetcher);
      const { result } = renderHook(() => {
        const coach = useCoach("u1-o2");
        const transcription = useTranscription();
        return kind === "coach"
          ? { ...coach, start: () => coach.check("Hola") }
          : { ...transcription, start: () => transcription.transcribe(new Blob(["audio"])) };
      });
      expect(result.current).toMatchObject({ loading: false, error: "" });
      let first!: Promise<void>;
      let second!: Promise<void>;
      act(() => {
        first = result.current.start();
      });
      act(() => {
        second = result.current.start();
      });
      expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
      await act(async () => {
        old.resolve(response({ review, text: "Viejo" }));
        await first;
      });
      expect(result.current).toMatchObject({ loading: true, error: "" });
      await act(async () => {
        current.resolve(response({ review, text: "Nuevo" }));
        await second;
      });
      expect(result.current.loading).toBe(false);
    },
  );
  it("sends an explicit authenticated local POST and tracks loading/result/reset", async () => {
    const pending = deferred();
    const fetcher = vi.fn(() => pending.promise);
    vi.stubGlobal("fetch", fetcher);
    const { result } = renderHook(() => useCoach("u1-o2"));
    expect(result.current).toMatchObject({ review: null, loading: false, error: "" });
    expect(fetcher).not.toHaveBeenCalled();
    let done!: Promise<void>;
    act(() => {
      done = result.current.check("Mi respuesta");
    });
    expect(result.current.loading).toBe(true);
    expect(fetcher).toHaveBeenCalledWith(
      "/api/coach/review",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Paso-Coach": "1" },
        body: JSON.stringify({ questionId: "u1-o2", answer: "Mi respuesta" }),
        signal: expect.any(AbortSignal),
      }),
    );
    await act(async () => {
      pending.resolve(response({ review }));
      await done;
    });
    expect(result.current).toMatchObject({ review, loading: false, error: "" });
    act(() => result.current.reset());
    expect(result.current).toMatchObject({ review: null, loading: false, error: "" });
  });
  it.each([
    [{ review: {} }, 200, "incomplete"],
    [{ error: "Allowance exhausted" }, 429, "Allowance exhausted"],
    [null, 200, "unavailable"],
  ])("rejects invalid/unavailable feedback %j", async (body, status, message) => {
    const fetcher = vi.fn(async () => response(body, status as number));
    vi.stubGlobal("fetch", fetcher);
    const { result } = renderHook(() => useCoach("id"));
    await act(() => result.current.check("Hola"));
    expect(result.current.error).toContain(message);
    expect(result.current.review).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(fetcher).toHaveBeenCalledOnce();
  });
  it("handles HTML errors and non-Error failures without leaking stale feedback", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("<html>Offline</html>", { status: 502 }))
        .mockRejectedValueOnce("failure"),
    );
    const { result } = renderHook(() => useCoach("id"));
    await act(() => result.current.check("Hola"));
    expect(result.current.error).toContain("unavailable");
    await act(() => result.current.check("Hola"));
    expect(result.current.error).toContain("could not finish");
  });
  it.each(["reset", "replace", "question", "unmount"])(
    "aborts %s and ignores a late success",
    async (action) => {
      const pending = deferred();
      const fetcher = vi
        .fn()
        .mockReturnValueOnce(pending.promise)
        .mockResolvedValue(response({ review: { ...review, summary: "New answer" } }));
      vi.stubGlobal("fetch", fetcher);
      const { result, rerender, unmount } = renderHook(({ id }) => useCoach(id), {
        initialProps: { id: "one" },
      });
      let old!: Promise<void>;
      act(() => {
        old = result.current.check("old");
      });
      if (action === "reset") {
        act(() => result.current.reset());
      }
      if (action === "replace") {
        await act(() => result.current.check("new"));
      }
      if (action === "question") {
        rerender({ id: "two" });
      }
      if (action === "unmount") {
        unmount();
      }
      expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
      await act(async () => {
        pending.resolve(response({ review }));
        await old;
      });
      if (action === "replace") {
        expect(result.current.review?.summary).toBe("New answer");
      }
      if (action === "reset") {
        expect(result.current).toMatchObject({ review: null, loading: false, error: "" });
      }
    },
  );
  it("ignores late rejection after reset", async () => {
    const pending = deferred();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => pending.promise),
    );
    const { result } = renderHook(() => useCoach("id"));
    let done!: Promise<void>;
    act(() => {
      done = result.current.check("Hola");
    });
    act(() => result.current.reset());
    await act(async () => {
      pending.reject(new Error("old"));
      await done;
    });
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });
  it("transcribes the original Blob, supports editing and explicit retry", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response({ error: "Try again" }, 503))
      .mockResolvedValueOnce(response({ text: "Hola, Ana." }));
    vi.stubGlobal("fetch", fetcher);
    const { result } = renderHook(useTranscription);
    act(() => result.current.retry());
    expect(fetcher).not.toHaveBeenCalled();
    const blob = new Blob(["audio"], { type: "audio/mp4" });
    await act(() => result.current.transcribe(blob));
    expect(result.current.error).toBe("Try again");
    await act(async () => result.current.retry());
    expect(result.current.text).toBe("Hola, Ana.");
    expect(fetcher.mock.calls[1]).toEqual([
      "/api/coach/transcribe",
      expect.objectContaining({
        method: "POST",
        body: blob,
        headers: { "Content-Type": "audio/mp4", "X-Paso-Coach": "1" },
      }),
    ]);
    act(() => result.current.setText("Hola, Julia."));
    expect(result.current.text).toBe("Hola, Julia.");
    act(() => result.current.clear());
    act(() => result.current.retry());
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result.current).toMatchObject({ text: "", loading: false, error: "" });
  });
  it("rejects a malformed transcript and defaults an unknown MIME type to webm", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => response({ text: 4 }));
    vi.stubGlobal("fetch", fetcher);
    const { result } = renderHook(useTranscription);
    await act(() => result.current.transcribe(new Blob(["x"])));
    expect(result.current.error).toContain("could not be read");
    expect((fetcher.mock.calls[0][1]!.headers as Record<string, string>)["Content-Type"]).toBe(
      "audio/webm",
    );
  });
  it.each(["clear", "replace", "unmount"])("cancels transcription on %s", async (action) => {
    const pending = deferred();
    const fetcher = vi
      .fn()
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValue(response({ text: "Nuevo" }));
    vi.stubGlobal("fetch", fetcher);
    const { result, unmount } = renderHook(useTranscription);
    let done!: Promise<void>;
    act(() => {
      done = result.current.transcribe(new Blob(["old"]));
    });
    expect(result.current.loading).toBe(true);
    if (action === "clear") {
      act(() => result.current.clear());
    }
    if (action === "replace") {
      await act(() => result.current.transcribe(new Blob(["new"])));
    }
    if (action === "unmount") {
      unmount();
    }
    expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
    await act(async () => {
      pending.resolve(response({ text: "Old" }));
      await done;
    });
    if (action === "replace") {
      expect(result.current.text).toBe("Nuevo");
    }
    if (action === "clear") {
      expect(result.current).toMatchObject({ text: "", loading: false, error: "" });
    }
  });
});
it("clears previous feedback when a replacement request begins", async () => {
  const pending = deferred();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValueOnce(response({ review })).mockReturnValueOnce(pending.promise),
  );
  const { result } = renderHook(() => useCoach("one"));
  await act(() => result.current.check("first"));
  let next!: Promise<void>;
  act(() => {
    next = result.current.check("second");
  });
  expect(result.current).toMatchObject({ review: null, loading: true, error: "" });
  await act(async () => {
    pending.resolve(response({ review }));
    await next;
  });
});
it("handles non-Error transcription failures and ignores a cancelled rejection", async () => {
  const pending = deferred();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockRejectedValueOnce("failed").mockReturnValueOnce(pending.promise),
  );
  const { result } = renderHook(useTranscription);
  act(() => result.current.clear());
  await act(() => result.current.transcribe(new Blob(["audio"])));
  expect(result.current.error).toBe("Transcription failed. You can type what you said below.");
  let next!: Promise<void>;
  act(() => {
    next = result.current.transcribe(new Blob(["new"]));
  });
  act(() => result.current.clear());
  await act(async () => {
    pending.reject(new Error("late"));
    await next;
  });
  expect(result.current).toMatchObject({ text: "", loading: false, error: "" });
});
it("can reset a coach before its first request", () => {
  const { result } = renderHook(() => useCoach("one"));
  act(() => result.current.reset());
  expect(result.current).toMatchObject({ review: null, error: "", loading: false });
});
