import { Button } from "../../design-system/Button";
import { Icon } from "../../design-system/Icon";
import type { TalkStatus } from "./useLiveTalk";

const LABELS: Record<TalkStatus, string> = {
  idle: "",
  microphone: "Waiting for the microphone…",
  connecting: "Connecting to Lucía…",
  live: "Live",
  ending: "Finishing the talk…",
  ended: "",
};

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

type Props = {
  status: TalkStatus;
  seconds: number;
  scoring: boolean;
  onEnd: () => void;
  onCancel: () => void;
};

export const LiveStatus = ({ status, seconds, scoring, onEnd, onCancel }: Props) => {
  const live = status === "live" || status === "ending";

  return (
    <>
      <div className="flex items-center gap-2.5 text-sm text-foreground">
        {live && <span className="size-2 rounded-full bg-destructive" aria-hidden />}
        <p role="status">
          {LABELS[status]}
          {scoring && "Scoring your answers…"}
        </p>
        {status === "live" && <span className="tabular-nums">{clock(seconds)}</span>}
      </div>
      {live && (
        <Button variant="secondary" className="mbs-3" onClick={onEnd}>
          <Icon name="pause" size={20} />
          End the talk
        </Button>
      )}
      {(status === "microphone" || status === "connecting") && (
        <Button variant="secondary" className="mbs-3" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </>
  );
};
