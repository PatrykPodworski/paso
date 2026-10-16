import { waitUntil } from "@vercel/functions";
import { WebSocket } from "undici";
import { clientIp, FREE_SECONDS, give, json, take } from "./_lib/limits.js";
import { passcodeRefusal } from "./_lib/passcode.js";
import { greeting, instructions } from "./_lib/talk-instructions.js";

const SESSION_SECONDS = 120;
const FREE_COOKIE = "paso_live_free";

// Vercel reads this statically, so it must be a literal: SESSION_SECONDS plus time
// to close the session.
export const config = { maxDuration: 150 };

const session = {
  model: "gpt-live-1",
  instructions,
  audio: { output: { voice: "marin" } },
  input: [{ role: "developer", content: [{ type: "input_text", text: greeting }] }],
  client: {
    data_channel: {
      allowed_client_events: ["session.close", "session.instructions.append"],
      allowed_server_events: [
        "session.started",
        "session.input_transcript.delta",
        "session.output_transcript.delta",
        "session.closed",
        "error",
      ].map((type) => ({ type })),
    },
  },
};

const hasFreeCookie = (request: Request) =>
  (request.headers.get("cookie") ?? "").split(";").some((c) => c.trim() === `${FREE_COOKIE}=used`);

// GPT-Live has no duration setting and its hangup endpoint is for SIP calls only, so
// the server attaches a sideband connection and closes the session itself.
const closeLater = async (id: string, key: string) => {
  await new Promise((resolve) => setTimeout(resolve, SESSION_SECONDS * 1000));

  const confirmed = await new Promise<boolean>((resolve) => {
    const socket = new WebSocket(
      `wss://api.openai.com/v1/live/sessions/${encodeURIComponent(id)}/attach`,
      { headers: { Authorization: `Bearer ${key}` } },
    );

    const timeout = setTimeout(() => socket.close(), 10_000);

    const settle = (closed: boolean) => {
      clearTimeout(timeout);
      resolve(closed);
    };

    socket.onopen = () => socket.send(JSON.stringify({ type: "session.close" }));

    socket.onmessage = (e) => {
      try {
        if (JSON.parse(String(e.data))?.type === "session.closed") {
          settle(true);
          socket.close();
        }
      } catch {
        // A message that is not JSON is not session.closed.
      }
    };

    // OpenAI drops the socket right after session.closed, and undici can report the
    // drop before that last message, so a drop waits a moment for it.
    socket.onclose = socket.onerror = () => setTimeout(() => settle(false), 1000);
  });

  console.log("Live session close", id, confirmed ? "confirmed" : "unconfirmed");
};

// Reserves a talk with the passcode or the free talk. Returns the refusal, or a refund
// for when OpenAI cannot create the session.
const reserve = async (request: Request, passcode: string | undefined) => {
  const freeKey = `live:free:${clientIp(request)}`;

  if (passcode !== undefined) {
    const refusal = await passcodeRefusal(request, passcode);

    if (refusal) {
      return { refusal };
    }
  } else if (hasFreeCookie(request) || !(await take(freeKey, 1, FREE_SECONDS))) {
    return { refusal: json({ error: "free_used" }, 403) };
  }

  return {
    refund: async () => {
      if (passcode === undefined) {
        await give(freeKey, FREE_SECONDS);
      }
    },
  };
};

const createSession = async (key: string, sdp: string) => {
  const response = await fetch("https://api.openai.com/v1/live/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ session, transport: { type: "webrtc", sdp } }),
  });

  const created = response.ok
    ? ((await response.json().catch(() => null)) as {
        session?: { id?: string };
        transport?: { sdp?: string };
      } | null)
    : null;

  if (!created?.session?.id || !created.transport?.sdp) {
    console.error("Live session creation failed", response.status);

    return null;
  }

  return { id: created.session.id, sdp: created.transport.sdp };
};

export const POST = async (request: Request) => {
  const body = (await request.json().catch(() => ({}))) as { sdp?: unknown; passcode?: unknown };
  const sdp = typeof body.sdp === "string" ? body.sdp : "";
  const passcode = typeof body.passcode === "string" ? body.passcode : undefined;
  const key = process.env.OPENAI_API_KEY;

  if (!sdp.trim() || sdp.length > 20_000) {
    return json({ error: "offer" }, 400);
  }

  if (!key) {
    return json({ error: "unavailable" }, 503);
  }

  const reserved = await reserve(request, passcode);

  if (reserved.refusal) {
    return reserved.refusal;
  }

  const created = await createSession(key, sdp);

  if (!created) {
    await reserved.refund();

    return json({ error: "upstream" }, 502);
  }

  waitUntil(closeLater(created.id, key));

  const cookie = `${FREE_COOKIE}=used; Path=/api; Max-Age=31536000; HttpOnly; Secure; SameSite=Strict`;

  return json(
    { sdp: created.sdp, greeting },
    201,
    passcode === undefined ? { "Set-Cookie": cookie } : {},
  );
};
