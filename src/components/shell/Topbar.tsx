import { streak, xp } from "../../data/progress";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { navigation, type Page } from "../navigation";

type Props = {
  page: Page;
  progress: Progress;
  openNav: () => void;
  openSettings: () => void;
};

export const Topbar = ({ page, progress, openNav, openSettings }: Props) => (
  <header className="topbar">
    <div>
      <button
        className="mobile-menu icon-button"
        onClick={() => openNav()}
        aria-label="Open navigation"
      >
        <Icon name="menu" />
      </button>
      <span className="breadcrumb flex items-center gap-[13px] max-tablet:gap-[8px] text-[13px] max-tablet:text-[11px] text-[#90998c]">
        Your Spanish journey
        <Icon name="chevron" size={13} className="max-tablet:hidden" />
        <strong className="font-medium text-[#54664f] max-tablet:hidden">
          {navigation.find((n) => n.id === page)?.label}
        </strong>
      </span>
    </div>
    <div className="topbar-stats">
      <span title="Consecutive practice days">
        <Icon name="flame" size={19} />
        <b>{streak(progress)}</b>
        <span>day streak</span>
      </span>
      <span className="xp-stat">
        <Icon name="spark" size={17} />
        <b>{xp(progress)}</b> XP
      </span>
      <button
        className="top-avatar"
        onClick={() => openSettings()}
        aria-label="Open your learning preferences"
      >
        {progress.name ? progress.name[0].toUpperCase() : "P"}
      </button>
    </div>
  </header>
);
