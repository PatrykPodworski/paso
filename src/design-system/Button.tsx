import type { ComponentProps } from "react";
import { PRESSABLE } from "./pressable";

const BASE =
  "inline-flex justify-center items-center border gap-3 rounded-lg font-semibold leading-normal";

const VARIANT = {
  primary:
    "bg-green-900 border-transparent text-sand-50 shadow-[0_2px_3px_var(--color-green-950)]/6 enabled:hover:bg-green-950 enabled:hover:shadow-[0_4px_10px_var(--color-green-950)]/13",
  secondary: "bg-white border-sage-200 enabled:hover:bg-sage-100",
  danger: "text-coral-800 bg-coral-50 border-coral-300",
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
