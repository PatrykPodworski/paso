import { clipFor } from "../audio/clipCache";
import { setActivePlayback, stopAudio } from "../audio/playback";

// Plays the file itself rather than looking it up by text, so a clip saved without its
// text can be heard too.
export const playClip = (src: string) => {
  stopAudio();
  const audio = clipFor(src);

  setActivePlayback({
    text: src,
    audio,
    resume: null,
    setPlaying: () => {},
    cancel: () => audio.pause(),
  });

  audio.currentTime = 0;
  audio.playbackRate = 1;
  void audio.play().catch(() => {});
};
