import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioButton } from "./AudioButton";
import { playWord } from "./playWord";
import { clearClips } from "./clipCache";
import { stopAudio } from "./playback";

vi.mock("../../data/audio-sources", () => ({
  audioSources: (text: string) => [`/audio/elevenlabs/${text}.mp3`, `/audio/${text}.m4a`],
}));

class MockAudio {
  src: string;
  playbackRate = 1;
  preservesPitch = false;
  paused = true;
  preload = "";
  currentTime = 0;
  error = null;
  onended: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play = vi.fn(async () => {
    this.paused = false;
  });
  pause = vi.fn(() => {
    this.paused = true;
    this.onpause?.();
  });
  end = () => {
    this.paused = true;
    this.onended?.();
  };
  load = vi.fn();
  removeAttribute = () => {
    this.src = "";
  };
  constructor(src = "") {
    this.src = src;
  }
}
let clips: MockAudio[];
let nextPlay: (() => Promise<void>) | undefined;

beforeEach(() => {
  clips = [];
  nextPlay = undefined;

  vi.stubGlobal(
    "Audio",
    class extends MockAudio {
      constructor(src?: string) {
        super(src);

        if (nextPlay) {
          this.play = vi.fn(nextPlay);
          nextPlay = undefined;
        }

        clips.push(this);
      }
    },
  );
});

afterEach(() => {
  act(stopAudio);
  clearClips();
  vi.unstubAllGlobals();
});

describe("word playback", () => {
  it.each(["onended", "onpause", "onerror"] as const)(
    "resolves a tapped word only once its clip fires %s",
    async (event) => {
      let done = false;

      const spoken = playWord("hola").then(() => {
        done = true;
      });

      await act(async () => {});
      expect(clips[0].play).toHaveBeenCalledOnce();
      expect(done).toBe(false);
      clips[0].paused = true;
      clips[0][event]?.();
      await spoken;
      expect(done).toBe(true);
      expect(clips).toHaveLength(1);
    },
  );

  it("reads the original recording when the upgraded word clip is missing", async () => {
    nextPlay = async () => {
      throw new Error("Missing upgraded clip");
    };

    const spoken = playWord("hola");

    await waitFor(() => expect(clips).toHaveLength(2));

    expect(clips.map((clip) => clip.src)).toEqual([
      "/audio/elevenlabs/hola.mp3",
      "/audio/hola.m4a",
    ]);

    clips[1].end();
    await expect(spoken).resolves.toBeUndefined();
  });

  it("stays silent without a device voice when no word recording plays", async () => {
    vi.stubGlobal(
      "Audio",
      class extends MockAudio {
        play = vi.fn(async () => {
          throw new Error("offline");
        });
        constructor(src?: string) {
          super(src);
          clips.push(this);
        }
      },
    );

    const synth = { cancel: vi.fn(), getVoices: () => [], speak: vi.fn() };

    vi.stubGlobal("speechSynthesis", synth);
    await expect(playWord("hola")).resolves.toBeUndefined();
    expect(clips).toHaveLength(2);
    expect(synth.speak).not.toHaveBeenCalled();
  });

  it("keeps a word silent when it is stopped before its clip starts", async () => {
    let start!: () => void;

    nextPlay = () =>
      new Promise<void>((resolve) => {
        start = () => {
          clips[0].paused = false;
          resolve();
        };
      });

    const spoken = playWord("hola");

    stopAudio();
    start();
    await expect(spoken).resolves.toBeUndefined();
    expect(clips[0].paused).toBe(true);
  });

  it("does not try the next recording for a word stopped while it loads", async () => {
    let fail!: (error: Error) => void;

    nextPlay = () =>
      new Promise<void>((_resolve, reject) => {
        fail = reject;
      });

    const spoken = playWord("hola");

    stopAudio();
    fail(new Error("Playback interrupted"));
    await expect(spoken).resolves.toBeUndefined();
    expect(clips).toHaveLength(1);
  });

  it("replays a word from its loaded clip, from the start and at normal speed", async () => {
    const first = playWord("hola");

    await act(async () => {});
    clips[0].end();
    await first;
    clips[0].currentTime = 0.4;
    clips[0].playbackRate = 0.75;
    const second = playWord("hola");

    await act(async () => {});
    expect(clips).toHaveLength(1);
    expect(clips[0].play).toHaveBeenCalledTimes(2);
    expect(clips[0].currentTime).toBe(0);
    expect(clips[0].playbackRate).toBe(1);
    clips[0].end();
    await expect(second).resolves.toBeUndefined();
  });

  it("keeps waiting for a word when a pause or end from its previous play arrives", async () => {
    let done = false;

    const spoken = playWord("hola").then(() => {
      done = true;
    });

    await act(async () => {});
    clips[0].onpause?.();
    clips[0].onended?.();
    await act(async () => {});
    expect(done).toBe(false);
    clips[0].end();
    await spoken;
    expect(done).toBe(true);
  });

  it("stops the previous word when the next one is tapped", async () => {
    const first = playWord("uno");
    const second = playWord("dos");

    await expect(first).resolves.toBeUndefined();
    expect(clips[0].paused).toBe(true);
    expect(clips[1].pause).not.toHaveBeenCalled();
    clips[1].end();
    await expect(second).resolves.toBeUndefined();
  });

  it("stops a playing player when a word is tapped", async () => {
    render(<AudioButton text="Hola." />);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(clips[0]?.play).toHaveBeenCalledOnce());
    act(() => void playWord("hola"));
    expect(clips[0].paused).toBe(true);
    expect(clips[1].play).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Listen" })).toBeInTheDocument();
  });
});
