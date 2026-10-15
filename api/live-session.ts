import { createHash, timingSafeEqual } from "node:crypto";
import { waitUntil } from "@vercel/functions";
import { WebSocket } from "undici";
import { clientIp, DAY_SECONDS, give, json, take, today } from "./_lib/limits.js";

// A session costs at most about 2.25 minutes at $0.05 a minute (2 minutes plus 15
// seconds billed at startup), so the cap holds voice spend under $3.50 a day.
export const DAILY_SESSIONS = 30;
export const PASSCODE_TRIES = 10;
const SESSION_SECONDS = 120;
const FREE_COOKIE = "paso_live_free";
const FREE_SECONDS = 30 * 86_400;

// Vercel reads this statically, so it must be a literal: SESSION_SECONDS plus time
// to close the session.
export const config = { maxDuration: 150 };

const instructions = `Eres un examinador del DELE A1 en España. Hablas solo en español de España, nunca en otro idioma, aunque el candidato use otro idioma o te lo pida.
El candidato tiene nivel A1. Habla muy despacio, con frases muy cortas y palabras sencillas.
Haz exactamente estas tres preguntas, una cada vez y en este orden:
1. ¿Cómo te llamas?
2. ¿Cuántos años tienes?
3. ¿De dónde eres?
Después de cada respuesta di solo «Muy bien» o «Gracias» y haz la pregunta siguiente. No hagas preguntas de seguimiento, no corrijas errores, no expliques nada y no hables de otros temas.
Si el candidato no responde o no entiendes la respuesta, repite la misma pregunta una vez, más despacio, y después pasa a la siguiente.
Después de la tercera respuesta, despídete con una frase corta y amable, por ejemplo «Muchas gracias. Hemos terminado. ¡Adiós!», y no digas nada más.
Backchannel policy: No uses sonidos de escucha.
Interruption policy: Si el candidato habla, deja de hablar y escucha.
Delegation policy: No delegues nunca. No tienes herramientas.`;

const greeting =
  "Saluda ahora en español: «Hola, buenos días. Soy el examinador.» Después pregunta «¿Cómo te llamas?» y escucha.";

const session = {
  model: "gpt-live-1",
  instructions,
  input: [{ role: "developer", content: [{ type: "input_text", text: greeting }] }],
  client: {
    data_channel: {
      allowed_client_events: ["session.close"],
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

const digest = (text: string) => createHash("sha256").update(text).digest();

const passcodeMatches = (given: string) => {
  const expected = process.env.PASSCODE;

  return !!expected && timingSafeEqual(digest(given), digest(expected));
};

const hasFreeCookie = (request: Request) =>
  (request.headers.get("cookie") ?? "").split(";").some((c) => c.trim() === `${FREE_COOKIE}=used`);

// GPT-Live has no duration setting and its hangup endpoint is for SIP calls only, so
// the server attaches a sideband connection and closes the session itself.
const closeLater = async (id: string, key: string) => {
  await new Promise((resolve) => setTimeout(resolve, SESSION_SECONDS * 1000));

  const confirmed = await new Promise<boolean>((resolve) => {
    let closed = false;

    const socket = new WebSocket(
      `wss://api.openai.com/v1/live/sessions/${encodeURIComponent(id)}/attach`,
      { headers: { Authorization: `Bearer ${key}` } },
    );

    const timeout = setTimeout(() => socket.close(), 10_000);

    socket.onopen = () => socket.send(JSON.stringify({ type: "session.close" }));

    socket.onmessage = (e) => {
      try {
        closed ||= JSON.parse(String(e.data))?.type === "session.closed";
      } catch {
        // A message that is not JSON is not session.closed.
      }
    };

    socket.onclose = socket.onerror = () => {
      clearTimeout(timeout);
      resolve(closed);
    };
  });

  console.log("Live session close", id, confirmed ? "confirmed" : "unconfirmed");
};

// Reserves a talk: the passcode or the free talk first, then a place under the daily cap.
// Returns the refusal, or a refund for when OpenAI cannot create the session.
const reserve = async (request: Request, passcode: string | undefined) => {
  const ip = clientIp(request);
  const triesKey = `live:tries:${ip}:${today()}`;
  const freeKey = `live:free:${ip}`;
  const dayKey = `live:day:${today()}`;

  if (passcode !== undefined) {
    if (!(await take(triesKey, PASSCODE_TRIES, DAY_SECONDS))) {
      return { refusal: json({ error: "passcode_tries" }, 429) };
    }

    if (!passcodeMatches(passcode)) {
      return { refusal: json({ error: "passcode" }, 401) };
    }

    await give(triesKey, DAY_SECONDS);
  } else if (hasFreeCookie(request) || !(await take(freeKey, 1, FREE_SECONDS))) {
    return { refusal: json({ error: "free_used" }, 403) };
  }

  const refundFree = async () => {
    if (passcode === undefined) {
      await give(freeKey, FREE_SECONDS);
    }
  };

  if (!(await take(dayKey, DAILY_SESSIONS, DAY_SECONDS))) {
    await refundFree();

    return { refusal: json({ error: "daily_cap" }, 429) };
  }

  return {
    refund: async () => {
      await give(dayKey, DAY_SECONDS);
      await refundFree();
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

  return json({ sdp: created.sdp }, 201, passcode === undefined ? { "Set-Cookie": cookie } : {});
};
