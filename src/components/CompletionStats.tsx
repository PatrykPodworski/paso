import type { ReactNode } from "react";

type Props = { stats: [label: string, value: ReactNode][] };

export const CompletionStats = ({ stats }: Props) => (
  <dl className="flex justify-center gap-[45px] max-md:gap-[25px] max-sm:gap-[20px] m-[30px_0] p-[22px] max-md:p-[20px_0] border-y border-sage-200">
    {stats.map(([label, value]) => (
      <div key={label} className="flex flex-col-reverse">
        <dt className="text-[12px] max-md:text-[11px] max-sm:text-[10px] mt-[6px] text-[#a0ad8b]">
          {label}
        </dt>
        <dd className="font-serif text-[32px] max-md:text-[29px] text-[#82986a] font-medium">
          {value}
        </dd>
      </div>
    ))}
  </dl>
);
