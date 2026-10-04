import type { ComponentProps } from "react";

// `!` keeps the old `.field-note` !important: it beat every contextual `p` rule it sat in.
const BASE = "text-sm! leading-relaxed! text-sage-700!";

type Props = {
  /** Placement only — margin, border, grid placement. Never type or colour. */
  className?: string;
} & Omit<ComponentProps<"p">, "className">;

export const FieldNote = ({ className = "", ...rest }: Props) => (
  <p className={`${BASE} ${className}`} {...rest} />
);
