import { useEffect, useMemo, useState } from "react";
import { buildExam, seenFrom } from "../../data/examBuilder";
import { examSections, mockExam, sectionVariants } from "../../data/mock";
import type { MockRun, MockRunPatch, NewMockResult } from "../../data/types";
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

// Moves the run to the start of a section. Speaking starts with ten minutes of preparation.
const sectionStart = (section: number): MockRunPatch => ({
  section,
  index: 0,
  stage: section === 3 ? "prep" : "run",
  deadline: Date.now() + (section === 3 ? 10 : mockExam[section].minutes) * 60000,
});

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

  // Lucía closes each talk at its own limit, so the speaking clock cuts no talk half-way.
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

  // Starts the sections given, the whole exam or one section alone.
  const start = (sections: number[]) => {
    setNow(Date.now());

    restart({
      seed,
      variants: nextExam,
      sections,
      started: new Date().toISOString(),
      ...sectionStart(sections[0]),
    });

    onSeen(sectionVariants(nextExam, sections[0]));
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

    const next = run.sections[run.sections.indexOf(run.section) + 1];

    if (next === undefined) {
      const took = (section: number) => run.sections.includes(section);

      onResult({
        at: new Date().toISOString(),
        sections: run.sections,
        ...(took(0) ? { reading: score(0) } : {}),
        ...(took(1) ? { listening: score(1) } : {}),
      });

      change({ stage: "done" });

      return;
    }

    setNow(Date.now());
    onSeen(sectionVariants(run.variants, next));
    change(sectionStart(next));
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
