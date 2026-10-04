import type { ReactNode } from "react";

const TITLE_SIZE = {
  default: "text-4xl max-md:text-3xl",
  today: "text-3xl max-sm:text-2xl",
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
    className={`flex items-center justify-between gap-6 mb-7 max-md:gap-3.5 max-md:mb-6 ${className}`}
  >
    <div>
      {eyebrow}
      <h1
        className={`font-serif font-semibold tracking-tighter leading-tight ${TITLE_SIZE[variant]}`}
      >
        {title}
      </h1>
      <p className="leading-relaxed mt-2 text-sm text-sage-700">{description}</p>
    </div>
    {children}
  </div>
);
