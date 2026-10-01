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

export const SkillPractice = ({ progress, filter, setSession, practice }: Props) => (
  <>
    <Panel className="bg-[#f1f0e4]! p-[30px_34px] max-lg:p-[27px] max-md:p-[24px] max-sm:p-[22px] flex justify-between gap-[20px] overflow-hidden">
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
        <p className="leading-[1.7] text-[14px] text-[#8f967c] max-w-[420px] mb-[21px]">
          Fresh questions come first. Revisit the ones you’ve seen as your confidence grows.
        </p>
        <Button variant="primary" onClick={() => practice(filter)}>
          Start {filter === "all" ? "my daily mix" : `${filter} practice`}
          <Icon name="arrow" />
        </Button>
      </div>
      <div className="h-[164px] w-[164px] max-lg:h-[125px] max-lg:w-[125px] bg-[#e0e6d2] rounded-full text-[#869b69] flex max-md:hidden flex-col items-center justify-center m-[0_24px] max-lg:m-[15px_0] relative shrink-0">
        <Icon
          name={skills.find((s) => s.id === filter)?.icon || "spark"}
          size={64}
          className="max-lg:w-[45px] max-lg:h-[45px]"
        />
        <i className="font-serif text-[22px] max-lg:text-[17px] bg-[#fff7e9] p-[4px_14px] rounded-[7px] transform-[rotate(-10deg)] mt-[16px] text-[#aa835b]">
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
              className="text-left p-[23px] max-xl:p-[20px_15px] max-sm:p-[19px_14px] relative [&:hover]:transform-[translateY(-2px)] [&:hover]:border-[#c4d2b6] [&_.skill-icon]:w-[45px] [&_.skill-icon]:h-[45px] [&_.skill-icon]:mb-[17px]"
              onClick={() => practice(s.id)}
            >
              <span className={`${SKILL_ICON} w-[45px] h-[45px] mb-[17px] ${s.tint}`}>
                <Icon name={s.icon} size={24} />
              </span>
              <Eyebrow variant="small">{s.spanish}</Eyebrow>
              <h3 className="font-semibold tracking-[-0.3px] text-[18px] max-md:text-[17px] max-sm:text-[18px] mt-[4px]">
                {s.name}
              </h3>
              <p className="leading-[1.7] text-[13px] max-sm:text-[12px] text-[#96a184] m-[10px_0]">
                {stats.practised} questions practised
              </p>
              <span className="text-[11px] max-xl:text-[10px] max-lg:text-[12px] max-md:text-[11px] max-sm:text-[10px] text-[#9ca88b]">
                {stats.accuracy === null
                  ? "A lovely place to start"
                  : `${stats.accuracy}% unassisted objective accuracy`}
              </span>
              <Icon
                name="arrow"
                size={19}
                className="absolute right-[20px] top-[35px] text-[#a2ad91]"
              />
            </Panel>
          );
        })}
    </div>
    <div className="grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] gap-[16px] mt-[20px] [&>button]:flex [&>button]:items-center [&>button]:gap-[15px] max-sm:[&>button]:gap-[11px] [&>button]:p-[20px] max-xl:[&>button]:p-[17px_13px] [&>button]:text-left [&_h3]:text-[15px] max-xl:[&_h3]:text-[14px] max-lg:[&_h3]:text-[16px] max-sm:[&_h3]:text-[15px] [&_p]:text-[12px] max-xl:[&_p]:text-[11px] max-lg:[&_p]:text-[13px] max-sm:[&_p]:text-[11px] [&_p]:text-[#939d86] [&_p]:mt-[5px] [&>button>svg]:ml-auto [&>button>svg]:text-[#99a589] [&>button>svg]:w-[17px] max-sm:[&>button>svg]:w-[15px] max-sm:[&_.quick-icon]:w-[35px] max-sm:[&_.quick-icon]:h-[39px]">
      <Panel
        as="button"
        onClick={() =>
          setSession({
            id: "pictures",
            title: "Picture a little Spanish",
            subtitle: "Read the visual clues",
            minutes: 4,
            icon: "map",
            questions: visualQuestions,
          })
        }
      >
        <span
          className={`h-[47px] w-[47px] rounded-[12px] flex items-center justify-center shrink-0 max-sm:w-[35px] max-sm:h-[39px] ${TONE.sage}`}
        >
          <Icon name="map" />
        </span>
        <div>
          <h3 className="text-[17px] font-semibold tracking-[-0.3px]">Picture this</h3>
          <p className="leading-[1.7]">6 visual puzzles · cafés, trains & your neighborhood</p>
        </div>
        <Icon name="arrow" />
      </Panel>
      <Panel
        as="button"
        onClick={() =>
          setSession({
            id: "foundations",
            title: "The little foundations",
            subtitle: "Sounds, numbers and patterns",
            minutes: 8,
            icon: "layers",
            questions: foundations,
          })
        }
      >
        <span
          className={`h-[47px] w-[47px] rounded-[12px] flex items-center justify-center shrink-0 max-sm:w-[35px] max-sm:h-[39px] ${TONE.sand}`}
        >
          <Icon name="layers" />
        </span>
        <div>
          <h3 className="text-[17px] font-semibold tracking-[-0.3px]">The foundation lab</h3>
          <p className="leading-[1.7]">24 checks · sounds, spelling, numbers & patterns</p>
        </div>
        <Icon name="arrow" />
      </Panel>
      <Panel
        as="button"
        onClick={() =>
          setSession({
            id: "form",
            title: "A form, a little Spanish",
            subtitle: "Writing task 1",
            minutes: 5,
            icon: "pen",
            questions: [formPractice],
          })
        }
      >
        <span
          className={`h-[47px] w-[47px] rounded-[12px] flex items-center justify-center shrink-0 max-sm:w-[35px] max-sm:h-[39px] ${TONE.lavender}`}
        >
          <Icon name="pen" />
        </span>
        <div>
          <h3 className="text-[17px] font-semibold tracking-[-0.3px]">Fill in your story</h3>
          <p className="leading-[1.7]">A personal form · 15–25 words · exam task 1</p>
        </div>
        <Icon name="arrow" />
      </Panel>
    </div>
  </>
);
