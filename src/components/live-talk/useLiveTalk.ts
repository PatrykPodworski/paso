import { useEffect, useRef, useState } from "react";
import type { TalkTurn } from "../../data/types";
import { connectExaminer, type LiveEvent } from "./examinerConnection";
import { addDelta, type LiveTurn } from "./transcript";

export type TalkStatus = "idle" | "connecting" | "live" | "ending" | "ended";

type Connection = {
  examiner: ReturnType<typeof connectExaminer>;
  timeout?: number;
  onEnded: (turns: TalkTurn[]) => void;
};

export const useLiveTalk = () => {
  const [status, setStatus] = useState<TalkStatus>("idle");
  const [turns, setTurns] = useState<LiveTurn[]>([]);
  const [seconds, setSeconds] = useState(0);
  const connection = useRef<Connection | null>(null);
  const transcript = useRef<LiveTurn[]>([]);

  const release = () => {
    const current = connection.current;

    connection.current = null;
    window.clearTimeout(current?.timeout);
    current?.examiner.close();

    return current;
  };

  const finish = () => {
    const current = release();

    if (current) {
      setStatus("ended");
      current.onEnded(transcript.current.map(({ role, text }) => ({ role, text })));
    }
  };

  const add = (role: TalkTurn["role"], event: LiveEvent) => {
    transcript.current = addDelta(transcript.current, role, event.delta ?? "", event.start_ms);
    setTurns(transcript.current);
  };

  const handle = (event: LiveEvent) => {
    if (event.type === "session.started") {
      setStatus("live");
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

  // Resolves to an error code, or null once the examiner session is connecting.
  const start = async (passcode: string | undefined, onEnded: Connection["onEnded"]) => {
    transcript.current = [];
    setTurns([]);
    setSeconds(0);
    setStatus("connecting");
    const examiner = connectExaminer(handle, finish);

    connection.current = { examiner, onEnded };
    const code = await examiner.start(passcode);

    if (code) {
      release();
      setStatus("idle");
    }

    return code;
  };

  const end = () => {
    const current = connection.current;

    if (!current?.examiner.end()) {
      finish();

      return;
    }

    setStatus("ending");
    current.timeout = window.setTimeout(finish, 15_000);
  };

  const reset = () => {
    setStatus("idle");
    setTurns([]);
  };

  return { status, turns, seconds, start, end, reset };
};
