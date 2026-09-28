import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState } from "react";
import type { Ref } from "react";
import { Icon } from "./Icon";
import { audioSources } from "../data/audio-sources";
import { FieldNote } from "../design-system/FieldNote";
type Playback = {
  text: string;
  audio: HTMLAudioElement | null;
  resume: (() => Promise<void>) | null;
  // Rebound when a later player adopts this playback, so the running clip
  // drives the button that is currently on screen.
  setPlaying: (playing: boolean) => void;
  cancel: () => void;
};
export type AudioHandle = { play: () => void; playing: () => boolean };
let activePlayback: Playback | null = null;
// Shared playback coordination is intentionally exported alongside the player.
// eslint-disable-next-line react/only-export-components
export const stopAudio = () => {
  activePlayback?.cancel();
  activePlayback = null;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
// A word tap has nowhere to show a status line, so this player stays silent on
// failure instead of falling back to the device voice. The full sentence is
// still read once the answer is checked.
// Resolves when the word has finished, so a caller can speak after it rather
// than over it. Stopping, a playback error or a missing recording resolve too,
// so a queued caller is never left waiting.
// ponytail: no speed control, no error state, no fallback voice
// eslint-disable-next-line react/only-export-components
export const playWord = async (text: string) => {
  stopAudio();
  let cancelled = false;
  let clip: HTMLAudioElement | null = null;
  activePlayback = {
    text,
    audio: null,
    resume: null,
    setPlaying: () => {},
    cancel: () => {
      cancelled = true;
      clip?.pause();
    },
  };
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
const UNAVAILABLE = "Audio is unavailable on this device. You can use the transcript in practice.";
// Resolves true once a clip started, was cancelled or was blocked by the
// browser, and false when every source failed so the caller can fall back to
// the device voice.
const playClips = async (
  text: string,
  speed: number,
  playback: Playback,
  events: {
    cancelled: () => boolean;
    onClip: (audio: HTMLAudioElement) => void;
    onEnded: () => void;
    onStarted: () => void;
    onBlocked: () => void;
  },
) => {
  for (const src of audioSources(text)) {
    const audio = new Audio(src);
    events.onClip(audio);
    playback.audio = audio;
    audio.playbackRate = speed;
    audio.preservesPitch = true;
    audio.onended = () => {
      if (!events.cancelled()) {
        events.onEnded();
      }
    };
    audio.onpause = () => {
      if (!events.cancelled()) {
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
const speakFallback = (
  text: string,
  speed: number,
  playback: Playback,
  events: {
    cancelled: () => boolean;
    onStarted: () => void;
    onStatus: (message: string) => void;
    onUnavailable: () => void;
  },
) => {
  if (!("speechSynthesis" in window)) {
    events.onUnavailable();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.85 * speed;
  const voices = window.speechSynthesis.getVoices();
  utterance.voice =
    voices.find((v) => v.lang === "es-ES") || voices.find((v) => v.lang.startsWith("es")) || null;
  utterance.onstart = () => {
    if (!events.cancelled()) {
      events.onStarted();
    }
  };
  utterance.onend = () => {
    if (!events.cancelled()) {
      playback.setPlaying(false);
    }
  };
  utterance.onerror = () => {
    if (events.cancelled()) {
      return;
    }
    playback.setPlaying(false);
    events.onStatus(UNAVAILABLE);
  };
  events.onStatus("Using your device’s voice while the recording is unavailable.");
  window.speechSynthesis.speak(utterance);
};
const useAudioPlayer = ({
  controlsRef,
  text,
  minimal,
  autoPlay,
  continuous,
  limit,
  onPlayed,
}: {
  controlsRef?: Ref<AudioHandle>;
  text: string;
  minimal: boolean;
  autoPlay: boolean;
  continuous: boolean;
  limit?: number;
  onPlayed?: () => void;
}) => {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const ref = useRef<HTMLAudioElement | null>(null);
  const playbackRef = useRef<Playback | null>(null);
  const resumePlayback = useRef<(() => Promise<void>) | null>(null);
  useEffect(() => {
    // Take over a clip that is still running for the same text, so a passage
    // survives the move to the next question about it.
    const running = activePlayback;
    if (!continuous || !running || running.text !== text) {
      return;
    }
    playbackRef.current = running;
    running.setPlaying = setPlaying;
    ref.current = running.audio;
    resumePlayback.current = running.resume;
    setPlaying(!running.audio?.paused);
  }, [continuous, text]);
  useEffect(
    () => () => {
      if (continuous) {
        // The session stops shared playback once the passage changes.
        return;
      }
      if (playbackRef.current && activePlayback === playbackRef.current) {
        stopAudio();
      } else {
        playbackRef.current?.cancel();
      }
    },
    [continuous],
  );
  useEffect(() => {
    if (ref.current) {
      ref.current.playbackRate = speed;
    }
  }, [speed]);
  const pause = () => {
    if (minimal && resumePlayback.current) {
      ref.current?.pause();
    } else {
      stopAudio();
    }
    setPlaying(false);
  };
  const resume = async (resumeClip: () => Promise<void>) => {
    setError("");
    setPlaying(true);
    try {
      await resumeClip();
    } catch {
      setPlaying(false);
      setError("Tap the play button to start the audio.");
    }
  };
  const play = async (restart = false) => {
    if (playing && !restart) {
      pause();
      return;
    }
    if (minimal && !restart && resumePlayback.current) {
      await resume(resumePlayback.current);
      return;
    }
    if (limit && count >= limit) {
      return;
    }
    stopAudio();
    setError("");
    let cancelled = false;
    const isCancelled = () => cancelled;
    const clearResume = () => {
      playback.resume = null;
      resumePlayback.current = null;
    };
    const countPlay = () => {
      setCount((c) => c + 1);
      onPlayed?.();
    };
    const playback: Playback = {
      text,
      audio: null,
      resume: null,
      setPlaying,
      cancel: () => {
        cancelled = true;
        clearResume();
        playback.audio?.pause();
        playback.setPlaying(false);
      },
    };
    activePlayback = playback;
    playbackRef.current = playback;
    setPlaying(true);
    const started = await playClips(text, speed, playback, {
      cancelled: isCancelled,
      onClip: (audio) => {
        ref.current = audio;
      },
      onEnded: () => {
        clearResume();
        playback.setPlaying(false);
      },
      onStarted: () => {
        resumePlayback.current = playback.resume;
        countPlay();
      },
      onBlocked: () => {
        setPlaying(false);
        setError("Tap the play button to start the audio.");
      },
    });
    if (!started) {
      speakFallback(text, speed, playback, {
        cancelled: isCancelled,
        onStarted: countPlay,
        onStatus: setError,
        onUnavailable: () => {
          setPlaying(false);
          setError(UNAVAILABLE);
        },
      });
    }
  };
  useImperativeHandle(controlsRef, () => ({ play: () => void play(true), playing: () => playing }));
  const startAutomatically = useEffectEvent(() => void play(true));
  useEffect(() => {
    if (autoPlay) {
      startAutomatically();
    }
  }, [autoPlay, text]);
  return { playing, speed, setSpeed, count, error, play };
};
const PlayLabel = ({ label, playing }: { label: string; playing: boolean }) => (
  <>
    <span>{playing ? "Playing…" : label}</span>
    <span className={`waveform ${playing ? "playing" : ""}`} aria-hidden="true">
      {[9, 17, 26, 13, 21, 30, 17, 24, 10, 18, 27, 13].map((h, i) => (
        <i key={i} style={{ height: h, animationDelay: `${i * 0.08}s` }} />
      ))}
    </span>
  </>
);
const PlayButton = ({
  label,
  iconOnly,
  minimal,
  playing,
  disabled,
  onClick,
}: {
  label: string;
  iconOnly: boolean;
  minimal: boolean;
  playing: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
  const pauseLabel = minimal ? "Pause audio" : "Stop audio";
  return (
    <button
      type="button"
      className={iconOnly ? "icon-button" : "audio-play"}
      onClick={onClick}
      aria-label={playing ? pauseLabel : label}
      title={playing ? pauseLabel : label}
      disabled={disabled}
    >
      <Icon name={playing ? "pause" : minimal ? "play" : "volume"} size={iconOnly ? 18 : 22} />
      {!iconOnly && <PlayLabel label={label} playing={playing} />}
    </button>
  );
};
export const AudioButton = ({
  ref: controlsRef,
  text,
  label = "Listen",
  compact = false,
  minimal = false,
  autoPlay = false,
  continuous = false,
  limit,
  onPlayed,
}: {
  ref?: Ref<AudioHandle>;
  text: string;
  label?: string;
  compact?: boolean;
  minimal?: boolean;
  autoPlay?: boolean;
  continuous?: boolean;
  limit?: number;
  onPlayed?: () => void;
}) => {
  const { playing, speed, setSpeed, count, error, play } = useAudioPlayer({
    controlsRef,
    text,
    minimal,
    autoPlay,
    continuous,
    limit,
    onPlayed,
  });
  const iconOnly = compact || minimal;
  return (
    <div className={`audio-control ${iconOnly ? "compact" : ""}`}>
      <PlayButton
        label={label}
        iconOnly={iconOnly}
        minimal={minimal}
        playing={playing}
        disabled={!!limit && count >= limit && !playing}
        onClick={() => void play()}
      />
      {!iconOnly && !limit && (
        <button
          type="button"
          className="speed-button"
          onClick={() => setSpeed((s) => (s === 1 ? 0.75 : 1))}
          aria-label={`Audio speed ${speed} times. Click to change`}
        >
          {speed}×
        </button>
      )}
      {limit && (
        <small>
          {count}/{limit} plays
        </small>
      )}
      {error && (
        <FieldNote
          role="status"
          className="[.question-pronunciation_&]:col-span-full [.question-pronunciation_&]:m-[-8px_0_18px]"
        >
          {error}
        </FieldNote>
      )}
    </div>
  );
};
