import { useEffect, useRef, useState } from "react";
import { readAccess, saveAccess } from "../liveAccess";
import { requestReview, type ReviewResult } from "./requestReview";

const REJECTED: ReviewResult = { error: "passcode" };

const isRejected = (result: ReviewResult) => "error" in result && result.error === "passcode";

// One request at a time; after a rejected passcode the rest are not sent.
const reviewInTurn = async (
  answers: [string, string][],
  passcode: string,
  done: Record<string, ReviewResult> = {},
): Promise<Record<string, ReviewResult>> => {
  if (!answers.length) {
    return done;
  }

  const [[id, answer], ...rest] = answers;

  if (Object.values(done).some(isRejected)) {
    return reviewInTurn(rest, passcode, { ...done, [id]: REJECTED });
  }

  return reviewInTurn(rest, passcode, {
    ...done,
    [id]: await requestReview(id, answer, passcode),
  });
};

// Requests reviews for several answers with the passcode the live talks share. They go one
// after another, and a rejected passcode stops the rest, so one wrong passcode costs one of
// the daily tries. A rejected passcode is forgotten; one that got a review is remembered.
export const useWritingReviews = () => {
  const [passcode, setPasscode] = useState(() => readAccess().passcode);
  const [stored, setStored] = useState(() => readAccess().passcode !== "");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ReviewResult>>({});

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  // Resolves to undefined when the view closed before the reviews came back: nobody saw them,
  // so they are dropped.
  const check = async (answers: Record<string, string>) => {
    setLoading(true);

    try {
      const next = await reviewInTurn(Object.entries(answers), passcode);

      if (!mounted.current) {
        return undefined;
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

      return next;
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  return { passcode, setPasscode, needsPasscode: !stored, loading, results, check };
};
