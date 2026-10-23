import type { ComponentProps } from "react";
import { PRESSABLE } from "./pressable";

type Props = {
  /** Placement only — margin, visibility. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"button">, "className">;

export const IconButton = ({ className = "", ...rest }: Props) => (
  <button
    className={`${PRESSABLE} inline-flex h-8 w-8 items-center justify-center rounded-md border-0 bg-transparent p-0 hover:bg-green-900/4 ${className}`}
    {...rest}
  />
);
