import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState } from "react";
import type { Ref } from "react";
import { activePlayback, setActivePlayback, stopAudio } from "./playback";
import type { Playback } from "./playback";
import { playClips } from "./playClips";
import { speakFallback, UNAVAILABLE } from "./speakFallback";

export const TAP_TO_PLAY = "Tap the play button to start the audio.";

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
  // Read the clip and its resume from here at use time: an adopted playback may
  // start, or fall back to another source, after this player took it over.
  const playbackRef = useRef<Playback | null>(null);
  // A continuous clip pauses in place so the next player can pick it up there.
  const resumable = minimal || continuous;

  useEffect(() => {
    // Take over a clip that is still running for the same text, so a recording
    // survives the move to the next question about it.
    const running = activePlayback;

    if (!continuous || !running || running.text !== text) {
      return;
    }

    playbackRef.current = running;
    running.setPlaying = setPlaying;
    setPlaying(!running.audio?.paused);
  }, [continuous, text]);

  useEffect(
    () => () => {
      if (continuous) {
        // The session stops shared playback once the recording changes.
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
    if (playbackRef.current?.audio) {
      playbackRef.current.audio.playbackRate = speed;
    }
  }, [speed]);

  const pause = () => {
    if (resumable && playbackRef.current?.resume) {
      playbackRef.current.audio?.pause();
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
      setError(TAP_TO_PLAY);
    }
  };

  const play = async (restart = false) => {
    if (playing && !restart) {
      pause();

      return;
    }

    if (resumable && !restart && playbackRef.current?.resume) {
      await resume(playbackRef.current.resume);

      return;
    }

    if (limit && count >= limit) {
      return;
    }

    stopAudio();
    setError("");
    let cancelled = false;
    const isCancelled = () => cancelled;

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
        playback.resume = null;
        playback.audio?.pause();
        playback.setPlaying(false);
      },
    };

    setActivePlayback(playback);
    playbackRef.current = playback;
    setPlaying(true);

    const started = await playClips(text, speed, playback, {
      cancelled: isCancelled,
      onEnded: () => {
        playback.resume = null;
        playback.setPlaying(false);
      },
      onStarted: countPlay,
      onBlocked: () => {
        setPlaying(false);
        setError(TAP_TO_PLAY);
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

  const startAutomatically = useEffectEvent(() => {
    // An adopted clip keeps playing, or stays paused, where the last player left it.
    if (!continuous || activePlayback?.text !== text) {
      void play(true);
    }
  });

  useEffect(() => {
    if (autoPlay) {
      startAutomatically();
    }
  }, [autoPlay, text]);

  return { playing, resumable, speed, setSpeed, count, error, play };
};
