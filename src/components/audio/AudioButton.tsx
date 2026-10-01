import type { Ref } from "react";
import { FieldNote } from "../../design-system/FieldNote";
import { PlayButton } from "./PlayButton";
import { useAudioPlayer } from "./useAudioPlayer";
import type { AudioHandle } from "./useAudioPlayer";

type Props = {
  ref?: Ref<AudioHandle>;
  text: string;
  label?: string;
  compact?: boolean;
  minimal?: boolean;
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

  const iconOnly = compact || minimal;

  return (
    <div
      className={`audio-control flex flex-wrap items-center gap-[10px] [.question-pronunciation_&]:contents [.reading-passage>&]:mb-[14px] ${iconOnly ? "compact" : ""}`}
    >
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
          className="speed-button p-[8px_10px] bg-[#f5f2f7] border border-[#e5dfec] rounded-[7px] text-[13px] text-[#a596b5] max-sm:text-[12px]"
          onClick={() => setSpeed((s) => (s === 1 ? 0.75 : 1))}
          aria-label={`Audio speed ${speed} times. Click to change`}
        >
          {speed}×
        </button>
      )}
      {limit && (
        <small className="text-[13px] text-[#a798b5] [.question-pronunciation_&]:col-[2] [.question-pronunciation_&]:text-center [.question-pronunciation_&]:m-[-12px_0_16px] [.question-pronunciation_&]:whitespace-nowrap">
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
