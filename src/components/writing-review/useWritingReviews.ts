import { useState } from "react";
import { readAccess, saveAccess } from "../liveAccess";
import { requestReview, type ReviewResult } from "./requestReview";

const REJECTED: ReviewResult = { error: "passcode" };

const isRejected = (result: ReviewResult) => "error" in result && result.error === "passcode";

// Requests reviews for several answers with the passcode the live talks share. They go one
// after another, and a rejected passcode stops the rest, so one wrong passcode costs one of
// the daily tries. A rejected passcode is forgotten; one that got a review is remembered.
export const useWritingReviews = () => {
  const [passcode, setPasscode] = useState(() => readAccess().passcode);
  const [stored, setStored] = useState(() => readAccess().passcode !== "");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ReviewResult>>({});

  const check = async (answers: Record<string, string>) => {
    setLoading(true);

    try {
      const next: Record<string, ReviewResult> = {};

      for (const [id, answer] of Object.entries(answers)) {
        next[id] = Object.values(next).some(isRejected)
          ? REJECTED
          : await requestReview(id, answer, passcode);
      }

      const outcomes = Object.values(next);

      if (outcomes.some(isRejected)) {
        saveAccess({ ...readAccess(), passcode: "" });
        setStored(false);
        setPasscode("");
      } else if (outcomes.some((r) => "review" in r)) {
        saveAccess({ ...readAccess(), passcode });
        setStored(true);
      }

      setResults(next);
    } finally {
      setLoading(false);
    }
  };

  return { passcode, setPasscode, needsPasscode: !stored, loading, results, check };
};
