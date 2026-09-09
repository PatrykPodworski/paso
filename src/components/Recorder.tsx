import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
export const Recorder = ({
  onRecorded,
  onStart,
  onRecordingChange,
  transcribeLocally = false,
}: {
  onRecorded: (blob: Blob) => void;
  onStart?: () => void;
  onRecordingChange?: (recording: boolean) => void;
  transcribeLocally?: boolean;
}) => {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const currentUrl = useRef("");
  const mounted = useRef(true);
  const starting = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current?.state === "recording") {
        recorder.current.stop();
      }
      stream.current?.getTracks().forEach((t) => t.stop());
      if (currentUrl.current) {
        URL.revokeObjectURL(currentUrl.current);
      }
    };
  }, []);
  useEffect(() => {
    if (!recording) {
      return;
    }
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);
  const toggle = async () => {
    if (recording) {
      recorder.current?.stop();
      setRecording(false);
      onRecordingChange?.(false);
      return;
    }
    if (starting.current) {
      return;
    }
    setError("");
    starting.current = true;
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        throw new Error(
          "Recording is not supported in this browser. Practise aloud and use the self-review checklist, or try Chrome on localhost.",
        );
      }
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const next = new MediaRecorder(media);
      recorder.current = next;
      const chunks: Blob[] = [];
      next.ondataavailable = (e) => {
        if (e.data.size) {
          chunks.push(e.data);
        }
      };
      next.onstop = () => {
        media.getTracks().forEach((t) => t.stop());
        if (!mounted.current) {
          return;
        }
        const blob = new Blob(chunks, { type: next.mimeType || "audio/webm" });
        if (currentUrl.current) {
          URL.revokeObjectURL(currentUrl.current);
        }
        currentUrl.current = URL.createObjectURL(blob);
        setUrl(currentUrl.current);
        setRecording(false);
        onRecordingChange?.(false);
        if (blob.size) {
          onRecorded(blob);
        }
      };
      next.onerror = () => {
        media.getTracks().forEach((t) => t.stop());
        setRecording(false);
        onRecordingChange?.(false);
        setError("Recording stopped unexpectedly. Please try again or practise aloud.");
      };
      next.start();
      onStart?.();
      setSeconds(0);
      setRecording(true);
      onRecordingChange?.(true);
    } catch (e) {
      setError(
        e instanceof Error && e.name === "NotAllowedError"
          ? "Microphone access was declined. Enable it in browser settings, or practise aloud and use the checklist."
          : e instanceof Error
            ? e.message
            : "The microphone could not start. You can still practise aloud.",
      );
    } finally {
      starting.current = false;
    }
  };
  return (
    <div className="recorder">
      <div className="record-main">
        <button
          type="button"
          className={`record-button ${recording ? "recording" : ""}`}
          onClick={toggle}
        >
          <Icon name={recording ? "pause" : "mic"} size={24} />
          {recording ? "Stop recording" : url ? "Record again" : "Record your answer"}
        </button>
        <span className="mono">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </span>
      </div>
      <p className="field-note">
        {transcribeLocally
          ? "Recorded in this tab and transcribed on this Mac. Check the transcript before sending it to Codex. Download to keep your recording."
          : "Recorded in this tab. Download to keep it; it is not uploaded or automatically graded."}
      </p>
      {url && (
        <div className="playback">
          <audio controls src={url} />
          <a
            href={url}
            download={`paso-speaking.${recorder.current?.mimeType.includes("mp4") ? "m4a" : "webm"}`}
            className="text-link"
          >
            <Icon name="download" size={16} /> Save recording
          </a>
        </div>
      )}
      {error && (
        <p role="status" className="notice">
          {error}
        </p>
      )}
    </div>
  );
};
