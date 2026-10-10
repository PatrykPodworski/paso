import { TONE } from "../tone";
import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { foundations, visualQuestions } from "../../data/curriculum";
import { formPractice } from "../../data/mock";
import { skillStats } from "../../data/progress";
import type { Progress, Skill } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { skills, SKILL_ICON, type Practice, type Session } from "../practice";

type Props = {
  progress: Progress;
  filter: Skill | "all";
  setSession: Session;
  practice: Practice;
};

const SETS = [
  {
    session: {
      id: "pictures",
      title: "Picture a little Spanish",
      subtitle: "Read the visual clues",
      minutes: 4,
      icon: "map",
      questions: visualQuestions,
    },
    tone: TONE.sage,
    name: "Picture this",
    note: "6 visual puzzles · cafés, trains & your neighborhood",
  },
  {
    session: {
      id: "foundations",
      title: "The little foundations",
      subtitle: "Sounds, numbers and patterns",
      minutes: 8,
      icon: "layers",
      questions: foundations,
    },
    tone: TONE.sand,
    name: "The foundation lab",
    note: "24 checks · sounds, spelling, numbers & patterns",
  },
  {
    session: {
      id: "form",
      title: "A form, a little Spanish",
      subtitle: "Writing task 1",
      minutes: 5,
      icon: "pen",
      questions: [formPractice],
    },
    tone: TONE.lavender,
    name: "Fill in your story",
    note: "A personal form · 15–25 words · exam task 1",
  },
];

export const SkillPractice = ({ progress, filter, setSession, practice }: Props) => (
  <>
    <Panel className="bg-sage-100! p-[30px_34px] max-lg:p-[27px] max-md:p-[24px] max-sm:p-[22px] flex justify-between gap-[20px] overflow-hidden">
      <div className="max-w-[520px]">
        <Eyebrow>A SMALL SESSION, CHOSEN FOR YOU</Eyebrow>
        <h2 className="font-serif font-semibold tracking-[-0.7px] leading-[1.25] text-[33px] max-lg:text-[29px] max-sm:text-[27px] m-[12px_0]">
          {filter === "all"
            ? "A little bit of everything."
            : filter === "listening"
              ? "Let Spanish find your ear."
              : filter === "speaking"
                ? "Your voice belongs here."
                : filter === "writing"
                  ? "Make a little room for your words."
                  : "Find the meaning in the details."}
        </h2>
        <p className="leading-[1.7] text-[14px] text-sage-600 max-w-[420px] mb-[21px]">
          Fresh questions come first. Revisit the ones you’ve seen as your confidence grows.
        </p>
        <Button variant="primary" onClick={() => practice(filter)}>
          Start {filter === "all" ? "my daily mix" : `${filter} practice`}
          <Icon name="arrow" />
        </Button>
      </div>
      <div className="h-[164px] w-[164px] max-lg:h-[125px] max-lg:w-[125px] bg-sage-200 rounded-full text-olive-600 flex max-md:hidden flex-col items-center justify-center m-[0_24px] max-lg:m-[15px_0] relative shrink-0">
        <Icon
          name={skills.find((s) => s.id === filter)?.icon || "spark"}
          size={64}
          className="max-lg:w-[45px] max-lg:h-[45px]"
        />
        <i className="font-serif text-[22px] max-lg:text-[17px] bg-sand-50 p-[4px_14px] rounded-[7px] transform-[rotate(-10deg)] mt-[16px] text-sand-600">
          ¡Tú puedes!
        </i>
      </div>
    </Panel>
    <div className="grid grid-cols-[repeat(4,1fr)] max-lg:grid-cols-[1fr_1fr] gap-[15px] max-md:gap-[13px] mt-[22px]">
      {skills
        .filter((s) => filter === "all" || filter === s.id)
        .map((s) => {
          const stats = skillStats(progress, s.id);

          return (
            <Panel
              as="button"
              key={s.id}
              className="text-left p-[23px] max-xl:p-[20px_15px] max-sm:p-[19px_14px] relative hover:transform-[translateY(-2px)] hover:border-sage-300"
              onClick={() => practice(s.id)}
            >
              <span className={`${SKILL_ICON} w-[45px] h-[45px] mb-[17px] ${s.tint}`}>
                <Icon name={s.icon} size={24} />
              </span>
              <Eyebrow variant="small">{s.spanish}</Eyebrow>
              <h3 className="font-semibold tracking-[-0.3px] text-[18px] max-md:text-[17px] max-sm:text-[18px] mt-[4px]">
                {s.name}
              </h3>
              <p className="leading-[1.7] text-[13px] max-sm:text-[12px] text-sage-500 m-[10px_0]">
                {stats.practised} questions practised
              </p>
              <span className="text-[11px] max-xl:text-[10px] max-lg:text-[12px] max-md:text-[11px] max-sm:text-[10px] text-sage-400">
                {stats.accuracy === null
                  ? "A lovely place to start"
                  : `${stats.accuracy}% unassisted objective accuracy`}
              </span>
              <Icon
                name="arrow"
                size={19}
                className="absolute right-[20px] top-[35px] text-sage-400"
              />
            </Panel>
          );
        })}
    </div>
    <div className="grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] gap-[16px] mt-[20px]">
      {SETS.map(({ session, tone, name, note }) => (
        <Panel
          as="button"
          key={session.id}
          className="flex items-center gap-[15px] max-sm:gap-[11px] p-[20px] max-xl:p-[17px_13px] text-left"
          onClick={() => setSession(session)}
        >
          <span
            className={`h-[47px] w-[47px] rounded-[12px] flex items-center justify-center shrink-0 max-sm:w-[35px] max-sm:h-[39px] ${tone}`}
          >
            <Icon name={session.icon} />
          </span>
          <div>
            <h3 className="text-[15px] max-xl:text-[14px] max-lg:text-[16px] max-sm:text-[15px] font-semibold tracking-[-0.3px]">
              {name}
            </h3>
            <p className="leading-[1.7] text-[12px] max-xl:text-[11px] max-lg:text-[13px] max-sm:text-[11px] text-sage-500 mt-[5px]">
              {note}
            </p>
          </div>
          <Icon name="arrow" className="ml-auto text-sage-500 w-[17px] max-sm:w-[15px]" />
        </Panel>
      ))}
    </div>
  </>
);
