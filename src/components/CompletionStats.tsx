import type { ReactNode } from "react";

type Props = { stats: [label: string, value: ReactNode][] };

export const CompletionStats = ({ stats }: Props) => (
  <dl className="flex justify-center gap-11 max-md:gap-6 max-sm:gap-5 my-7 mx-0 p-5 max-md:py-5 max-md:px-0 border-y border-border">
    {stats.map(([label, value]) => (
      <div key={label} className="flex flex-col-reverse">
        <dt className="text-xs max-md:text-2xs mt-1.5 text-muted-foreground">{label}</dt>
        <dd className="font-heading text-3xl text-foreground font-medium">{value}</dd>
      </div>
    ))}
  </dl>
);
