import { useEffect, useState } from "react";
import { mockSections } from "../data/mock";
import type { Progress } from "../data/types";
import { isCorrect } from "../data/progress";
import { stopAudio } from "./playback";
import { fresh, useMockRun } from "./useMockRun";

export const useMockExam = (onResult: (result: Progress["mockResults"][number]) => void) => {
  const { run, setRun, storageError } = useMockRun();
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const left = Math.max(0, Math.ceil((run.deadline - now) / 1000));

  useEffect(() => {
    if (run.stage !== "run" && run.stage !== "prep") {
      return;
    }

    const id = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(id);
  }, [run.stage]);

  useEffect(() => {
    if ((run.stage === "run" || run.stage === "prep") && run.deadline > 0 && now >= run.deadline) {
      stopAudio();

      setRun((r) =>
        r.stage === "prep"
          ? { ...r, stage: "run", deadline: Date.now() + 600000 }
          : { ...r, stage: "review" },
      );

      setConfirm(false);
    }
  }, [now, run.deadline, run.stage, setRun]);

  const start = () => {
    setNow(Date.now());

    setRun({
      ...fresh(),
      stage: "run",
      started: new Date().toISOString(),
      deadline: Date.now() + 45 * 60000,
    });
  };

  const endSection = () => {
    stopAudio();
    setConfirm(false);
    setRun((r) => ({ ...r, stage: "review" }));
  };

  const score = (index: number) =>
    mockSections[index].questions.filter((q) => isCorrect(q, run.answers[q.id] || "")).length;

  const nextSection = () => {
    if (run.section === 3) {
      const result = { at: new Date().toISOString(), reading: score(0), listening: score(1) };

      onResult(result);
      setRun((r) => ({ ...r, stage: "done" }));

      return;
    }

    const next = run.section + 1;

    setNow(Date.now());

    setRun((r) => ({
      ...r,
      index: 0,
      section: next,
      stage: next === 3 ? "prep" : "run",
      deadline: Date.now() + (next === 3 ? 10 : mockSections[next].minutes) * 60000,
    }));
  };

  return {
    run,
    setRun,
    storageError,
    setNow,
    left,
    confirm,
    setConfirm,
    start,
    endSection,
    score,
    nextSection,
  };
};
