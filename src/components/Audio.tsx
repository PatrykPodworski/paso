import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState } from "react";
import type { Ref } from "react";
import { Icon } from "./Icon";
import { audioSources } from "../data/audio-sources";
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
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const ref = useRef<HTMLAudioElement | null>(null);
  const playbackRef = useRef<Playback | null>(null);
  const resumePlayback = useRef<(() => Promise<void>) | null>(null);
  const iconOnly = compact || minimal;
  const pauseLabel = minimal ? "Pause audio" : "Stop audio";
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
  const play = async (restart = false) => {
    if (playing && !restart) {
      if (minimal && resumePlayback.current) {
        ref.current?.pause();
      } else {
        stopAudio();
      }
      setPlaying(false);
      return;
    }
    if (minimal && !restart && resumePlayback.current) {
      setError("");
      setPlaying(true);
      try {
        await resumePlayback.current();
      } catch {
        setPlaying(false);
        setError("Tap the play button to start the audio.");
      }
      return;
    }
    if (limit && count >= limit) {
      return;
    }
    stopAudio();
    setError("");
    let cancelled = false;
    const playback: Playback = {
      text,
      audio: null,
      resume: null,
      setPlaying,
      cancel: () => {
        cancelled = true;
        playback.resume = null;
        resumePlayback.current = null;
        playback.audio?.pause();
        playback.setPlaying(false);
      },
    };
    activePlayback = playback;
    playbackRef.current = playback;
    setPlaying(true);
    for (const src of audioSources(text)) {
      const audio = new Audio(src);
      ref.current = audio;
      playback.audio = audio;
      audio.playbackRate = speed;
      audio.preservesPitch = true;
      audio.onended = () => {
        if (!cancelled) {
          playback.resume = null;
          resumePlayback.current = null;
          playback.setPlaying(false);
        }
      };
      audio.onpause = () => {
        if (!cancelled) {
          playback.setPlaying(false);
        }
      };
      try {
        await audio.play();
        if (cancelled) {
          audio.pause();
          return;
        }
        playback.resume = async () => {
          await audio.play();
          if (cancelled) {
            audio.pause();
          }
        };
        resumePlayback.current = playback.resume;
        setCount((c) => c + 1);
        onPlayed?.();
        return;
      } catch (error) {
        if (cancelled) {
          return;
        }
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          setPlaying(false);
          setError("Tap the play button to start the audio.");
          return;
        }
        // A missing upgraded clip can still use the original local recording.
      }
    }
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 0.85 * speed;
      const voices = window.speechSynthesis.getVoices();
      utterance.voice =
        voices.find((v) => v.lang === "es-ES") ||
        voices.find((v) => v.lang.startsWith("es")) ||
        null;
      utterance.onstart = () => {
        if (cancelled) {
          return;
        }
        setCount((c) => c + 1);
        onPlayed?.();
      };
      utterance.onend = () => {
        if (!cancelled) {
          playback.setPlaying(false);
        }
      };
      utterance.onerror = () => {
        if (cancelled) {
          return;
        }
        playback.setPlaying(false);
        setError("Audio is unavailable on this device. You can use the transcript in practice.");
      };
      setError("Using your device’s voice while the recording is unavailable.");
      window.speechSynthesis.speak(utterance);
    } else {
      setPlaying(false);
      setError("Audio is unavailable on this device. You can use the transcript in practice.");
    }
  };
  useImperativeHandle(controlsRef, () => ({ play: () => void play(true), playing: () => playing }));
  const startAutomatically = useEffectEvent(() => void play(true));
  useEffect(() => {
    if (autoPlay) {
      startAutomatically();
    }
  }, [autoPlay, text]);
  return (
    <div className={`audio-control ${iconOnly ? "compact" : ""}`}>
      <button
        type="button"
        className={iconOnly ? "icon-button" : "audio-play"}
        onClick={() => void play()}
        aria-label={playing ? pauseLabel : label}
        title={playing ? pauseLabel : label}
        disabled={!!limit && count >= limit && !playing}
      >
        <Icon name={playing ? "pause" : minimal ? "play" : "volume"} size={iconOnly ? 18 : 22} />
        {!iconOnly && (
          <>
            <span>{playing ? "Playing…" : label}</span>
            <span className={`waveform ${playing ? "playing" : ""}`} aria-hidden="true">
              {[9, 17, 26, 13, 21, 30, 17, 24, 10, 18, 27, 13].map((h, i) => (
                <i key={i} style={{ height: h, animationDelay: `${i * 0.08}s` }} />
              ))}
            </span>
          </>
        )}
      </button>
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
        <p role="status" className="field-note">
          {error}
        </p>
      )}
    </div>
  );
};
