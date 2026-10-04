import type { Skill } from "../data/types";

const COLOR: Record<Skill, string> = {
  reading: "bg-sage-400",
  listening: "bg-lavender-400",
  writing: "bg-sand-400",
  speaking: "bg-coral-500",
};

type Props = { skill: Skill };

export const SkillDot = ({ skill }: Props) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${COLOR[skill]}`} />
);
