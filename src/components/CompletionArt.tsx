import type { ReactNode } from "react";

type Props = { children: ReactNode };

export const CompletionArt = ({ children }: Props) => (
  <div className="flex gap-[25px] items-center justify-center text-[#b7a473] m-[0_auto_22px] [&>svg]:text-[#8fa473] [&>svg]:bg-[#f0f2e1] [&>svg]:w-[96px] [&>svg]:h-[96px] [&>svg]:p-[22px] [&>svg]:rounded-full [&>span]:text-[27px] [&>span]:text-[#c9af73]">
    {children}
  </div>
);
