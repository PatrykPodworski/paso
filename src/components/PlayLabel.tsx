type Props = { label: string; playing: boolean };

export const PlayLabel = ({ label, playing }: Props) => (
  <>
    <span>{playing ? "Playing…" : label}</span>
    <span className={`waveform ${playing ? "playing" : ""}`} aria-hidden="true">
      {[9, 17, 26, 13, 21, 30, 17, 24, 10, 18, 27, 13].map((h, i) => (
        <i key={i} style={{ height: h, animationDelay: `${i * 0.08}s` }} />
      ))}
    </span>
  </>
);
