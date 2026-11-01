import type { ComponentProps } from "react";
import { PRESSABLE } from "./pressable";

const BASE =
  "inline-flex justify-center items-center border gap-3 rounded-lg font-semibold leading-normal";

const VARIANT = {
  primary:
    "bg-primary border-transparent text-primary-foreground shadow-sm enabled:hover:bg-primary/80 enabled:hover:shadow-md",
  secondary: "bg-card border-border enabled:hover:bg-muted",
  danger: "text-destructive bg-destructive/10 border-destructive/30",
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
