import { Icon } from "./Icon";
import { PlayLabel } from "./PlayLabel";
export const PlayButton = ({
  label,
  iconOnly,
  minimal,
  playing,
  disabled,
  onClick,
}: {
  label: string;
  iconOnly: boolean;
  minimal: boolean;
  playing: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
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
