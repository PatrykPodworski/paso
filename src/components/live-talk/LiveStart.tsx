import { Button } from "../../design-system/Button";
import { ButtonRow } from "../../design-system/ButtonRow";
import { FieldNote } from "../../design-system/FieldNote";
import { Icon } from "../../design-system/Icon";
import { Notice } from "../../design-system/Notice";
import { Input } from "../ui/input";

type Props = {
  needsPasscode: boolean;
  passcode: string;
  onPasscode: (passcode: string) => void;
  onStart: () => void;
  // Why the last talk did not work. The start then reads as a retry, next to Skip.
  failure: string;
  onSkip: () => void;
};

export const LiveStart = ({
  needsPasscode,
  passcode,
  onPasscode,
  onStart,
  failure,
  onSkip,
}: Props) => (
  <>
    {failure && (
      <Notice as="div">
        <div>
          <p className="font-medium">The talk didn’t work.</p>
          <p>{failure} Nothing was scored or saved.</p>
        </div>
      </Notice>
    )}
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
          {failure ? "Try again" : "Start the talk"}
        </Button>
        {failure && (
          <Button type="button" variant="secondary" className="max-sm:flex-1" onClick={onSkip}>
            Skip
          </Button>
        )}
      </ButtonRow>
    </form>
  </>
);
