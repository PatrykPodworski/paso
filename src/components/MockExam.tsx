import { Eyebrow } from "../design-system/Eyebrow";
import { Badge } from "../design-system/Badge";
import { PageHeading } from "../design-system/PageHeading";
import { useEffect, useState } from "react";
import { mockSections } from "../data/mock";
import type { Progress } from "../data/types";
import { isCorrect } from "../data/progress";
import { ExamRunning } from "./ExamRunning";
import { ExamTopbar } from "./ExamTopbar";
import { MockIntro } from "./MockIntro";
import { MockResults } from "./MockResults";
import { OralPrep } from "./OralPrep";
import { SectionReview } from "./SectionReview";
import { Icon } from "./Icon";
import { stopAudio } from "./AudioButton";
import { Notice } from "../design-system/Notice";

interface Run {
  section: number;
  index: number;
  stage: "intro" | "run" | "review" | "prep" | "done";
  answers: Record<string, string>;
  deadline: number;
  started: string;
  drafts: Record<string, string>;
}
const KEY = "paso-mock-v1";

const fresh = (): Run => ({
  section: 0,
  index: 0,
  stage: "intro",
  answers: {},
  deadline: 0,
  started: "",
  drafts: {},
});

const load = (): Run => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");

    return raw &&
      Number.isInteger(raw.section) &&
      raw.section >= 0 &&
      raw.section < 4 &&
      Number.isInteger(raw.index) &&
      raw.index >= 0 &&
      raw.index < mockSections[raw.section].questions.length &&
      ["intro", "run", "review", "prep", "done"].includes(raw.stage) &&
      raw.answers
      ? { ...fresh(), ...raw }
      : fresh();
  } catch {
    return fresh();
  }
};

type Props = {
  progress: Progress;
  onResult: (result: Progress["mockResults"][number]) => void;
};

export const MockExam = ({ progress, onResult }: Props) => {
  const [run, setRun] = useState<Run>(load);
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [writing, setWriting] = useState("");
  const [speaking, setSpeaking] = useState("");
  const section = mockSections[run.section];
  const left = Math.max(0, Math.ceil((run.deadline - now) / 1000));

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(run));
    } catch {
      setStorageError(true);
    }
  }, [run]);

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
  }, [now, run.deadline, run.stage]);

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

  const download = () => {
    const body = {
      date: run.started,
      reading: score(0),
      listening: score(1),
      writing: "Requires human assessment",
      speaking: "Requires human assessment",
      responses: mockSections.flatMap((s) =>
        s.questions.map((q) => ({
          skill: s.title,
          task: q.task,
          prompt: q.prompt,
          response: run.answers[q.id] || "",
          model: q.answer,
          explanation: q.explanation,
        })),
      ),
    };

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(body, null, 2)], { type: "application/json" }),
    );

    const a = document.createElement("a");

    a.href = url;
    a.download = "paso-exam-responses.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const examViews = {
    prep: (
      <OralPrep
        notes={run.drafts.prep || ""}
        onNotes={(prep) => setRun((r) => ({ ...r, drafts: { ...r.drafts, prep } }))}
        onReady={() => {
          setNow(Date.now());
          setRun((r) => ({ ...r, stage: "run", deadline: Date.now() + 600000 }));
        }}
      />
    ),
    review: (
      <SectionReview
        sectionIndex={run.section}
        score={score(run.section)}
        answers={run.answers}
        onNext={nextSection}
      />
    ),
    run: (
      <ExamRunning
        sectionIndex={run.section}
        index={run.index}
        answers={run.answers}
        drafts={run.drafts}
        confirm={confirm}
        onDraft={(id, text) => setRun((r) => ({ ...r, drafts: { ...r.drafts, [id]: text } }))}
        onAnswer={(id, answer) =>
          setRun((r) => ({
            ...r,
            answers: { ...r.answers, [id]: answer },
            index: Math.min(r.index + 1, section.questions.length - 1),
          }))
        }
        onMove={(step) => setRun((r) => ({ ...r, index: r.index + step }))}
        onConfirm={setConfirm}
        onEnd={endSection}
      />
    ),
  };

  return (
    <div className="mock-page">
      <PageHeading
        eyebrow={
          <Eyebrow variant="page" className="mb-[9px]">
            A CALM DRESS REHEARSAL
          </Eyebrow>
        }
        title="Meet the exam."
        description="Familiar tasks. A little focus. A more confident you."
      >
        <Badge className="max-tablet:hidden">
          <Icon name="clock" size={16} /> Official section timings
        </Badge>
      </PageHeading>
      {storageError && (
        <Notice as="p" role="status">
          This browser could not save the rehearsal. Keep this page open to retain your work.
        </Notice>
      )}
      {run.stage === "intro" ? (
        <MockIntro progress={progress} onStart={start} />
      ) : run.stage === "done" ? (
        <MockResults
          reading={score(0)}
          listening={score(1)}
          writing={writing}
          speaking={speaking}
          onWriting={setWriting}
          onSpeaking={setSpeaking}
          onDownload={download}
          onReset={() => setRun(fresh())}
        />
      ) : (
        <>
          <ExamTopbar sectionIndex={run.section} showTimer={run.stage !== "review"} left={left} />
          {examViews[run.stage]}
        </>
      )}
    </div>
  );
};
