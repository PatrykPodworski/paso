// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LiveScore } from "../src/data/types.ts";

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

const { POST, SCORES_PER_IP } = await import("./score-talk.ts");

const openai = vi.fn();

const turns = [
  { role: "examiner", text: "Hola, buenos días. ¿Cómo te llamas?" },
  { role: "student", text: "Me llamo Ana." },
  { role: "examiner", text: "Muy bien. ¿Cuántos años tienes?" },
  { role: "student", text: "Soy veinte años." },
  { role: "examiner", text: "Gracias. ¿De dónde eres?" },
  { role: "student", text: "Soy de Polonia." },
];

const model = (items: object) =>
  openai.mockImplementation(async () =>
    Response.json({
      output: [
        { type: "reasoning", summary: [] },
        { type: "message", content: [{ type: "output_text", text: JSON.stringify(items) }] },
      ],
    }),
  );

const score = (body: object, ip = "203.0.113.7"): Promise<Response> =>
  POST(
    new Request("https://paso.podwor.ski/api/score-talk", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": ip },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => {
  store.clear();
  vi.stubEnv("OPENAI_API_KEY", "sk-test");
  vi.stubGlobal("fetch", openai);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("scoring a talk", () => {
  it("passes a talk with all three answers in correct Spanish as perfect", async () => {
    model({ name: "correct", age: "correct", country: "correct" });

    const response = await score({ turns });

    expect(await response.json()).toEqual({
      grade: "perfect",
      items: { name: "correct", age: "correct", country: "correct" },
    });
  });

  it("passes understandable answers with mistakes as good", async () => {
    model({ name: "correct", age: "understandable", country: "correct" });

    expect(((await (await score({ turns })).json()) as LiveScore).grade).toBe("good");
  });

  it("fails a talk with a missing answer as bad", async () => {
    model({ name: "correct", age: "understandable", country: "missing" });

    expect(((await (await score({ turns })).json()) as LiveScore).grade).toBe("bad");
  });

  it("sends the transcript, not the grade, to the text model", async () => {
    model({ name: "correct", age: "correct", country: "correct" });
    await score({ turns });
    const [url, init] = openai.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(url).toBe("https://api.openai.com/v1/responses");
    expect(init.headers.Authorization).toBe("Bearer sk-test");
    expect(body.model).toBe("gpt-5.6-luna");
    expect(body.input).toContain("Student: Soy veinte años.");
    expect(body.input).toContain("Examiner: Gracias. ¿De dónde eres?");
    expect(body.text.format.type).toBe("json_schema");
  });

  it("fails a talk where the student said nothing without calling the model", async () => {
    const response = await score({ turns: [{ role: "examiner", text: "¿Cómo te llamas?" }] });

    expect(await response.json()).toEqual({
      grade: "bad",
      items: { name: "missing", age: "missing", country: "missing" },
    });

    expect(openai).not.toHaveBeenCalled();
  });
});

describe("guards", () => {
  it("rejects a malformed or oversized transcript", async () => {
    model({ name: "correct", age: "correct", country: "correct" });

    expect((await score({ turns: "hola" })).status).toBe(400);
    expect((await score({ turns: [{ role: "student", text: 4 }] })).status).toBe(400);
    expect((await score({ turns: [{ role: "teacher", text: "hola" }] })).status).toBe(400);

    expect((await score({ turns: [{ role: "student", text: "a".repeat(5000) }] })).status).toBe(
      400,
    );

    expect((await score({ turns })).status).toBe(200);
  });

  it("limits scoring per IP address per day", async () => {
    model({ name: "correct", age: "correct", country: "correct" });

    for (let i = 0; i < SCORES_PER_IP; i++) {
      expect((await score({ turns })).status).toBe(200);
    }

    expect((await score({ turns })).status).toBe(429);
    expect((await score({ turns }, "198.51.100.2")).status).toBe(200);
  });

  it("reports a model failure or unusable output as an upstream error", async () => {
    openai.mockImplementationOnce(async () => new Response("{}", { status: 500 }));
    expect((await score({ turns })).status).toBe(502);

    model({ name: "yes" });
    expect((await score({ turns })).status).toBe(502);
  });

  it("reports a missing API key as unavailable", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    expect((await score({ turns })).status).toBe(503);
  });
});
