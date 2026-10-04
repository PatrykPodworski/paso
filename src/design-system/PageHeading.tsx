import type { ReactNode } from "react";

const TITLE_SIZE = {
  default: "text-[36px] max-md:text-[30px] max-sm:text-[28px]",
  today: "text-[33px] max-xl:text-[28px] max-md:text-[29px] max-sm:text-[26px]",
};

type Props = {
  variant?: keyof typeof TITLE_SIZE;
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  /** Right-hand element: a badge, a stamp, a chip. */
  children?: ReactNode;
  /** Placement only. Never sizing or colour. */
  className?: string;
};

export const PageHeading = ({
  variant = "default",
  eyebrow,
  title,
  description,
  children,
  className = "",
}: Props) => (
  <div
    className={`flex items-center justify-between gap-6 mb-[29px] max-md:gap-[15px] max-md:mb-6 ${className}`}
  >
    <div>
      {eyebrow}
      <h1
        className={`font-serif font-semibold tracking-[-1.3px] leading-[1.2] ${TITLE_SIZE[variant]}`}
      >
        {title}
      </h1>
      <p className="leading-[1.7] mt-[9px] text-[14px] text-[#75816b]">{description}</p>
    </div>
    {children}
  </div>
);
