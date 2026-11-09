import type { QuestionKind } from "../../data/types";
import { Panel } from "../../design-system/Panel";
import { PRESSABLE } from "../../design-system/pressable";
import { SectionHeading } from "../../design-system/SectionHeading";
import type { Session } from "../practice";
import { SkillDot } from "../SkillDot";
import { exerciseGroups } from "./exerciseGroups";

const KIND: Record<QuestionKind, string> = {
  choice: "Multiple choice",
  listen: "Listening",
  type: "Typed answer",
  order: "Sentence builder",
  write: "Writing",
  form: "Form",
  live: "Live talk",
  teach: "Teaching card",
};

const ROW =
  "flex flex-wrap items-baseline gap-x-4 gap-y-1 w-full text-start border-0 bg-transparent px-5 py-3 max-sm:px-4 hover:bg-muted";

type Props = { setSession: Session };

export const ExerciseList = ({ setSession }: Props) =>
  exerciseGroups.map((g) => (
    <section key={g.id} aria-labelledby={`backoffice-${g.id}`}>
      <SectionHeading title={g.title} titleId={`backoffice-${g.id}`} />
      <Panel className="overflow-clip">
        <ul className="divide-y divide-border">
          {g.rows.map(({ question, context }) => (
            <li key={question.id}>
              <button
                type="button"
                className={`${PRESSABLE} ${ROW}`}
                onClick={() =>
                  setSession({
                    id: `backoffice-${question.id}`,
                    title: context,
                    subtitle: g.title,
                    minutes: 1,
                    icon: "layers",
                    questions: [question],
                  })
                }
              >
                <span className="flex items-center gap-2 basis-36 shrink-0 text-2xs uppercase tracking-widest text-muted-foreground">
                  <SkillDot skill={question.skill} />
                  {KIND[question.kind]}
                </span>
                <span className="flex-1 basis-60 min-w-0">
                  <strong className="font-semibold text-foreground text-sm line-clamp-2">
                    {question.task || question.prompt}
                  </strong>
                  <small className="text-muted-foreground text-xs line-clamp-1">
                    <span>{context}</span> · <span>{question.answer}</span>
                  </small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  ));
