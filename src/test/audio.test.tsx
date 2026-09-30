import { createRef } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioButton } from "../components/audio/AudioButton";
import { playWord } from "../components/audio/playWord";
import { stopAudio } from "../components/audio/playback";
import type { AudioHandle } from "../components/audio/useAudioPlayer";

vi.mock("../data/audio-sources", () => ({
  audioSources: () => ["/audio/elevenlabs/test.mp3", "/audio/original.m4a"],
}));

class MockAudio {
  src: string;
  playbackRate = 1;
  preservesPitch = false;
  paused = true;
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
  constructor(src: string) {
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
      constructor(src: string) {
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
  vi.unstubAllGlobals();
});

describe("course audio playback", () => {
  it("autoplays a minimal player, pauses and resumes the same clip, and replays after ending", async () => {
    const played = vi.fn();

    const { container, rerender, unmount } = render(
      <AudioButton text="Hola." label="Play Hola" minimal autoPlay onPlayed={played} />,
    );

    await waitFor(() => expect(played).toHaveBeenCalledOnce());
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(container.querySelector(".waveform")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Pause audio" }));
    expect(clips[0].pause).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Play Hola" }));
    await waitFor(() => expect(clips[0].play).toHaveBeenCalledTimes(2));
    expect(clips).toHaveLength(1);
    expect(played).toHaveBeenCalledOnce();
    rerender(<AudioButton text="Hola." label="Play Hola" minimal autoPlay onPlayed={played} />);
    expect(clips[0].play).toHaveBeenCalledTimes(2);
    act(() => clips[0].onended?.());
    fireEvent.click(screen.getByRole("button", { name: "Play Hola" }));
    await waitFor(() => expect(played).toHaveBeenCalledTimes(2));
    expect(clips).toHaveLength(2);
    unmount();
    expect(clips[1].pause).toHaveBeenCalled();
  });

  it("autoplays once, counts the successful play, and does not restart on rerender", async () => {
    const played = vi.fn();
    const { rerender } = render(<AudioButton text="Hola." autoPlay limit={2} onPlayed={played} />);

    await waitFor(() => expect(played).toHaveBeenCalledOnce());
    expect(screen.getByText("1/2 plays")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Stop audio" }));
    rerender(<AudioButton text="Hola." autoPlay limit={2} onPlayed={played} />);
    expect(clips).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(played).toHaveBeenCalledTimes(2));
    act(() => clips[1].onended?.());
    expect(screen.getByRole("button", { name: "Listen" })).toBeDisabled();
  });

  it("leaves a manual retry when autoplay is blocked without consuming a play", async () => {
    nextPlay = async () => {
      throw new DOMException("Autoplay blocked", "NotAllowedError");
    };

    const played = vi.fn();

    render(<AudioButton text="Hola." autoPlay limit={2} onPlayed={played} />);
    await screen.findByText("Tap the play button to start the audio.");
    expect(played).not.toHaveBeenCalled();
    expect(clips).toHaveLength(1);
    expect(screen.getByText("0/2 plays")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(played).toHaveBeenCalledOnce());
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("plays ElevenLabs first and changes speed without changing pitch", async () => {
    const played = vi.fn();

    render(<AudioButton text="Hola." onPlayed={played} />);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(played).toHaveBeenCalledOnce());
    expect(clips[0].src).toBe("/audio/elevenlabs/test.mp3");
    expect(clips[0].preservesPitch).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: /Audio speed/ }));
    expect(clips[0].playbackRate).toBe(0.75);
  });

  it("falls back to bundled audio and counts only one successful exam play", async () => {
    nextPlay = async () => {
      throw new Error("Missing upgraded clip");
    };

    const played = vi.fn();

    render(<AudioButton text="Hola." limit={1} onPlayed={played} />);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(played).toHaveBeenCalledOnce());

    expect(clips.map((clip) => clip.src)).toEqual([
      "/audio/elevenlabs/test.mp3",
      "/audio/original.m4a",
    ]);

    expect(screen.getByText("1/1 plays")).toBeInTheDocument();
    act(() => clips[1].onended?.());
    expect(screen.getByRole("button", { name: "Listen" })).toBeDisabled();
  });

  it("does not restart a stopped request through the fallback voice", async () => {
    let reject!: (error: Error) => void;

    nextPlay = () =>
      new Promise<void>((_resolve, fail) => {
        reject = fail;
      });

    const played = vi.fn();

    render(<AudioButton text="Hola." onPlayed={played} />);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop audio" }));
    await act(async () => reject(new Error("Playback interrupted")));
    expect(clips).toHaveLength(1);
    expect(played).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Listen" })).toBeInTheDocument();
  });

  it("stops the previous player when another phrase starts", async () => {
    render(
      <>
        <AudioButton text="Hola." label="First" />
        <AudioButton text="Adiós." label="Second" />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "First" }));
    await waitFor(() => expect(clips).toHaveLength(1));
    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    await waitFor(() => expect(clips).toHaveLength(2));
    expect(clips[0].pause).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "First" })).toBeInTheDocument();
  });
});

describe("audio cancellation and device fallback", () => {
  it("stops a pending play on unmount without charging a listening attempt", async () => {
    let resolve!: () => void;

    nextPlay = () =>
      new Promise<void>((r) => {
        resolve = r;
      });

    const played = vi.fn();
    const { unmount } = render(<AudioButton text="Hola." onPlayed={played} />);

    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    unmount();
    await act(async () => resolve());
    expect(clips[0].pause).toHaveBeenCalled();
    expect(played).not.toHaveBeenCalled();
  });

  it("returns to normal speed and responds to a natural pause", async () => {
    render(<AudioButton text="Hola." />);
    fireEvent.click(screen.getByRole("button", { name: /Audio speed/ }));
    fireEvent.click(screen.getByRole("button", { name: /Audio speed/ }));
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(clips[0].play).toHaveBeenCalledOnce());
    expect(clips[0].playbackRate).toBe(1);
    act(() => clips[0].onpause?.());
    expect(screen.getByRole("button", { name: "Listen" })).toBeEnabled();
  });

  it("carries a continuous clip over to the next player mounted for the same text", async () => {
    const { rerender } = render(
      <AudioButton key="q1" text="Hola." label="Passage" minimal continuous />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Passage" }));
    await waitFor(() => expect(clips[0].play).toHaveBeenCalledOnce());
    rerender(<AudioButton key="q2" text="Hola." label="Passage" minimal continuous />);
    expect(clips[0].pause).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Pause audio" }));
    expect(clips[0].pause).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Passage" }));
    await waitFor(() => expect(clips[0].play).toHaveBeenCalledTimes(2));
    expect(clips).toHaveLength(1);
    act(stopAudio);
    expect(clips[0].pause).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "Passage" })).toBeInTheDocument();
  });

  it("starts a fresh clip when the continuous player moves to different text", async () => {
    const { rerender } = render(
      <AudioButton key="q1" text="Hola." label="Passage" minimal continuous />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Passage" }));
    await waitFor(() => expect(clips[0].play).toHaveBeenCalledOnce());
    rerender(<AudioButton key="q2" text="Adiós." label="Other passage" minimal continuous />);
    fireEvent.click(screen.getByRole("button", { name: "Other passage" }));
    await waitFor(() => expect(clips).toHaveLength(2));
    expect(clips[0].pause).toHaveBeenCalledOnce();
  });

  it("unmounting an old player does not stop the new active player", async () => {
    const { rerender } = render(
      <>
        <AudioButton key="first" text="Hola." label="First" />
        <AudioButton key="second" text="Adiós." label="Second" />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "First" }));
    await act(async () => {});
    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    await act(async () => {});
    rerender(<AudioButton key="second" text="Adiós." label="Second" />);
    expect(clips[1].pause).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Stop audio" })).toBeInTheDocument();
  });

  it("ignores the late end of a stopped clip while the replay is playing", async () => {
    render(<AudioButton text="Hola." />);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(clips[0]?.play).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Stop audio" }));
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(clips[1]?.play).toHaveBeenCalledOnce());
    act(() => clips[0].onended?.());
    expect(screen.getByRole("button", { name: "Stop audio" })).toBeInTheDocument();
  });

  const fallback = (voices: { lang: string; name: string }[] = []) => {
    vi.stubGlobal(
      "Audio",
      class extends MockAudio {
        play = vi.fn(async () => {
          throw new Error("offline");
        });
      },
    );

    class Utterance {
      text: string;
      lang = "";
      rate = 0;
      voice: unknown = null;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
    const synth = { cancel: vi.fn(), getVoices: () => voices, speak: vi.fn<(u: any) => void>() };

    vi.stubGlobal("speechSynthesis", synth);

    return synth;
  };

  it.each(
    [
      [
        { lang: "en-US", name: "English" },
        { lang: "es-MX", name: "Mexico" },
        { lang: "es-ES", name: "Spain" },
      ],
      [
        { lang: "en-US", name: "English" },
        { lang: "es-MX", name: "Mexico" },
      ],
      [],
    ].map((voices) => [voices]),
  )("selects Spanish voices with an honest fallback notice: %j", async (voices) => {
    const synth = fallback(voices);
    const played = vi.fn();

    render(<AudioButton text="Hola." onPlayed={played} limit={1} />);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(synth.speak).toHaveBeenCalledOnce());
    const u = synth.speak.mock.calls[0][0];

    expect(u.text).toBe("Hola.");
    expect(u.lang).toBe("es-ES");
    expect(u.rate).toBe(0.85);
    expect(u.voice).toEqual(voices.at(-1) || null);
    expect(screen.getByRole("status")).toHaveTextContent("device’s voice");
    expect(played).not.toHaveBeenCalled();
    act(() => u.onstart());
    expect(played).toHaveBeenCalledOnce();
    expect(screen.getByText("1/1 plays")).toBeInTheDocument();
    act(() => u.onend());
    expect(screen.getByRole("button", { name: "Listen" })).toBeDisabled();
  });

  it("applies slow speed to synthesized speech and handles a device error", async () => {
    const synth = fallback();

    render(<AudioButton text="Hola." />);
    fireEvent.click(screen.getByRole("button", { name: /Audio speed/ }));
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(synth.speak).toHaveBeenCalled());
    const u = synth.speak.mock.calls[0][0];

    expect(u.rate).toBe(0.6375);
    act(() => u.onerror());
    expect(screen.getByRole("status")).toHaveTextContent("Audio is unavailable");
    expect(screen.getByRole("button", { name: "Listen" })).toBeEnabled();
  });

  it("ignores every speech callback after cancellation", async () => {
    const synth = fallback();
    const played = vi.fn();

    render(<AudioButton text="Hola." onPlayed={played} />);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await waitFor(() => expect(synth.speak).toHaveBeenCalled());
    const u = synth.speak.mock.calls[0][0];

    act(stopAudio);

    act(() => {
      u.onstart();
      u.onerror();
      u.onend();
    });

    expect(played).not.toHaveBeenCalled();
    expect(screen.queryByText(/Audio is unavailable on this device/)).not.toBeInTheDocument();
    expect(synth.cancel).toHaveBeenCalled();
  });

  it("reports unavailable audio without consuming a play if no device voice exists", async () => {
    vi.stubGlobal(
      "Audio",
      class extends MockAudio {
        play = vi.fn(async () => {
          throw new Error("offline");
        });
      },
    );

    const played = vi.fn();

    render(<AudioButton text="Hola." onPlayed={played} limit={2} />);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await screen.findByText(/Audio is unavailable on this device/);
    expect(played).not.toHaveBeenCalled();
    expect(screen.getByText("0/2 plays")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Listen" })).toBeEnabled();
  });
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
      "/audio/elevenlabs/test.mp3",
      "/audio/original.m4a",
    ]);

    clips[1].onended?.();
    await expect(spoken).resolves.toBeUndefined();
  });

  it("stays silent without a device voice when no word recording plays", async () => {
    vi.stubGlobal(
      "Audio",
      class extends MockAudio {
        play = vi.fn(async () => {
          throw new Error("offline");
        });
        constructor(src: string) {
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

  it("stops the previous word when the next one is tapped", async () => {
    const first = playWord("uno");
    const second = playWord("dos");

    await expect(first).resolves.toBeUndefined();
    expect(clips[0].paused).toBe(true);
    expect(clips[1].pause).not.toHaveBeenCalled();
    clips[1].onended?.();
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

describe("player controls", () => {
  it("shows the full player's playing state and speed until the clip ends", async () => {
    const { container } = render(<AudioButton text="Hola." />);
    const play = screen.getByRole("button", { name: "Listen" });

    expect(play).toHaveAttribute("title", "Listen");
    expect(play).toHaveTextContent("Listen");
    expect(container.querySelector(".waveform")).not.toHaveClass("playing");
    fireEvent.click(play);
    await waitFor(() => expect(clips[0]?.play).toHaveBeenCalledOnce());
    expect(play).toHaveAccessibleName("Stop audio");
    expect(play).toHaveAttribute("title", "Stop audio");
    expect(play).toHaveTextContent("Playing…");
    expect(container.querySelector(".waveform")).toHaveClass("playing");
    const speed = screen.getByRole("button", { name: "Audio speed 1 times. Click to change" });

    expect(speed).toHaveTextContent("1×");
    fireEvent.click(speed);
    expect(speed).toHaveAccessibleName("Audio speed 0.75 times. Click to change");
    expect(speed).toHaveTextContent("0.75×");
    act(() => clips[0].onended?.());
    expect(play).toHaveAccessibleName("Listen");
    expect(play).toHaveTextContent("Listen");
  });

  it.each([
    [{ compact: true }, "Stop audio"],
    [{ minimal: true }, "Pause audio"],
  ])("shows an icon-only player for %j that offers %s while playing", async (props, pause) => {
    render(<AudioButton text="Hola." label="Play Hola" {...props} />);
    const play = screen.getByRole("button", { name: "Play Hola" });

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(play.textContent).toBe("");
    expect(play).toHaveAttribute("title", "Play Hola");
    fireEvent.click(play);
    await waitFor(() => expect(clips[0]?.play).toHaveBeenCalledOnce());
    expect(play).toHaveAccessibleName(pause);
    expect(play).toHaveAttribute("title", pause);
  });

  it("shows the exam play count instead of a speed control", () => {
    render(<AudioButton text="Hola." limit={2} />);
    expect(screen.getByText("0/2 plays")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Audio speed/ })).not.toBeInTheDocument();
  });
});

describe("resuming and replay limits", () => {
  it("asks for a tap when resuming a paused clip is blocked, then resumes on the tap", async () => {
    render(<AudioButton text="Hola." label="Play Hola" minimal />);
    fireEvent.click(screen.getByRole("button", { name: "Play Hola" }));
    await waitFor(() => expect(clips[0]?.play).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Pause audio" }));
    clips[0].play.mockRejectedValueOnce(new DOMException("Blocked", "NotAllowedError"));
    fireEvent.click(screen.getByRole("button", { name: "Play Hola" }));
    await screen.findByText("Tap the play button to start the audio.");
    fireEvent.click(screen.getByRole("button", { name: "Play Hola" }));
    await waitFor(() => expect(clips[0].play).toHaveBeenCalledTimes(3));
    expect(clips).toHaveLength(1);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pause audio" })).toBeInTheDocument();
  });

  it("keeps a clip paused when it is stopped while resuming", async () => {
    render(<AudioButton text="Hola." label="Play Hola" minimal />);
    fireEvent.click(screen.getByRole("button", { name: "Play Hola" }));
    await waitFor(() => expect(clips[0]?.play).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Pause audio" }));
    let start!: () => void;

    clips[0].play.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          start = () => {
            clips[0].paused = false;
            resolve();
          };
        }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Play Hola" }));
    act(stopAudio);
    await act(async () => start());
    expect(clips[0].paused).toBe(true);
    expect(screen.getByRole("button", { name: "Play Hola" })).toBeInTheDocument();
  });

  it("refuses a replay request once the plays are used up", async () => {
    const ref = createRef<AudioHandle>();
    const played = vi.fn();

    render(<AudioButton ref={ref} text="Hola." limit={1} onPlayed={played} />);
    act(() => ref.current!.play());
    await waitFor(() => expect(played).toHaveBeenCalledOnce());
    expect(ref.current!.playing()).toBe(true);
    act(() => clips[0].onended?.());
    expect(ref.current!.playing()).toBe(false);
    await act(async () => ref.current!.play());
    expect(clips).toHaveLength(1);
    expect(played).toHaveBeenCalledOnce();
    expect(screen.getByText("1/1 plays")).toBeInTheDocument();
  });
});
