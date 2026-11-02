import { useState } from "react";
import { readFlags, saveFlags } from "./flags";

export const useFlags = () => {
  const [flagged, setFlagged] = useState(readFlags);

  const setFlags = (ids: string[], on: boolean) => {
    const next = new Set(flagged);

    for (const id of ids) {
      if (on) {
        next.add(id);
      } else {
        next.delete(id);
      }
    }

    saveFlags(next);
    setFlagged(next);
  };

  return { flagged, setFlags };
};

export type Flags = ReturnType<typeof useFlags>;
