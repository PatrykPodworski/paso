type Props = {
  percent: number;
  /** Placement only — margin, flex. Never colour or size. */
  className?: string;
};

export const ProgressTrack = ({ percent, className = "" }: Props) => (
  <span className={`block h-[4px] overflow-hidden rounded-[10px] bg-[#edf0e7] ${className}`}>
    <span
      className="block h-full rounded-[10px] bg-[#8eab82] transition-width motion-reduce:transition-none"
      style={{ width: `${percent}%` }}
    />
  </span>
);
