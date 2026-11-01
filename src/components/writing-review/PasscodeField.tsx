import { Input } from "../ui/input";

type Props = { passcode: string; onPasscode: (passcode: string) => void; autoFocus?: boolean };

export const PasscodeField = ({ passcode, onPasscode, autoFocus }: Props) => (
  <label className="flex flex-col gap-1.5 text-sm">
    Passcode
    <Input
      type="password"
      autoComplete="off"
      className="max-w-xs"
      value={passcode}
      autoFocus={autoFocus}
      onChange={(e) => onPasscode(e.target.value)}
    />
  </label>
);
