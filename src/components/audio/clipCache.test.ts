import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearClips, clipFor, preloadClips } from "./clipCache";
import { setActivePlayback, stopAudio } from "./playback";

vi.mock("../../data/audio-sources", () => ({
  audioSources: (text: string) => [`/audio/elevenlabs/${text}.mp3`, `/audio/${text}.m4a`],
}));

class MockAudio {
  src = "";
  preload = "";
  currentTime = 0;
  paused = true;
  error: { code: number } | null = null;
  load = vi.fn();
  removeAttribute = () => {
    this.src = "";
  };
}
let clips: MockAudio[];

beforeEach(() => {
  clips = [];

  vi.stubGlobal(
    "Audio",
    class extends MockAudio {
      constructor() {
        super();
        clips.push(this);
      }
    },
  );
});

afterEach(() => {
  stopAudio();
  clearClips();
});

describe("clip cache", () => {
  it("preloads only the first recording of each text", () => {
    preloadClips(["hola", "adiós"]);

    expect(clips.map((clip) => [clip.src, clip.preload])).toEqual([
      ["/audio/elevenlabs/hola.mp3", "auto"],
      ["/audio/elevenlabs/adiós.mp3", "auto"],
    ]);
  });

  it("plays a preloaded clip from the start without fetching it again", () => {
    preloadClips(["hola"]);
    clips[0].currentTime = 1.5;

    expect(clipFor("/audio/elevenlabs/hola.mp3")).toBe(clips[0]);
    expect(clips).toHaveLength(1);
    expect(clips[0].currentTime).toBe(0);
  });

  it("preloading a clip that is playing keeps its position", () => {
    const passage = clipFor("/audio/elevenlabs/pasaje.mp3");

    passage.currentTime = 12;
    preloadClips(["pasaje"]);

    expect(clips).toHaveLength(1);
    expect(passage.currentTime).toBe(12);
  });

  it("fetches a clip again after it failed to load", () => {
    const failed = clipFor("/audio/elevenlabs/hola.mp3") as unknown as MockAudio;

    failed.error = { code: 2 };

    expect(clipFor("/audio/elevenlabs/hola.mp3")).not.toBe(failed);
    expect(clips).toHaveLength(2);
  });

  it("releases the oldest idle clip past forty, keeping playing and active clips", () => {
    const playing = clipFor("/audio/playing.mp3") as unknown as MockAudio;
    const active = clipFor("/audio/active.mp3");

    playing.paused = false;

    setActivePlayback({
      text: "",
      audio: active,
      resume: null,
      setPlaying: () => {},
      cancel: () => {},
    });

    const oldest = clipFor("/audio/oldest.mp3") as unknown as MockAudio;

    for (let i = 0; i < 37; i++) {
      clipFor(`/audio/${i}.mp3`);
    }

    expect(oldest.load).not.toHaveBeenCalled();
    clipFor("/audio/new.mp3");

    expect(oldest.load).toHaveBeenCalledOnce();
    expect(oldest.src).toBe("");
    expect(playing.src).toBe("/audio/playing.mp3");
    expect(clipFor("/audio/active.mp3")).toBe(active);
    expect(clipFor("/audio/oldest.mp3")).not.toBe(oldest);
  });

  it("keeps a clip that was used again over an older one", () => {
    const first = clipFor("/audio/first.mp3") as unknown as MockAudio;
    const second = clipFor("/audio/second.mp3") as unknown as MockAudio;

    for (let i = 0; i < 38; i++) {
      clipFor(`/audio/${i}.mp3`);
    }

    clipFor("/audio/first.mp3");
    clipFor("/audio/new.mp3");

    expect(first.load).not.toHaveBeenCalled();
    expect(second.load).toHaveBeenCalledOnce();
  });
});
