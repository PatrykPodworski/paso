import type { ComponentProps } from "react";

// One variant per context the old `.eyebrow` descendant rules styled, values copied as-is.
const VARIANT = {
  default: "block text-xs tracking-widest font-bold text-sage-600",
  greeting: "block text-2xs tracking-widest font-bold text-sand-600",
  page: "block text-xs max-md:text-2xs tracking-widest font-bold text-sage-600",
  heading: "block text-2xs tracking-widest font-bold text-sage-600",
  banner: "block text-2xs tracking-widest font-bold text-sage-600",
  checklist: "block text-2xs tracking-widest font-bold text-sage-600",
  small: "block text-2xs tracking-widest font-bold text-sage-600",
  phrase: "flex items-center gap-1.5 text-2xs tracking-widest font-bold text-sand-500",
  unit: "block text-2xs max-sm:leading-normal tracking-widest font-medium text-sage-500",
  pathUnit: "block text-2xs max-sm:leading-normal tracking-widest font-medium text-sage-500",
};

type Props = {
  variant?: keyof typeof VARIANT;
  /** Placement only — margin, grid placement. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"span">, "className">;

export const Eyebrow = ({ variant = "default", className = "", ...rest }: Props) => (
  <span className={`leading-relaxed ${VARIANT[variant]} ${className}`} {...rest} />
);
