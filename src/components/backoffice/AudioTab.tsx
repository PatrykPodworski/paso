import { useState } from "react";
import { Panel } from "../../design-system/Panel";
import { audioAssets, audioSourceNames } from "./audioAssets";
import { AudioRow } from "./AudioRow";
import { ALL_UNITS, AssetToolbar } from "./AssetToolbar";
import { matches } from "./matches";
import type { Flags } from "./useFlags";

type Props = { flags: Flags };

const audioIds = audioAssets.map((a) => a.id);

export const AudioTab = ({ flags }: Props) => {
  // Every clip at once takes most of a second to render, so the tab opens on one unit.
  const [unit, setUnit] = useState(audioSourceNames[0]);
  const [query, setQuery] = useState("");

  const visible = audioAssets.filter(
    (a) => (unit === ALL_UNITS || a.source === unit) && matches(query, a.text, a.id),
  );

  return (
    <>
      <AssetToolbar
        units={audioSourceNames}
        unit={unit}
        onUnit={setUnit}
        query={query}
        onQuery={setQuery}
        placeholder="la cocina"
        kindIds={audioIds}
        visibleIds={visible.map((a) => a.id)}
        flags={flags}
      />
      <Panel className="overflow-clip">
        {visible.length ? (
          <ul className="divide-y divide-border">
            {visible.map((a) => (
              <AudioRow key={a.id} asset={a} flags={flags} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-3 text-sm text-muted-foreground">No clip matches these filters.</p>
        )}
      </Panel>
    </>
  );
};
