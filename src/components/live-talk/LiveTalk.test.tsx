import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LiveTalk } from "./LiveTalk";

class FakeChannel {
  readyState = "open";
  sent: string[] = [];
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;

  send(data: string) {
    this.sent.push(data);
  }

  emit(event: object) {
    act(() => this.onmessage?.({ data: JSON.stringify(event) }));
  }
}

let channel: FakeChannel;
const peers: FakePeer[] = [];
const speakers: { srcObject: unknown }[] = [];
let remote: RTCSessionDescriptionInit | undefined;
const stopped: string[] = [];

class FakePeer {
  iceGatheringState = "complete";
  localDescription: RTCSessionDescriptionInit | null = null;
  ontrack: ((e: { streams: unknown[] }) => void) | null = null;

  constructor() {
    peers.push(this);
  }

  addTrack() {}

  createDataChannel() {
    channel = new FakeChannel();

    return channel;
  }

  async createOffer() {
    return { type: "offer", sdp: "offer-sdp" };
  }

  async setLocalDescription(description: RTCSessionDescriptionInit) {
    this.localDescription = description;
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit) {
    remote = description;
  }

  close() {
    stopped.push("peer");
  }
}

const microphone = {
  getAudioTracks: () => [{ stop: () => stopped.push("mic") }],
  getTracks: () => [{ stop: () => stopped.push("mic") }],
};

const api = vi.fn();

const replies = (session: Response, score?: object) =>
  api.mockImplementation(async (url: string) =>
    url === "/api/live-session" ? session : Response.json(score),
  );

const started = () => Response.json({ sdp: "answer-sdp" }, { status: 201 });

const mount = () => {
  const onEvaluated = vi.fn();
  const onSubmit = vi.fn();

  render(<LiveTalk onEvaluated={onEvaluated} onSubmit={onSubmit} />);

  return { onEvaluated, onSubmit };
};

const click = async (name: string) => {
  await act(async () => fireEvent.click(screen.getByRole("button", { name })));
};

const talk = async () => {
  await click("Start the talk");
  channel.emit({ type: "session.started", session: { id: "live_1" } });
  channel.emit({ type: "session.output_transcript.delta", delta: "¿Cómo te " });
  channel.emit({ type: "session.output_transcript.delta", delta: "llamas?" });
  channel.emit({ type: "session.input_transcript.delta", delta: "Me llamo Ana." });
};

const finish = async () => {
  await click("End the talk");
  await act(async () => channel.onmessage?.({ data: JSON.stringify({ type: "session.closed" }) }));
};

const body = (url: string) => JSON.parse(api.mock.calls.find((c) => c[0] === url)![1].body);

beforeEach(() => {
  remote = undefined;
  stopped.length = 0;
  vi.stubGlobal("RTCPeerConnection", FakePeer);
  vi.stubGlobal("fetch", api);

  vi.stubGlobal(
    "Audio",
    class {
      srcObject: unknown = null;
      play = async () => {};

      constructor() {
        speakers.push(this);
      }
    },
  );

  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: async () => microphone },
  });
});

describe("a live talk", () => {
  it("connects, shows both sides of the transcript and closes on request", async () => {
    replies(started(), { grade: "perfect", items: {} });
    mount();
    await talk();

    expect(body("/api/live-session")).toEqual({ sdp: "offer-sdp" });
    expect(remote).toEqual({ type: "answer", sdp: "answer-sdp" });
    expect(screen.getByRole("status")).toHaveTextContent("Live");

    expect(screen.getByRole("list", { name: "Transcript" })).toHaveTextContent(
      "Examiner¿Cómo te llamas?YouMe llamo Ana.",
    );

    await click("End the talk");

    expect(channel.sent).toEqual([JSON.stringify({ type: "session.close" })]);
    expect(stopped).toEqual([]);
  });

  it("scores the transcript after the talk and records a passing grade", async () => {
    replies(started(), {
      grade: "good",
      items: { name: "correct", age: "understandable", country: "correct" },
    });

    const { onEvaluated, onSubmit } = mount();

    await talk();
    await finish();

    expect(stopped).toEqual(["mic", "peer"]);

    expect(body("/api/score-talk")).toEqual({
      turns: [
        { role: "examiner", text: "¿Cómo te llamas?" },
        { role: "student", text: "Me llamo Ana." },
      ],
    });

    expect(await screen.findByRole("heading", { name: "Good. You passed." })).toBeVisible();

    expect(screen.getByRole("list", { name: "Your answers" })).toHaveTextContent(
      "NameCorrectAgeUnderstandable, with mistakesCountryCorrect",
    );

    expect(onEvaluated).toHaveBeenCalledWith(
      "Examiner: ¿Cómo te llamas?\nYou: Me llamo Ana.",
      true,
      false,
      "good",
    );

    await click("Continue");

    expect(onSubmit).toHaveBeenCalledWith(
      "Examiner: ¿Cómo te llamas?\nYou: Me llamo Ana.",
      true,
      false,
    );
  });

  it("asks for another talk after a bad grade", async () => {
    replies(started(), {
      grade: "bad",
      items: { name: "correct", age: "missing", country: "missing" },
    });

    const { onEvaluated } = mount();

    await talk();
    await finish();

    expect(
      await screen.findByRole("heading", { name: "Not yet. Talk again to pass." }),
    ).toBeVisible();

    expect(onEvaluated.mock.calls[0].slice(1)).toEqual([false, false, "bad"]);
    expect(screen.getByRole("button", { name: "Talk again" })).toBeEnabled();
  });

  it("offers to score again when scoring fails", async () => {
    replies(started(), { grade: "perfect", items: {} });
    api.mockImplementationOnce(async () => started());
    api.mockImplementationOnce(async () => new Response("{}", { status: 502 }));
    mount();
    await talk();
    await finish();
    expect(await screen.findByText(/could not be scored/)).toBeVisible();
    await click("Score again");
    expect(await screen.findByRole("heading", { name: "Perfect. You passed." })).toBeVisible();
  });
});

describe("access", () => {
  it("uses the free talk once and then asks for the passcode", async () => {
    replies(started(), { grade: "perfect", items: {} });
    mount();
    await talk();

    expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
      freeUsed: true,
      passcode: "",
    });
  });

  it("starts a talk with the passcode once the free talk is used", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "" }));
    replies(started(), { grade: "perfect", items: {} });
    mount();

    expect(screen.getByRole("button", { name: "Start the talk" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Passcode"), { target: { value: "olé" } });
    await talk();

    expect(body("/api/live-session")).toEqual({ sdp: "offer-sdp", passcode: "olé" });
    expect(JSON.parse(localStorage.getItem("paso-live-v1")!).passcode).toBe("olé");
  });

  it("forgets a passcode the server rejects", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "old" }));
    replies(Response.json({ error: "passcode" }, { status: 401 }));
    mount();
    await click("Start the talk");

    expect(screen.getByText("That passcode is not right.")).toBeVisible();
    expect(screen.getByLabelText("Passcode")).toHaveValue("");
    expect(stopped).toEqual(["mic", "peer"]);
  });

  it("asks for the passcode when the server says the free talk is used", async () => {
    replies(Response.json({ error: "free_used" }, { status: 403 }));
    mount();
    await click("Start the talk");

    expect(screen.getByText(/used your free live talk/)).toBeVisible();
    expect(screen.getByLabelText("Passcode")).toBeVisible();
  });

  it("explains the limit on wrong passcodes", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "guess" }));
    replies(Response.json({ error: "passcode_tries" }, { status: 429 }));
    mount();
    await click("Start the talk");

    expect(screen.getByText("Too many wrong passcodes. Try again tomorrow.")).toBeVisible();
  });

  it("explains the daily limit", async () => {
    replies(Response.json({ error: "daily_cap" }, { status: 429 }));
    mount();
    await click("Start the talk");

    expect(screen.getByText(/live talks for today are used up/)).toBeVisible();
  });

  it("explains a declined microphone without starting a session", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: async () => {
          throw new DOMException("Denied", "NotAllowedError");
        },
      },
    });

    mount();
    await click("Start the talk");

    expect(screen.getByText(/Microphone access was declined/)).toBeVisible();
    expect(api).not.toHaveBeenCalled();
  });
});

describe("connection", () => {
  it("plays the examiner's voice", async () => {
    replies(started());
    mount();
    await talk();
    act(() => peers.at(-1)!.ontrack?.({ streams: ["examiner-stream"] }));

    expect(speakers.at(-1)!.srcObject).toBe("examiner-stream");
  });

  it("counts the talk time while live", async () => {
    vi.useFakeTimers();
    replies(started());
    mount();
    await talk();
    await act(async () => vi.advanceTimersByTime(62_000));

    expect(screen.getByRole("status")).toHaveTextContent("Live · 1:02");
    vi.useRealTimers();
  });

  it("scores what was said when the connection drops", async () => {
    replies(started(), {
      grade: "bad",
      items: { name: "correct", age: "missing", country: "missing" },
    });

    mount();
    await talk();
    await act(async () => channel.onclose?.());

    expect(stopped).toEqual(["mic", "peer"]);

    expect(
      await screen.findByRole("heading", { name: "Not yet. Talk again to pass." }),
    ).toBeVisible();
  });

  it("ends the talk itself when the examiner never confirms the close", async () => {
    vi.useFakeTimers();
    replies(started(), { grade: "perfect", items: {} });
    mount();
    await talk();
    await click("End the talk");
    expect(stopped).toEqual([]);
    await act(async () => vi.advanceTimersByTime(15_000));

    expect(stopped).toEqual(["mic", "peer"]);
    vi.useRealTimers();
  });

  it("releases the microphone when the lesson closes mid-talk", async () => {
    replies(started());
    mount();
    await talk();
    cleanup();

    expect(stopped).toEqual(["mic", "peer"]);
  });

  it("explains a network failure", async () => {
    api.mockRejectedValue(new TypeError("Failed to fetch"));
    mount();
    await click("Start the talk");

    expect(
      screen.getByText("The examiner is not available right now. Try again later."),
    ).toBeVisible();
  });

  it("starts as a free visitor when the saved access is unreadable", () => {
    localStorage.setItem("paso-live-v1", "{oops");
    mount();

    expect(screen.getByText("Your first live talk is free.")).toBeVisible();
  });
});
