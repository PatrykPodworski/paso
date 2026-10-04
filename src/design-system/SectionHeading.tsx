import type { ReactNode } from "react";

// One variant per context the old `.path-heading`, `.word-heading` and `.vocabulary-collection` rules styled.
const TITLE =
  "font-serif text-[25px] max-xl:text-[22px] max-md:text-[25px] max-sm:text-[23px] font-semibold tracking-[-0.7px] leading-[1.25]";

const TEXT = "mt-[5px] text-[14px] leading-[1.7] text-sage-700";

const VARIANT = {
  default: {
    box: "mt-[28px] max-md:mt-[26px] gap-[16px] max-sm:gap-[12px]",
    title: TITLE,
    text: TEXT,
  },
  path: {
    box: "mt-[30px] max-md:mt-[26px] gap-[16px] max-sm:gap-[12px]",
    title: TITLE,
    text: TEXT,
  },
  word: {
    box: "mt-[37px] max-md:mt-[26px] gap-[16px] max-md:gap-[15px] max-sm:gap-[12px] max-md:flex-col max-md:items-start",
    title: TITLE,
    text: TEXT,
  },
  collection: {
    box: "mt-[28px] max-md:mt-[26px] gap-[16px] max-sm:flex-col max-sm:items-stretch",
    title: "text-[17px] font-semibold tracking-[-0.3px]",
    text: "mt-[6px] text-[13px] leading-[1.6] text-sage-800",
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
    <div className={`flex items-center justify-between mb-[17px] ${v.box}`}>
      <div>
        {eyebrow}
        <Title
          id={titleId}
          className={`${v.title} ${eyebrow && variant === "word" ? "mt-[8px]" : ""}`}
        >
          {title}
        </Title>
        {text && <p className={v.text}>{text}</p>}
      </div>
      {children}
    </div>
  );
};
