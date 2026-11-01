import { Icon } from "../design-system/Icon";

type Props = { icon: string; sparkles?: boolean };

const SPARKLE = "text-2xl text-muted-foreground";

export const CompletionArt = ({ icon, sparkles = false }: Props) => (
  <div className="flex gap-6 items-center justify-center text-muted-foreground mt-0 mx-auto mb-5">
    {sparkles && <span className={`${SPARKLE} -translate-y-6`}>✦</span>}
    <Icon name={icon} className="text-success bg-success/10 w-24 h-24 p-5 rounded-full" />
    {sparkles && <span className={`${SPARKLE} translate-y-5`}>✧</span>}
  </div>
);
