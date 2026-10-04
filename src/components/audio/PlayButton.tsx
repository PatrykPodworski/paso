import { Icon } from "../../design-system/Icon";
import { IconButton } from "../../design-system/IconButton";
import { PlayLabel } from "./PlayLabel";
import { PRESSABLE } from "../../design-system/pressable";

// Round icon-only buttons, one per context that restyles the player.
const ROUND = {
  phrase: "h-7 w-7 border border-sand-200 bg-sand-50 text-sand-500",
  word: "h-11 w-11 border-0 bg-sage-100 text-green-900",
  pronunciation:
    "col-start-2 row-start-1 mt-3.5 h-11 w-11 self-start border border-lavender-200 bg-lavender-50 text-lavender-700 hover:bg-lavender-200",
  passage: "h-9 w-9 border border-sand-200 bg-sand-50 text-sage-600 hover:bg-sand-100",
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
    return `${PRESSABLE} inline-flex items-center justify-center rounded-full p-0 ${ROUND[round]}`;
  }

  if (iconOnly) {
    return undefined;
  }

  return `${PRESSABLE} audio-play flex items-center gap-4 min-h-13 py-3 px-5 bg-lavender-100 text-lavender-600 border border-lavender-200 rounded-lg max-md:gap-2.5 max-md:py-3 max-md:px-3.5 max-sm:gap-2 max-sm:p-3`;
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
