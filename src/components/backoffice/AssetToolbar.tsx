import { useId } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { CopyIdsButton } from "./CopyIdsButton";
import type { Flags } from "./useFlags";

export const ALL_UNITS = "All units";

type Props = {
  units: string[];
  unit: string;
  onUnit: (unit: string) => void;
  query: string;
  onQuery: (query: string) => void;
  /** An example query for this kind of asset. */
  placeholder: string;
  /** Every id of the tab's asset kind, then the ids the filters leave visible. */
  kindIds: string[];
  visibleIds: string[];
  flags: Flags;
};

const FIELD = "flex flex-col gap-1.5";
const LABEL = "text-sm font-medium";

export const AssetToolbar = ({
  units,
  unit,
  onUnit,
  query,
  onQuery,
  placeholder,
  kindIds,
  visibleIds,
  flags,
}: Props) => {
  const visibleFlagged = visibleIds.filter((id) => flags.flagged.has(id)).length;
  const allVisible = visibleIds.length > 0 && visibleFlagged === visibleIds.length;
  const flagged = kindIds.filter((id) => flags.flagged.has(id)).length;
  const id = useId();
  const selectAll = `Select all visible (${visibleIds.length})`;

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className={FIELD}>
          <label htmlFor={`${id}-unit`} className={LABEL}>
            Unit
          </label>
          <NativeSelect id={`${id}-unit`} value={unit} onChange={(e) => onUnit(e.target.value)}>
            {[ALL_UNITS, ...units].map((u) => (
              <NativeSelectOption key={u} value={u}>
                {u}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className={`${FIELD} flex-1 basis-60`}>
          <label htmlFor={`${id}-search`} className={LABEL}>
            Search
          </label>
          <Input
            id={`${id}-search`}
            type="search"
            value={query}
            placeholder={placeholder}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>
        <CopyIdsButton flags={flags} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <label className="flex items-center gap-2 min-h-11 text-sm font-medium cursor-pointer">
          <Checkbox
            aria-label={selectAll}
            checked={allVisible}
            indeterminate={visibleFlagged > 0 && !allVisible}
            disabled={!visibleIds.length}
            onCheckedChange={() => flags.setFlags(visibleIds, !allVisible)}
          />
          {selectAll}
        </label>
        <p className="text-sm text-muted-foreground">
          {visibleIds.length} of {kindIds.length} shown · {flagged} flagged
        </p>
      </div>
    </div>
  );
};
