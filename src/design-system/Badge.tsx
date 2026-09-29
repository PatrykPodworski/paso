import type { ComponentProps } from "react";

type Props = {
  /** Placement only — visibility, margin. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"span">, "className">;

export const Badge = ({ className = "", ...rest }: Props) => (
  <span
    className={`inline-flex items-center gap-[7px] whitespace-nowrap rounded-[20px] border border-[#dde3d7] bg-[#fdfef9] px-[13px] py-[8px] text-[14px] ${className}`}
    {...rest}
  />
);
