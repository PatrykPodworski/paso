import { useMemo, useState } from "react";
import { withShownOptions } from "../../data/optionOrder";
import { randomSeed } from "../../data/random";
import type { Question } from "../../data/types";

// The question with its options in the attempt's order. Without the attempt's seed the card keeps
// a seed of its own while it is mounted, so a re-render does not reorder the options.
export const useShownOptions = (q: Question, seed?: number) => {
  const [ownSeed] = useState(randomSeed);
  const attemptSeed = seed ?? ownSeed;

  return useMemo(() => withShownOptions(q, attemptSeed), [q, attemptSeed]);
};
