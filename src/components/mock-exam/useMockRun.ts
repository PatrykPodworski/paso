import { useCallback, useEffect, useRef, useState } from "react";
import { freshMockRun } from "../../data/mock";
import type { MockRun, MockRunPatch } from "../../data/types";

export type ChangeRun = (change: MockRunPatch) => void;

// The run id goes with each write, so the server applies it only to that run. A run started
// before run ids existed has none.
export type MockRunActions = {
  onRunChange: (runId: string | undefined, change: MockRunPatch) => void;
  // `replaces` is the id of the run the new one replaces.
  onNewRun: (replaces: string | undefined, run: MockRunPatch) => void;
  onLeave: () => void;
};

// The server keeps the run. This page shows each change at once and sends it on, and does not
// take the server's copy back while it is open, so typing is never reset.
export const useMockRun = (
  saved: MockRun | null,
  { onRunChange, onNewRun, onLeave }: MockRunActions,
) => {
  const [run, setRun] = useState(() => saved ?? freshMockRun());
  // A change made right after a restart already belongs to the new run.
  const runId = useRef(run.id);

  // Drafts still waiting to be sent go at once when the learner leaves the exam page.
  useEffect(() => onLeave, [onLeave]);

  const change = useCallback<ChangeRun>(
    (patch) => {
      setRun((r) => ({
        ...r,
        ...patch,
        answers: { ...r.answers, ...patch.answers },
        drafts: { ...r.drafts, ...patch.drafts },
        scores: { ...r.scores, ...patch.scores },
        talks: { ...r.talks, ...patch.talks },
        marks: { ...r.marks, ...patch.marks },
        plays: { ...r.plays, ...patch.plays },
      }));

      onRunChange(runId.current, patch);
    },
    [onRunChange],
  );

  const restart = (patch: MockRunPatch = {}) => {
    const replaces = runId.current;
    const start = { ...patch, id: crypto.randomUUID() };

    runId.current = start.id;
    setRun({ ...freshMockRun(), ...start });
    onNewRun(replaces, start);
  };

  return { run, change, restart };
};
