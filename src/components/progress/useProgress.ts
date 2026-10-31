import { useEffect, useState } from "react";
import { learnerId } from "./learner";
import { createProgressClient, type ProgressState } from "./progressClient";

export const useProgress = () => {
  const [state, setState] = useState<ProgressState>({ snapshot: null, problem: null });

  const [{ actions, kept }] = useState(() => {
    const learner = learnerId();

    return { actions: createProgressClient(learner.id, setState), kept: learner.kept };
  });

  useEffect(() => {
    void actions.load();
  }, [actions]);

  return { ...state, storageError: !kept, actions };
};
