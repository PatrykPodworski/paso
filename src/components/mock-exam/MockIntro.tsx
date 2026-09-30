import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { Notice } from "../../design-system/Notice";
import { mockSections } from "../../data/mock";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";

type Props = { progress: Progress; onStart: () => void };

export const MockIntro = ({ progress, onStart }: Props) => (
  <>
    <div className="flex items-center gap-[45px] rounded-[13px] border border-line bg-[#f0efdf] p-[40px] max-desktop:gap-[25px] max-desktop:p-[30px] max-tablet:p-[25px] max-phone:p-[23px]">
      <div className="flex h-[220px] w-[190px] shrink-0 flex-col items-center justify-center gap-[25px] rounded-[95px_95px_15px_15px] border border-[#d8dfbf] bg-[#e5e8d2] text-[#9aaa7c] max-desktop:h-[190px] max-desktop:w-[150px] max-laptop:hidden">
        <Icon name="flag" size={70} />
        <span className="text-[16px] tracking-[5px]">DELE A1</span>
      </div>
      <div>
        <Eyebrow>YOUR FIRST FULL REHEARSAL</Eyebrow>
        <h2 className="mt-[12px] mb-[17px] text-[34px] max-desktop:text-[29px] max-laptop:text-[34px] max-tablet:text-[29px] max-phone:text-[28px]">
          One exam. Four ways
          <br />
          to make yourself understood.
        </h2>
        <p className="max-w-[550px] text-[14px] text-[#90997e]">
          Try 55 original tasks and questions. Reading and listening are scored automatically.
          Writing and speaking are saved for self-review or a teacher’s assessment.
        </p>
        <div className="my-[20px] flex flex-wrap gap-[20px] text-[13px] text-[#8a947d] [&_svg]:w-[16px] max-desktop:gap-[13px] max-desktop:text-[12px] max-tablet:gap-[12px] max-tablet:text-[13px]">
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
    <div className="mt-[25px] grid grid-cols-[repeat(4,1fr)] gap-[17px] max-desktop:gap-[12px] max-laptop:grid-cols-[1fr_1fr] max-phone:gap-[11px]">
      {mockSections.map((s, i) => (
        <Panel
          as="article"
          key={s.title}
          className="p-[23px] max-desktop:px-[15px] max-desktop:py-[19px] max-tablet:p-[21px] max-phone:px-[15px] max-phone:py-[19px]"
        >
          <div className={`skill-icon ${s.title.toLowerCase()}`}>
            <Icon name={["book", "headphones", "pen", "mic"][i]} />
          </div>
          <h3 className="mt-[16px] mb-[8px] max-tablet:text-[17px]">{s.title}</h3>
          <p className="min-h-[30px] text-[12px] text-[#99a38a] max-phone:text-[11px]">
            {s.spanish}
          </p>
          <strong className="mt-[11px] mb-[8px] block font-(family-name:--serif) text-[25px] font-medium max-phone:text-[23px]">
            {s.minutes} minutes
          </strong>
          <span className="text-[12px] text-[#99a58b] max-phone:text-[11px]">
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
              className="mt-[13px] flex items-center gap-[22px] border-t border-line py-[15px] text-[14px] text-[#7f8f6f] max-laptop:flex-wrap max-laptop:gap-[12px]"
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
