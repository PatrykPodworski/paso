import type { Skill } from "../data/types";

const COLOR: Record<Skill, string> = {
  reading: "bg-skill-reading",
  listening: "bg-skill-listening",
  writing: "bg-skill-writing",
  speaking: "bg-skill-speaking",
};

type Props = { skill: Skill };

export const SkillDot = ({ skill }: Props) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${COLOR[skill]}`} />
);
