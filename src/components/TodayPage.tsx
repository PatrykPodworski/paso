import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { SectionHeading } from "../design-system/SectionHeading";
import { TextLink } from "../design-system/TextLink";
import { allLessons, units } from "../data/curriculum";
import type { Lesson, Progress } from "../data/types";
import { JourneyArt } from "./Art";
import { AudioButton } from "./AudioButton";
import { DailyGoal } from "./DailyGoal";
import { Icon } from "./Icon";
import type { Page } from "./navigation";
import type { Practice, Session } from "./practice";
import { QuickPractice } from "./QuickPractice";
import { SkillsPanel } from "./SkillsPanel";
import { TodayHeading } from "./TodayHeading";
import { UnitCard } from "./UnitCard";

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
      <aside className="dashboard-aside">
        <DailyGoal progress={progress} openSettings={openSettings} />
        <SkillsPanel progress={progress} navigate={navigate} practice={practice} />
        <section className="phrase-card">
          <Eyebrow variant="phrase">
            <Icon name="spark" size={14} /> A PHRASE FOR TODAY
          </Eyebrow>
          <h3 lang="es">Poco a poco.</h3>
          <span className="phrase-pronunciation">/ˈpo.ko a ˈpo.ko/</span>
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
