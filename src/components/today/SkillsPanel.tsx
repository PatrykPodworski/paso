import { Panel, PanelHeading } from "../../design-system/Panel";
import { TextLink } from "../../design-system/TextLink";
import { skillStats } from "../../data/progress";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import type { Page } from "../navigation";
import { exerciseBank, skills, type Practice } from "../practice";

type Props = {
  progress: Progress;
  navigate: (target: Page) => void;
  practice: Practice;
};

export const SkillsPanel = ({ progress, navigate, practice }: Props) => (
  <Panel as="section" className="skills-panel">
    <PanelHeading title="A little of every skill">
      <Icon name="layers" size={17} />
    </PanelHeading>
    <p>Four ways to grow your Spanish.</p>
    {skills.map((s) => {
      const stats = skillStats(progress, s.id);
      const total = exerciseBank.filter((q) => q.skill === s.id).length;

      return (
        <button className="skill-row" key={s.id} onClick={() => practice(s.id)}>
          <span className={`skill-icon ${s.id}`}>
            <Icon name={s.icon} size={17} />
          </span>
          <span>
            <strong>
              {s.name}
              <small>{stats.practised} practised</small>
            </strong>
            <span className="progress-track">
              <span style={{ width: `${(stats.practised / total) * 100}%` }} />
            </span>
          </span>
          <Icon name="chevron" size={13} />
        </button>
      );
    })}
    <TextLink
      className="w-full justify-between border-t border-t-[#eef0e6] pt-[14px] text-[12px]! font-normal! text-[#8b9879]! max-laptop:text-[13px]! desktop:text-[12px]!"
      onClick={() => navigate("guide")}
    >
      How the exam works
      <Icon name="arrow" size={15} />
    </TextLink>
  </Panel>
);
