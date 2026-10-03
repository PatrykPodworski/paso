type Props = {
  value: number;
  max?: number;
  /** Makes the track a progressbar; without it the track is decorative. */
  label?: string;
  /** Placement only — margin, flex. Never colour or size. */
  className?: string;
};

export const ProgressTrack = ({ value, max = 100, label, className = "" }: Props) => (
  <span
    className={`block h-[4px] overflow-hidden rounded-[10px] bg-[#edf0e7] ${className}`}
    {...(label && {
      role: "progressbar",
      "aria-label": label,
      "aria-valuemin": 0,
      "aria-valuemax": max,
      "aria-valuenow": value,
    })}
  >
    <span
      className="block h-full rounded-[10px] bg-[#8eab82] transition-width motion-reduce:transition-none"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </span>
);
