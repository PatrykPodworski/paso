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
  "flex items-center w-full p-0 border-0 bg-transparent text-left gap-[11px] max-xl:gap-[7px] max-lg:gap-[12px] max-md:gap-[8px] mb-[23px] max-xl:mb-[18px] max-lg:mb-[20px]";

export const SkillsPanel = ({ progress, navigate, practice }: Props) => (
  <Panel
    as="section"
    className="p-[23px_20px] max-xl:p-[18px_15px] max-md:p-[21px_15px] max-sm:p-[23px]"
  >
    <PanelHeading title="A little of every skill">
      <Icon name="layers" size={17} />
    </PanelHeading>
    <p className="leading-[1.7] mt-[7px] mb-[21px] text-[#75816b] text-[12px] max-lg:text-[13px] max-md:text-[11px]">
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
            <strong className="flex justify-between font-medium text-[#667958] text-[12px] max-xl:text-[11px] max-lg:text-[14px] max-md:text-[12px]">
              {s.name}
              <small className="font-normal text-[#81906e] text-[10px] max-lg:text-[11px] max-md:text-[9px]">
                {stats.practised} practised
              </small>
            </strong>
            <ProgressTrack percent={(stats.practised / total) * 100} className="mt-[7px]" />
          </span>
          <Icon name="chevron" size={13} className="text-[#a2ad91] max-xl:hidden" />
        </button>
      );
    })}
    <TextLink
      className="w-full justify-between border-t border-t-[#eef0e6] pt-[14px] text-[12px]! font-normal! text-[#8b9879]! max-lg:text-[13px]! xl:text-[12px]!"
      onClick={() => navigate("guide")}
    >
      How the exam works
      <Icon name="arrow" size={15} />
    </TextLink>
  </Panel>
);
