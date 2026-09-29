import { Eyebrow } from "../design-system/Eyebrow";
import { Badge } from "../design-system/Badge";
import { PageHeading } from "../design-system/PageHeading";
import { Notice } from "../design-system/Notice";
import { useState } from "react";
import type { Progress } from "../data/types";
import { Icon } from "../design-system/Icon";
import { downloadResponses } from "./downloadResponses";
import { ExamRunning } from "./ExamRunning";
import { ExamTopbar } from "./ExamTopbar";
import { MockIntro } from "./MockIntro";
import { MockResults } from "./MockResults";
import { OralPrep } from "./OralPrep";
import { SectionReview } from "./SectionReview";
import { useMockExam } from "./useMockExam";
import { fresh } from "./useMockRun";

type Props = {
  progress: Progress;
  onResult: (result: Progress["mockResults"][number]) => void;
};

export const MockExam = ({ progress, onResult }: Props) => {
  const {
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
  } = useMockExam(onResult);

  const [writing, setWriting] = useState("");
  const [speaking, setSpeaking] = useState("");

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
      {run.stage === "intro" && <MockIntro progress={progress} onStart={start} />}
      {run.stage === "done" && (
        <MockResults
          reading={score(0)}
          listening={score(1)}
          writing={writing}
          speaking={speaking}
          onWriting={setWriting}
          onSpeaking={setSpeaking}
          onDownload={() => downloadResponses(run, score)}
          onReset={() => setRun(fresh())}
        />
      )}
      <ExamTopbar run={run} left={left} />
      {run.stage === "prep" && <OralPrep run={run} setRun={setRun} setNow={setNow} />}
      {run.stage === "review" && <SectionReview run={run} score={score} onNext={nextSection} />}
      {run.stage === "run" && (
        <ExamRunning
          run={run}
          setRun={setRun}
          confirm={confirm}
          setConfirm={setConfirm}
          onEnd={endSection}
        />
      )}
    </div>
  );
};
