import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { Notice } from "../../design-system/Notice";
import { mockSections } from "../../data/mock";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { skills, SKILL_ICON, SKILL_ICON_SIZE } from "../practice";

type Props = { progress: Progress; onStart: () => void };

export const MockIntro = ({ progress, onStart }: Props) => (
  <>
    <div className="flex items-center gap-11 rounded-xl border border-sage-200 bg-sage-100 p-10 max-xl:gap-6 max-xl:p-7 max-md:p-6">
      <div className="flex h-55 w-47 shrink-0 flex-col items-center justify-center gap-6 rounded-t-arch rounded-b-2xl border border-sage-200 bg-sage-200 text-olive-500 max-xl:h-47 max-xl:w-37 max-lg:hidden">
        <Icon name="flag" size={70} />
        <span className="text-base tracking-widest">DELE A1</span>
      </div>
      <div>
        <Eyebrow>YOUR FIRST FULL REHEARSAL</Eyebrow>
        <h2 className="font-serif font-semibold tracking-tight leading-tight mt-3 mb-4 text-4xl max-xl:text-3xl max-lg:text-4xl max-md:text-3xl">
          One exam. Four ways
          <br />
          to make yourself understood.
        </h2>
        <p className="leading-relaxed max-w-137 text-sm text-sage-500">
          Try 55 original tasks and questions. Reading and listening are scored automatically.
          Writing and speaking are saved for self-review or a teacher’s assessment.
        </p>
        <div className="my-5 flex flex-wrap gap-5 text-xs text-sage-600 max-xl:gap-3">
          <span className="flex items-center gap-1.5">
            <Icon name="clock" className="w-4" />
            105 min + 10 min oral prep
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="book" className="w-4" />4 skills · 100 possible points
          </span>
        </div>
        <Button variant="primary" onClick={onStart}>
          Start exam rehearsal
          <Icon name="arrow" />
        </Button>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-4 gap-4 max-xl:gap-3 max-lg:grid-cols-2 max-sm:gap-2.5">
      {mockSections.map((s, i) => (
        <Panel
          as="article"
          key={s.title}
          className="p-6 max-xl:px-3.5 max-xl:py-5 max-md:p-5 max-sm:px-3.5 max-sm:py-5"
        >
          <div className={`${SKILL_ICON} ${SKILL_ICON_SIZE} ${skills[i].tint}`}>
            <Icon name={["book", "headphones", "pen", "mic"][i]} />
          </div>
          <h3 className="text-base font-semibold tracking-tight mt-4 mb-2">{s.title}</h3>
          <p className="leading-relaxed min-h-7 text-xs text-sage-500 max-sm:text-2xs">
            {s.spanish}
          </p>
          <strong className="mt-2.5 mb-2 block font-serif text-2xl font-medium">
            {s.minutes} minutes
          </strong>
          <span className="text-xs text-sage-500 max-sm:text-2xs">
            {s.questions.length} {i < 2 ? "questions · 4 tasks" : "tasks"}
          </span>
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
              className="mt-3 flex items-center gap-5 border-t border-sage-200 py-3.5 text-sm text-sage-600 max-lg:flex-wrap max-lg:gap-3"
              key={r.at}
            >
              <span>{new Date(r.at).toLocaleDateString()}</span>
              <strong className="font-medium">Reading {r.reading}/25</strong>
              <strong className="font-medium">Listening {r.listening}/25</strong>
              <small className="ml-auto text-xs text-sage-400">Productive skills ungraded</small>
            </div>
          ))}
      </Panel>
    )}
  </>
);
