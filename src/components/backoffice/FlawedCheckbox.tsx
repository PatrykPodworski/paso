import { Checkbox } from "../ui/checkbox";
import type { Flags } from "./useFlags";

type Props = { id: string; name: string; flags: Flags };

// The label grows the hit area to a 44 px touch target around the small box.
export const FlawedCheckbox = ({ id, name, flags }: Props) => (
  <label className="flex items-center gap-2 min-h-11 shrink-0 text-sm font-medium cursor-pointer">
    <Checkbox
      aria-label={`Flawed: ${name}`}
      checked={flags.flagged.has(id)}
      onCheckedChange={(on) => flags.setFlags([id], on)}
    />
    Flawed
  </label>
);
