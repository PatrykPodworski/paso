import { TONE } from "./tone";
import { FieldNote } from "../design-system/FieldNote";
import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { PageHeading } from "../design-system/PageHeading";
import { Panel } from "../design-system/Panel";
import { allLessons, allQuestions, units } from "../data/curriculum";
import type { Lesson, Progress } from "../data/types";
import { Stamp } from "./Art";
import { Icon } from "../design-system/Icon";
import type { Page } from "./navigation";
import type { Session } from "./practice";
import { UnitCard } from "./UnitCard";

const PATH_NUMBER =
  "flex items-center justify-center shrink-0 rounded-full border border-[#dbe3d1] mt-[26px] w-[31px] h-[31px] text-[12px] max-tablet:w-[27px] max-tablet:h-[27px] max-tablet:text-[11px]";

type Props = {
  progress: Progress;
  nextLesson: Lesson;
  completed: number;
  progressPercent: number;
  expanded: string;
  setExpanded: (id: string) => void;
  setSession: Session;
  navigate: (target: Page) => void;
};

export const PathPage = ({
  progress,
  nextLesson,
  completed,
  progressPercent,
  expanded,
  setExpanded,
  setSession,
  navigate,
}: Props) => {
  const nextUnit = units.find((u) => u.lessons.some((l) => l.id === nextLesson.id))!;

  return (
    <>
      <PageHeading
        eyebrow={
          <Eyebrow variant="page" className="mb-[9px]">
            FROM YOUR FIRST HOLA TO YOUR A1
          </Eyebrow>
        }
        title="Every step has a story."
        description={
          <>
            {units.length} units · {allLessons.length} lessons · {allQuestions.length} exercises.
            Explore freely, or follow the path.
          </>
        }
      >
        <Stamp />
      </PageHeading>
      <Panel className="flex items-center gap-[18px] max-tablet:gap-[13px] mb-[30px] p-[23px_25px] max-tablet:p-[20px] max-laptop:flex-wrap">
        <span
          className={`flex items-center justify-center shrink-0 rounded-[12px] w-[47px] h-[47px] max-desktop:w-[40px] max-desktop:h-[43px] max-tablet:w-[43px] max-tablet:h-[45px] max-phone:w-[34px] max-phone:h-[37px] ${TONE[nextUnit.color]}`}
        >
          <Icon name={nextUnit.icon} size={28} />
        </span>
        <div className="flex-1 max-laptop:min-w-[250px] max-tablet:min-w-[200px] max-phone:min-w-[160px]">
          <Eyebrow variant="banner" className="mb-[7px]">
            YOUR NEXT SMALL STEP
          </Eyebrow>
          <h3 className="font-semibold tracking-[-0.3px] text-[17px] max-desktop:text-[15px] max-phone:text-[14px]">
            {nextUnit.title} · {nextLesson.title}
          </h3>
          <p className="leading-[1.7] mt-[6px] text-[14px] text-[#8e9b7f]">
            {completed}/{allLessons.length} complete · {progressPercent}% of your path
          </p>
        </div>
        <Button
          variant="primary"
          className="tablet:max-laptop:ml-[65px]"
          onClick={() => setSession(nextLesson)}
        >
          Continue learning
          <Icon name="arrow" />
        </Button>
      </Panel>
      <div className="grid grid-cols-[minmax(0,1fr)_262px] gap-[27px] max-desktop:grid-cols-[minmax(0,1fr)_230px] max-desktop:gap-[20px] max-laptop:grid-cols-[1fr]">
        <div className="relative before:content-[''] before:absolute before:top-[20px] before:bottom-[65px] before:left-[15px] max-tablet:before:left-[13px] before:border-l before:border-dashed before:border-[#cfdac3]">
          {units.map((u, i) => (
            <div
              className="relative flex items-start gap-[18px] max-tablet:gap-[11px] mb-[18px]"
              key={u.id}
            >
              <span
                className={`${PATH_NUMBER} ${u.lessons.every((l) => progress.completed[l.id]) ? "bg-[#789363] text-[#fff]" : "bg-[#f2f5ec] text-[#94a37e]"}`}
              >
                {u.lessons.every((l) => progress.completed[l.id]) ? (
                  <Icon name="check" size={16} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <UnitCard
                onPath
                unit={u}
                index={i}
                progress={progress}
                start={setSession}
                expanded={expanded === u.id}
                onExpand={() => setExpanded(expanded === u.id ? "" : u.id)}
              />
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-[15px] max-tablet:gap-[12px] mt-[28px] ml-[50px] max-tablet:ml-[38px] p-[24px] max-tablet:p-[20px] max-phone:p-[19px] rounded-[12px] bg-[#eaf0e2] text-[#6f8a56]">
            <Icon name="flag" size={28} />
            <div>
              <h3 className="font-semibold tracking-[-0.3px] font-serif text-[21px] max-tablet:text-[20px]">
                The next chapter is yours.
              </h3>
              <p className="leading-[1.7] mt-[5px] text-[13px]">
                Put your skills together in the exam rehearsal.
              </p>
            </div>
            <Button
              variant="primary"
              size="small"
              className="tablet:ml-auto"
              onClick={() => navigate("exam")}
            >
              Meet the exam
              <Icon name="arrow" />
            </Button>
          </div>
        </div>
        <Panel
          as="aside"
          className="p-[26px] self-start sticky top-[20px] max-laptop:static max-laptop:grid max-laptop:grid-cols-[1fr_1fr] max-laptop:gap-[20px] max-phone:grid-cols-[1fr]"
        >
          <Eyebrow className="max-laptop:col-span-full">HOW YOUR PATH WORKS</Eyebrow>
          <h3 className="tracking-[-0.3px] font-serif font-medium leading-[1.3] text-[26px] max-phone:text-[25px] m-[12px_0_24px] max-laptop:m-0 max-laptop:col-span-full">
            Learn it. Try it.
            <br />
            Make it yours.
          </h3>
          {[
            ["spark", "Discover the words", "Connect Spanish words with meaning and sound."],
            ["layers", "Understand the pattern", "Learn the why behind each answer."],
            ["headphones", "Meet real life", "Read a message. Listen to a conversation."],
            ["mic", "Use your own voice", "Write, record and reflect on your progress."],
          ].map(([icon, title, body]) => (
            <div key={title} className="flex gap-[12px] mb-[23px] max-laptop:mb-0 text-[#869576]">
              <Icon name={icon} size={20} />
              <section>
                <h4 className="font-semibold text-[14px] text-[#647455]">{title}</h4>
                <p className="leading-[1.7] mt-[6px] text-[14px]">{body}</p>
              </section>
            </div>
          ))}
          <FieldNote className="mt-[6px] max-laptop:col-span-full">
            All lessons are open. Completion tracks practice, not exam readiness. Review mistakes
            and use the A1 checklist to find gaps.
          </FieldNote>
        </Panel>
      </div>
    </>
  );
};
