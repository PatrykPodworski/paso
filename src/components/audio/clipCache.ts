import { audioSources } from "../../data/audio-sources";
import { activePlayback } from "./playback";

// Chrome on Android refuses new media elements past about 75, so the cache
// releases its least recently used idle clip beyond this size.
const LIMIT = 40;
const clips = new Map<string, HTMLAudioElement>();

const evict = () => {
  for (const [src, audio] of clips) {
    if (clips.size <= LIMIT) {
      return;
    }

    // A paused clip can still be resumed by the player that owns it.
    if (audio.paused && activePlayback?.audio !== audio) {
      clips.delete(src);
      audio.removeAttribute("src");
      audio.load();
    }
  }
};

// Keeps the playback position, so a clip that is playing is not disturbed.
const cachedClip = (src: string) => {
  const cached = clips.get(src);

  clips.delete(src);

  // A clip that failed to load is fetched again, so a dropped connection is
  // not remembered for the rest of the session.
  if (cached && !cached.error) {
    clips.set(src, cached);

    return cached;
  }

  const audio = new Audio();

  audio.preload = "auto";
  audio.src = src;
  clips.set(src, audio);
  evict();

  return audio;
};

// The cached element for a new play, rewound to the start.
export const clipFor = (src: string) => {
  const audio = cachedClip(src);

  audio.currentTime = 0;

  return audio;
};

// Only the first source of each text loads ahead: the later ones are fallbacks
// that play only when it fails.
export const preloadClips = (texts: string[]) => {
  for (const text of texts) {
    cachedClip(audioSources(text)[0]);
  }
};

// Lets a unit test start from an empty cache.
export const clearClips = () => clips.clear();
