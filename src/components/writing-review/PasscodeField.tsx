import { FIELD } from "../../design-system/field";

type Props = { passcode: string; onPasscode: (passcode: string) => void };

export const PasscodeField = ({ passcode, onPasscode }: Props) => (
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
);
