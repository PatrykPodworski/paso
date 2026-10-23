import { Button } from "../../design-system/Button";
import { FieldNote } from "../../design-system/FieldNote";
import { Icon } from "../../design-system/Icon";
import { FIELD } from "../../design-system/field";

type Props = {
  needsPasscode: boolean;
  passcode: string;
  onPasscode: (passcode: string) => void;
  onStart: () => void;
};

export const LiveStart = ({ needsPasscode, passcode, onPasscode, onStart }: Props) => (
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
        <input
          type="password"
          autoComplete="off"
          className={`${FIELD} max-w-xs`}
          value={passcode}
          onChange={(e) => onPasscode(e.target.value)}
        />
      </label>
    )}
    <Button
      type="submit"
      variant="primary"
      className="self-start max-sm:self-stretch"
      disabled={needsPasscode && !passcode.trim()}
    >
      <Icon name="mic" size={20} />
      Start the talk
    </Button>
  </form>
);
