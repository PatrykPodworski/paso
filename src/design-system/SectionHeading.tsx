import type { ReactNode } from "react";

// One variant per context the old `.path-heading`, `.word-heading` and `.vocabulary-collection` rules styled.
const TITLE =
  "font-serif text-2xl max-xl:text-xl max-md:text-2xl font-semibold tracking-tight leading-tight";

const TEXT = "mt-1 text-sm leading-relaxed text-sage-700";

const VARIANT = {
  default: {
    box: "mt-7 max-md:mt-6 gap-4 max-sm:gap-3",
    title: TITLE,
    text: TEXT,
  },
  path: {
    box: "mt-7 max-md:mt-6 gap-4 max-sm:gap-3",
    title: TITLE,
    text: TEXT,
  },
  word: {
    box: "mt-9 max-md:mt-6 gap-4 max-md:gap-3.5 max-sm:gap-3 max-md:flex-col max-md:items-start",
    title: TITLE,
    text: TEXT,
  },
  collection: {
    box: "mt-7 max-md:mt-6 gap-4 max-sm:flex-col max-sm:items-stretch",
    title: "text-base font-semibold tracking-tight",
    text: "mt-1.5 text-xs leading-relaxed text-sage-800",
  },
};

type Props = {
  variant?: keyof typeof VARIANT;
  title: ReactNode;
  titleId?: string;
  eyebrow?: ReactNode;
  text?: ReactNode;
  /** The aside on the right: a badge, a link, a caption. */
  children?: ReactNode;
};

export const SectionHeading = ({
  variant = "default",
  title,
  titleId,
  eyebrow,
  text,
  children,
}: Props) => {
  const v = VARIANT[variant];
  const Title = variant === "collection" ? "h3" : "h2";

  return (
    <div className={`flex items-center justify-between mb-4 ${v.box}`}>
      <div>
        {eyebrow}
        <Title id={titleId} className={`${v.title} ${eyebrow && variant === "word" ? "mt-2" : ""}`}>
          {title}
        </Title>
        {text && <p className={v.text}>{text}</p>}
      </div>
      {children}
    </div>
  );
};
