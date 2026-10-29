import { useEffect, useState } from "react";
import { mockSections } from "../../data/mock";
import type { MockRun, NewMockResult } from "../../data/types";
import { isCorrect } from "../../data/progress";
import { stopAudio } from "../audio/playback";
import { type MockRunActions, useMockRun } from "./useMockRun";

export type MockExamActions = MockRunActions & { onResult: (result: NewMockResult) => void };

export const useMockExam = (saved: MockRun | null, { onResult, ...actions }: MockExamActions) => {
  const { run, change, restart } = useMockRun(saved, actions);
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

      change(
        run.stage === "prep"
          ? { stage: "run", deadline: Date.now() + 600000 }
          : { stage: "review" },
      );
    }
  }, [now, run.deadline, run.stage, change]);

  const start = () => {
    setNow(Date.now());

    restart({
      stage: "run",
      started: new Date().toISOString(),
      deadline: Date.now() + 45 * 60000,
    });
  };

  const endSection = () => {
    stopAudio();
    setConfirm(false);
    change({ stage: "review" });
  };

  const score = (index: number) =>
    mockSections[index].questions.filter((q) => isCorrect(q, run.answers[q.id] || "")).length;

  const nextSection = () => {
    setConfirm(false);

    if (run.section === 3) {
      const result = { at: new Date().toISOString(), reading: score(0), listening: score(1) };

      onResult(result);
      change({ stage: "done" });

      return;
    }

    const next = run.section + 1;

    setNow(Date.now());

    change({
      section: next,
      index: 0,
      stage: next === 3 ? "prep" : "run",
      deadline: Date.now() + (next === 3 ? 10 : mockSections[next].minutes) * 60000,
    });
  };

  return {
    run,
    change,
    restart,
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
