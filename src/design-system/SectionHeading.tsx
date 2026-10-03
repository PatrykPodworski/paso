import type { ReactNode } from "react";

// Descendant variants keep the old `.section-heading h2|p` specificity. One variant per
// context the old `.path-heading`, `.word-heading` and `.vocabulary-collection` rules styled.
const TITLE =
  "[&_h2]:text-[25px] max-xl:[&_h2]:text-[22px] max-md:[&_h2]:text-[25px] max-sm:[&_h2]:text-[23px]";

const TEXT = "[&_p]:mt-[5px] [&_p]:text-[14px] [&_p]:text-[#75816b]";

const VARIANT = {
  default: `mt-[28px] max-md:mt-[26px] gap-[16px] max-sm:gap-[12px] ${TEXT}`,
  path: `mt-[30px] max-md:mt-[26px] gap-[16px] max-sm:gap-[12px] ${TEXT}`,
  word: `mt-[37px] max-md:mt-[26px] gap-[16px] max-md:gap-[15px] max-sm:gap-[12px] max-md:flex-col max-md:items-start ${TEXT}`,
  collection:
    "mt-[28px] max-md:mt-[26px] gap-[16px] max-sm:flex-col max-sm:items-stretch [&_p]:mt-[6px] [&_p]:text-[13px] [&_p]:leading-[1.6] [&_p]:text-[#59675d]",
};

type Props = { variant?: keyof typeof VARIANT; children: ReactNode };

export const SectionHeading = ({ variant = "default", children }: Props) => (
  <div className={`flex items-center justify-between mb-[17px] ${TITLE} ${VARIANT[variant]}`}>
    {children}
  </div>
);
