import { streak, xp } from "../../data/progress";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { IconButton } from "../../design-system/IconButton";
import { navigation, type Page } from "../navigation";

type Props = {
  page: Page;
  progress: Progress;
  openNav: () => void;
  openSettings: () => void;
};

const STAT = "flex gap-[5px] items-center";
const STAT_VALUE = "font-semibold text-[#58624c]";

export const Topbar = ({ page, progress, openNav, openSettings }: Props) => (
  <header className="h-[75px] xl:h-[80px] max-md:h-[65px] flex items-center justify-between p-[0_38px] max-xl:p-[0_27px] max-md:p-[0_20px] max-sm:px-[14px] bg-[#f8f9f5] border-b border-b-line">
    <div className="flex items-center gap-[10px]">
      <IconButton className="md:hidden!" onClick={() => openNav()} aria-label="Open navigation">
        <Icon name="menu" />
      </IconButton>
      <span className="breadcrumb flex items-center gap-[13px] max-md:gap-[8px] text-[13px] max-md:text-[11px] text-[#90998c]">
        Your Spanish journey
        <Icon name="chevron" size={13} className="max-md:hidden" />
        <strong className="font-medium text-[#54664f] max-md:hidden">
          {navigation.find((n) => n.id === page)?.label}
        </strong>
      </span>
    </div>
    <div className="flex items-center gap-[25px] max-xl:gap-[18px] max-md:gap-[15px] text-[13px] max-md:text-[12px] text-[#8c9384]">
      <span className={STAT} title="Consecutive practice days">
        <Icon name="flame" size={19} className="text-[#c08554]" />
        <b className={STAT_VALUE}>{streak(progress)}</b>
        <span className="max-md:hidden">day streak</span>
      </span>
      <span className={`xp-stat ${STAT} max-md:hidden`}>
        <Icon name="spark" size={17} className="text-[#8c9c65]" />
        <b className={STAT_VALUE}>{xp(progress)}</b> XP
      </span>
      <button
        className="w-[30px] h-[30px] max-md:w-[29px] max-md:h-[29px] -ml-[7px] max-md:m-0 flex items-center justify-center rounded-[50%] border-2 border-[#fffdf5] shadow-[0_0_0_1px_#e6e5d9] bg-[#dfcdb1] text-[#695d43] text-[13px] font-(family-name:--serif) font-semibold"
        onClick={() => openSettings()}
        aria-label="Open your learning preferences"
      >
        {progress.name ? progress.name[0].toUpperCase() : "P"}
      </button>
    </div>
  </header>
);
