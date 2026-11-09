import { useMemo, useState } from "react";
import { withShownOptions, withShownTokens } from "../../data/optionOrder";
import { randomSeed } from "../../data/random";
import type { Question } from "../../data/types";

// The question with its options and word tiles in the attempt's order. Without the attempt's seed
// the card keeps a seed of its own while it is mounted, so a re-render does not reorder them.
export const useShownOptions = (q: Question, seed?: number) => {
  const [ownSeed] = useState(randomSeed);
  const attemptSeed = seed ?? ownSeed;

  return useMemo(
    () => withShownTokens(withShownOptions(q, attemptSeed), attemptSeed),
    [q, attemptSeed],
  );
};
