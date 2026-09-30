import { Icon } from "../../design-system/Icon";
import { navigation, type Page } from "../navigation";

type Props = {
  page: Page;
  navigate: (target: Page) => void;
  mobileNav: boolean;
  closeNav: () => void;
  mistakeCount: number;
  name: string;
  openSettings: () => void;
};

export const Sidebar = ({
  page,
  navigate,
  mobileNav,
  closeNav,
  mistakeCount,
  name,
  openSettings,
}: Props) => (
  <>
    {mobileNav && (
      <button className="nav-backdrop" onClick={() => closeNav()} aria-label="Close navigation" />
    )}
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <a
        href="#today"
        className="brand"
        onClick={(e) => {
          e.preventDefault();
          navigate("today");
        }}
        aria-label="Paso home"
      >
        <span className="brand-mark">
          p<span>•</span>
        </span>
        <span>
          paso<span className="brand-period">.</span>
        </span>
      </a>
      <div className="flex items-center gap-[10px] border border-[#e5e7dc] rounded-[9px] p-[13px_10px] bg-[#f5f6ee] mb-[35px] max-desktop:gap-[7px] max-desktop:p-[12px_8px]">
        <span className="spanish-flag" aria-label="Spanish flag" />
        <div>
          <strong className="block text-[12px] tracking-[-0.1px]">Spanish for your world</strong>
          <span className="block text-[11px] text-[#7a856c] mt-[4px] max-desktop:text-[12px]">
            DELE A1 · Beginner
          </span>
        </div>
      </div>
      <span className="nav-label">YOUR LEARNING SPACE</span>
      <nav aria-label="Main navigation">
        {navigation.map((n) => (
          <button
            key={n.id}
            className={`nav-item ${page === n.id ? "active" : ""}`}
            onClick={() => navigate(n.id)}
            aria-current={page === n.id ? "page" : undefined}
          >
            <Icon name={n.icon} />
            <span>{n.label}</span>
            {n.id === "practice" && mistakeCount > 0 && <small>{mistakeCount}</small>}
            {page === n.id && <i />}
          </button>
        ))}
      </nav>
      <div className="sidebar-note">
        <span className="small-sun">✺</span>
        <p>Un poquito cada día.</p>
        <span>
          A little every day
          <br />
          takes you a long way.
        </span>
        <div className="handdrawn-line" />
      </div>
      <div className="sidebar-bottom">
        <button className="help-link" onClick={() => navigate("guide")}>
          <Icon name="info" size={17} />
          Your exam, explained
          <Icon name="external" size={13} />
        </button>
        <button className="profile" onClick={() => openSettings()}>
          <span className="avatar">{name ? name[0].toUpperCase() : "P"}</span>
          <span>
            <strong>{name || "Your Spanish journey"}</strong>
            <small>Learning at your pace</small>
          </span>
          <Icon name="settings" size={18} />
        </button>
      </div>
    </aside>
  </>
);
