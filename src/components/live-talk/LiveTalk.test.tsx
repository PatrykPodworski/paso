import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
let remoteFails = false;
let gathering = false;
const stopped: string[] = [];

class FakePeer {
  iceGatheringState = gathering ? "gathering" : "complete";
  localDescription: RTCSessionDescriptionInit | null = null;
  ontrack: ((e: { streams: unknown[] }) => void) | null = null;
  connectionState = "new";
  onconnectionstatechange: (() => void) | null = null;
  listeners: (() => void)[] = [];

  constructor() {
    peers.push(this);
  }

  addEventListener(_type: string, listener: () => void) {
    this.listeners.push(listener);
  }

  removeEventListener(_type: string, listener: () => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  gather() {
    this.iceGatheringState = "complete";
    act(() => this.listeners.forEach((l) => l()));
  }

  addTrack() {
    if (this.connectionState === "closed") {
      throw new DOMException("The peer is closed", "InvalidStateError");
    }
  }

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
    if (remoteFails) {
      throw new DOMException("Bad answer", "InvalidAccessError");
    }

    remote = description;
  }

  become(state: string) {
    this.connectionState = state;
    act(() => this.onconnectionstatechange?.());
  }

  close() {
    this.connectionState = "closed";
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

const started = (limitSeconds = 120) =>
  Response.json({ sdp: "answer-sdp", greeting: "Saluda.", limitSeconds }, { status: 201 });

const graded = (name: string, age: string, country: string) => [
  { id: "name", label: "Name", level: name },
  { id: "age", label: "Age", level: age },
  { id: "country", label: "Country", level: country },
];

const mount = () => {
  const onEvaluated = vi.fn();
  const onSubmit = vi.fn();

  render(<LiveTalk task="u1" onEvaluated={onEvaluated} onSubmit={onSubmit} />);

  return { onEvaluated, onSubmit };
};

const click = async (name: string) => {
  await act(async () => fireEvent.click(screen.getByRole("button", { name })));
};

const say = (role: "examiner" | "student", delta: string, start: number) =>
  channel.emit({
    type: `session.${role === "student" ? "input" : "output"}_transcript.delta`,
    delta,
    start_ms: start,
    end_ms: start + 300,
  });

const talk = async () => {
  await click("Start the talk");
  channel.emit({ type: "session.started", session: { id: "live_1" } });
  say("examiner", "¿Cómo te ", 0);
  say("examiner", "llamas?", 400);
  say("student", "Me llamo Ana.", 2100);
};

const finish = async () => {
  await click("End the talk");
  await act(async () => channel.onmessage?.({ data: JSON.stringify({ type: "session.closed" }) }));
};

const openTranscript = async () => {
  await act(async () => fireEvent.click(screen.getByText("Transcript")));

  return screen.getByRole("list", { name: "Transcript" });
};

const body = (url: string) => JSON.parse(api.mock.calls.find((c) => c[0] === url)![1].body);

beforeEach(() => {
  remote = undefined;
  remoteFails = false;
  gathering = false;
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

afterEach(() => {
  vi.useRealTimers();
});

describe("a live talk", () => {
  it("connects, shows only the status during the talk and closes on request", async () => {
    replies(started(), { grade: "perfect", items: [] });
    mount();
    await talk();

    expect(body("/api/live-session")).toEqual({ sdp: "offer-sdp", task: "u1" });
    expect(remote).toEqual({ type: "answer", sdp: "answer-sdp" });
    expect(screen.getByRole("status")).toHaveTextContent("Live");
    expect(screen.queryByText("Me llamo Ana.")).toBeNull();

    await click("End the talk");

    expect(channel.sent).toEqual([JSON.stringify({ type: "session.close" })]);
    expect(screen.getByRole("status")).toHaveTextContent("Finishing the talk…");
    expect(stopped).toEqual([]);
  });

  it("scores the transcript after the talk and records a passing grade", async () => {
    replies(started(), {
      grade: "good",
      items: [
        { id: "name", label: "Name", level: "correct" },
        { id: "age", label: "Age", level: "understandable" },
        { id: "home", label: "Home town", level: "correct" },
      ],
    });

    const { onEvaluated, onSubmit } = mount();

    await talk();
    await finish();

    expect(stopped).toEqual(["mic", "peer"]);

    expect(body("/api/score-talk")).toEqual({
      task: "u1",
      turns: [
        { role: "examiner", text: "¿Cómo te llamas?" },
        { role: "student", text: "Me llamo Ana." },
      ],
    });

    expect(await screen.findByRole("heading", { name: "Good. You passed." })).toBeVisible();

    expect(screen.getByRole("list", { name: "Your answers" })).toHaveTextContent(
      "NameCorrectAgeUnderstandable, with mistakesHome townCorrect",
    );

    expect(screen.getByRole("list", { name: "Transcript" })).not.toBeVisible();
    expect(await openTranscript()).toHaveTextContent("Lucía¿Cómo te llamas?YouMe llamo Ana.");
    expect(screen.getByRole("list", { name: "Transcript" })).toBeVisible();

    expect(onEvaluated).toHaveBeenCalledWith(
      "Lucía: ¿Cómo te llamas?\nYou: Me llamo Ana.",
      true,
      false,
      "good",
    );

    await click("Continue");

    expect(onSubmit).toHaveBeenCalledWith(
      "Lucía: ¿Cómo te llamas?\nYou: Me llamo Ana.",
      true,
      false,
    );
  });

  it("asks for another talk after a bad grade", async () => {
    replies(started(), { grade: "bad", items: graded("correct", "missing", "missing") });

    const { onEvaluated } = mount();

    await talk();
    await finish();

    expect(
      await screen.findByRole("heading", { name: "Not yet. Talk again to pass." }),
    ).toBeVisible();

    expect(screen.getByText(/Lucía did not get everything she asked for\./)).toBeVisible();

    expect(onEvaluated.mock.calls[0].slice(1)).toEqual([false, false, "bad"]);
    expect(screen.getByRole("button", { name: "Talk again" })).toBeEnabled();
  });

  it("offers to score again when scoring fails", async () => {
    replies(started(), { grade: "perfect", items: [] });
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

it("clips a long transcript to the 4000 characters progress stores", async () => {
  replies(started(), { grade: "good", items: [] });
  const { onEvaluated } = mount();

  await talk();
  say("student", "a".repeat(4000), 2500);
  await finish();
  await screen.findByRole("heading", { name: "Good. You passed." });

  const [answer] = onEvaluated.mock.calls[0];

  expect(answer).toHaveLength(4000);
  expect(answer.startsWith("Lucía: ¿Cómo te llamas?\nYou: Me llamo Ana.")).toBe(true);
});

describe("access", () => {
  it("uses the free talk once and then asks for the passcode", async () => {
    replies(started(), { grade: "perfect", items: [] });
    mount();
    await talk();

    expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
      freeUsed: true,
      passcode: "",
    });
  });

  it("keeps the passcode progress stored when the free talk is used", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: false, passcode: "olé" }));
    replies(started(), { grade: "perfect", items: [] });
    mount();
    await talk();

    expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
      freeUsed: true,
      passcode: "olé",
    });
  });

  it("starts a talk with the passcode once the free talk is used", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "" }));
    replies(started(), { grade: "perfect", items: [] });
    mount();

    expect(screen.getByRole("button", { name: "Start the talk" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Passcode"), { target: { value: "olé" } });
    await talk();

    expect(body("/api/live-session")).toEqual({ sdp: "offer-sdp", task: "u1", passcode: "olé" });
    expect(JSON.parse(localStorage.getItem("paso-live-v1")!).passcode).toBe("olé");
  });

  it("sends the passcode with the transcript, also when scoring again", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));
    let scores = 0;

    api.mockImplementation(async (url: string) =>
      url === "/api/live-session"
        ? started()
        : ++scores === 1
          ? new Response("{}", { status: 502 })
          : Response.json({ grade: "perfect", items: [] }),
    );

    mount();
    await talk();
    await finish();
    expect(await screen.findByText(/could not be scored/)).toBeVisible();
    await click("Score again");

    const passcodes = api.mock.calls
      .filter((c) => c[0] === "/api/score-talk")
      .map((c) => JSON.parse(c[1].body).passcode);

    expect(passcodes).toEqual(["olé", "olé"]);
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

    expect(screen.getByText("This network has already used its free live talk.")).toBeVisible();
    expect(screen.getByLabelText("Passcode")).toBeVisible();
  });

  it("keeps the passcode progress stored when the server says the free talk is used", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: false, passcode: "olé" }));
    replies(Response.json({ error: "free_used" }, { status: 403 }));
    mount();
    await click("Start the talk");

    expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
      freeUsed: true,
      passcode: "olé",
    });

    expect(screen.getByLabelText("Passcode")).toHaveValue("olé");
  });

  it("explains the limit on wrong passcodes", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "guess" }));
    replies(Response.json({ error: "passcode_tries" }, { status: 429 }));
    mount();
    await click("Start the talk");

    expect(screen.getByText("Too many wrong passcodes. Try again tomorrow.")).toBeVisible();
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
  it("plays Lucía's voice", async () => {
    replies(started());
    mount();
    await talk();
    act(() => peers.at(-1)!.ontrack?.({ streams: ["lucia-stream"] }));

    expect(speakers.at(-1)!.srcObject).toBe("lucia-stream");
  });

  it("asks to close shortly after the limit the server returned", async () => {
    vi.useFakeTimers();
    replies(started(40));
    mount();
    await talk();
    await act(async () => vi.advanceTimersByTime(44_999));

    expect(channel.sent).toEqual([]);

    await act(async () => vi.advanceTimersByTime(1));

    expect(channel.sent).toEqual([JSON.stringify({ type: "session.close" })]);
    expect(screen.getByRole("status")).toHaveTextContent("Finishing the talk…");
  });

  it("counts the talk time while live", async () => {
    vi.useFakeTimers();
    replies(started());
    mount();
    await talk();
    await act(async () => vi.advanceTimersByTime(62_000));

    expect(screen.getByRole("status")).toHaveTextContent(/^Live$/);
    expect(screen.getByText("1:02")).toBeVisible();
  });

  it("scores what was said when the connection drops", async () => {
    replies(started(), { grade: "bad", items: graded("correct", "missing", "missing") });

    mount();
    await talk();
    await act(async () => channel.onclose?.());

    expect(stopped).toEqual(["mic", "peer"]);

    expect(
      await screen.findByRole("heading", { name: "Not yet. Talk again to pass." }),
    ).toBeVisible();
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

    expect(screen.getByText("Lucía is not available right now. Try again later.")).toBeVisible();
  });

  it("starts as a free visitor when the saved access is unreadable", () => {
    localStorage.setItem("paso-live-v1", "{oops");
    mount();

    expect(screen.getByText("Your first live talk is free.")).toBeVisible();
    expect(screen.getByText(/^Lucía talks with you in Spanish\./)).toBeVisible();
  });
});

describe("guards", () => {
  it("shows the turns in the order they were spoken", async () => {
    replies(started(), { grade: "perfect", items: [] });
    mount();
    await talk();
    say("examiner", "¿Cuántos años tienes?", 4000);
    say("student", "Ana, ", 1800);
    await finish();
    await screen.findByRole("heading", { name: "Perfect. You passed." });

    expect(await openTranscript()).toHaveTextContent(
      "Lucía¿Cómo te llamas?YouAna, Me llamo Ana.Lucía¿Cuántos años tienes?",
    );
  });

  it("lets the learner cancel while connecting", async () => {
    replies(started());
    mount();
    await click("Start the talk");
    await click("Cancel");

    expect(stopped).toEqual(["mic", "peer"]);
    expect(screen.getByRole("button", { name: "Start the talk" })).toBeVisible();
    expect(api.mock.calls.map((c) => c[0])).toEqual(["/api/live-session"]);
  });

  it("stops a microphone the browser grants after the learner cancelled", async () => {
    let grant!: (stream: typeof microphone) => void;

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: () => new Promise((resolve) => (grant = resolve)) },
    });

    mount();
    await click("Start the talk");
    await click("Cancel");
    await act(async () => grant(microphone));

    expect(stopped).toContain("mic");
    expect(api).not.toHaveBeenCalled();
  });

  it("sends the offer once gathering completes and stops listening for it", async () => {
    gathering = true;
    replies(started());
    mount();
    await click("Start the talk");

    expect(api).not.toHaveBeenCalled();

    await act(async () => peers.at(-1)!.gather());

    expect(body("/api/live-session")).toEqual({ sdp: "offer-sdp", task: "u1" });
    expect(peers.at(-1)!.listeners).toEqual([]);
  });

  it("sends no session request when the learner cancels while connecting", async () => {
    vi.useFakeTimers();
    gathering = true;
    replies(started());
    mount();
    await click("Start the talk");
    await click("Cancel");
    await act(async () => vi.advanceTimersByTimeAsync(5_000));

    expect(api).not.toHaveBeenCalled();
  });

  it("ignores a cancelled call's late events during the next talk", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));
    api.mockImplementation(async () => started());
    mount();
    await click("Start the talk");
    await click("Cancel");

    const [oldChannel, oldPeer] = [channel, peers.at(-1)!];

    await click("Start the talk");
    await act(async () => oldChannel.onclose?.());
    oldPeer.become("failed");
    oldChannel.emit({ type: "session.closed" });

    expect(screen.getByRole("status")).toHaveTextContent("Connecting to Lucía…");
    expect(screen.queryByText(/not available/)).toBeNull();
  });

  it("gives up when the connection fails before Lucía starts", async () => {
    replies(started());
    mount();
    await click("Start the talk");
    peers.at(-1)!.become("failed");

    expect(screen.getByText("Lucía is not available right now. Try again later.")).toBeVisible();

    expect(stopped).toEqual(["mic", "peer"]);
  });

  it("scores what was said when the connection is lost mid-talk", async () => {
    replies(started(), { grade: "perfect", items: graded("correct", "correct", "correct") });

    mount();
    await talk();
    await act(async () => peers.at(-1)!.become("disconnected"));

    expect(await screen.findByRole("heading", { name: "Perfect. You passed." })).toBeVisible();
  });

  it("counts the free talk as used once the session exists, even if the call fails", async () => {
    remoteFails = true;
    replies(started());
    mount();
    await click("Start the talk");

    expect(screen.getByText("Lucía is not available right now. Try again later.")).toBeVisible();

    expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
      freeUsed: true,
      passcode: "",
    });

    expect(screen.getByLabelText("Passcode")).toBeVisible();
  });
});

describe("greeting", () => {
  it("asks Lucía to greet with the server's words when she is silent", async () => {
    vi.useFakeTimers();
    replies(started());
    mount();
    await click("Start the talk");
    channel.emit({ type: "session.started", session: { id: "live_1" } });
    await act(async () => vi.advanceTimersByTime(2_500));

    expect(channel.sent).toEqual([
      JSON.stringify({
        type: "session.instructions.append",
        delegation_id: null,
        content: "Saluda.",
      }),
    ]);
  });
});
