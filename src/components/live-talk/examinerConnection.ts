export type LiveEvent = { type: string; delta?: string; start_ms?: number; end_ms?: number };

type Handlers = {
  onEvent: (event: LiveEvent) => void;
  // The connection dropped or failed.
  onDrop: () => void;
  // The server created the session, which uses up a free talk.
  onCreated: () => void;
};

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

  return ["passcode", "passcode_tries", "free_used"].includes(body.error ?? "")
    ? body.error!
    : "unavailable";
};

const microphoneError = (e: unknown) =>
  e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "microphone";

// A WebRTC connection to the examiner through the /api/live-session proxy. The caller
// owns it and must call close().
export const connectExaminer = ({ onEvent, onDrop, onCreated }: Handlers) => {
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

  channel.onmessage = (e) => onEvent(JSON.parse(e.data));
  channel.onclose = onDrop;

  // Resolves to an error code, or null once the microphone is on.
  const listen = async () => {
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
  const connect = async (passcode: string | undefined) => {
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
        body: JSON.stringify({ sdp: peer.localDescription?.sdp, passcode }),
      });

      if (!response.ok) {
        return startError(response);
      }

      const answer = (await response.json()) as { sdp: string; greeting?: string };

      greeting = answer.greeting ?? "";
      onCreated();
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

  const close = () => {
    closed = true;
    microphone?.getTracks().forEach((t) => t.stop());
    peer.close();
    audio.srcObject = null;
  };

  return { listen, connect, end, greet, close };
};
