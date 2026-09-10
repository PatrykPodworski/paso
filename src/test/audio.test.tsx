import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioButton, stopAudio } from "../components/Audio";

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
