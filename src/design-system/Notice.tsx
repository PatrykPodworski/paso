import type { HTMLAttributes } from "react";
import { Icon } from "./Icon";

type Props = {
  as?: "p" | "div";
  positive?: boolean;
  icon?: string;
  /** Placement only — margin. Never colour, padding or type. */
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className">;

export const Notice = ({
  as: Tag = "div",
  positive = false,
  icon,
  className = "",
  children,
  ...rest
}: Props) => (
  <Tag
    className={`my-4 flex items-start gap-3 rounded-lg border px-5 py-4 text-sm leading-relaxed max-md:gap-2 max-md:p-4 ${positive ? "border-sage-200 bg-sage-100" : "border-sand-200 bg-sand-100"} ${className}`}
    {...rest}
  >
    {icon && <Icon name={icon} className="mt-0.5 w-4" />}
    {children}
  </Tag>
);
