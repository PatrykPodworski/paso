import type { ComponentProps } from "react";

// One variant per context the old `.eyebrow` descendant rules styled, values copied as-is.
const VARIANT = {
  default: "block text-xs tracking-widest font-bold text-muted-foreground",
  greeting: "block text-2xs tracking-widest font-bold text-muted-foreground",
  page: "block text-xs max-md:text-2xs tracking-widest font-bold text-muted-foreground",
  heading: "block text-2xs tracking-widest font-bold text-muted-foreground",
  banner: "block text-2xs tracking-widest font-bold text-muted-foreground",
  checklist: "block text-2xs tracking-widest font-bold text-muted-foreground",
  small: "block text-2xs tracking-widest font-bold text-muted-foreground",
  phrase: "flex items-center gap-1.5 text-2xs tracking-widest font-bold text-muted-foreground",
  unit: "block text-2xs max-sm:leading-normal tracking-widest font-medium text-muted-foreground",
  pathUnit:
    "block text-2xs max-sm:leading-normal tracking-widest font-medium text-muted-foreground",
};

type Props = {
  variant?: keyof typeof VARIANT;
  /** Placement only — margin, grid placement. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"span">, "className">;

export const Eyebrow = ({ variant = "default", className = "", ...rest }: Props) => (
  <span className={`leading-relaxed ${VARIANT[variant]} ${className}`} {...rest} />
);
