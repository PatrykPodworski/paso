import { TONE } from "../tone";
import { Icon } from "../../design-system/Icon";
import type { Practice } from "../practice";
import { PRESSABLE } from "../../design-system/pressable";

type Props = {
  mistakeCount: number;
  practice: Practice;
};

const CARD =
  "relative min-w-0 text-left rounded-[10px] border border-sage-200 bg-[#fffefa] p-[20px_16px] hover:border-[#c4d1b7] hover:transform-[translateY(-2px)] max-xl:p-[15px_11px] max-md:p-[17px_12px] max-sm:grid max-sm:grid-cols-[36px_1fr] max-sm:gap-[0_13px] max-sm:p-[16px]";

const ARROW =
  "absolute right-[13px] top-[25px] text-[#9da68e] max-sm:right-[16px] max-sm:top-[27px]";

const ICON =
  "h-[36px] w-[36px] rounded-[10px] mb-[14px] flex items-center justify-center shrink-0 max-sm:row-[1/3] max-sm:m-0";

const TITLE =
  "block text-[14px] max-xl:text-[13px] max-lg:text-[14px] max-sm:text-[15px] max-sm:self-end";

const NOTE =
  "block text-[11px] text-[#75816b] mt-[6px] pr-[6px] xl:leading-[1.6] max-xl:text-[10px] max-lg:text-[12px] max-md:text-[11px] max-sm:text-[12px] max-sm:mt-[5px]";

export const QuickPractice = ({ mistakeCount, practice }: Props) => (
  <div className="grid grid-cols-[repeat(3,1fr)] gap-[12px] max-md:gap-[10px] max-sm:grid-cols-[1fr]">
    <button className={`${PRESSABLE} ${CARD}`} onClick={() => practice("listening")}>
      <span className={`${ICON} ${TONE.lavender}`}>
        <Icon name="headphones" size={23} />
      </span>
      <strong className={TITLE}>Tune your ear</strong>
      <small className={NOTE}>Listen to everyday Spanish</small>
      <Icon name="arrow" size={17} className={ARROW} />
    </button>
    <button className={`${PRESSABLE} ${CARD}`} onClick={() => practice("speaking")}>
      <span className={`${ICON} ${TONE.peach}`}>
        <Icon name="mic" size={23} />
      </span>
      <strong className={TITLE}>Find your voice</strong>
      <small className={NOTE}>A safe space to speak</small>
      <Icon name="arrow" size={17} className={ARROW} />
    </button>
    <button
      className={`${PRESSABLE} ${CARD}`}
      onClick={() => practice(mistakeCount ? "mistakes" : "all")}
    >
      <span className={`${ICON} ${TONE.sage}`}>
        <Icon name="repeat" size={23} />
      </span>
      <strong className={TITLE}>Make it stick</strong>
      <small className={NOTE}>
        {mistakeCount ? `${mistakeCount} mistakes to revisit` : "A fresh mix of little challenges"}
      </small>
      <Icon name="arrow" size={17} className={ARROW} />
    </button>
  </div>
);
