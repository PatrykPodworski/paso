import { useEffect, useRef, useState } from "react";
import type { TalkTurn } from "../../data/types";
import { createExaminerConnection } from "./examinerConnection";
import { turnsOf, type Fragment, type LiveTurn } from "./transcript";

export type TalkStatus = "idle" | "microphone" | "connecting" | "live" | "ending" | "ended";

// Lucía must start within CONNECT_MS of the microphone turning on, and is asked to greet
// if she is still silent GREET_MS into the talk. The server closes a session at the
// task's limit; the client asks GRACE_MS later in case it did not.
const CONNECT_MS = 15_000;
const GREET_MS = 2_500;
const GRACE_MS = 5_000;
const CLOSE_MS = 15_000;

type Handlers = {
  onCreated: () => void;
  onEnded: (turns: TalkTurn[]) => void;
  onFail: (code: string) => void;
};

type Connection = {
  examiner: ReturnType<typeof createExaminerConnection>;
  handlers: Handlers;
  live: boolean;
  // Known once the server has created the session.
  limitMs?: number;
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
      const spoken = turnsOf(fragments.current);

      setStatus("ended");
      setTurns(spoken);
      current.handlers.onEnded(spoken.map(({ role, text }) => ({ role, text })));
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

  const created = (limitSeconds: number) => {
    if (connection.current) {
      connection.current.limitMs = limitSeconds * 1000 + GRACE_MS;
      connection.current.handlers.onCreated();
    }
  };

  const started = () => {
    if (connection.current) {
      connection.current.live = true;
      setStatus("live");
    }
  };

  const spoken = (fragment: Fragment) => {
    fragments.current.push(fragment);
  };

  const drop = () => (connection.current?.live ? finish() : fail("unavailable"));

  useEffect(() => () => void release(), []);

  useEffect(() => {
    const limits = {
      connecting: [CONNECT_MS, () => fail("unavailable")],
      live: [connection.current?.limitMs, end],
      ending: [CLOSE_MS, finish],
    } as const;

    const limit = limits[status as keyof typeof limits];

    if (!limit?.[0]) {
      return;
    }

    const timer = window.setTimeout(limit[1], limit[0]);

    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "live") {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!fragments.current.some((f) => f.role === "examiner")) {
        connection.current?.examiner.greet();
      }
    }, GREET_MS);

    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "live") {
      return;
    }

    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => clearInterval(timer);
  }, [status]);

  const start = async (task: string, passcode: string | undefined, handlers: Handlers) => {
    fragments.current = [];
    setTurns([]);
    setSeconds(0);
    setStatus("microphone");

    const examiner = createExaminerConnection({
      onCreated: created,
      onStarted: started,
      onFragment: spoken,
      onClosed: finish,
      onDrop: drop,
    });

    const current: Connection = { examiner, handlers, live: false };

    connection.current = current;
    const micError = await examiner.acquireMicrophone();

    if (connection.current !== current) {
      return;
    }

    if (micError) {
      fail(micError);

      return;
    }

    setStatus("connecting");
    const code = await examiner.connect(task, passcode);

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
