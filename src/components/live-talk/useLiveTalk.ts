import { useEffect, useRef, useState } from "react";
import type { TalkTurn } from "../../data/types";
import { connectExaminer, type LiveEvent } from "./examinerConnection";
import { turnsOf, type Fragment, type LiveTurn } from "./transcript";

export type TalkStatus = "idle" | "microphone" | "connecting" | "live" | "ending" | "ended";

// The examiner must start within CONNECT_MS of the microphone turning on. The server
// closes a session after two minutes; the client asks a little later in case it did not.
const CONNECT_MS = 15_000;
const TALK_MS = 125_000;
const CLOSE_MS = 15_000;

type Handlers = {
  onCreated: () => void;
  onEnded: (turns: TalkTurn[]) => void;
  onFail: (code: string) => void;
};

type Connection = {
  examiner: ReturnType<typeof connectExaminer>;
  handlers: Handlers;
  live: boolean;
};

export const useLiveTalk = () => {
  const [status, setStatus] = useState<TalkStatus>("idle");
  const [turns, setTurns] = useState<LiveTurn[]>([]);
  const [seconds, setSeconds] = useState(0);
  const connection = useRef<Connection | null>(null);
  const fragments = useRef<Fragment[]>([]);

  const release = () => {
    const current = connection.current;

    connection.current = null;
    current?.examiner.close();

    return current;
  };

  const finish = () => {
    const current = release();

    if (current) {
      setStatus("ended");

      current.handlers.onEnded(
        turnsOf(fragments.current).map(({ role, text }) => ({ role, text })),
      );
    }
  };

  const fail = (code: string) => {
    const current = release();

    if (current) {
      setStatus("idle");
      current.handlers.onFail(code);
    }
  };

  const end = () => {
    if (connection.current?.examiner.end()) {
      setStatus("ending");
    } else {
      finish();
    }
  };

  const add = (role: TalkTurn["role"], event: LiveEvent) => {
    const start = event.start_ms ?? 0;

    fragments.current = [
      ...fragments.current,
      { role, text: event.delta ?? "", start, end: event.end_ms ?? start },
    ];

    setTurns(turnsOf(fragments.current));
  };

  const handle = (event: LiveEvent) => {
    if (event.type === "session.started" && connection.current) {
      connection.current.live = true;
      setStatus("live");
    } else if (event.type === "session.input_transcript.delta") {
      add("student", event);
    } else if (event.type === "session.output_transcript.delta") {
      add("examiner", event);
    } else if (event.type === "session.closed") {
      finish();
    }
  };

  const drop = () => (connection.current?.live ? finish() : fail("unavailable"));

  useEffect(() => () => void release(), []);

  useEffect(() => {
    const limits = {
      connecting: [CONNECT_MS, () => fail("unavailable")],
      live: [TALK_MS, end],
      ending: [CLOSE_MS, finish],
    } as const;

    const limit = limits[status as keyof typeof limits];

    if (!limit) {
      return;
    }

    const timer = window.setTimeout(limit[1], limit[0]);

    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "live") {
      return;
    }

    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => clearInterval(timer);
  }, [status]);

  const start = async (passcode: string | undefined, handlers: Handlers) => {
    fragments.current = [];
    setTurns([]);
    setSeconds(0);
    setStatus("microphone");

    const examiner = connectExaminer({
      onEvent: handle,
      onDrop: drop,
      onCreated: handlers.onCreated,
    });

    const current: Connection = { examiner, handlers, live: false };

    connection.current = current;
    const denied = await examiner.listen();

    if (connection.current !== current) {
      examiner.close();

      return;
    }

    if (denied) {
      fail(denied);

      return;
    }

    setStatus("connecting");
    const code = await examiner.connect(passcode);

    if (code && connection.current === current) {
      fail(code);
    }
  };

  const cancel = () => {
    release();
    setStatus("idle");
  };

  const reset = () => {
    setStatus("idle");
    setTurns([]);
  };

  return { status, turns, seconds, start, end, cancel, reset };
};
