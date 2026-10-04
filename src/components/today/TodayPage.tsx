import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { SectionHeading } from "../../design-system/SectionHeading";
import { TextLink } from "../../design-system/TextLink";
import { ProgressTrack } from "../../design-system/ProgressTrack";
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
import { PRESSABLE } from "../../design-system/pressable";

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
    <div className="flex gap-6 min-2xl:gap-7 max-xl:gap-5 max-lg:flex-col max-md:gap-5">
      <div className="flex-1 min-w-0">
        <section className="relative overflow-hidden rounded-xl border border-sand-100 bg-sand-100 min-h-92 p-8 max-xl:min-h-76 max-xl:p-6 max-lg:min-h-84 max-lg:p-7 max-md:min-h-88 max-md:py-7 max-md:px-6 max-sm:min-h-106 max-sm:py-6 max-sm:px-5">
          <div className="relative z-2 max-w-3/5 max-lg:max-w-1/2 max-md:max-w-2/3 max-sm:max-w-9/10">
            <span className="flex items-center gap-1.5 text-2xs tracking-widest font-bold text-sage-600">
              <i className="h-1 w-1 rounded-full bg-olive-500" />
              YOUR JOURNEY TO DELE A1
            </span>
            <h2 className="font-serif text-5xl tracking-tight leading-none mt-5 mx-0 mb-3 text-green-900 font-medium max-xl:text-4xl max-xl:mt-4 max-lg:text-5xl max-md:text-4xl">
              Small steps.
              <br />A world of <em className="font-medium text-coral-600">Spanish.</em>
            </h2>
            <p className="text-xs leading-relaxed text-sage-700 max-w-70 mb-5 max-xl:max-w-62 max-lg:text-sm max-md:text-xs max-sm:max-w-57 max-sm:relative max-sm:z-3">
              Real-life Spanish, little wins, and a clear path to your first diploma.
            </p>
            <Button
              variant="primary"
              size="compact"
              className="max-sm:mt-1 max-sm:relative max-sm:z-3"
              onClick={() => setSession(nextLesson)}
            >
              {completed ? "Continue my journey" : "Let’s take the first step"}
              <Icon name="arrow" size={19} />
            </Button>
            <span className="flex items-center gap-1 mt-3 text-2xs text-sage-700 max-lg:text-xs max-md:text-2xs max-sm:relative max-sm:z-3 max-sm:max-w-40 max-sm:leading-relaxed">
              <Icon name="clock" size={13} />
              {nextLesson.minutes} minutes is a lovely start
            </span>
          </div>
          <JourneyArt />
          <span className="absolute right-6 bottom-4 z-2 text-2xs tracking-widest text-sage-500 max-sm:hidden">
            POCO A POCO, PASO A PASO.
          </span>
        </section>
        <SectionHeading
          variant="path"
          eyebrow={
            <Eyebrow variant="heading" className="mb-1.5">
              A LITTLE STRUCTURE. A LOT OF POSSIBILITY.
            </Eyebrow>
          }
          title="Your learning path"
        >
          <TextLink className="text-xs! max-sm:text-2xs!" onClick={() => navigate("path")}>
            View full path
            <Icon name="arrow" size={16} />
          </TextLink>
        </SectionHeading>
        <div className="flex items-center gap-3 max-sm:gap-2 mb-4 text-xs max-sm:text-2xs text-sage-700">
          <span className="whitespace-nowrap">
            <b className="font-medium text-sage-800">{completed}</b> of {allLessons.length} lessons
            complete
          </span>
          <ProgressTrack value={progressPercent} className="flex-1" />
          <b className="font-medium text-xs">{progressPercent}%</b>
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
          className={`${PRESSABLE} flex items-center justify-center w-full gap-2 border-0 bg-transparent p-4 max-sm:py-3.5 max-sm:px-0 text-xs max-sm:text-2xs text-sage-600 hover:text-green-900`}
          onClick={() => navigate("path")}
        >
          Home, cafés, adventures & 6 more chapters
          <Icon name="arrow" size={16} />
        </button>
        <SectionHeading title="A little change of pace">
          <span className="text-sm text-sage-700">Make it yours</span>
        </SectionHeading>
        <QuickPractice mistakeCount={mistakeCount} practice={practice} />
      </div>
      <aside className="w-75 shrink-0 flex flex-col gap-4 max-xl:w-59 max-lg:w-auto max-lg:grid max-lg:grid-cols-2 max-md:gap-3.5 max-sm:grid-cols-1">
        <DailyGoal progress={progress} openSettings={openSettings} />
        <SkillsPanel progress={progress} navigate={navigate} practice={practice} />
        <section className="p-5 xl:p-6 max-lg:py-5 max-lg:px-7 max-lg:col-span-full rounded-xl border border-sand-200 bg-sand-100">
          <Eyebrow variant="phrase">
            <Icon name="spark" size={14} /> A PHRASE FOR TODAY
          </Eyebrow>
          <h3
            lang="es"
            className="font-serif italic font-medium tracking-tight text-sand-700 text-3xl xl:text-4xl mt-5 max-lg:mt-3"
          >
            Poco a poco.
          </h3>
          <span className="block text-xs text-sand-500 mt-1.5">/ˈpo.ko a ˈpo.ko/</span>
          <p className="leading-relaxed mt-2.5 text-sm text-sand-600">Little by little.</p>
          <div className="flex items-center justify-between mt-2 max-lg:justify-start max-lg:gap-5">
            <span className="text-2xs max-md:text-xs text-sage-700">
              Progress has its own pace.
            </span>
            <AudioButton round="phrase" text="Poco a poco." label="Listen to poco a poco" />
          </div>
        </section>
        <div className="flex justify-center items-center gap-2 p-1 text-sage-400 max-lg:hidden">
          <Icon name="heart" size={16} className="text-sage-300" />
          <p className="text-xs leading-relaxed">
            No rush. No lost hearts.
            <br />
            Just you, getting a little better.
          </p>
        </div>
      </aside>
    </div>
  </>
);
