import { audioSources } from "../data/audio-sources";
import type { Playback } from "./playback";

// Resolves true once a clip started, was cancelled or was blocked by the
// browser, and false when every source failed so the caller can fall back to
// the device voice.
export const playClips = async (
  text: string,
  speed: number,
  playback: Playback,
  events: {
    cancelled: () => boolean;
    onClip: (audio: HTMLAudioElement) => void;
    onEnded: () => void;
    onStarted: () => void;
    onBlocked: () => void;
  },
) => {
  for (const src of audioSources(text)) {
    const audio = new Audio(src);

    events.onClip(audio);
    playback.audio = audio;
    audio.playbackRate = speed;
    audio.preservesPitch = true;

    audio.onended = () => {
      if (!events.cancelled()) {
        events.onEnded();
      }
    };

    audio.onpause = () => {
      if (!events.cancelled()) {
        playback.setPlaying(false);
      }
    };

    try {
      await audio.play();

      if (events.cancelled()) {
        audio.pause();

        return true;
      }

      playback.resume = async () => {
        await audio.play();

        if (events.cancelled()) {
          audio.pause();
        }
      };

      events.onStarted();

      return true;
    } catch (error) {
      if (events.cancelled()) {
        return true;
      }

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        events.onBlocked();

        return true;
      }
      // A missing upgraded clip can still use the original local recording.
    }
  }

  return false;
};
