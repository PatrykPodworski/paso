import { Eyebrow } from "../../design-system/Eyebrow";
import { Badge } from "../../design-system/Badge";
import { PageHeading } from "../../design-system/PageHeading";
import type { ProgressSnapshot } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { downloadResponses } from "./downloadResponses";
import { ExamRunning } from "./ExamRunning";
import { ExamTopbar } from "./ExamTopbar";
import { MockIntro } from "./MockIntro";
import { MockResults } from "./MockResults";
import { OralPrep } from "./OralPrep";
import { SectionReview } from "./SectionReview";
import { type MockExamActions, useMockExam } from "./useMockExam";

type Props = MockExamActions & { progress: ProgressSnapshot };

export const MockExam = ({ progress, ...actions }: Props) => {
  const {
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
  } = useMockExam(progress.mockRun, actions);

  return (
    <div className="mock-page">
      <PageHeading
        eyebrow={
          <Eyebrow variant="page" className="mb-2">
            A CALM DRESS REHEARSAL
          </Eyebrow>
        }
        title="Meet the exam."
        description="Familiar tasks. A little focus. A more confident you."
      >
        <Badge className="max-md:hidden">
          <Icon name="clock" size={16} /> Official section timings
        </Badge>
      </PageHeading>
      {run.stage === "intro" && <MockIntro progress={progress} onStart={start} />}
      {run.stage === "done" && (
        <MockResults
          reading={score(0)}
          listening={score(1)}
          writing={run.scores.writing ?? ""}
          speaking={run.scores.speaking ?? ""}
          talks={run.talks}
          onWriting={(writing) => change({ scores: { writing } })}
          onSpeaking={(speaking) => change({ scores: { speaking } })}
          onDownload={() => downloadResponses(run, score)}
          onReset={() => restart()}
        />
      )}
      <ExamTopbar run={run} left={left} />
      {run.stage === "prep" && <OralPrep run={run} change={change} setNow={setNow} />}
      {run.stage === "review" && <SectionReview run={run} score={score} onNext={nextSection} />}
      {run.stage === "run" && (
        <ExamRunning
          run={run}
          change={change}
          confirm={confirm}
          setConfirm={setConfirm}
          onEnd={endSection}
        />
      )}
    </div>
  );
};
