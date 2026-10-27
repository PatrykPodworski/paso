import { useState } from "react";
import { readAccess, saveAccess } from "../liveAccess";
import { requestReview, type ReviewResult } from "./requestReview";

// Requests reviews for several answers at once with the passcode the live talks share.
// A rejected passcode is forgotten; one that got a review is remembered.
export const useWritingReviews = () => {
  const [passcode, setPasscode] = useState(() => readAccess().passcode);
  const [stored, setStored] = useState(() => readAccess().passcode !== "");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ReviewResult>>({});

  const check = async (answers: Record<string, string>) => {
    setLoading(true);

    try {
      const entries = await Promise.all(
        Object.entries(answers).map(
          async ([id, answer]) => [id, await requestReview(id, answer, passcode)] as const,
        ),
      );

      const outcomes = entries.map(([, result]) => result);

      if (outcomes.some((r) => "error" in r && r.error === "passcode")) {
        saveAccess({ ...readAccess(), passcode: "" });
        setStored(false);
        setPasscode("");
      } else if (outcomes.some((r) => "review" in r)) {
        saveAccess({ ...readAccess(), passcode });
        setStored(true);
      }

      setResults(Object.fromEntries(entries));
    } finally {
      setLoading(false);
    }
  };

  return { passcode, setPasscode, needsPasscode: !stored, loading, results, check };
};
