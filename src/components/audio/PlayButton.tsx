import { Icon } from "../../design-system/Icon";
import { IconButton } from "../../design-system/IconButton";
import { PlayLabel } from "./PlayLabel";
import { PRESSABLE } from "../../design-system/pressable";

// Round icon-only buttons, one per context that restyles the player.
const ROUND = {
  phrase: "h-[30px] w-[30px] border border-sand-200 bg-sand-50 text-sand-500",
  word: "h-[44px] w-[44px] border-0 bg-sage-100 text-green-900",
  pronunciation:
    "col-start-2 row-start-1 mt-[15px] h-[44px] w-[44px] self-start border border-lavender-200 bg-lavender-50 text-lavender-700 hover:bg-lavender-200",
  passage: "h-[38px] w-[38px] border border-sand-200 bg-sand-50 text-sage-600 hover:bg-sand-100",
};

export type Round = keyof typeof ROUND;

type Props = {
  label: string;
  iconOnly: boolean;
  minimal: boolean;
  round?: Round;
  playing: boolean;
  disabled: boolean;
  onClick: () => void;
};

// Icon-only buttons without a round style keep IconButton's own classes.
const buttonClass = (round: Round | undefined, iconOnly: boolean) => {
  if (round) {
    return `${PRESSABLE} inline-flex items-center justify-center rounded-[50%] p-0 ${ROUND[round]}`;
  }

  if (iconOnly) {
    return undefined;
  }

  return `${PRESSABLE} audio-play flex items-center gap-[16px] min-h-[54px] p-[13px_20px] bg-lavender-100 text-lavender-600 border border-lavender-200 rounded-[9px] max-md:gap-[10px] max-md:p-[13px_15px] max-sm:gap-[8px] max-sm:p-[12px]`;
};

export const PlayButton = ({
  label,
  iconOnly,
  minimal,
  round,
  playing,
  disabled,
  onClick,
}: Props) => {
  const pauseLabel = minimal ? "Pause audio" : "Stop audio";
  const name = playing ? pauseLabel : label;
  const Tag = iconOnly && !round ? IconButton : "button";

  return (
    <Tag
      type="button"
      className={buttonClass(round, iconOnly)}
      onClick={onClick}
      aria-label={name}
      title={name}
      disabled={disabled}
    >
      <Icon name={playing ? "pause" : minimal ? "play" : "volume"} size={iconOnly ? 18 : 22} />
      {!iconOnly && <PlayLabel label={label} playing={playing} />}
    </Tag>
  );
};
