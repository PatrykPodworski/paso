import { useState } from "react";
import { Button } from "../ui/button";
import { audioAssets } from "./audioAssets";
import { flaggedIdList } from "./flags";
import { pictureIds } from "./imageAssets";
import type { Flags } from "./useFlags";

type Props = { flags: Flags };

const assetIds = [...audioAssets.map((a) => a.id), ...pictureIds];

const ids = (n: number) => `${n} ${n === 1 ? "ID" : "IDs"}`;

// Copies the flagged ids of every asset kind, not only the open tab's.
export const CopyIdsButton = ({ flags }: Props) => {
  const [status, setStatus] = useState("");
  const list = flaggedIdList(assetIds, flags.flagged);
  const count = list ? list.split("\n").length : 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(list);
      setStatus(`Copied ${ids(count)}.`);
    } catch {
      setStatus("The browser blocked the clipboard. Nothing was copied.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled={!count} onClick={() => void copy()}>
        Copy {ids(count)}
      </Button>
      <span role="status" className="text-xs text-muted-foreground">
        {status}
      </span>
    </div>
  );
};
