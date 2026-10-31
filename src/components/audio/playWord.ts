import { audioSources } from "../../data/audio-sources";
import { clipFor } from "./clipCache";
import { setActivePlayback, stopAudio } from "./playback";

// A word tap has nowhere to show a status line, so this player stays silent on
// failure instead of falling back to the device voice. The full sentence is
// still read once the answer is checked.
// Resolves when the word has finished, so a caller can speak after it rather
// than over it. Stopping, a playback error or a missing recording resolve too,
// so a queued caller is never left waiting.
// ponytail: no speed control, no error state, no fallback voice
export const playWord = async (text: string) => {
  stopAudio();
  let cancelled = false;
  let clip: HTMLAudioElement | null = null;

  setActivePlayback({
    text,
    audio: null,
    resume: null,
    setPlaying: () => {},
    cancel: () => {
      cancelled = true;
      clip?.pause();
    },
  });

  for (const src of audioSources(text)) {
    const audio = clipFor(src);

    clip = audio;
    // A player may have left the shared clip at a slower speed.
    audio.playbackRate = 1;

    // A pause or end left over from the clip's previous play arrives while it
    // is playing again, and must not cut the word short.
    const spoken = new Promise<void>((resolve) => {
      audio.onended = () => audio.paused && resolve();
      audio.onpause = () => audio.paused && resolve();
      audio.onerror = () => resolve();
    });

    try {
      await audio.play();

      if (cancelled) {
        audio.pause();

        return;
      }

      await spoken;

      return;
    } catch {
      if (cancelled) {
        return;
      }
      // A missing upgraded clip can still use the original local recording.
    }
  }
};
