import { askingLesson, askingUnits } from "../../data/asking-questions/askingQuestions";
import type { ProgressSnapshot } from "../../data/types";
import { Eyebrow } from "../../design-system/Eyebrow";
import { PageHeading } from "../../design-system/PageHeading";
import { Panel } from "../../design-system/Panel";
import type { Session } from "../practice";
import { SetLessonRow } from "./SetLessonRow";

type Props = { progress: ProgressSnapshot; setSession: Session };

export const QuestionsPage = ({ progress, setSession }: Props) => (
  <>
    <PageHeading
      eyebrow={
        <Eyebrow variant="page" className="mbe-2">
          A PRACTICE SET
        </Eyebrow>
      }
      title="Asking questions."
      description="Form and ask questions in Spanish, one new question word per lesson."
    />
    <div className="flex flex-col gap-6">
      {askingUnits
        .filter((u) => u.lessons.length)
        .map((u) => (
          <section key={u.id} aria-labelledby={`${u.id}-title`}>
            <h2 id={`${u.id}-title`} className="mbe-3 text-lg font-semibold tracking-tight">
              {u.title}
            </h2>
            <Panel className="flex flex-col p-2">
              {u.lessons.map((l) => (
                <SetLessonRow
                  key={l.id}
                  lesson={l}
                  progress={progress}
                  onOpen={() => setSession(askingLesson(l.id))}
                />
              ))}
            </Panel>
          </section>
        ))}
    </div>
  </>
);
