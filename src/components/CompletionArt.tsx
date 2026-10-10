import { Icon } from "../design-system/Icon";

type Props = { icon: string; sparkles?: boolean };

const SPARKLE = "text-[27px] text-sand-400";

export const CompletionArt = ({ icon, sparkles = false }: Props) => (
  <div className="flex gap-[25px] items-center justify-center text-sand-500 m-[0_auto_22px]">
    {sparkles && <span className={`${SPARKLE} translate-y-[-23px]`}>✦</span>}
    <Icon
      name={icon}
      className="text-olive-500 bg-sage-100 w-[96px] h-[96px] p-[22px] rounded-full"
    />
    {sparkles && <span className={`${SPARKLE} translate-y-[19px]`}>✧</span>}
  </div>
);
