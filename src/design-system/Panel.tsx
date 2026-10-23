import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import { PRESSABLE } from "./pressable";

type Props = {
  as?: "div" | "section" | "aside" | "article" | "button";
  /** Layout and padding of the particular panel. Never background, border or radius. */
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className">;

export const Panel = ({ as: Tag = "div", className = "", ...rest }: Props) => (
  <Tag
    className={`${Tag === "button" ? PRESSABLE : ""} bg-white border border-sage-200 rounded-xl ${className}`}
    {...rest}
  />
);

type PanelHeadingProps = { title: ReactNode; icon?: string; children?: ReactNode };

// The title sizes are what the old `.panel-heading h3` media cascade resolved to: the
// min-width 1600px and max-width 430px rules were overridden by later ones in styles.css.
export const PanelHeading = ({ title, icon, children }: PanelHeadingProps) => (
  <div className="flex items-center justify-between gap-2.5">
    <h3 className="tracking-tight text-sm font-semibold">{title}</h3>
    {icon && <Icon name={icon} size={17} className="text-sage-400" />}
    {children}
  </div>
);
