import type { HTMLAttributes } from "react";

type Props = {
  /** Placement only — margin and justification. */
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className">;

export const ButtonRow = ({ className = "", ...rest }: Props) => (
  <div className={`flex flex-wrap items-center gap-3 ${className}`} {...rest} />
);
