import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { SectionHeading } from "../../design-system/SectionHeading";
import { TextLink } from "../../design-system/TextLink";
import { allLessons, units } from "../../data/curriculum";
import type { Lesson, Progress } from "../../data/types";
import { JourneyArt } from "../Art";
import { AudioButton } from "../audio/AudioButton";
import { DailyGoal } from "./DailyGoal";
import { Icon } from "../../design-system/Icon";
import type { Page } from "../navigation";
import type { Practice, Session } from "../practice";
import { QuickPractice } from "./QuickPractice";
import { SkillsPanel } from "./SkillsPanel";
import { TodayHeading } from "./TodayHeading";
import { UnitCard } from "../UnitCard";

type Props = {
  progress: Progress;
  nextLesson: Lesson;
  completed: number;
  progressPercent: number;
  mistakeCount: number;
  expanded: string;
  setExpanded: (id: string) => void;
  setSession: Session;
  openSettings: () => void;
  navigate: (target: Page) => void;
  practice: Practice;
};

export const TodayPage = ({
  progress,
  nextLesson,
  completed,
  progressPercent,
  mistakeCount,
  expanded,
  setExpanded,
  setSession,
  openSettings,
  navigate,
  practice,
}: Props) => (
  <>
    <TodayHeading progress={progress} openSettings={openSettings} />
    <div className="grid grid-cols-[minmax(0,1fr)_300px] gap-[24px] min-[1600px]:gap-[30px] max-desktop:grid-cols-[minmax(0,1fr)_236px] max-desktop:gap-[19px] max-laptop:grid-cols-[minmax(0,1fr)] max-tablet:gap-[22px]">
      <div className="min-w-0">
        <section className="relative overflow-hidden rounded-[13px] border border-[#ece6d4] bg-[#f0eddf] min-h-[367px] p-[31px] max-desktop:min-h-[306px] max-desktop:p-[25px_23px] max-laptop:min-h-[335px] max-laptop:p-[30px] max-tablet:min-h-[353px] max-tablet:p-[28px_25px] max-phone:min-h-[425px] max-phone:p-[26px_21px]">
          <div className="relative z-[2] max-w-[60%] max-desktop:max-w-[58%] max-laptop:max-w-[54%] max-tablet:max-w-[64%] max-phone:max-w-[89%]">
            <span className="flex items-center gap-[7px] text-[10px] tracking-[1.4px] font-bold text-[#8d9476] max-desktop:tracking-[1px] max-laptop:text-[11px] max-phone:text-[9px]">
              <i className="h-[5px] w-[5px] rounded-[50%] bg-[#94a26b]" />
              YOUR JOURNEY TO DELE A1
            </span>
            <h2 className="font-(family-name:--serif) text-[47px] tracking-[-1.5px] leading-[1.06] m-[19px_0_13px] text-[#304f3d] font-medium max-desktop:text-[35px] max-desktop:mt-[17px] max-laptop:text-[45px] max-tablet:text-[41px] max-phone:text-[39px] max-phone:leading-[1.08]">
              Small steps.
              <br />A world of <em className="font-medium text-[#bb7553]">Spanish.</em>
            </h2>
            <p className="text-[13px] leading-[1.8] text-[#787d62] max-w-[280px] mb-[20px] max-desktop:max-w-[250px] max-laptop:text-[14px] max-tablet:text-[13px] max-phone:text-[12px] max-phone:max-w-[230px] max-phone:relative max-phone:z-[3]">
              Real-life Spanish, little wins, and a clear path to your first diploma.
            </p>
            <Button
              variant="primary"
              size="compact"
              className="max-phone:mt-[4px] max-phone:relative max-phone:z-[3]"
              onClick={() => setSession(nextLesson)}
            >
              {completed ? "Continue my journey" : "Let’s take the first step"}
              <Icon name="arrow" size={19} />
            </Button>
            <span className="flex items-center gap-[5px] mt-[12px] text-[10px] text-[#787d62] max-laptop:text-[12px] max-tablet:text-[10px] max-phone:relative max-phone:z-[3] max-phone:max-w-[160px] max-phone:leading-[1.6]">
              <Icon name="clock" size={13} />
              {nextLesson.minutes} minutes is a lovely start
            </span>
          </div>
          <JourneyArt />
          <span className="absolute right-[26px] bottom-[17px] z-[2] text-[10px] tracking-[1.7px] text-[#a3a087] max-tablet:text-[9px] max-phone:hidden">
            POCO A POCO, PASO A PASO.
          </span>
        </section>
        <SectionHeading variant="path">
          <div>
            <Eyebrow variant="heading" className="mb-[6px]">
              A LITTLE STRUCTURE. A LOT OF POSSIBILITY.
            </Eyebrow>
            <h2>Your learning path</h2>
          </div>
          <TextLink
            className="text-[13px]! max-phone:text-[11px]!"
            onClick={() => navigate("path")}
          >
            View full path
            <Icon name="arrow" size={16} />
          </TextLink>
        </SectionHeading>
        <div className="path-overview">
          <span>
            <b>{completed}</b> of {allLessons.length} lessons complete
          </span>
          <div className="progress-track">
            <div style={{ width: `${progressPercent}%` }} />
          </div>
          <b>{progressPercent}%</b>
        </div>
        <div className="flex flex-col gap-3">
          {units.slice(0, 3).map((u, i) => (
            <UnitCard
              key={u.id}
              unit={u}
              index={i}
              progress={progress}
              start={setSession}
              expanded={expanded === u.id}
              onExpand={() => setExpanded(expanded === u.id ? "" : u.id)}
            />
          ))}
        </div>
        <button className="remaining-units" onClick={() => navigate("path")}>
          Home, cafés, adventures & 6 more chapters
          <Icon name="arrow" size={16} />
        </button>
        <SectionHeading>
          <h2>A little change of pace</h2>
          <span className="subtle">Make it yours</span>
        </SectionHeading>
        <QuickPractice mistakeCount={mistakeCount} practice={practice} />
      </div>
      <aside className="flex flex-col gap-[18px] max-laptop:grid max-laptop:grid-cols-[1fr_1fr] max-tablet:gap-[15px] max-phone:grid-cols-[1fr]">
        <DailyGoal progress={progress} openSettings={openSettings} />
        <SkillsPanel progress={progress} navigate={navigate} practice={practice} />
        <section className="phrase-card max-laptop:col-[1/-1] max-laptop:p-[22px_28px]!">
          <Eyebrow variant="phrase">
            <Icon name="spark" size={14} /> A PHRASE FOR TODAY
          </Eyebrow>
          <h3 lang="es">Poco a poco.</h3>
          <span className="block text-[12px] text-[#b49d7f] mt-[6px]">/ˈpo.ko a ˈpo.ko/</span>
          <p>Little by little.</p>
          <div>
            <span>Progress has its own pace.</span>
            <AudioButton compact text="Poco a poco." label="Listen to poco a poco" />
          </div>
        </section>
        <div className="quiet-note">
          <Icon name="heart" size={16} />
          <p>
            No rush. No lost hearts.
            <br />
            Just you, getting a little better.
          </p>
        </div>
      </aside>
    </div>
  </>
);
