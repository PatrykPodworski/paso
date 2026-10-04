import type { ReactNode } from "react";

type Props = { stats: [label: string, value: ReactNode][] };

export const CompletionStats = ({ stats }: Props) => (
  <dl className="flex justify-center gap-11 max-md:gap-6 max-sm:gap-5 my-7 mx-0 p-5 max-md:py-5 max-md:px-0 border-y border-sage-200">
    {stats.map(([label, value]) => (
      <div key={label} className="flex flex-col-reverse">
        <dt className="text-xs max-md:text-2xs mt-1.5 text-sage-400">{label}</dt>
        <dd className="font-serif text-3xl text-olive-600 font-medium">{value}</dd>
      </div>
    ))}
  </dl>
);
