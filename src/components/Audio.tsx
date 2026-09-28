import type { Ref } from "react";
import { FieldNote } from "../design-system/FieldNote";
import { PlayButton } from "./PlayButton";
import { useAudioPlayer } from "./useAudioPlayer";
import type { AudioHandle } from "./useAudioPlayer";
// Shared playback coordination is intentionally exported alongside the player.
// eslint-disable-next-line react/only-export-components
export { stopAudio } from "./playback";
// eslint-disable-next-line react/only-export-components
export { playWord } from "./playWord";
export type { AudioHandle };
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
