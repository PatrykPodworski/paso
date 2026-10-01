type Props = { label: string; playing: boolean };

export const PlayLabel = ({ label, playing }: Props) => (
  <>
    <span className="text-[14px] font-medium max-sm:text-[13px]">
      {playing ? "Playing…" : label}
    </span>
    <span
      className={`waveform flex items-center gap-[3px] h-[28px] ml-[8px] max-md:gap-[2px] max-md:ml-[1px] ${playing ? "playing" : ""}`}
      aria-hidden="true"
    >
      {[9, 17, 26, 13, 21, 30, 17, 24, 10, 18, 27, 13].map((h, i) => (
        <i
          key={i}
          className={`w-[3px] bg-[#b4a6c3] rounded-[4px] max-md:w-[2px] ${i >= 8 ? "max-sm:hidden" : ""} ${playing ? "[animation:wave_0.65s_ease-in-out_infinite_alternate]" : ""}`}
          style={{ height: h, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </span>
  </>
);
