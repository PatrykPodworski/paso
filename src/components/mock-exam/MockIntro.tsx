import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { Notice } from "../../design-system/Notice";
import { Badge } from "../ui/badge";
import { fullExam, mockExam, sectionSizes, sectionVariants } from "../../data/mock";
import type { ExamVariants, ProgressSnapshot } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { skills, SKILL_ICON, SKILL_ICON_SIZE } from "../practice";
import { historyMarks, historyMarkText } from "./rehearsalHistory";

// The exam the start buttons begin: a section is new when the learner saw none of its variants.
type Props = {
  progress: ProgressSnapshot;
  variants: ExamVariants;
  // Starts the given sections: the whole exam or one section alone.
  onStart: (sections: number[]) => void;
};

type Result = ProgressSnapshot["mockResults"][number];

// A rehearsal of part of the exam, named by its sections, such as "Speaking only".
const partOf = ({ sections }: Result) =>
  sections.length < mockExam.length && `${sections.map((i) => mockExam[i].title).join(", ")} only`;

const isNew = (progress: ProgressSnapshot, variants: ExamVariants, section: number) =>
  sectionVariants(variants, section).every((id) => !Object.hasOwn(progress.seenVariants, id));

export const MockIntro = ({ progress, variants, onStart }: Props) => (
  <>
    <div className="flex items-center gap-11 rounded-xl border border-border bg-muted p-10 max-xl:gap-6 max-xl:p-7 max-md:p-6">
      <div className="flex h-55 w-47 shrink-0 flex-col items-center justify-center gap-6 rounded-t-arch rounded-b-2xl border border-border bg-muted text-foreground max-xl:h-47 max-xl:w-37 max-lg:hidden">
        <Icon name="flag" size={70} />
        <span className="text-base tracking-widest">DELE A1</span>
      </div>
      <div>
        <Eyebrow>YOUR FIRST FULL REHEARSAL</Eyebrow>
        <h2 className="font-heading font-semibold tracking-tight leading-tight mt-3 mb-4 text-4xl max-xl:text-3xl max-lg:text-4xl max-md:text-3xl">
          One exam. Four ways
          <br />
          to make yourself understood.
        </h2>
        <p className="leading-relaxed max-w-137 text-sm text-muted-foreground">
          Try 55 original tasks and questions. Reading and listening are scored automatically.
          Writing and speaking are saved for self-review or a teacher’s assessment.
        </p>
        <div className="my-5 flex flex-wrap gap-5 text-xs text-muted-foreground max-xl:gap-3">
          <span className="flex items-center gap-1.5">
            <Icon name="clock" className="w-4" />
            105 min + 10 min oral prep
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="book" className="w-4" />4 skills · 100 possible points
          </span>
        </div>
        <Button variant="primary" onClick={() => onStart(fullExam)}>
          Start exam rehearsal
          <Icon name="arrow" />
        </Button>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-4 gap-4 max-xl:gap-3 max-lg:grid-cols-2 max-sm:gap-2.5">
      {mockExam.map((s, i) => (
        <Panel
          as="article"
          key={s.title}
          className="p-6 max-xl:px-3.5 max-xl:py-5 max-md:p-5 max-sm:px-3.5 max-sm:py-5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className={`${SKILL_ICON} ${SKILL_ICON_SIZE} ${skills[i].tint}`}>
              <Icon name={["book", "headphones", "pen", "mic"][i]} />
            </div>
            {isNew(progress, variants, i) ? (
              <Badge variant="secondary">New</Badge>
            ) : (
              <Badge variant="outline">Seen before</Badge>
            )}
          </div>
          <h3 className="text-base font-semibold tracking-tight mt-4 mb-2">{s.title}</h3>
          <p className="leading-relaxed min-h-7 text-xs text-muted-foreground max-sm:text-2xs">
            {s.spanish}
          </p>
          <strong className="mt-2.5 mb-2 block font-heading text-2xl font-medium">
            {s.minutes} minutes
          </strong>
          <span className="text-xs text-muted-foreground max-sm:text-2xs">
            {sectionSizes[i]} {i < 2 ? "questions · 4 tasks" : "tasks"}
          </span>
          <Button
            variant="secondary"
            size="small"
            className="mt-4 w-full"
            aria-label={`Practise ${s.title.toLowerCase()} alone`}
            onClick={() => onStart([i])}
          >
            Practise alone
          </Button>
        </Panel>
      ))}
    </div>
    <Notice icon="info">
      <p className="leading-relaxed">
        This is an independent guided rehearsal. Shorter listening clips, visual symbols and
        navigation differ from the live exam; audio is controlled per question. Use the{" "}
        <a
          className="underline"
          href="https://examenes.cervantes.es/es/dele/preparar-prueba"
          target="_blank"
          rel="noreferrer"
        >
          official papers and recordings
        </a>{" "}
        to practise exact formatting and continuous audio. The timer keeps running if you leave this
        page.
      </p>
    </Notice>
    {progress.mockResults.length > 0 && (
      <Panel className="p-6">
        <h3 className="text-base font-semibold tracking-tight">Your previous rehearsals</h3>
        {progress.mockResults
          .slice()
          .reverse()
          .map((r) => (
            <div
              className="mt-3 flex items-center gap-5 border-t border-border py-3.5 text-sm text-muted-foreground max-lg:flex-wrap max-lg:gap-3"
              key={r.id}
            >
              <span>{new Date(r.at).toLocaleDateString()}</span>
              {partOf(r) && <span>{partOf(r)}</span>}
              {historyMarks(r).map((mark) =>
                mark.state === "score" ? (
                  <strong className="font-medium" key={mark.title}>
                    {historyMarkText(mark)}
                  </strong>
                ) : (
                  <small className="text-xs text-muted-foreground" key={mark.title}>
                    {historyMarkText(mark)}
                  </small>
                ),
              )}
            </div>
          ))}
      </Panel>
    )}
  </>
);
