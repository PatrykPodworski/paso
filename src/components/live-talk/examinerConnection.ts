export type LiveEvent = { type: string; delta?: string; start_ms?: number };

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

const microphoneError = (e: unknown) =>
  e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "microphone";

// A WebRTC connection to the examiner through the /api/live-session proxy. The caller
// owns it and must call close().
export const connectExaminer = (onEvent: (event: LiveEvent) => void, onClose: () => void) => {
  const peer = new RTCPeerConnection();
  const audio = new Audio();
  const channel = peer.createDataChannel("oai-events");
  let microphone: MediaStream | undefined;

  audio.autoplay = true;

  peer.ontrack = (e) => {
    audio.srcObject = e.streams[0];
    void audio.play().catch(() => {});
  };

  channel.onmessage = (e) => onEvent(JSON.parse(e.data));
  channel.onclose = onClose;

  // Resolves to an error code, or null once the session is connecting.
  const start = async (passcode: string | undefined) => {
    try {
      microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      return microphoneError(e);
    }

    microphone.getAudioTracks().forEach((t) => peer.addTrack(t, microphone!));

    try {
      await peer.setLocalDescription(await peer.createOffer());
      await gathered(peer);

      const response = await fetch("/api/live-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdp: peer.localDescription?.sdp, passcode }),
      });

      if (!response.ok) {
        return startError(response);
      }

      const { sdp } = (await response.json()) as { sdp: string };

      await peer.setRemoteDescription({ type: "answer", sdp });

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

  const close = () => {
    microphone?.getTracks().forEach((t) => t.stop());
    peer.close();
    audio.srcObject = null;
  };

  return { start, end, close };
};
