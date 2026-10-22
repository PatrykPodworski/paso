import type { ComponentProps } from "react";

type Props = {
  /** Placement only — visibility, margin. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"span">, "className">;

export const Badge = ({ className = "", ...rest }: Props) => (
  <span
    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-2xl border border-sage-200 bg-white px-3 py-2 text-sm ${className}`}
    {...rest}
  />
);
