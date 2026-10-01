import type { ComponentProps } from "react";
import { PRESSABLE } from "./pressable";

type Props = {
  /** Placement only — margin, visibility. Never sizing or colour. */
  className?: string;
} & Omit<ComponentProps<"button">, "className">;

export const IconButton = ({ className = "", ...rest }: Props) => (
  <button
    className={`${PRESSABLE} inline-flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border-0 bg-transparent p-0 hover:bg-[#254b3e0b] ${className}`}
    {...rest}
  />
);
