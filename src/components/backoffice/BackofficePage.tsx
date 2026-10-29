import { units } from "../../data/curriculum";
import { mockSections } from "../../data/mock";
import type { Question, QuestionKind } from "../../data/types";
import { Eyebrow } from "../../design-system/Eyebrow";
import { PageHeading } from "../../design-system/PageHeading";
import { Panel } from "../../design-system/Panel";
import { PRESSABLE } from "../../design-system/pressable";
import { SectionHeading } from "../../design-system/SectionHeading";
import type { Session } from "../practice";
import { SkillDot } from "../SkillDot";

const KIND: Record<QuestionKind, string> = {
  choice: "Multiple choice",
  listen: "Listening",
  type: "Typed answer",
  order: "Sentence builder",
  write: "Writing",
  form: "Form",
  live: "Live talk",
};

type Group = { id: string; title: string; rows: { question: Question; context: string }[] };

const groups: Group[] = [
  ...units.map((u, i) => ({
    id: u.id,
    title: `Unit ${i + 1} · ${u.title}`,
    rows: u.lessons.flatMap((l) => l.questions.map((question) => ({ question, context: l.title }))),
  })),
  {
    id: "mock",
    title: "Mock exam",
    rows: mockSections.flatMap((s) =>
      s.questions.map((question) => ({ question, context: s.title })),
    ),
  },
];

const ROW =
  "flex flex-wrap items-baseline gap-x-4 gap-y-1 w-full text-start border-0 bg-transparent px-5 py-3 max-sm:px-4 hover:bg-sage-50";

type Props = { setSession: Session };

export const BackofficePage = ({ setSession }: Props) => (
  <>
    <PageHeading
      eyebrow={
        <Eyebrow variant="page" className="mb-2">
          BACKOFFICE
        </Eyebrow>
      }
      title="Every task, one click away."
      description={`${groups.reduce((n, g) => n + g.rows.length, 0)} tasks. Open any of them directly.`}
    />
    {groups.map((g) => (
      <section key={g.id} aria-labelledby={`backoffice-${g.id}`}>
        <SectionHeading title={g.title} titleId={`backoffice-${g.id}`} />
        <Panel className="overflow-clip">
          <ul className="divide-y divide-sage-100">
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
                  <span className="flex items-center gap-2 basis-36 shrink-0 text-2xs uppercase tracking-widest text-sage-600">
                    <SkillDot skill={question.skill} />
                    {KIND[question.kind]}
                  </span>
                  <span className="flex-1 basis-60 min-w-0">
                    <strong className="font-semibold text-sage-800 text-sm line-clamp-2">
                      {question.task || question.prompt}
                    </strong>
                    <small className="text-sage-600 text-xs line-clamp-1">
                      <span>{context}</span> · <span>{question.answer}</span>
                    </small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    ))}
  </>
);
