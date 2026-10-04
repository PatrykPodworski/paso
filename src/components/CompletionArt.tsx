import { Icon } from "../design-system/Icon";

type Props = { icon: string; sparkles?: boolean };

const SPARKLE = "text-[27px] text-[#c9af73]";

export const CompletionArt = ({ icon, sparkles = false }: Props) => (
  <div className="flex gap-[25px] items-center justify-center text-[#b7a473] m-[0_auto_22px]">
    {sparkles && <span className={`${SPARKLE} translate-y-[-23px]`}>✦</span>}
    <Icon
      name={icon}
      className="text-[#8fa473] bg-[#f0f2e1] w-[96px] h-[96px] p-[22px] rounded-full"
    />
    {sparkles && <span className={`${SPARKLE} translate-y-[19px]`}>✧</span>}
  </div>
);
