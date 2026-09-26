import type { ComponentProps } from "react";

const BASE =
  "inline-flex justify-center items-center border border-transparent gap-3 rounded-lg font-semibold leading-normal";

const VARIANT = {
  primary:
    "bg-green text-[#fffdf4] shadow-[0_2px_3px_#223c3010] [&:hover:not(:disabled)]:bg-[#193e2e] [&:hover:not(:disabled)]:shadow-[0_4px_10px_#223c3020]",
  secondary: "bg-paper border-[#d9dfd4] [&:hover:not(:disabled)]:bg-[#eff3e9]",
  danger: "text-[#a14031] bg-[#fff0e8] border-[#e7c9bc]",
};

// An unconditional base value plus max-width overrides, mirroring the CSS this replaces.
// Disjoint min/max pairs would leave 430 < w < 431 matching neither, which a 125% zoom
// reaches: the property then falls back to the browser default.
const SIZE = {
  // 15px sits between text-sm and text-base; kept so every default button in the app keeps its size.
  default: "px-5 py-3 min-h-11 text-[0.9375rem] [@media(max-width:430px)]:text-sm",
  compact: "px-4 py-2.5 min-h-11 text-sm",
  small: "px-3 py-2 min-h-9.5 text-sm",
};

type Props = {
  variant: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  /** Placement only — margin, width, flex, white-space. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"button">, "className">;

export const Button = ({
  variant,
  size = "default",
  className = "",
  ...rest
}: Props) => (
  <button
    className={`${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    {...rest}
  />
);
