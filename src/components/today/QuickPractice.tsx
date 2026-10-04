import { TONE } from "../tone";
import { Icon } from "../../design-system/Icon";
import type { Practice } from "../practice";
import { PRESSABLE } from "../../design-system/pressable";

type Props = {
  mistakeCount: number;
  practice: Practice;
};

const CARD =
  "relative min-w-0 text-left rounded-lg border border-sage-200 bg-white py-5 px-4 hover:border-sage-300 hover:-translate-y-0.5 max-xl:py-3.5 max-xl:px-2.5 max-md:py-4 max-md:px-3 max-sm:flex max-sm:items-center max-sm:gap-3 max-sm:p-4";

const ARROW = "absolute right-3 top-6 text-sage-400 max-sm:right-4 max-sm:top-7";

const ICON = "h-9 w-9 rounded-lg mb-3.5 flex items-center justify-center shrink-0 max-sm:m-0";

const TITLE = "block text-sm max-xl:text-xs max-lg:text-sm";

const NOTE =
  "block text-2xs text-sage-700 mt-1.5 pr-1.5 xl:leading-relaxed max-lg:text-xs max-md:text-2xs max-sm:text-xs max-sm:mt-1";

export const QuickPractice = ({ mistakeCount, practice }: Props) => (
  <div className="grid grid-cols-3 gap-3 max-md:gap-2.5 max-sm:grid-cols-1">
    <button className={`${PRESSABLE} ${CARD}`} onClick={() => practice("listening")}>
      <span className={`${ICON} ${TONE.lavender}`}>
        <Icon name="headphones" size={23} />
      </span>
      <span className="block min-w-0">
        <strong className={TITLE}>Tune your ear</strong>
        <small className={NOTE}>Listen to everyday Spanish</small>
      </span>
      <Icon name="arrow" size={17} className={ARROW} />
    </button>
    <button className={`${PRESSABLE} ${CARD}`} onClick={() => practice("speaking")}>
      <span className={`${ICON} ${TONE.peach}`}>
        <Icon name="mic" size={23} />
      </span>
      <span className="block min-w-0">
        <strong className={TITLE}>Find your voice</strong>
        <small className={NOTE}>A safe space to speak</small>
      </span>
      <Icon name="arrow" size={17} className={ARROW} />
    </button>
    <button
      className={`${PRESSABLE} ${CARD}`}
      onClick={() => practice(mistakeCount ? "mistakes" : "all")}
    >
      <span className={`${ICON} ${TONE.sage}`}>
        <Icon name="repeat" size={23} />
      </span>
      <span className="block min-w-0">
        <strong className={TITLE}>Make it stick</strong>
        <small className={NOTE}>
          {mistakeCount
            ? `${mistakeCount} mistakes to revisit`
            : "A fresh mix of little challenges"}
        </small>
      </span>
      <Icon name="arrow" size={17} className={ARROW} />
    </button>
  </div>
);
