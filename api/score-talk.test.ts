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

const { POST } = await import("./score-talk.ts");
const { PASSCODE_TRIES } = await import("./_lib/passcode.ts");

const openai = vi.fn();

const turns = [
  { role: "examiner", text: "Hola, buenos días. ¿Cómo te llamas?" },
  { role: "student", text: "Me llamo Ana." },
  { role: "examiner", text: "Muy bien. ¿Cuántos años tienes?" },
  { role: "student", text: "Soy veinte años." },
  { role: "examiner", text: "Gracias. ¿De dónde eres?" },
  { role: "student", text: "Soy de Polonia." },
];

const model = (levels: object, corrections: object[] = []) =>
  openai.mockImplementation(async () =>
    Response.json({
      output: [
        { type: "reasoning", summary: [] },
        {
          type: "message",
          content: [{ type: "output_text", text: JSON.stringify({ levels, corrections }) }],
        },
      ],
    }),
  );

const age = {
  original: "Soy veinte años",
  corrected: "Tengo veinte años",
  explanation: "Spanish uses tener for age.",
};

const score = (body: object, ip = "203.0.113.7"): Promise<Response> =>
  POST(
    new Request("https://paso.podwor.ski/api/score-talk", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": ip },
      body: JSON.stringify({ task: "u1", passcode: "olé-2026", ...body }),
    }),
  );

beforeEach(() => {
  store.clear();
  vi.stubEnv("OPENAI_API_KEY", "sk-test");
  vi.stubEnv("PASSCODE", "olé-2026");
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
      items: [
        { id: "name", label: "Name", level: "correct" },
        { id: "age", label: "Age", level: "correct" },
        { id: "country", label: "Country", level: "correct" },
      ],
      corrections: [],
    });
  });

  it("lists the learner's errors with the corrections the model gives", async () => {
    model({ name: "correct", age: "understandable", country: "correct" }, [age]);

    const response = await score({ turns });

    expect(await response.json()).toEqual({
      grade: "good",
      items: [
        { id: "name", label: "Name", level: "correct" },
        { id: "age", label: "Age", level: "understandable" },
        { id: "country", label: "Country", level: "correct" },
      ],
      corrections: [age],
    });
  });

  it("keeps at most eight corrections", async () => {
    const many = Array.from({ length: 10 }, (_, i) => ({ ...age, original: `error ${i}` }));

    model({ name: "correct", age: "understandable", country: "correct" }, many);

    const { corrections } = (await (await score({ turns })).json()) as LiveScore;

    expect(corrections?.map((c) => c.original)).toEqual([
      "error 0",
      "error 1",
      "error 2",
      "error 3",
      "error 4",
      "error 5",
      "error 6",
      "error 7",
    ]);
  });

  it("lists the items in the task's order, whatever order the model used", async () => {
    model({ country: "missing", age: "understandable", name: "correct" });

    const { items } = (await (await score({ turns })).json()) as LiveScore;

    expect(items.map((i) => `${i.id}:${i.level}`)).toEqual([
      "name:correct",
      "age:understandable",
      "country:missing",
    ]);
  });

  it("refuses a task it does not know before calling the model", async () => {
    model({ name: "correct", age: "correct", country: "correct" });

    for (const task of ["u99", 7, undefined]) {
      const response = await score({ turns, task });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "task" });
    }

    expect(openai).not.toHaveBeenCalled();
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
    expect(body.instructions).toContain("For each of name, age and country, return one of:");
    expect(body.instructions).toContain("In corrections, list the learner's grammar");
    expect(body.text.format.type).toBe("json_schema");
    expect(body.text.format.schema.required).toEqual(["levels", "corrections"]);
    expect(body.text.format.schema.properties.levels.required).toEqual(["name", "age", "country"]);
  });

  it("fails a talk where the student said nothing without calling the model", async () => {
    const response = await score({ turns: [{ role: "examiner", text: "¿Cómo te llamas?" }] });

    expect(await response.json()).toEqual({
      grade: "bad",
      items: [
        { id: "name", label: "Name", level: "missing" },
        { id: "age", label: "Age", level: "missing" },
        { id: "country", label: "Country", level: "missing" },
      ],
    });

    expect(openai).not.toHaveBeenCalled();
  });
});

describe("guards", () => {
  it("joins a transcript split into many short turns instead of refusing it", async () => {
    model({ name: "correct", age: "correct", country: "correct" });

    const fragments = Array.from({ length: 60 }, (_, i) => ({
      role: i % 3 === 2 ? "examiner" : "student",
      text: `palabra${i}`,
    }));

    expect((await score({ turns: fragments })).status).toBe(200);
    const input = JSON.parse(openai.mock.calls[0][1].body).input as string;

    expect(input.split("\n")).toHaveLength(40);
    expect(input.split("\n")[0]).toBe("Student: palabra0 palabra1");
  });

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

  it("reports a model failure or unusable output as an upstream error", async () => {
    openai.mockImplementationOnce(async () => new Response("{}", { status: 500 }));
    expect((await score({ turns })).status).toBe(502);

    model({ name: "yes" });
    expect((await score({ turns })).status).toBe(502);
  });

  it("reports corrections that break the schema as an upstream error", async () => {
    const levels = { name: "correct", age: "correct", country: "correct" };

    model(levels, [{ original: "Soy veinte años", corrected: "Tengo veinte años" }]);
    expect((await score({ turns })).status).toBe(502);

    openai.mockImplementationOnce(async () =>
      Response.json({
        output: [
          { type: "message", content: [{ type: "output_text", text: JSON.stringify({ levels }) }] },
        ],
      }),
    );

    expect((await score({ turns })).status).toBe(502);

    model(levels, [age]);
    expect((await score({ turns })).status).toBe(200);
  });

  it("reports a missing API key as unavailable", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    expect((await score({ turns })).status).toBe(503);
  });
});

describe("access", () => {
  const free = { turns, passcode: undefined };

  beforeEach(() => model({ name: "correct", age: "correct", country: "correct" }));

  it("gives an address one free score", async () => {
    expect((await score(free)).status).toBe(200);

    const again = await score(free);

    expect(again.status).toBe(403);
    expect(await again.json()).toEqual({ error: "free_used" });
    expect((await score(free, "198.51.100.2")).status).toBe(200);
    expect(openai).toHaveBeenCalledTimes(2);
  });

  it("gives the free score back when the model fails", async () => {
    openai.mockImplementationOnce(async () => new Response("{}", { status: 500 }));

    expect((await score(free)).status).toBe(502);
    expect((await score(free)).status).toBe(200);
  });

  it("gives the free score back when the model cannot be reached", async () => {
    openai.mockRejectedValueOnce(new TypeError("fetch failed"));

    expect((await score(free)).status).toBe(502);
    expect((await score(free)).status).toBe(200);
  });

  it("gives the free score back when the model answers with a body that is not JSON", async () => {
    openai.mockImplementationOnce(async () => new Response("<html>", { status: 200 }));

    expect((await score(free)).status).toBe(502);
    expect((await score(free)).status).toBe(200);
  });

  it("gives the free score back when the model answers with a malformed envelope", async () => {
    openai.mockImplementationOnce(async () => Response.json({ output: {} }));

    expect((await score(free)).status).toBe(502);
    expect((await score(free)).status).toBe(200);
  });

  it("scores without a limit with the passcode", async () => {
    for (let i = 0; i < 50; i++) {
      expect((await score({ turns })).status).toBe(200);
    }
  });

  it("rejects a wrong passcode", async () => {
    const response = await score({ turns, passcode: "ole" });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "passcode" });
    expect(openai).not.toHaveBeenCalled();
  });

  it("stops checking passcodes from an address after repeated wrong guesses", async () => {
    for (let i = 0; i < PASSCODE_TRIES; i++) {
      expect((await score({ turns, passcode: `guess-${i}` })).status).toBe(401);
    }

    expect((await score({ turns })).status).toBe(429);
    expect((await score({ turns }, "198.51.100.2")).status).toBe(200);
  });
});
