import { useState } from "react";
import { courseUnitNumber } from "../../data/path";
import { Panel } from "../../design-system/Panel";
import { ALL_UNITS, AssetToolbar } from "./AssetToolbar";
import { imageAssets, pictureIds } from "./imageAssets";
import { ImageRow } from "./ImageRow";
import { matches } from "./matches";
import type { Flags } from "./useFlags";

type Props = { flags: Flags };

const unitName = (courseUnit: number) => `Unit ${courseUnitNumber(courseUnit)}`;

const unitNames = [...new Set(imageAssets.map((a) => unitName(a.unit)))];

export const ImagesTab = ({ flags }: Props) => {
  const [unit, setUnit] = useState(ALL_UNITS);
  const [query, setQuery] = useState("");

  const visible = imageAssets.filter(
    (a) => (unit === ALL_UNITS || unitName(a.unit) === unit) && matches(query, a.word, a.english),
  );

  return (
    <>
      <AssetToolbar
        units={unitNames}
        unit={unit}
        onUnit={setUnit}
        query={query}
        onQuery={setQuery}
        placeholder="hola"
        kindIds={pictureIds}
        visibleIds={visible.flatMap((a) => (a.id ? [a.id] : []))}
        flags={flags}
      />
      <Panel className="overflow-clip">
        {visible.length ? (
          <ul className="divide-y divide-border">
            {visible.map((a) => (
              <ImageRow key={a.word} asset={a} flags={flags} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-3 text-sm text-muted-foreground">No word matches these filters.</p>
        )}
      </Panel>
    </>
  );
};
