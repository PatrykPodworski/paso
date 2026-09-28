import type { ComponentProps } from "react";

// One variant per context the old `.eyebrow` descendant rules styled, values copied as-is.
const VARIANT = {
  default: "block text-[12px] tracking-[1.6px] font-bold text-[#818879]",
  page: "block text-[12px] max-tablet:text-[11px] tracking-[1.6px] font-bold text-[#818879]",
  heading:
    "block text-[10px] tracking-[1.4px] max-phone:text-[8px] max-phone:tracking-[0.9px] font-bold text-[#818879]",
  banner: "block text-[11px] max-phone:text-[10px] tracking-[1.6px] font-bold text-[#818879]",
  checklist: "block text-[11px] tracking-[1.6px] font-bold text-[#818879]",
  small: "block text-[10px] tracking-[1.6px] font-bold text-[#818879]",
  phrase:
    "flex items-center gap-[6px] text-[10px] desktop:text-[9px] tracking-[1.1px] font-bold text-[#b19673]",
  unit: "block text-[10px] max-laptop:text-[11px] max-tablet:text-[9px] max-phone:leading-[1.5] tracking-[1px] font-medium text-[#8c9980] [&>i]:not-italic [&>i]:px-[5px]",
  pathUnit:
    "block text-[10px] max-laptop:text-[11px] max-tablet:text-[10px] max-phone:text-[8px] max-phone:leading-[1.5] tracking-[1px] font-medium text-[#8c9980] [&>i]:not-italic [&>i]:px-[5px]",
};

type Props = {
  variant?: keyof typeof VARIANT;
  /** Placement only — margin, grid placement. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"span">, "className">;

export const Eyebrow = ({ variant = "default", className = "", ...rest }: Props) => (
  <span className={`leading-[1.6] ${VARIANT[variant]} ${className}`} {...rest} />
);
