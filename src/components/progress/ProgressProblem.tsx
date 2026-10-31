import { PasscodeGate } from "./PasscodeGate";
import type { Problem } from "./progressClient";
import { SaveFailed } from "./SaveFailed";

type Props = {
  problem: Problem | null;
  onRetry: () => void;
  onUnlock: (passcode: string) => void;
};

// The dialog for a request that needs the learner: a passcode, or a Retry for a failed write.
export const ProgressProblem = ({ problem, onRetry, onUnlock }: Props) => {
  if (problem === "save") {
    return <SaveFailed onRetry={onRetry} />;
  }

  if (problem === "passcode" || problem === "wrongPasscode" || problem === "passcodeTries") {
    return <PasscodeGate problem={problem} onUnlock={onUnlock} />;
  }

  return null;
};
