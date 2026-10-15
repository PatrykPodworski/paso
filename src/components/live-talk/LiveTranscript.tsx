import type { LiveTurn } from "./transcript";

type Props = { turns: LiveTurn[] };

export const LiveTranscript = ({ turns }: Props) => (
  <ol aria-label="Transcript" className="mbs-[18px] flex flex-col gap-[10px]">
    {turns.map((turn) => (
      <li
        key={`${turn.role}-${turn.at}`}
        className={`max-w-[85%] rounded-[9px] px-[14px] py-[10px] text-[14px] leading-[1.6] ${turn.role === "student" ? "self-end bg-sage-100" : "self-start bg-white"}`}
      >
        <span className="block text-[11px] uppercase tracking-[1.2px] text-sage-600">
          {turn.role === "student" ? "You" : "Examiner"}
        </span>
        <p className="text-green-950">{turn.text}</p>
      </li>
    ))}
  </ol>
);
