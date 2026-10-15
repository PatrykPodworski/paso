// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const vercel = vi.hoisted(() => ({
  store: new Map<string, unknown>(),
  pending: [] as Promise<unknown>[],
}));

vi.mock("@vercel/functions", () => ({
  getCache: () => ({
    get: async (key: string) => vercel.store.get(key) ?? null,
    set: async (key: string, value: unknown) => {
      vercel.store.set(key, value);
    },
  }),
  ipAddress: (request: Request) => request.headers.get("x-real-ip") ?? undefined,
  waitUntil: (promise: Promise<unknown>) => {
    vercel.pending.push(promise);
  },
}));

const { POST, DAILY_SESSIONS, PASSCODE_TRIES } = await import("./live-session.ts");

const openai = vi.fn();

const talk = (body: object, headers: Record<string, string> = {}) =>
  POST(
    new Request("https://paso.podwor.ski/api/live-session", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": "203.0.113.7", ...headers },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => {
  vercel.store.clear();
  vercel.pending = [];
  vi.stubEnv("OPENAI_API_KEY", "sk-test");
  vi.stubEnv("PASSCODE", "olé-2026");

  openai.mockImplementation(async () =>
    Response.json(
      { session: { id: "live_123" }, transport: { type: "webrtc", sdp: "answer-sdp" } },
      { status: 201 },
    ),
  );

  vi.stubGlobal("fetch", openai);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("creating a live session", () => {
  it("exchanges the browser offer for the examiner session's answer", async () => {
    const response = await talk({ sdp: "offer-sdp" });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ sdp: "answer-sdp" });
    const [url, init] = openai.mock.calls[0];

    expect(url).toBe("https://api.openai.com/v1/live/sessions");
    expect(init.headers.Authorization).toBe("Bearer sk-test");
    const body = JSON.parse(init.body);

    expect(body.transport).toEqual({ type: "webrtc", sdp: "offer-sdp" });
    expect(body.session.model).toBe("gpt-live-1");
    expect(body.session.client.data_channel.allowed_client_events).toEqual(["session.close"]);
  });

  it("refuses a request without an offer before calling OpenAI", async () => {
    const response = await talk({ sdp: " " });

    expect(response.status).toBe(400);
    expect(openai).not.toHaveBeenCalled();
    expect((await talk({ sdp: "offer-sdp" })).status).toBe(201);
  });

  it("reports a missing API key as unavailable", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    expect((await talk({ sdp: "offer-sdp" })).status).toBe(503);
  });

  it("reports an OpenAI failure without spending the free talk", async () => {
    openai.mockResolvedValueOnce(new Response("{}", { status: 500 }));

    const failed = await talk({ sdp: "offer-sdp" });

    expect(failed.status).toBe(502);
    expect(failed.headers.get("set-cookie")).toBeNull();
    expect((await talk({ sdp: "offer-sdp" })).status).toBe(201);
  });
});

describe("access", () => {
  it("gives a visitor one free talk and marks it with a cookie", async () => {
    const first = await talk({ sdp: "offer-sdp" });

    expect(first.headers.get("set-cookie")).toMatch(/^paso_live_free=used;.*HttpOnly/);

    const again = await talk({ sdp: "offer-sdp" }, { cookie: "paso_live_free=used" });

    expect(again.status).toBe(403);
    expect(await again.json()).toEqual({ error: "free_used" });
    expect(openai).toHaveBeenCalledTimes(1);
  });

  it("counts the free talk per IP address when the cookie is gone", async () => {
    await talk({ sdp: "offer-sdp" });

    expect((await talk({ sdp: "offer-sdp" })).status).toBe(403);
    expect((await talk({ sdp: "offer-sdp" }, { "x-real-ip": "198.51.100.2" })).status).toBe(201);
  });

  it("lets the passcode start further talks", async () => {
    await talk({ sdp: "offer-sdp" });

    const response = await talk(
      { sdp: "offer-sdp", passcode: "olé-2026" },
      { cookie: "paso_live_free=used" },
    );

    expect(response.status).toBe(201);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("rejects a wrong passcode", async () => {
    const response = await talk({ sdp: "offer-sdp", passcode: "ole" });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "passcode" });
    expect(openai).not.toHaveBeenCalled();
  });

  it("stops checking passcodes from an address after repeated wrong guesses", async () => {
    for (let i = 0; i < PASSCODE_TRIES; i++) {
      expect((await talk({ sdp: "offer-sdp", passcode: `guess-${i}` })).status).toBe(401);
    }

    expect((await talk({ sdp: "offer-sdp", passcode: "olé-2026" })).status).toBe(429);

    expect(
      (await talk({ sdp: "offer-sdp", passcode: "olé-2026" }, { "x-real-ip": "198.51.100.2" }))
        .status,
    ).toBe(201);
  });

  it("rejects every passcode when none is configured", async () => {
    vi.stubEnv("PASSCODE", "");

    expect((await talk({ sdp: "offer-sdp", passcode: "" })).status).toBe(401);
  });

  it("stops all talks for the day at the daily cap", async () => {
    for (let i = 0; i < DAILY_SESSIONS; i++) {
      expect((await talk({ sdp: "offer-sdp", passcode: "olé-2026" })).status).toBe(201);
    }

    const response = await talk({ sdp: "offer-sdp", passcode: "olé-2026" });

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "daily_cap" });
  });
});

describe("session length", () => {
  it("closes the session from the server two minutes after it starts", async () => {
    vi.useFakeTimers();
    const sockets: { url: string; init: unknown; sent: string[] }[] = [];

    class FakeSocket {
      onopen?: () => void;
      onclose?: () => void;
      onerror?: () => void;
      sent: string[] = [];

      constructor(url: string, init: unknown) {
        sockets.push({ url, init, sent: this.sent });
        queueMicrotask(() => this.onopen?.());
      }

      send(data: string) {
        this.sent.push(data);
        queueMicrotask(() => this.onclose?.());
      }

      close() {}
    }

    vi.stubGlobal("WebSocket", FakeSocket);
    await talk({ sdp: "offer-sdp" });
    await vi.advanceTimersByTimeAsync(119_000);
    expect(sockets).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1_000);
    await Promise.all(vercel.pending);

    expect(sockets).toEqual([
      {
        url: "wss://api.openai.com/v1/live/sessions/live_123/attach",
        init: { headers: { Authorization: "Bearer sk-test" } },
        sent: [JSON.stringify({ type: "session.close" })],
      },
    ]);

    vi.useRealTimers();
  });
});
