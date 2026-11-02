import { useEffect, useMemo, useState } from "react";
import { buildExam, seenFrom } from "../../data/examBuilder";
import { examSections, mockExam, sectionVariants } from "../../data/mock";
import type { MockRun, NewMockResult } from "../../data/types";
import { isCorrect } from "../../data/progress";
import { stopAudio } from "../audio/playback";
import { draftAnswers } from "./draftAnswers";
import { type MockRunActions, useMockRun } from "./useMockRun";

export type MockExamActions = MockRunActions & {
  onResult: (result: NewMockResult) => void;
  // Records the task variants a section shows, so later exams prefer others.
  onSeen: (variants: string[]) => void;
};

const randomSeed = () => crypto.getRandomValues(new Uint32Array(1))[0];

export const useMockExam = (
  saved: MockRun | null,
  seenVariants: Record<string, string>,
  { onResult, onSeen, ...actions }: MockExamActions,
) => {
  const { run, change, restart } = useMockRun(saved, actions);
  // The exam the start button begins, built ahead so the intro can say what is new in it.
  const [seed, setSeed] = useState(randomSeed);

  const nextExam = useMemo(
    () => buildExam({ seed, seen: seenFrom(seenVariants) }),
    [seed, seenVariants],
  );

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

  // Lucas closes each talk at its own limit, so the speaking clock cuts no talk half-way.
  const speaking = run.stage === "run" && run.section === 3;

  useEffect(() => {
    if (
      (run.stage === "run" || run.stage === "prep") &&
      !speaking &&
      run.deadline > 0 &&
      now >= run.deadline
    ) {
      stopAudio();

      change(
        run.stage === "prep"
          ? { stage: "run", deadline: Date.now() + 600000 }
          : { answers: draftAnswers(run), stage: "review" },
      );
    }
  }, [now, run, speaking, change]);

  const start = () => {
    setNow(Date.now());

    restart({
      seed,
      variants: nextExam,
      stage: "run",
      started: new Date().toISOString(),
      deadline: Date.now() + 45 * 60000,
    });

    onSeen(sectionVariants(nextExam, 0));
    setSeed(randomSeed());
  };

  const endSection = () => {
    stopAudio();
    setConfirm(false);
    change({ answers: draftAnswers(run), stage: "review" });
  };

  const score = (index: number) =>
    examSections(run.variants)[index].questions.filter((q) => isCorrect(q, run.answers[q.id] || ""))
      .length;

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
    onSeen(sectionVariants(run.variants, next));

    change({
      section: next,
      index: 0,
      stage: next === 3 ? "prep" : "run",
      deadline: Date.now() + (next === 3 ? 10 : mockExam[next].minutes) * 60000,
    });
  };

  return {
    nextExam,
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
