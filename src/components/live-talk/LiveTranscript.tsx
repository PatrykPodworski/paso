import type { LiveTurn } from "./transcript";

type Props = { turns: LiveTurn[] };

export const LiveTranscript = ({ turns }: Props) => (
  <details className="mbs-4 text-sm text-sage-700">
    <summary className="cursor-pointer">Transcript</summary>
    <ol aria-label="Transcript" className="mbs-3 flex flex-col gap-2.5">
      {turns.map((turn) => (
        <li
          key={`${turn.role}-${turn.at}`}
          className={`max-w-5/6 rounded-lg px-3.5 py-2.5 leading-relaxed ${turn.role === "student" ? "self-end bg-sage-100" : "self-start bg-white"}`}
        >
          <span className="block text-xs uppercase tracking-widest text-sage-600">
            {turn.role === "student" ? "You" : "Lucía"}
          </span>
          <p lang={turn.role === "student" ? undefined : "es"} className="text-green-950">
            {turn.text}
          </p>
        </li>
      ))}
    </ol>
  </details>
);
