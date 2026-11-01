import { useCallback, useEffect, useState } from "react";
import { freshMockRun } from "../../data/mock";
import type { MockRun, MockRunPatch } from "../../data/types";

export type ChangeRun = (change: MockRunPatch) => void;

export type MockRunActions = {
  onRunChange: ChangeRun;
  onNewRun: (run: MockRunPatch) => void;
  onLeave: () => void;
};

// The server keeps the run. This page shows each change at once and sends it on, and does not
// take the server's copy back while it is open, so typing is never reset.
export const useMockRun = (
  saved: MockRun | null,
  { onRunChange, onNewRun, onLeave }: MockRunActions,
) => {
  const [run, setRun] = useState(() => saved ?? freshMockRun());

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
      }));

      onRunChange(patch);
    },
    [onRunChange],
  );

  const restart = (patch: MockRunPatch = {}) => {
    setRun({ ...freshMockRun(), ...patch });
    onNewRun(patch);
  };

  return { run, change, restart };
};
