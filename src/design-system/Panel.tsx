import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  as?: "div" | "section" | "aside" | "article" | "button";
  /** Layout and padding of the particular panel. Never background, border or radius. */
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className">;

export const Panel = ({ as: Tag = "div", className = "", ...rest }: Props) => (
  <Tag className={`bg-paper border border-line rounded-[13px] ${className}`} {...rest} />
);

// The title sizes are what the old `.panel-heading h3` media cascade resolved to: the
// min-width 1600px and max-width 430px rules were overridden by later ones in styles.css.
export const PanelHeading = ({ title, children }: { title: ReactNode; children?: ReactNode }) => (
  <div className="flex items-center justify-between gap-[10px] [&>svg]:text-[#a0a68f]">
    <h3 className="text-[14px] max-laptop:text-[15px] max-tablet:text-[14px] desktop:text-[15px] font-semibold">
      {title}
    </h3>
    {children}
  </div>
);
