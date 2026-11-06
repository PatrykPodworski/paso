import type { TalkTurn } from "../../data/types";
import type { Fragment } from "./transcript";

type Handlers = {
  // The server created the session, which uses up a free talk, and will close it
  // after limitSeconds.
  onCreated: (limitSeconds: number) => void;
  // The examiner is on the line: the talk is live.
  onStarted: () => void;
  // A piece of what the examiner or the learner said.
  onFragment: (fragment: Fragment) => void;
  // The examiner closed the talk.
  onClosed: () => void;
  // The connection dropped or failed.
  onDrop: () => void;
};

type ServerEvent = { type: string; delta?: string; start_ms?: number; end_ms?: number };

const SPEAKERS: Record<string, TalkTurn["role"]> = {
  "session.input_transcript.delta": "student",
  "session.output_transcript.delta": "examiner",
};

// Sends the offer with the candidates gathered so far if gathering stalls.
const gathered = (peer: RTCPeerConnection) =>
  new Promise<void>((resolve) => {
    if (peer.iceGatheringState === "complete") {
      resolve();

      return;
    }

    const done = () => {
      peer.removeEventListener("icegatheringstatechange", check);
      clearTimeout(timer);
      resolve();
    };

    const check = () => peer.iceGatheringState === "complete" && done();
    const timer = window.setTimeout(done, 5000);

    peer.addEventListener("icegatheringstatechange", check);
  });

const startError = async (response: Response) => {
  const body = (await response.json().catch(() => ({}))) as { error?: string };

  return ["passcode", "passcode_tries", "free_used"].includes(body.error ?? "")
    ? body.error!
    : "unavailable";
};

const microphoneError = (e: unknown) =>
  e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "microphone";

// A WebRTC connection to the examiner through the /api/live-session proxy. The caller
// owns it and must call close().
export const createExaminerConnection = ({
  onCreated,
  onStarted,
  onFragment,
  onClosed,
  onDrop,
}: Handlers) => {
  const peer = new RTCPeerConnection();
  const audio = new Audio();
  const channel = peer.createDataChannel("oai-events");
  let microphone: MediaStream | undefined;
  let greeting = "";
  let closed = false;

  audio.autoplay = true;

  peer.ontrack = (e) => {
    audio.srcObject = e.streams[0];
    void audio.play().catch(() => {});
  };

  peer.onconnectionstatechange = () => {
    if (peer.connectionState === "failed" || peer.connectionState === "disconnected") {
      onDrop();
    }
  };

  const receive = (event: ServerEvent) => {
    const role = SPEAKERS[event.type];

    if (role) {
      const start = event.start_ms ?? 0;

      onFragment({ role, text: event.delta ?? "", start, end: event.end_ms ?? start });
    } else if (event.type === "session.started") {
      onStarted();
    } else if (event.type === "session.closed") {
      onClosed();
    }
  };

  channel.onmessage = (e) => receive(JSON.parse(e.data));
  channel.onclose = onDrop;

  // Resolves to an error code, or null once the microphone is on.
  const acquireMicrophone = async () => {
    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      return microphoneError(e);
    }

    // The learner can cancel while the browser asks for permission; the caller has
    // already moved on, so only the late stream needs stopping.
    if (closed) {
      stream.getTracks().forEach((t) => t.stop());

      return null;
    }

    microphone = stream;
    stream.getAudioTracks().forEach((t) => peer.addTrack(t, stream));

    return null;
  };

  // Resolves to an error code, or null once the session is connecting.
  const connect = async (task: string, passcode: string | undefined, topic?: string) => {
    try {
      await peer.setLocalDescription(await peer.createOffer());
      await gathered(peer);

      // Cancelled while gathering: send nothing, so no session is created or paid for.
      if (closed) {
        return null;
      }

      const response = await fetch("/api/live-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdp: peer.localDescription?.sdp, task, topic, passcode }),
      });

      if (!response.ok) {
        return startError(response);
      }

      const answer = (await response.json()) as {
        sdp: string;
        greeting?: string;
        limitSeconds: number;
      };

      greeting = answer.greeting ?? "";
      onCreated(answer.limitSeconds);
      await peer.setRemoteDescription({ type: "answer", sdp: answer.sdp });

      return null;
    } catch {
      return "unavailable";
    }
  };

  // Asks the examiner to close; false when the channel is already gone.
  const end = () => {
    if (channel.readyState !== "open") {
      return false;
    }

    channel.send(JSON.stringify({ type: "session.close" }));

    return true;
  };

  // Asks Lucía to open the talk with the greeting the server sent.
  const greet = () => {
    if (greeting && channel.readyState === "open") {
      channel.send(
        JSON.stringify({
          type: "session.instructions.append",
          delegation_id: null,
          content: greeting,
        }),
      );
    }
  };

  // Detaches the handlers first: a closed call's late events must not reach the next talk.
  const close = () => {
    closed = true;
    peer.ontrack = peer.onconnectionstatechange = null;
    channel.onmessage = channel.onclose = null;
    microphone?.getTracks().forEach((t) => t.stop());
    peer.close();
    audio.srcObject = null;
  };

  return { acquireMicrophone, connect, end, greet, close };
};
