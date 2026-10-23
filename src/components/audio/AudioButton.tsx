import type { Ref } from "react";
import { FieldNote } from "../../design-system/FieldNote";
import { PlayButton } from "./PlayButton";
import type { Round } from "./PlayButton";
import { useAudioPlayer } from "./useAudioPlayer";
import type { AudioHandle } from "./useAudioPlayer";
import { PRESSABLE } from "../../design-system/pressable";

type Props = {
  ref?: Ref<AudioHandle>;
  text: string;
  label?: string;
  compact?: boolean;
  minimal?: boolean;
  /** A round play button styled for its context; implies icon only. */
  round?: Round;
  /** Placement and alignment of the control only. */
  className?: string;
  autoPlay?: boolean;
  continuous?: boolean;
  limit?: number;
  onPlayed?: () => void;
};

export const AudioButton = ({
  ref: controlsRef,
  text,
  label = "Listen",
  compact = false,
  minimal = false,
  round,
  className = "",
  autoPlay = false,
  continuous = false,
  limit,
  onPlayed,
}: Props) => {
  const { playing, speed, setSpeed, count, error, play } = useAudioPlayer({
    controlsRef,
    text,
    minimal,
    autoPlay,
    continuous,
    limit,
    onPlayed,
  });

  const iconOnly = compact || minimal || !!round;

  return (
    <div
      className={`audio-control flex flex-wrap items-center gap-2.5 [.question-pronunciation_&]:contents [.reading-passage>&]:mb-3.5 ${iconOnly ? "compact" : ""} ${className}`}
    >
      <PlayButton
        label={label}
        iconOnly={iconOnly}
        minimal={minimal}
        round={round}
        playing={playing}
        disabled={!!limit && count >= limit && !playing}
        onClick={() => void play()}
      />
      {!iconOnly && !limit && (
        <button
          type="button"
          className={`${PRESSABLE} speed-button py-2 px-2.5 bg-lavender-50 border border-lavender-200 rounded-md text-xs text-lavender-500`}
          onClick={() => setSpeed((s) => (s === 1 ? 0.75 : 1))}
          aria-label={`Audio speed ${speed} times. Click to change`}
        >
          {speed}×
        </button>
      )}
      {limit && (
        <small className="text-xs text-lavender-500 [.question-pronunciation_&]:col-start-2 [.question-pronunciation_&]:text-center [.question-pronunciation_&]:-mt-3 [.question-pronunciation_&]:mx-0 [.question-pronunciation_&]:mb-4 [.question-pronunciation_&]:whitespace-nowrap">
          {count}/{limit} plays
        </small>
      )}
      {error && (
        <FieldNote
          role="status"
          className="[.question-pronunciation_&]:col-span-2 [.question-pronunciation_&]:-mt-2 [.question-pronunciation_&]:mx-0 [.question-pronunciation_&]:mb-4"
        >
          {error}
        </FieldNote>
      )}
    </div>
  );
};
