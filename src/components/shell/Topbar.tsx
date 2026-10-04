import { streak, xp } from "../../data/progress";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { IconButton } from "../../design-system/IconButton";
import { navigation, type Page } from "../navigation";
import { PRESSABLE } from "../../design-system/pressable";

type Props = {
  page: Page;
  progress: Progress;
  openNav: () => void;
  openSettings: () => void;
};

const STAT = "flex gap-1 items-center";
const STAT_VALUE = "font-semibold text-sage-800";

export const Topbar = ({ page, progress, openNav, openSettings }: Props) => (
  <header className="h-19 xl:h-20 max-md:h-16 flex items-center justify-between py-0 px-9 max-xl:py-0 max-xl:px-7 max-md:py-0 max-md:px-5 max-sm:px-3.5 bg-sage-50 border-b border-b-sage-200">
    <div className="flex items-center gap-2.5">
      <IconButton className="md:hidden!" onClick={() => openNav()} aria-label="Open navigation">
        <Icon name="menu" />
      </IconButton>
      <span className="breadcrumb flex items-center gap-3 max-md:gap-2 text-xs max-md:text-2xs text-sage-500">
        Your Spanish journey
        <Icon name="chevron" size={13} className="max-md:hidden" />
        <strong className="font-medium text-sage-800 max-md:hidden">
          {navigation.find((n) => n.id === page)?.label}
        </strong>
      </span>
    </div>
    <div className="flex items-center gap-6 max-xl:gap-4 max-md:gap-3.5 text-xs text-sage-600">
      <span className={STAT} title="Consecutive practice days">
        <Icon name="flame" size={19} className="text-coral-500" />
        <b className={STAT_VALUE}>{streak(progress)}</b>
        <span className="max-md:hidden">day streak</span>
      </span>
      <span className={`xp-stat ${STAT} max-md:hidden`}>
        <Icon name="spark" size={17} className="text-olive-500" />
        <b className={STAT_VALUE}>{xp(progress)}</b> XP
      </span>
      <button
        className={`${PRESSABLE} w-7 h-7 -ml-1.5 max-md:m-0 flex items-center justify-center rounded-full border-2 border-sage-50 ring ring-sage-200 bg-sand-300 text-sand-800 text-xs font-serif font-semibold`}
        onClick={() => openSettings()}
        aria-label="Open your learning preferences"
      >
        {progress.name ? progress.name[0].toUpperCase() : "P"}
      </button>
    </div>
  </header>
);
