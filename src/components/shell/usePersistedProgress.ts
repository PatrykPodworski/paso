import { useEffect, useState } from "react";
import { readProgress, STORAGE_KEY } from "../../data/progress";
import type { Progress } from "../../data/types";

export const usePersistedProgress = () => {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [progress]);

  return [progress, setProgress, storageError] as const;
};
