import { Panel, PanelHeading } from "../../design-system/Panel";
import { TextLink } from "../../design-system/TextLink";
import { ProgressTrack } from "../../design-system/ProgressTrack";
import { skillStats } from "../../data/progress";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import type { Page } from "../navigation";
import { exerciseBank, skills, SKILL_ICON, SKILL_ICON_SIZE, type Practice } from "../practice";
import { PRESSABLE } from "../../design-system/pressable";

type Props = {
  progress: Progress;
  navigate: (target: Page) => void;
  practice: Practice;
};

const SKILL_ROW =
  "flex items-center w-full p-0 border-0 bg-transparent text-left gap-2.5 max-xl:gap-1.5 max-lg:gap-3 max-md:gap-2 mb-6 max-xl:mb-4 max-lg:mb-5";

export const SkillsPanel = ({ progress, navigate, practice }: Props) => (
  <Panel
    as="section"
    className="py-6 px-5 max-xl:py-4 max-xl:px-3.5 max-md:py-5 max-md:px-3.5 max-sm:p-6"
  >
    <PanelHeading title="A little of every skill" icon="layers" />
    <p className="leading-relaxed mt-1.5 mb-5 text-sage-700 text-xs max-md:text-2xs">
      Four ways to grow your Spanish.
    </p>
    {skills.map((s) => {
      const stats = skillStats(progress, s.id);
      const total = exerciseBank.filter((q) => q.skill === s.id).length;

      return (
        <button className={`${PRESSABLE} ${SKILL_ROW}`} key={s.id} onClick={() => practice(s.id)}>
          <span className={`${SKILL_ICON} ${SKILL_ICON_SIZE} ${s.tint}`}>
            <Icon name={s.icon} size={17} />
          </span>
          <span className="flex-1">
            <strong className="flex justify-between font-medium text-sage-700 text-xs max-xl:text-2xs max-lg:text-sm max-md:text-xs">
              {s.name}
              <small className="font-normal text-sage-600 text-2xs">
                {stats.practised} practised
              </small>
            </strong>
            <ProgressTrack value={stats.practised} max={total} className="mt-1.5" />
          </span>
          <Icon name="chevron" size={13} className="text-sage-400 max-xl:hidden" />
        </button>
      );
    })}
    <TextLink
      className="w-full justify-between border-t border-t-sage-100 pt-3.5 text-xs! font-normal! text-sage-600! max-lg:text-xs! xl:text-xs!"
      onClick={() => navigate("guide")}
    >
      How the exam works
      <Icon name="arrow" size={15} />
    </TextLink>
  </Panel>
);
