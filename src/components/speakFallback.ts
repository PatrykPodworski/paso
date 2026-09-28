import type { Playback } from "./playback";
export const UNAVAILABLE =
  "Audio is unavailable on this device. You can use the transcript in practice.";
export const speakFallback = (
  text: string,
  speed: number,
  playback: Playback,
  events: {
    cancelled: () => boolean;
    onStarted: () => void;
    onStatus: (message: string) => void;
    onUnavailable: () => void;
  },
) => {
  if (!("speechSynthesis" in window)) {
    events.onUnavailable();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.85 * speed;
  const voices = window.speechSynthesis.getVoices();
  utterance.voice =
    voices.find((v) => v.lang === "es-ES") || voices.find((v) => v.lang.startsWith("es")) || null;
  utterance.onstart = () => {
    if (!events.cancelled()) {
      events.onStarted();
    }
  };
  utterance.onend = () => {
    if (!events.cancelled()) {
      playback.setPlaying(false);
    }
  };
  utterance.onerror = () => {
    if (events.cancelled()) {
      return;
    }
    playback.setPlaying(false);
    events.onStatus(UNAVAILABLE);
  };
  events.onStatus("Using your device’s voice while the recording is unavailable.");
  window.speechSynthesis.speak(utterance);
};
