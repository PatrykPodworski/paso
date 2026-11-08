import { useRef, useState } from "react";
import type { MockResponses } from "../../../data/types";
import { Button } from "../../../design-system/Button";
import { Notice } from "../../../design-system/Notice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ResponseGroups } from "./ResponseGroups";

type Props = {
  resultId: string;
  // When the rehearsal was and what it took, under the title.
  description: string;
  load: (resultId: string) => Promise<MockResponses | null>;
  className?: string;
};

type State =
  | { kind: "closed" }
  | { kind: "loading" }
  | { kind: "failed" }
  | { kind: "loaded"; responses: MockResponses | null };

type BodyProps = { state: State; onRetry: () => void };

const Body = ({ state, onRetry }: BodyProps) => {
  if (state.kind === "failed") {
    return (
      <Notice icon="info" className="my-0 items-center">
        <p className="flex-1">Your responses did not load.</p>
        <Button variant="secondary" size="small" onClick={onRetry}>
          Retry
        </Button>
      </Notice>
    );
  }

  if (state.kind !== "loaded") {
    return <p className="text-sm text-muted-foreground">Loading responses…</p>;
  }

  return state.responses ? (
    <ResponseGroups responses={state.responses} />
  ) : (
    <p className="text-sm text-muted-foreground">Responses not recorded</p>
  );
};

// Opens one rehearsal's responses, read from the server each time the dialog opens.
export const RehearsalResponses = ({ resultId, description, load, className }: Props) => {
  const [state, setState] = useState<State>({ kind: "closed" });
  // A read that answers after the dialog closed or a newer read started is dropped.
  const latest = useRef(0);

  const fetchResponses = () => {
    const request = ++latest.current;
    const settle = (next: State) => request === latest.current && setState(next);

    setState({ kind: "loading" });

    void load(resultId).then(
      (responses) => settle({ kind: "loaded", responses }),
      () => settle({ kind: "failed" }),
    );
  };

  const close = () => {
    latest.current++;
    setState({ kind: "closed" });
  };

  return (
    <Dialog
      open={state.kind !== "closed"}
      onOpenChange={(open) => (open ? fetchResponses() : close())}
    >
      <DialogTrigger render={<Button variant="secondary" size="small" className={className} />}>
        View responses
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Your responses</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Body state={state} onRetry={fetchResponses} />
      </DialogContent>
    </Dialog>
  );
};
