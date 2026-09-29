import { audioSources } from "../data/audio-sources";
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
    clip = new Audio(src);

    const spoken = new Promise<void>((resolve) => {
      clip!.onended = () => resolve();
      clip!.onpause = () => resolve();
      clip!.onerror = () => resolve();
    });

    try {
      await clip.play();

      if (cancelled) {
        clip.pause();

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
