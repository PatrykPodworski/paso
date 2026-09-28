import type { ComponentProps } from "react";

const BASE =
  "inline-flex items-center gap-[7px] border-0 bg-transparent p-0 text-[14px] font-semibold no-underline text-[#4a6d55] [&:hover]:underline [&:hover]:underline-offset-4";

type Props = {
  /**
   * Placement, plus the context overrides the old descendant rules applied. An override
   * of a BASE property needs `!`: stylesheet order, not class order, decides between two
   * utilities, and `text-[14px]` is emitted after `text-[13px]`.
   */
  className?: string;
} & (
  | ({ href: string } & Omit<ComponentProps<"a">, "className">)
  | ({ href?: never } & Omit<ComponentProps<"button">, "className">)
);

// An anchor when given an href, otherwise a button.
export const TextLink = ({ className = "", ...rest }: Props) =>
  rest.href === undefined ? (
    <button className={`${BASE} ${className}`} {...(rest as ComponentProps<"button">)} />
  ) : (
    <a className={`${BASE} ${className}`} {...(rest as ComponentProps<"a">)} />
  );
