import { useEffect, useRef, useState } from "react";
import type { TalkTurn } from "../../data/types";
import { addDelta } from "./transcript";

export type TalkStatus = "idle" | "connecting" | "live" | "ending" | "ended";

type Connection = {
  peer: RTCPeerConnection;
  channel: RTCDataChannel;
  audio: HTMLAudioElement;
  microphone?: MediaStream;
  timeout?: number;
  onEnded: (turns: TalkTurn[]) => void;
};

type LiveEvent = { type: string; delta?: string };

// Sends the offer with the candidates gathered so far if gathering stalls.
const gathered = (peer: RTCPeerConnection) =>
  new Promise<void>((resolve) => {
    if (peer.iceGatheringState === "complete") {
      resolve();

      return;
    }

    const check = () => peer.iceGatheringState === "complete" && resolve();

    peer.addEventListener("icegatheringstatechange", check);
    window.setTimeout(resolve, 5000);
  });

const startError = async (response: Response) => {
  const body = (await response.json().catch(() => ({}))) as { error?: string };

  return ["passcode", "passcode_tries", "free_used", "daily_cap"].includes(body.error ?? "")
    ? body.error!
    : "unavailable";
};

// A WebRTC connection to the examiner, through the /api/live-session proxy.
export const useLiveTalk = () => {
  const [status, setStatus] = useState<TalkStatus>("idle");
  const [turns, setTurns] = useState<TalkTurn[]>([]);
  const [seconds, setSeconds] = useState(0);
  const connection = useRef<Connection | null>(null);
  const transcript = useRef<TalkTurn[]>([]);

  const release = () => {
    const current = connection.current;

    connection.current = null;

    if (!current) {
      return null;
    }

    window.clearTimeout(current.timeout);
    current.microphone?.getTracks().forEach((t) => t.stop());
    current.peer.close();
    current.audio.srcObject = null;

    return current;
  };

  const finish = () => {
    const current = release();

    if (current) {
      setStatus("ended");
      current.onEnded(transcript.current);
    }
  };

  const add = (role: TalkTurn["role"], delta: string) => {
    transcript.current = addDelta(transcript.current, role, delta);
    setTurns(transcript.current);
  };

  const handle = (event: LiveEvent) => {
    if (event.type === "session.started") {
      setStatus("live");
    } else if (event.type === "session.input_transcript.delta") {
      add("student", event.delta ?? "");
    } else if (event.type === "session.output_transcript.delta") {
      add("examiner", event.delta ?? "");
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
    const peer = new RTCPeerConnection();
    const audio = new Audio();
    const channel = peer.createDataChannel("oai-events");
    const current: Connection = { peer, channel, audio, onEnded };

    connection.current = current;
    audio.autoplay = true;

    peer.ontrack = (e) => {
      audio.srcObject = e.streams[0];
      void audio.play().catch(() => {});
    };

    channel.onmessage = (e) => handle(JSON.parse(e.data));
    channel.onclose = finish;

    const fail = (code: string) => {
      release();
      setStatus("idle");

      return code;
    };

    try {
      current.microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      return fail(
        e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "microphone",
      );
    }

    current.microphone.getAudioTracks().forEach((t) => peer.addTrack(t, current.microphone!));

    try {
      await peer.setLocalDescription(await peer.createOffer());
      await gathered(peer);

      const response = await fetch("/api/live-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdp: peer.localDescription?.sdp, passcode }),
      });

      if (!response.ok) {
        return fail(await startError(response));
      }

      const { sdp } = (await response.json()) as { sdp: string };

      await peer.setRemoteDescription({ type: "answer", sdp });

      return null;
    } catch {
      return fail("unavailable");
    }
  };

  const end = () => {
    const current = connection.current;

    if (!current || current.channel.readyState !== "open") {
      finish();

      return;
    }

    setStatus("ending");
    current.channel.send(JSON.stringify({ type: "session.close" }));
    current.timeout = window.setTimeout(finish, 15_000);
  };

  const reset = () => {
    setStatus("idle");
    setTurns([]);
  };

  return { status, turns, seconds, start, end, reset };
};
