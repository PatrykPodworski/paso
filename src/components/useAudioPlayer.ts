import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState } from "react";
import type { Ref } from "react";
import { activePlayback, setActivePlayback, stopAudio } from "./playback";
import type { Playback } from "./playback";
import { playClips } from "./playClips";
import { speakFallback, UNAVAILABLE } from "./speakFallback";

export type AudioHandle = { play: () => void; playing: () => boolean };

export const useAudioPlayer = ({
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

    setActivePlayback(playback);
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
