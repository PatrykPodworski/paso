import { Icon } from "../design-system/Icon";

type Props = { icon: string; sparkles?: boolean };

const SPARKLE = "text-2xl text-sand-400";

export const CompletionArt = ({ icon, sparkles = false }: Props) => (
  <div className="flex gap-6 items-center justify-center text-sand-500 mt-0 mx-auto mb-5">
    {sparkles && <span className={`${SPARKLE} -translate-y-6`}>✦</span>}
    <Icon name={icon} className="text-olive-500 bg-sage-100 w-24 h-24 p-5 rounded-full" />
    {sparkles && <span className={`${SPARKLE} translate-y-5`}>✧</span>}
  </div>
);
