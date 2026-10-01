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
    <div className="flex items-center gap-[45px] rounded-[13px] border border-line bg-[#f0efdf] p-[40px] max-xl:gap-[25px] max-xl:p-[30px] max-md:p-[25px] max-sm:p-[23px]">
      <div className="flex h-[220px] w-[190px] shrink-0 flex-col items-center justify-center gap-[25px] rounded-[95px_95px_15px_15px] border border-[#d8dfbf] bg-[#e5e8d2] text-[#9aaa7c] max-xl:h-[190px] max-xl:w-[150px] max-lg:hidden">
        <Icon name="flag" size={70} />
        <span className="text-[16px] tracking-[5px]">DELE A1</span>
      </div>
      <div>
        <Eyebrow>YOUR FIRST FULL REHEARSAL</Eyebrow>
        <h2 className="mt-[12px] mb-[17px] text-[34px] max-xl:text-[29px] max-lg:text-[34px] max-md:text-[29px] max-sm:text-[28px]">
          One exam. Four ways
          <br />
          to make yourself understood.
        </h2>
        <p className="max-w-[550px] text-[14px] text-[#90997e]">
          Try 55 original tasks and questions. Reading and listening are scored automatically.
          Writing and speaking are saved for self-review or a teacher’s assessment.
        </p>
        <div className="my-[20px] flex flex-wrap gap-[20px] text-[13px] text-[#8a947d] [&_svg]:w-[16px] max-xl:gap-[13px] max-xl:text-[12px] max-md:gap-[12px] max-md:text-[13px]">
          <span className="flex items-center gap-[7px]">
            <Icon name="clock" />
            105 min + 10 min oral prep
          </span>
          <span className="flex items-center gap-[7px]">
            <Icon name="book" />4 skills · 100 possible points
          </span>
        </div>
        <Button variant="primary" onClick={onStart}>
          Start exam rehearsal
          <Icon name="arrow" />
        </Button>
      </div>
    </div>
    <div className="mt-[25px] grid grid-cols-[repeat(4,1fr)] gap-[17px] max-xl:gap-[12px] max-lg:grid-cols-[1fr_1fr] max-sm:gap-[11px]">
      {mockSections.map((s, i) => (
        <Panel
          as="article"
          key={s.title}
          className="p-[23px] max-xl:px-[15px] max-xl:py-[19px] max-md:p-[21px] max-sm:px-[15px] max-sm:py-[19px]"
        >
          <div className={`${SKILL_ICON} ${SKILL_ICON_SIZE} ${skills[i].tint}`}>
            <Icon name={["book", "headphones", "pen", "mic"][i]} />
          </div>
          <h3 className="mt-[16px] mb-[8px] max-md:text-[17px]">{s.title}</h3>
          <p className="min-h-[30px] text-[12px] text-[#99a38a] max-sm:text-[11px]">{s.spanish}</p>
          <strong className="mt-[11px] mb-[8px] block font-(family-name:--serif) text-[25px] font-medium max-sm:text-[23px]">
            {s.minutes} minutes
          </strong>
          <span className="text-[12px] text-[#99a58b] max-sm:text-[11px]">
            {s.questions.length} {i < 2 ? "questions · 4 tasks" : "tasks"}
          </span>
        </Panel>
      ))}
    </div>
    <Notice>
      <Icon name="info" />
      <p>
        This is an independent guided rehearsal. Shorter listening clips, visual symbols and
        navigation differ from the live exam; audio is controlled per question. Use the{" "}
        <a
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
      <Panel className="p-[24px]">
        <h3>Your previous rehearsals</h3>
        {progress.mockResults
          .slice()
          .reverse()
          .map((r) => (
            <div
              className="mt-[13px] flex items-center gap-[22px] border-t border-line py-[15px] text-[14px] text-[#7f8f6f] max-lg:flex-wrap max-lg:gap-[12px]"
              key={r.at}
            >
              <span>{new Date(r.at).toLocaleDateString()}</span>
              <strong className="font-medium">Reading {r.reading}/25</strong>
              <strong className="font-medium">Listening {r.listening}/25</strong>
              <small className="ml-auto text-[12px] text-[#a0ad8e]">
                Productive skills ungraded
              </small>
            </div>
          ))}
      </Panel>
    )}
  </>
);
