type Props = { label: string; playing: boolean };

export const PlayLabel = ({ label, playing }: Props) => (
  <>
    <span className="text-sm font-medium max-sm:text-xs">{playing ? "Playing…" : label}</span>
    <span
      className={`waveform flex items-center gap-0.5 h-7 ml-2 max-md:gap-0.5 max-md:ml-px ${playing ? "playing" : ""}`}
      aria-hidden="true"
    >
      {[9, 17, 26, 13, 21, 30, 17, 24, 10, 18, 27, 13].map((h, i) => (
        <i
          key={i}
          className={`w-0.5 bg-lavender-400 rounded-sm max-md:w-0.5 ${i >= 8 ? "max-sm:hidden" : ""} ${playing ? "animate-wave motion-reduce:animate-none" : ""}`}
          style={{ height: h, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </span>
  </>
);
