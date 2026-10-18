import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createExaminerConnection } from "./examinerConnection";
import type { Fragment } from "./transcript";
import { useLiveTalk } from "./useLiveTalk";

vi.mock("./examinerConnection", () => ({ createExaminerConnection: vi.fn() }));

type ConnectionHandlers = Parameters<typeof createExaminerConnection>[0];

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));

  return { promise, resolve };
};

type MicrophoneError = "denied" | "microphone" | null;

class FakeExaminer {
  handlers: ConnectionHandlers;
  microphone = deferred<MicrophoneError>();
  session = deferred<string | null>();
  acquireMicrophone = vi.fn(() => this.microphone.promise);
  connect = vi.fn(() => this.session.promise);
  end = vi.fn(() => true);
  greet = vi.fn();
  close = vi.fn();

  constructor(handlers: ConnectionHandlers) {
    this.handlers = handlers;
  }
}

const examiners: FakeExaminer[] = [];
const examiner = () => examiners.at(-1)!;

const mount = () => {
  const handlers = { onCreated: vi.fn(), onEnded: vi.fn(), onFail: vi.fn() };
  const hook = renderHook(() => useLiveTalk());
  const talk = () => hook.result.current;

  const start = (passcode?: string) =>
    act(async () => {
      void talk().start(passcode, handlers);
    });

  const microphone = (code: MicrophoneError = null) =>
    act(async () => examiner().microphone.resolve(code));

  const session = (code: string | null = null) => act(async () => examiner().session.resolve(code));

  const started = () => act(() => examiner().handlers.onStarted());
  const closed = () => act(() => examiner().handlers.onClosed());
  const dropped = () => act(() => examiner().handlers.onDrop());
  const spoken = (fragment: Fragment) => act(() => examiner().handlers.onFragment(fragment));
  const elapse = (ms: number) => act(() => vi.advanceTimersByTime(ms));

  const live = async () => {
    await start();
    await microphone();
    started();
  };

  return {
    ...hook,
    talk,
    handlers,
    start,
    microphone,
    session,
    started,
    closed,
    dropped,
    spoken,
    elapse,
    live,
  };
};

const greeting: Fragment = { role: "examiner", text: "¿Cómo te llamas?", start: 0, end: 900 };
const answer: Fragment = { role: "student", text: "Me llamo Ana.", start: 2100, end: 2400 };

beforeEach(() => {
  examiners.length = 0;

  vi.mocked(createExaminerConnection).mockImplementation((handlers) => {
    const fake = new FakeExaminer(handlers);

    examiners.push(fake);

    return fake;
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("steps", () => {
  it("walks from idle through microphone, connecting and live to ended", async () => {
    const h = mount();
    const steps = [h.talk().status];

    await h.start("olé");
    steps.push(h.talk().status);
    await h.microphone();
    steps.push(h.talk().status);
    h.started();
    steps.push(h.talk().status);
    act(() => h.talk().end());
    steps.push(h.talk().status);
    h.closed();
    steps.push(h.talk().status);

    expect(steps).toEqual(["idle", "microphone", "connecting", "live", "ending", "ended"]);
    expect(examiner().connect).toHaveBeenCalledWith("olé");
    expect(examiner().end).toHaveBeenCalledTimes(1);
    expect(examiner().close).toHaveBeenCalledTimes(1);
    expect(h.handlers.onEnded).toHaveBeenCalledWith([]);
  });

  it("ends at once when the examiner can no longer be asked to close", async () => {
    const h = mount();

    await h.live();
    examiner().end.mockReturnValue(false);
    act(() => h.talk().end());

    expect(h.talk().status).toBe("ended");
    expect(h.handlers.onEnded).toHaveBeenCalledWith([]);
  });

  it("passes the session's creation on", async () => {
    const h = mount();

    await h.start();
    examiner().handlers.onCreated();

    expect(h.handlers.onCreated).toHaveBeenCalledTimes(1);
  });

  it("goes back to idle with the microphone's error", async () => {
    const h = mount();

    await h.start();
    await h.microphone("denied");

    expect(h.talk().status).toBe("idle");
    expect(h.handlers.onFail).toHaveBeenCalledWith("denied");
    expect(examiner().connect).not.toHaveBeenCalled();
    expect(examiner().close).toHaveBeenCalledTimes(1);
  });

  it("goes back to idle with the connection's error", async () => {
    const h = mount();

    await h.start();
    await h.microphone();
    await h.session("passcode");

    expect(h.talk().status).toBe("idle");
    expect(h.handlers.onFail).toHaveBeenCalledWith("passcode");
    expect(examiner().close).toHaveBeenCalledTimes(1);
  });

  it("closes once on cancel and lets a late microphone pass", async () => {
    const h = mount();

    await h.start();
    act(() => h.talk().cancel());
    await h.microphone();

    expect(h.talk().status).toBe("idle");
    expect(examiner().close).toHaveBeenCalledTimes(1);
    expect(examiner().connect).not.toHaveBeenCalled();
  });

  it("ignores the connection's error after a cancel", async () => {
    const h = mount();

    await h.start();
    await h.microphone();
    act(() => h.talk().cancel());
    await h.session("unavailable");

    expect(h.talk().status).toBe("idle");
    expect(h.handlers.onFail).not.toHaveBeenCalled();
    expect(examiner().close).toHaveBeenCalledTimes(1);
  });

  it("closes the connection when the hook unmounts", async () => {
    const h = mount();

    await h.live();
    h.unmount();

    expect(examiner().close).toHaveBeenCalledTimes(1);
  });

  it("resets to idle without a transcript", async () => {
    const h = mount();

    await h.live();
    h.spoken(greeting);
    h.closed();
    act(() => h.talk().reset());

    expect(h.talk().status).toBe("idle");
    expect(h.talk().turns).toEqual([]);
  });
});

describe("transcript", () => {
  it("joins the fragments into turns in spoken order", async () => {
    const h = mount();

    await h.live();
    h.spoken({ role: "examiner", text: "¿Cuántos años tienes?", start: 4000, end: 4800 });
    h.spoken({ role: "student", text: "Me llamo ", start: 2100, end: 2300 });
    h.spoken(greeting);
    h.spoken({ role: "student", text: "Ana.", start: 2300, end: 2400 });
    act(() => h.talk().end());
    h.closed();

    expect(h.talk().turns).toEqual([
      { role: "examiner", text: "¿Cómo te llamas?", at: 0 },
      { role: "student", text: "Me llamo Ana.", at: 2100 },
      { role: "examiner", text: "¿Cuántos años tienes?", at: 4000 },
    ]);

    expect(h.handlers.onEnded).toHaveBeenCalledWith([
      { role: "examiner", text: "¿Cómo te llamas?" },
      { role: "student", text: "Me llamo Ana." },
      { role: "examiner", text: "¿Cuántos años tienes?" },
    ]);
  });

  it("starts the next talk with an empty transcript and clock", async () => {
    vi.useFakeTimers();

    const h = mount();

    await h.live();
    h.spoken(greeting);
    h.elapse(3000);
    h.closed();

    expect(h.talk().turns).toHaveLength(1);
    expect(h.talk().seconds).toBe(3);

    await h.start();

    expect(h.talk().turns).toEqual([]);
    expect(h.talk().seconds).toBe(0);
  });
});

describe("drops", () => {
  it("fails when the connection drops before the examiner starts", async () => {
    const h = mount();

    await h.start();
    await h.microphone();
    h.dropped();

    expect(h.talk().status).toBe("idle");
    expect(h.handlers.onFail).toHaveBeenCalledWith("unavailable");
    expect(examiner().close).toHaveBeenCalledTimes(1);
  });

  it("finishes with what was said when the connection drops mid-talk", async () => {
    const h = mount();

    await h.live();
    h.spoken(greeting);
    h.spoken(answer);
    h.dropped();

    expect(h.talk().status).toBe("ended");
    expect(h.handlers.onFail).not.toHaveBeenCalled();

    expect(h.handlers.onEnded).toHaveBeenCalledWith([
      { role: "examiner", text: "¿Cómo te llamas?" },
      { role: "student", text: "Me llamo Ana." },
    ]);
  });
});

describe("timers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("gives up when the examiner does not start within 15 seconds", async () => {
    const h = mount();

    await h.start();
    await h.microphone();
    h.elapse(14_999);

    expect(h.talk().status).toBe("connecting");

    h.elapse(1);

    expect(h.talk().status).toBe("idle");
    expect(h.handlers.onFail).toHaveBeenCalledWith("unavailable");
    expect(examiner().close).toHaveBeenCalledTimes(1);
  });

  it("stops the connect limit once the examiner starts", async () => {
    const h = mount();

    await h.start();
    await h.microphone();
    h.elapse(14_999);
    h.started();
    h.elapse(1);

    expect(h.talk().status).toBe("live");
    expect(h.handlers.onFail).not.toHaveBeenCalled();
  });

  it("asks the examiner to greet when she is silent 2.5 seconds into the talk", async () => {
    const h = mount();

    await h.live();
    h.spoken(answer);
    h.elapse(2_499);

    expect(examiner().greet).not.toHaveBeenCalled();

    h.elapse(1);

    expect(examiner().greet).toHaveBeenCalledTimes(1);
  });

  it("leaves the examiner alone when she has already spoken", async () => {
    const h = mount();

    await h.live();
    h.spoken(greeting);
    h.elapse(10_000);

    expect(examiner().greet).not.toHaveBeenCalled();
  });

  it("asks the examiner to close when the talk reaches its limit", async () => {
    const h = mount();

    await h.live();
    h.elapse(124_999);

    expect(examiner().end).not.toHaveBeenCalled();

    h.elapse(1);

    expect(examiner().end).toHaveBeenCalledTimes(1);
    expect(h.talk().status).toBe("ending");
  });

  it("ends on its own when the examiner never confirms the close", async () => {
    const h = mount();

    await h.live();
    h.spoken(greeting);
    act(() => h.talk().end());
    h.elapse(14_999);

    expect(h.talk().status).toBe("ending");

    h.elapse(1);

    expect(h.talk().status).toBe("ended");

    expect(h.handlers.onEnded).toHaveBeenCalledWith([
      { role: "examiner", text: "¿Cómo te llamas?" },
    ]);

    expect(examiner().close).toHaveBeenCalledTimes(1);
  });

  it("counts the seconds only while live", async () => {
    const h = mount();

    await h.start();
    await h.microphone();
    h.elapse(5_000);

    expect(h.talk().seconds).toBe(0);

    h.started();
    h.elapse(62_000);

    expect(h.talk().seconds).toBe(62);

    act(() => h.talk().end());
    h.elapse(5_000);

    expect(h.talk().seconds).toBe(62);
  });
});
