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

const SIDEBAR =
  "fixed left-0 top-0 bottom-0 z-30 flex flex-col w-[260px] max-desktop:w-[215px] max-tablet:w-[245px] pt-[36px] desktop:pt-[34px] max-tablet:pt-[28px] px-[20px] max-desktop:px-[15px] max-tablet:px-[20px] pb-0 bg-[#fcfcf8] border-r border-r-line max-tablet:[transition:transform_0.2s]";

const NAV_ITEM =
  "w-full flex items-center text-left gap-[12px] max-desktop:gap-[10px] bg-transparent border-0 rounded-[8px] p-[13px] desktop:p-[15px_13px] m-[4px_0] desktop:m-[5px_0] text-[#718068] text-[14px]";

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
      <button
        className="hidden max-tablet:block fixed inset-0 z-[25] border-0 bg-[#253a2c77] backdrop-blur-[3px]"
        onClick={() => closeNav()}
        aria-label="Close navigation"
      />
    )}
    <aside
      className={`${SIDEBAR} ${
        mobileNav
          ? "max-tablet:[transform:translateX(0)] max-tablet:shadow-[8px_0_40px_#203b301c]"
          : "max-tablet:[transform:translateX(-100%)]"
      }`}
    >
      <a
        href="#today"
        className="flex items-center gap-[9px] no-underline m-[0_12px_34px] text-[37px] font-bold tracking-[-2.5px] leading-[1]"
        onClick={(e) => {
          e.preventDefault();
          navigate("today");
        }}
        aria-label="Paso home"
      >
        <span className="relative font-[family-name:Georgia,serif] bg-green text-[#f9f4e8] w-[32px] h-[35px] leading-[30px] text-center rounded-[10px_10px_10px_3px] text-[34px] tracking-[-2px] pr-[2px]">
          p<span className="absolute text-[#dfac76] text-[22px] left-[13px] top-[-1px]">•</span>
        </span>
        <span>
          paso<span className="text-coral">.</span>
        </span>
      </a>
      <div className="flex items-center gap-[10px] border border-[#e5e7dc] rounded-[9px] p-[13px_10px] bg-[#f5f6ee] mb-[35px] max-desktop:gap-[7px] max-desktop:p-[12px_8px]">
        <span
          className="w-[25px] h-[25px] rounded-[50%] bg-[linear-gradient(#b65246_0_27%,#f5d37a_27%_72%,#b65246_72%)] border-[3px] border-[#fffdf4] shadow-[0_0_0_1px_#d8dacd] shrink-0"
          aria-label="Spanish flag"
        />
        <div>
          <strong className="block text-[12px] tracking-[-0.1px]">Spanish for your world</strong>
          <span className="block text-[11px] text-[#7a856c] mt-[4px] max-desktop:text-[12px]">
            DELE A1 · Beginner
          </span>
        </div>
      </div>
      <span className="text-[11px] desktop:text-[10px] font-bold tracking-[1.5px] text-[#9a9f91] px-[13px] mb-[13px]">
        YOUR LEARNING SPACE
      </span>
      <nav aria-label="Main navigation">
        {navigation.map((n) => (
          <button
            key={n.id}
            className={`${NAV_ITEM} ${
              page === n.id ? "bg-[#e9eee1] text-green font-semibold" : "hover:bg-[#f1f3ea]"
            }`}
            onClick={() => navigate(n.id)}
            aria-current={page === n.id ? "page" : undefined}
          >
            <Icon name={n.icon} className="w-[18px]" />
            <span>{n.label}</span>
            {n.id === "practice" && mistakeCount > 0 && (
              <small className="ml-auto rounded-[4px] bg-[#e9d8c5] p-[2px_5px] text-[12px] text-[#885b3f]">
                {mistakeCount}
              </small>
            )}
            {page === n.id && <i className="ml-auto w-[5px] h-[5px] rounded-[50%] bg-green" />}
          </button>
        ))}
      </nav>
      <div className="pt-[38px] max-tablet:pt-[25px] px-[17px] pb-[30px] mt-[20px]">
        <span className="block text-[33px] text-[#c99059] leading-[1]">✺</span>
        <p className="font-(family-name:--serif) text-[19px] italic text-[#677457] m-[11px_0_5px]">
          Un poquito cada día.
        </p>
        <span className="text-[#7e8b70] text-[14px] desktop:text-[13px] leading-[1.7]">
          A little every day
          <br />
          takes you a long way.
        </span>
        <div className="w-[68px] h-[9px] border-t border-t-[#c7cbb6] rounded-[50%] -rotate-[5deg] mt-[17px]" />
      </div>
      <div className="mt-auto pb-[22px] max-tablet:pb-[17px]">
        <button
          className="flex items-center gap-[9px] text-[13px] text-[#8e9588] p-[15px_8px] bg-transparent border-0"
          onClick={() => navigate("guide")}
        >
          <Icon name="info" size={17} />
          Your exam, explained
          <Icon name="external" size={13} />
        </button>
        <button
          className="flex items-center gap-[10px] w-full text-left border-0 border-t border-t-line p-[19px_0_0] bg-transparent"
          onClick={() => openSettings()}
        >
          <span className="w-[33px] h-[33px] flex items-center justify-center rounded-[50%] bg-[#dfcdb1] text-[#695d43] text-[14px] font-(family-name:--serif) font-semibold">
            {name ? name[0].toUpperCase() : "P"}
          </span>
          <span>
            <strong className="block max-w-[130px] overflow-hidden text-ellipsis text-[13px] desktop:text-[12px]">
              {name || "Your Spanish journey"}
            </strong>
            <small className="block mt-[3px] text-[11px] desktop:text-[10px] text-[#a1a391]">
              Learning at your pace
            </small>
          </span>
          <Icon name="settings" size={18} className="ml-auto text-[#919b86]" />
        </button>
      </div>
    </aside>
  </>
);
