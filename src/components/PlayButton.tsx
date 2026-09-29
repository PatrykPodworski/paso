import { Icon } from "../design-system/Icon";
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
      className={iconOnly ? "icon-button" : "audio-play"}
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
