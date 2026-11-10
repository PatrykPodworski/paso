import { pathUnitNumber } from "../../data/path";
import type { PracticeSet } from "../../data/practice-sets/practiceSet";
import type { ProgressSnapshot } from "../../data/types";
import { Eyebrow } from "../../design-system/Eyebrow";
import { PageHeading } from "../../design-system/PageHeading";
import { Panel } from "../../design-system/Panel";
import type { Session } from "../practice";
import { SetLessonRow } from "./SetLessonRow";

type Props = { set: PracticeSet; progress: ProgressSnapshot; setSession: Session };

export const SetPage = ({ set, progress, setSession }: Props) => (
  <>
    <PageHeading
      eyebrow={
        <Eyebrow variant="page" className="mbe-2">
          A PRACTICE SET
        </Eyebrow>
      }
      title={set.title}
      description={set.description}
    />
    <div className="flex flex-col gap-6">
      {set.units
        .filter((u) => u.lessons.length)
        .map((u) => (
          <section key={u.id} aria-labelledby={`${u.id}-title`}>
            <h2 id={`${u.id}-title`} className="text-lg font-semibold tracking-tight">
              Unit {pathUnitNumber(u.id)}
            </h2>
            <p className="mbe-3 text-sm text-muted-foreground">{u.subtitle}</p>
            <Panel className="flex flex-col p-2">
              {u.lessons.map((l) => (
                <SetLessonRow
                  key={l.id}
                  lesson={l}
                  progress={progress}
                  onOpen={() => setSession(set.lesson(l.id))}
                />
              ))}
            </Panel>
          </section>
        ))}
    </div>
  </>
);
