import { Icon } from "../../design-system/Icon";
import { IconButton } from "../../design-system/IconButton";
import { PlayLabel } from "./PlayLabel";
import { PRESSABLE } from "../../design-system/pressable";

// Round icon-only buttons, one per context that restyles the player.
const ROUND = {
  phrase: "h-[30px] w-[30px] border border-[#e7dcc2] bg-[#fcf7e9] text-[#b6986f]",
  word: "h-[44px] w-[44px] border-0 bg-sage-100 text-green-900",
  pronunciation:
    "col-start-2 row-start-1 mt-[15px] h-[44px] w-[44px] self-start border border-[#e5dfec] bg-[#f3eff7] text-[#7c698e] hover:bg-[#eae3f1]",
  passage:
    "h-[38px] w-[38px] border border-[#e2ddc9] bg-[#fffdf3] text-[#8a8f6d] hover:bg-[#f2eedd]",
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

  return `${PRESSABLE} audio-play flex items-center gap-[16px] min-h-[54px] p-[13px_20px] bg-[#eae6ef] text-[#9483a5] border border-[#ded7e6] rounded-[9px] max-md:gap-[10px] max-md:p-[13px_15px] max-sm:gap-[8px] max-sm:p-[12px]`;
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
