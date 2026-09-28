import { streak, xp } from "../data/progress";
import type { Progress } from "../data/types";
import { Icon } from "./Icon";
import { navigation, type Page } from "./navigation";
export const Topbar = ({
  page,
  progress,
  openNav,
  openSettings,
}: {
  page: Page;
  progress: Progress;
  openNav: () => void;
  openSettings: () => void;
}) => (
  <header className="topbar">
    <div>
      <button
        className="mobile-menu icon-button"
        onClick={() => openNav()}
        aria-label="Open navigation"
      >
        <Icon name="menu" />
      </button>
      <span className="breadcrumb">
        Your Spanish journey
        <Icon name="chevron" size={13} />
        <strong>{navigation.find((n) => n.id === page)?.label}</strong>
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
