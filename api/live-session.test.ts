// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const vercel = vi.hoisted(() => ({
  store: new Map<string, unknown>(),
  pending: [] as Promise<unknown>[],
  sockets: [] as { url: string; init: unknown; sent: string[] }[],
  confirmClose: true,
  dropFirst: false,
}));

// The examiner side of a sideband connection: it answers session.close with
// session.closed when confirmClose is set, then hangs up. With dropFirst the hang-up
// reaches the socket before the session.closed message, as an abrupt drop can.
vi.mock("undici", () => ({
  WebSocket: class {
    onopen?: () => void;
    onmessage?: (e: { data: string }) => void;
    onclose?: () => void;
    onerror?: () => void;
    sent: string[] = [];

    constructor(url: string, init: unknown) {
      vercel.sockets.push({ url, init, sent: this.sent });
      queueMicrotask(() => this.onopen?.());
    }

    send(data: string) {
      this.sent.push(data);

      const closed = () =>
        vercel.confirmClose &&
        this.onmessage?.({
          data: JSON.stringify({ type: "session.closed", reason: "close_requested" }),
        });

      queueMicrotask(() => {
        if (vercel.dropFirst) {
          this.onerror?.();
          this.onclose?.();
          closed();
        } else {
          closed();
          this.onclose?.();
        }
      });
    }

    close() {}
  },
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
  vercel.sockets = [];
  vercel.confirmClose = true;
  vercel.dropFirst = false;
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
  vi.useRealTimers();
});

describe("creating a live session", () => {
  it("exchanges the browser offer for the session's answer and Lucía's greeting", async () => {
    const response = await talk({ sdp: "offer-sdp" });

    expect(response.status).toBe(201);
    const { sdp, greeting } = (await response.json()) as { sdp: string; greeting: string };

    expect(sdp).toBe("answer-sdp");
    expect(greeting).toContain("«Hola, soy Lucía.»");
    const [url, init] = openai.mock.calls[0];

    expect(url).toBe("https://api.openai.com/v1/live/sessions");
    expect(init.headers.Authorization).toBe("Bearer sk-test");
    const body = JSON.parse(init.body);

    expect(body.transport).toEqual({ type: "webrtc", sdp: "offer-sdp" });
    expect(body.session.model).toBe("gpt-live-1");
    expect(body.session.audio).toEqual({ output: { voice: "marin" } });
    expect(body.session.input[0].content[0].text).toBe(greeting);

    expect(body.session.client.data_channel.allowed_client_events).toEqual([
      "session.close",
      "session.instructions.append",
    ]);
  });

  it("introduces Lucía by name and never as an examiner", async () => {
    await talk({ sdp: "offer-sdp" });
    const { session } = JSON.parse(openai.mock.calls[0][1].body);

    expect(session.instructions).toMatch(/^Eres Lucía,/);
    expect(JSON.stringify(session)).not.toMatch(/soy (el |la |una? )?examinador/i);
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

  it("reads only its own cookie", async () => {
    const response = await talk(
      { sdp: "offer-sdp" },
      { cookie: "xpaso_live_free=used; theme=dark" },
    );

    expect(response.status).toBe(201);
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
  const twoMinutesLater = async () => {
    await vi.advanceTimersByTimeAsync(119_000);
    expect(vercel.sockets).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1_000);
    await vi.advanceTimersByTimeAsync(1_000);
    await Promise.all(vercel.pending);
  };

  it("closes the session from the server two minutes after it starts", async () => {
    vi.useFakeTimers();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await talk({ sdp: "offer-sdp" });
    await twoMinutesLater();

    expect(vercel.sockets).toEqual([
      {
        url: "wss://api.openai.com/v1/live/sessions/live_123/attach",
        init: { headers: { Authorization: "Bearer sk-test" } },
        sent: [JSON.stringify({ type: "session.close" })],
      },
    ]);

    expect(log).toHaveBeenCalledWith("Live session close", "live_123", "confirmed");
  });

  it("confirms a close whose session.closed arrives after the socket drops", async () => {
    vi.useFakeTimers();
    vercel.dropFirst = true;
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await talk({ sdp: "offer-sdp" });
    await twoMinutesLater();

    expect(log).toHaveBeenCalledWith("Live session close", "live_123", "confirmed");
  });

  it("logs a close that OpenAI never confirmed", async () => {
    vi.useFakeTimers();
    vercel.confirmClose = false;
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await talk({ sdp: "offer-sdp" });
    await twoMinutesLater();

    expect(log).toHaveBeenCalledWith("Live session close", "live_123", "unconfirmed");
  });
});

describe("caps under concurrent requests", () => {
  it("gives one free talk when two arrive at once", async () => {
    const statuses = await Promise.all([talk({ sdp: "offer-sdp" }), talk({ sdp: "offer-sdp" })]);

    expect(statuses.map((r) => r.status).sort()).toEqual([201, 403]);
    expect(openai).toHaveBeenCalledTimes(1);
  });

  it("refunds the day's talk when OpenAI fails", async () => {
    openai.mockResolvedValueOnce(new Response("{}", { status: 500 }));
    await talk({ sdp: "offer-sdp", passcode: "olé-2026" });

    for (let i = 0; i < DAILY_SESSIONS; i++) {
      expect((await talk({ sdp: "offer-sdp", passcode: "olé-2026" })).status).toBe(201);
    }
  });

  it("counts a passcode guess even when guesses arrive at once", async () => {
    await Promise.all(
      Array.from({ length: PASSCODE_TRIES + 5 }, (_, i) =>
        talk({ sdp: "offer-sdp", passcode: `guess-${i}` }),
      ),
    );

    expect((await talk({ sdp: "offer-sdp", passcode: "olé-2026" })).status).toBe(429);
  });

  it("keeps a right passcode from using up a try", async () => {
    for (let i = 0; i < PASSCODE_TRIES + 2; i++) {
      expect((await talk({ sdp: "offer-sdp", passcode: "olé-2026" })).status).toBe(201);
    }
  });
});
