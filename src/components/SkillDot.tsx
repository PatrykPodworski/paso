import type { Skill } from "../data/types";

const COLOR: Record<Skill, string> = {
  reading: "bg-[#adbc95]",
  listening: "bg-[#b4a6c2]",
  writing: "bg-[#cdb284]",
  speaking: "bg-[#d29a7e]",
};

type Props = { skill: Skill };

export const SkillDot = ({ skill }: Props) => (
  <span className={`inline-block w-[6px] h-[6px] rounded-full shrink-0 ${COLOR[skill]}`} />
);
