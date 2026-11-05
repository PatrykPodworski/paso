import { Button } from "../../design-system/Button";
import { ButtonRow } from "../../design-system/ButtonRow";
import { FieldNote } from "../../design-system/FieldNote";
import { Icon } from "../../design-system/Icon";
import { Input } from "../ui/input";

type Props = {
  needsPasscode: boolean;
  passcode: string;
  onPasscode: (passcode: string) => void;
  onStart: () => void;
  // After a talk that did not work: the start reads as a retry, next to a way to move on.
  onSkip?: () => void;
};

export const LiveStart = ({ needsPasscode, passcode, onPasscode, onStart, onSkip }: Props) => (
  <form
    className="flex flex-col gap-3.5"
    onSubmit={(e) => {
      e.preventDefault();
      onStart();
    }}
  >
    <FieldNote>
      {needsPasscode
        ? "You have used your free live talk. Enter the passcode to talk again."
        : "Your first live talk is free."}
    </FieldNote>
    {needsPasscode && (
      <label className="flex flex-col gap-1.5 text-sm">
        Passcode
        <Input
          type="password"
          autoComplete="off"
          className="max-w-xs"
          value={passcode}
          onChange={(e) => onPasscode(e.target.value)}
        />
      </label>
    )}
    <ButtonRow>
      <Button
        type="submit"
        variant="primary"
        className="max-sm:flex-1"
        disabled={needsPasscode && !passcode.trim()}
      >
        <Icon name="mic" size={20} />
        {onSkip ? "Try again" : "Start the talk"}
      </Button>
      {onSkip && (
        <Button type="button" variant="secondary" className="max-sm:flex-1" onClick={onSkip}>
          Skip
        </Button>
      )}
    </ButtonRow>
  </form>
);
