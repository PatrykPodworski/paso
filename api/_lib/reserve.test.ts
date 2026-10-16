// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";

const store = vi.hoisted(() => new Map<string, unknown>());

vi.mock("@vercel/functions", () => ({
  getCache: () => ({
    get: async (key: string) => store.get(key) ?? null,
    set: async (key: string, value: unknown) => {
      store.set(key, value);
    },
  }),
  ipAddress: (request: Request) => request.headers.get("x-real-ip") ?? undefined,
}));

const { reserve } = await import("./reserve.ts");

const request = () =>
  new Request("https://paso.podwor.ski/api/x", { headers: { "x-real-ip": "203.0.113.7" } });

beforeEach(() => {
  store.clear();
  vi.stubEnv("PASSCODE", "open sesame");
});

it("counts the free use per scope and address", async () => {
  expect("refund" in (await reserve(request(), undefined, "live"))).toBe(true);
  expect("refund" in (await reserve(request(), undefined, "score"))).toBe(true);

  expect(Object.fromEntries(store)).toEqual({
    "live:free:203.0.113.7": 1,
    "score:free:203.0.113.7": 1,
  });

  const again = await reserve(request(), undefined, "live");

  expect(again.refusal?.status).toBe(403);
  expect(await again.refusal?.json()).toEqual({ error: "free_used" });
});

it("refuses the free use without counting it when freeUsed says so", async () => {
  const reserved = await reserve(request(), undefined, "live", () => true);

  expect(reserved.refusal?.status).toBe(403);
  expect(store.has("live:free:203.0.113.7")).toBe(false);
});

it("gives the free use back on refund", async () => {
  await (await reserve(request(), undefined, "score")).refund?.();

  expect(store.get("score:free:203.0.113.7")).toBe(0);
  expect("refund" in (await reserve(request(), undefined, "score"))).toBe(true);
});

it("leaves the free use alone for a passcode call, even on refund", async () => {
  await (await reserve(request(), "open sesame", "score")).refund?.();

  expect(store.has("score:free:203.0.113.7")).toBe(false);
});

it("passes on the passcode refusal", async () => {
  const reserved = await reserve(request(), "wrong", "live");

  expect(reserved.refusal?.status).toBe(401);
  expect(await reserved.refusal?.json()).toEqual({ error: "passcode" });
});
