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
    <div className="grid grid-cols-[minmax(0,1fr)_300px] gap-[24px] min-[1600px]:gap-[30px] max-xl:grid-cols-[minmax(0,1fr)_236px] max-xl:gap-[19px] max-lg:grid-cols-[minmax(0,1fr)] max-md:gap-[22px]">
      <div className="min-w-0">
        <section className="relative overflow-hidden rounded-[13px] border border-[#ece6d4] bg-[#f0eddf] min-h-[367px] p-[31px] max-xl:min-h-[306px] max-xl:p-[25px_23px] max-lg:min-h-[335px] max-lg:p-[30px] max-md:min-h-[353px] max-md:p-[28px_25px] max-sm:min-h-[425px] max-sm:p-[26px_21px]">
          <div className="relative z-[2] max-w-[60%] max-xl:max-w-[58%] max-lg:max-w-[54%] max-md:max-w-[64%] max-sm:max-w-[89%]">
            <span className="flex items-center gap-[7px] text-[10px] tracking-[1.4px] font-bold text-[#8d9476] max-xl:tracking-[1px] max-lg:text-[11px] max-sm:text-[9px]">
              <i className="h-[5px] w-[5px] rounded-[50%] bg-[#94a26b]" />
              YOUR JOURNEY TO DELE A1
            </span>
            <h2 className="font-serif text-[47px] tracking-[-1.5px] leading-[1.06] m-[19px_0_13px] text-[#304f3d] font-medium max-xl:text-[35px] max-xl:mt-[17px] max-lg:text-[45px] max-md:text-[41px] max-sm:text-[39px] max-sm:leading-[1.08]">
              Small steps.
              <br />A world of <em className="font-medium text-[#bb7553]">Spanish.</em>
            </h2>
            <p className="text-[13px] leading-[1.8] text-[#787d62] max-w-[280px] mb-[20px] max-xl:max-w-[250px] max-lg:text-[14px] max-md:text-[13px] max-sm:text-[12px] max-sm:max-w-[230px] max-sm:relative max-sm:z-[3]">
              Real-life Spanish, little wins, and a clear path to your first diploma.
            </p>
            <Button
              variant="primary"
              size="compact"
              className="max-sm:mt-[4px] max-sm:relative max-sm:z-[3]"
              onClick={() => setSession(nextLesson)}
            >
              {completed ? "Continue my journey" : "Let’s take the first step"}
              <Icon name="arrow" size={19} />
            </Button>
            <span className="flex items-center gap-[5px] mt-[12px] text-[10px] text-[#787d62] max-lg:text-[12px] max-md:text-[10px] max-sm:relative max-sm:z-[3] max-sm:max-w-[160px] max-sm:leading-[1.6]">
              <Icon name="clock" size={13} />
              {nextLesson.minutes} minutes is a lovely start
            </span>
          </div>
          <JourneyArt />
          <span className="absolute right-[26px] bottom-[17px] z-[2] text-[10px] tracking-[1.7px] text-[#a3a087] max-md:text-[9px] max-sm:hidden">
            POCO A POCO, PASO A PASO.
          </span>
        </section>
        <SectionHeading variant="path">
          <div>
            <Eyebrow variant="heading" className="mb-[6px]">
              A LITTLE STRUCTURE. A LOT OF POSSIBILITY.
            </Eyebrow>
            <h2 className="font-serif text-[27px] font-semibold tracking-[-0.7px] leading-[1.25]">
              Your learning path
            </h2>
          </div>
          <TextLink className="text-[13px]! max-sm:text-[11px]!" onClick={() => navigate("path")}>
            View full path
            <Icon name="arrow" size={16} />
          </TextLink>
        </SectionHeading>
        <div className="flex items-center gap-[12px] max-sm:gap-[8px] mb-[18px] text-[12px] max-sm:text-[11px] text-[#75816b]">
          <span className="whitespace-nowrap">
            <b className="font-medium text-[#536849]">{completed}</b> of {allLessons.length} lessons
            complete
          </span>
          <ProgressTrack percent={progressPercent} className="flex-1" />
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
          className={`${PRESSABLE} flex items-center justify-center w-full gap-[9px] border-0 bg-transparent p-[16px] max-sm:p-[14px_0] text-[13px] max-sm:text-[11px] text-[#8a977c] [&:hover]:text-green`}
          onClick={() => navigate("path")}
        >
          Home, cafés, adventures & 6 more chapters
          <Icon name="arrow" size={16} />
        </button>
        <SectionHeading>
          <h2 className="font-serif text-[27px] font-semibold tracking-[-0.7px] leading-[1.25]">
            A little change of pace
          </h2>
          <span className="text-[14px] text-[#75816b]">Make it yours</span>
        </SectionHeading>
        <QuickPractice mistakeCount={mistakeCount} practice={practice} />
      </div>
      <aside className="flex flex-col gap-[18px] max-lg:grid max-lg:grid-cols-[1fr_1fr] max-md:gap-[15px] max-sm:grid-cols-[1fr]">
        <DailyGoal progress={progress} openSettings={openSettings} />
        <SkillsPanel progress={progress} navigate={navigate} practice={practice} />
        <section className="p-[22px] xl:p-[24px] max-lg:p-[22px_28px] max-lg:col-span-full rounded-[12px] border border-[#eee1cd] bg-[#f3ebdd]">
          <Eyebrow variant="phrase">
            <Icon name="spark" size={14} /> A PHRASE FOR TODAY
          </Eyebrow>
          <h3
            lang="es"
            className="font-serif italic font-medium tracking-[-1px] text-[#906e4e] text-[29px] xl:text-[34px] mt-[19px] max-lg:mt-[12px]"
          >
            Poco a poco.
          </h3>
          <span className="block text-[12px] text-[#b49d7f] mt-[6px]">/ˈpo.ko a ˈpo.ko/</span>
          <p className="leading-[1.7] mt-[11px] text-[14px] text-[#8e7d61]">Little by little.</p>
          <div className="flex items-center justify-between mt-[8px] max-lg:justify-start max-lg:gap-[20px] [&_button]:h-[30px] [&_button]:w-[30px] [&_button]:rounded-[50%] [&_button]:border [&_button]:border-[#e7dcc2] [&_button]:bg-[#fcf7e9]! [&_button]:text-[#b6986f]">
            <span className="text-[11px] max-md:text-[13px] text-[#75816b]">
              Progress has its own pace.
            </span>
            <AudioButton compact text="Poco a poco." label="Listen to poco a poco" />
          </div>
        </section>
        <div className="flex justify-center items-center gap-[9px] p-[5px] text-[#a5ad97] max-lg:hidden">
          <Icon name="heart" size={16} className="text-[#bac3ac]" />
          <p className="text-[12px] leading-[1.8]">
            No rush. No lost hearts.
            <br />
            Just you, getting a little better.
          </p>
        </div>
      </aside>
    </div>
  </>
);
