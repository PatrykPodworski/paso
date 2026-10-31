import { audioSources } from "../../data/audio-sources";
import { clipFor } from "./clipCache";
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
    onEnded: () => void;
    onStarted: () => void;
    onBlocked: () => void;
  },
) => {
  for (const src of audioSources(text)) {
    const audio = clipFor(src);

    playback.audio = audio;
    audio.playbackRate = speed;
    audio.preservesPitch = true;

    // Media events arrive later, so a shared clip can still deliver a pause
    // or end from its previous play after it started again. A clip that is
    // playing ignores them.
    audio.onended = () => {
      if (audio.paused && !events.cancelled()) {
        events.onEnded();
      }
    };

    audio.onpause = () => {
      if (audio.paused && !events.cancelled()) {
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
