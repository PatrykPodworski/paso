import { Icon } from "../../design-system/Icon";
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

  return (
    <button
      type="button"
      className={
        iconOnly
          ? "icon-button"
          : "audio-play flex items-center gap-[16px] min-h-[54px] p-[13px_20px] bg-[#eae6ef] text-[#9483a5] border border-[#ded7e6] rounded-[9px] max-tablet:gap-[10px] max-tablet:p-[13px_15px] max-phone:gap-[8px] max-phone:p-[12px]"
      }
      onClick={onClick}
      aria-label={playing ? pauseLabel : label}
      title={playing ? pauseLabel : label}
      disabled={disabled}
    >
      <Icon name={playing ? "pause" : minimal ? "play" : "volume"} size={iconOnly ? 18 : 22} />
      {!iconOnly && <PlayLabel label={label} playing={playing} />}
    </button>
  );
};
