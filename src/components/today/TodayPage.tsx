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
    <div className="dashboard-grid">
      <div className="dashboard-primary">
        <section className="hero-card">
          <div className="hero-text">
            <span className="hero-eyebrow">
              <i />
              YOUR JOURNEY TO DELE A1
            </span>
            <h2>
              Small steps.
              <br />A world of <em>Spanish.</em>
            </h2>
            <p>Real-life Spanish, little wins, and a clear path to your first diploma.</p>
            <Button
              variant="primary"
              size="compact"
              className="max-phone:mt-[4px] max-phone:relative max-phone:z-[3]"
              onClick={() => setSession(nextLesson)}
            >
              {completed ? "Continue my journey" : "Let’s take the first step"}
              <Icon name="arrow" size={19} />
            </Button>
            <span className="hero-caption">
              <Icon name="clock" size={13} />
              {nextLesson.minutes} minutes is a lovely start
            </span>
          </div>
          <JourneyArt />
          <span className="hero-footnote">POCO A POCO, PASO A PASO.</span>
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
        <div className="flex items-center gap-[12px] max-phone:gap-[8px] mb-[18px] text-[12px] max-phone:text-[11px] text-[#75816b]">
          <span className="whitespace-nowrap">
            <b className="font-medium text-[#536849]">{completed}</b> of {allLessons.length} lessons
            complete
          </span>
          <div className="progress-track flex-1 h-[4px]!">
            <div style={{ width: `${progressPercent}%` }} />
          </div>
          <b className="font-medium text-[12px]">{progressPercent}%</b>
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
        <button
          className="flex items-center justify-center w-full gap-[9px] border-0 bg-transparent p-[16px] max-phone:p-[14px_0] text-[13px] max-phone:text-[11px] text-[#8a977c] [&:hover]:text-(--green)"
          onClick={() => navigate("path")}
        >
          Home, cafés, adventures & 6 more chapters
          <Icon name="arrow" size={16} />
        </button>
        <SectionHeading>
          <h2>A little change of pace</h2>
          <span className="subtle">Make it yours</span>
        </SectionHeading>
        <QuickPractice mistakeCount={mistakeCount} practice={practice} />
      </div>
      <aside className="dashboard-aside">
        <DailyGoal progress={progress} openSettings={openSettings} />
        <SkillsPanel progress={progress} navigate={navigate} practice={practice} />
        <section className="p-[22px] desktop:p-[24px] max-laptop:p-[22px_28px] max-laptop:col-span-full rounded-[12px] border border-[#eee1cd] bg-[#f3ebdd]">
          <Eyebrow variant="phrase">
            <Icon name="spark" size={14} /> A PHRASE FOR TODAY
          </Eyebrow>
          <h3
            lang="es"
            className="font-(family-name:--serif) italic font-medium tracking-[-1px] text-[#906e4e] text-[29px] desktop:text-[34px] mt-[19px] max-laptop:mt-[12px]"
          >
            Poco a poco.
          </h3>
          <span className="phrase-pronunciation">/ˈpo.ko a ˈpo.ko/</span>
          <p className="mt-[11px] text-[14px] text-[#8e7d61]">Little by little.</p>
          <div className="flex items-center justify-between mt-[8px] max-laptop:justify-start max-laptop:gap-[20px] [&_.icon-button]:w-[30px] [&_.icon-button]:h-[30px] [&_.icon-button]:rounded-full [&_.icon-button]:border [&_.icon-button]:border-[#e7dcc2] [&_.icon-button]:bg-[#fcf7e9] [&_.icon-button]:text-[#b6986f]">
            <span className="text-[11px] max-tablet:text-[13px] text-[#75816b]">
              Progress has its own pace.
            </span>
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
