import { useEffect, useRef, useState } from "react";
import type { TalkTurn } from "../../data/types";
import { connectExaminer, type LiveEvent } from "./examinerConnection";
import { turnsOf, type Fragment, type LiveTurn } from "./transcript";

export type TalkStatus = "idle" | "connecting" | "live" | "ending" | "ended";

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
  timers: number[];
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
    current?.timers.forEach((t) => window.clearTimeout(t));
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
    const current = connection.current;

    if (!current?.examiner.end()) {
      finish();

      return;
    }

    setStatus("ending");
    current.timers.push(window.setTimeout(finish, CLOSE_MS));
  };

  const drop = () => (connection.current?.live ? finish() : fail("unavailable"));

  const begin = () => {
    const current = connection.current!;

    current.timers.forEach((t) => window.clearTimeout(t));
    current.live = true;
    current.timers = [window.setTimeout(end, TALK_MS)];
    setStatus("live");
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
    if (event.type === "session.started") {
      begin();
    } else if (event.type === "session.input_transcript.delta") {
      add("student", event);
    } else if (event.type === "session.output_transcript.delta") {
      add("examiner", event);
    } else if (event.type === "session.closed") {
      finish();
    }
  };

  useEffect(() => () => void release(), []);

  useEffect(() => {
    if (status !== "live") {
      return;
    }

    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => clearInterval(timer);
  }, [status]);

  const connectWithin = (current: Connection, passcode: string | undefined) => {
    current.timers.push(window.setTimeout(() => fail("unavailable"), CONNECT_MS));

    return current.examiner.connect(passcode);
  };

  const start = async (passcode: string | undefined, handlers: Handlers) => {
    fragments.current = [];
    setTurns([]);
    setSeconds(0);
    setStatus("connecting");

    const examiner = connectExaminer({
      onEvent: handle,
      onDrop: drop,
      onCreated: handlers.onCreated,
    });

    const current: Connection = { examiner, handlers, live: false, timers: [] };

    connection.current = current;
    const code = (await examiner.listen()) ?? (await connectWithin(current, passcode));

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
