import type { ComponentProps } from "react";
import { PRESSABLE } from "./pressable";

const BASE =
  "inline-flex justify-center items-center border gap-3 rounded-lg font-semibold leading-normal";

const VARIANT = {
  primary:
    "bg-green-900 border-transparent text-[#fffdf4] shadow-[0_2px_3px_#223c3010] enabled:hover:bg-[#193e2e] enabled:hover:shadow-[0_4px_10px_#223c3020]",
  secondary: "bg-white border-[#d9dfd4] enabled:hover:bg-[#eff3e9]",
  danger: "text-[#a14031] bg-[#fff0e8] border-[#e7c9bc]",
};

const SIZE = {
  default: "px-5 py-3 min-h-11 text-sm",
  compact: "px-4 py-2.5 min-h-11 text-sm",
  small: "px-3 py-2 min-h-9.5 text-sm",
};

type Props = {
  variant: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  /** Placement only — margin, width, flex, white-space. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"button">, "className">;

export const Button = ({ variant, size = "default", className = "", ...rest }: Props) => (
  <button
    className={`${PRESSABLE} ${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    {...rest}
  />
);
