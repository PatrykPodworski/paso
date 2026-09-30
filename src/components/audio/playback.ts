export type Playback = {
  text: string;
  audio: HTMLAudioElement | null;
  resume: (() => Promise<void>) | null;
  // Rebound when a later player adopts this playback, so the running clip
  // drives the button that is currently on screen.
  setPlaying: (playing: boolean) => void;
  cancel: () => void;
};

export let activePlayback: Playback | null = null;

export const setActivePlayback = (playback: Playback) => {
  activePlayback = playback;
};

export const stopAudio = () => {
  activePlayback?.cancel();
  activePlayback = null;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
