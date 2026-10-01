import { Icon } from "../../design-system/Icon";
import { IconButton } from "../../design-system/IconButton";
import { PlayLabel } from "./PlayLabel";

type Props = {
  label: string;
  iconOnly: boolean;
  minimal: boolean;
  playing: boolean;
  disabled: boolean;
  onClick: () => void;
};

export const PlayButton = ({ label, iconOnly, minimal, playing, disabled, onClick }: Props) => {
  const pauseLabel = minimal ? "Pause audio" : "Stop audio";
  const Tag = iconOnly ? IconButton : "button";

  return (
    <Tag
      type="button"
      className={
        iconOnly
          ? undefined
          : "audio-play flex items-center gap-[16px] min-h-[54px] p-[13px_20px] bg-[#eae6ef] text-[#9483a5] border border-[#ded7e6] rounded-[9px] max-md:gap-[10px] max-md:p-[13px_15px] max-sm:gap-[8px] max-sm:p-[12px]"
      }
      onClick={onClick}
      aria-label={playing ? pauseLabel : label}
      title={playing ? pauseLabel : label}
      disabled={disabled}
    >
      <Icon name={playing ? "pause" : minimal ? "play" : "volume"} size={iconOnly ? 18 : 22} />
      {!iconOnly && <PlayLabel label={label} playing={playing} />}
    </Tag>
  );
};
