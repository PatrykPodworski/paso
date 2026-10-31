import { useState } from "react";
import { Button } from "../../design-system/Button";
import { Dialog } from "../../design-system/Dialog";
import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import { Input } from "../ui/input";
import type { Problem } from "./progressClient";

type PasscodeProblem = Extract<Problem, "passcode" | "wrongPasscode" | "passcodeTries">;

const MESSAGES: Record<PasscodeProblem, string> = {
  passcode: "",
  wrongPasscode: "That passcode is not right.",
  passcodeTries: "Too many wrong passcodes. Try again tomorrow.",
};

type Props = {
  problem: PasscodeProblem;
  onUnlock: (passcode: string) => void;
};

// Progress can't be loaded or saved without the passcode, so the gate cannot be dismissed.
export const PasscodeGate = ({ problem, onUnlock }: Props) => {
  const [passcode, setPasscode] = useState("");

  return (
    <Dialog label="Enter the passcode" onClose={() => {}} className="w-110 p-7 max-md:p-6">
      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          onUnlock(passcode);
        }}
      >
        <h2 className="font-heading font-semibold tracking-tight leading-tight text-2xl">
          Enter the passcode.
        </h2>
        <FieldNote>
          Your progress is saved online. The passcode lets this browser reach it.
        </FieldNote>
        <label className="flex flex-col gap-1.5 text-sm">
          Passcode
          <Input
            type="password"
            autoComplete="off"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
        </label>
        {MESSAGES[problem] && <Notice as="p">{MESSAGES[problem]}</Notice>}
        <Button
          type="submit"
          variant="primary"
          className="self-start max-sm:self-stretch"
          disabled={!passcode.trim()}
        >
          Continue
        </Button>
      </form>
    </Dialog>
  );
};
