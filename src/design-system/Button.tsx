import type { ComponentProps } from "react";

const BASE =
  "inline-flex justify-center items-center border border-transparent rounded-[8px] font-semibold leading-[1.5]";

const VARIANT = {
  primary:
    "bg-[var(--green)] text-[#fffdf4] shadow-[0_2px_3px_#223c3010] [&:hover:not(:disabled)]:bg-[#193e2e] [&:hover:not(:disabled)]:shadow-[0_4px_10px_#223c3020]",
  secondary: "bg-[var(--paper)] border-[#d9dfd4] [&:hover:not(:disabled)]:bg-[#eff3e9]",
  danger: "text-[#a14031] bg-[#fff0e8] border-[#e7c9bc]",
};

// An unconditional base value plus max-width overrides, mirroring the CSS this replaces.
// Disjoint min/max pairs would leave 430 < w < 431 matching neither, which a 125% zoom
// reaches: the property then falls back to the browser default.
const SIZE = {
  default: "gap-[12px] px-[20px] py-[13px] min-h-[44px] text-[15px] [@media(max-width:430px)]:text-[14px]",
  small: "gap-[12px] px-[13px] py-[8px] min-h-[38px] text-[14px]",
};


type Props = {
  variant: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  /** Replaces the size utilities rather than adding to them; see CONTEXT_SIZE. */
  sizeClasses?: string;
  /** Placement only — margin, width, flex, white-space. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"button">, "className">;

export const Button = ({
  variant,
  size = "default",
  sizeClasses,
  className = "",
  ...rest
}: Props) => (
  <button
    className={`${BASE} ${VARIANT[variant]} ${sizeClasses ?? SIZE[size]} ${className}`}
    {...rest}
  />
);
