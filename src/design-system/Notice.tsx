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
    className={`my-[18px] flex items-start gap-[12px] rounded-[9px] border px-[20px] py-[17px] text-[14px] leading-[1.7] max-md:gap-[9px] max-md:p-[16px] ${positive ? "border-[#dbe6d1] bg-[#edf3e5]" : "border-[#e9e0c7] bg-[#f4efdf]"} ${className}`}
    {...rest}
  >
    {icon && <Icon name={icon} className="mt-[2px] w-[18px]" />}
    {children}
  </Tag>
);
