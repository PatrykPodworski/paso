import { Icon } from "../../design-system/Icon";
import { navigation, type Page } from "../navigation";
import { PRESSABLE } from "../../design-system/pressable";

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
  "fixed left-0 top-0 bottom-0 z-30 flex flex-col w-[260px] max-xl:w-[215px] max-md:w-[245px] pt-[36px] xl:pt-[34px] max-md:pt-[28px] px-[20px] max-xl:px-[15px] max-md:px-[20px] pb-0 bg-white border-r border-r-sage-200 max-md:transition-transform max-md:duration-200 max-md:motion-reduce:transition-none";

const NAV_ITEM =
  "w-full flex items-center text-left gap-[12px] max-xl:gap-[10px] bg-transparent border-0 rounded-[8px] p-[13px] xl:p-[15px_13px] m-[4px_0] xl:m-[5px_0] text-sage-700 text-[14px]";

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
        className={`${PRESSABLE} hidden max-md:block fixed inset-0 z-[25] border-0 bg-green-950/47 backdrop-blur-[3px]`}
        onClick={() => closeNav()}
        aria-label="Close navigation"
      />
    )}
    <aside
      className={`${SIDEBAR} ${
        mobileNav
          ? "max-md:translate-x-0 max-md:shadow-[8px_0_40px_var(--color-green-950)]/11"
          : "max-md:-translate-x-full"
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
        <span className="relative font-serif bg-green-900 text-sand-50 w-[32px] h-[35px] leading-[30px] text-center rounded-[10px_10px_10px_3px] text-[34px] tracking-[-2px] pr-[2px]">
          p<span className="absolute text-sand-400 text-[22px] left-[13px] top-[-1px]">•</span>
        </span>
        <span>
          paso<span className="text-coral-600">.</span>
        </span>
      </a>
      <div className="flex items-center gap-[10px] border border-sage-200 rounded-[9px] p-[13px_10px] bg-sage-50 mb-[35px] max-xl:gap-[7px] max-xl:p-[12px_8px]">
        <span
          className="w-[25px] h-[25px] rounded-[50%] bg-[linear-gradient(var(--color-coral-700)_0_27%,var(--color-yellow-300)_27%_72%,var(--color-coral-700)_72%)] border-[3px] border-sand-50 shadow-[0_0_0_1px_var(--color-sage-200)] shrink-0"
          aria-label="Spanish flag"
        />
        <div>
          <strong className="block text-[12px] tracking-[-0.1px]">Spanish for your world</strong>
          <span className="block text-[11px] text-sage-700 mt-[4px] max-xl:text-[12px]">
            DELE A1 · Beginner
          </span>
        </div>
      </div>
      <span className="text-[11px] xl:text-[10px] font-bold tracking-[1.5px] text-sage-500 px-[13px] mb-[13px]">
        YOUR LEARNING SPACE
      </span>
      <nav aria-label="Main navigation">
        {navigation.map((n) => (
          <button
            key={n.id}
            className={`${PRESSABLE} ${NAV_ITEM} ${
              page === n.id ? "bg-sage-100 text-green-900 font-semibold" : "hover:bg-sage-100"
            }`}
            onClick={() => navigate(n.id)}
            aria-current={page === n.id ? "page" : undefined}
          >
            <Icon name={n.icon} className="w-[18px]" />
            <span>{n.label}</span>
            {n.id === "practice" && mistakeCount > 0 && (
              <small className="ml-auto rounded-[4px] bg-sand-200 p-[2px_5px] text-[12px] text-coral-800">
                {mistakeCount}
              </small>
            )}
            {page === n.id && <i className="ml-auto w-[5px] h-[5px] rounded-[50%] bg-green-900" />}
          </button>
        ))}
      </nav>
      <div className="pt-[38px] max-md:pt-[25px] px-[17px] pb-[30px] mt-[20px]">
        <span className="block text-[33px] text-sand-500 leading-[1]">✺</span>
        <p className="leading-[1.7] font-serif text-[19px] italic text-sage-700 m-[11px_0_5px]">
          Un poquito cada día.
        </p>
        <span className="text-sage-600 text-[14px] xl:text-[13px] leading-[1.7]">
          A little every day
          <br />
          takes you a long way.
        </span>
        <div className="w-[68px] h-[9px] border-t border-t-sage-300 rounded-[50%] -rotate-[5deg] mt-[17px]" />
      </div>
      <div className="mt-auto pb-[22px] max-md:pb-[17px]">
        <button
          className={`${PRESSABLE} flex items-center gap-[9px] text-[13px] text-sage-600 p-[15px_8px] bg-transparent border-0`}
          onClick={() => navigate("guide")}
        >
          <Icon name="info" size={17} />
          Your exam, explained
          <Icon name="external" size={13} />
        </button>
        <button
          className={`${PRESSABLE} flex items-center gap-[10px] w-full text-left border-0 border-t border-t-sage-200 p-[19px_0_0] bg-transparent`}
          onClick={() => openSettings()}
        >
          <span className="w-[33px] h-[33px] flex items-center justify-center rounded-[50%] bg-sand-300 text-sand-800 text-[14px] font-serif font-semibold">
            {name ? name[0].toUpperCase() : "P"}
          </span>
          <span>
            <strong className="block max-w-[130px] overflow-hidden text-ellipsis text-[13px] xl:text-[12px]">
              {name || "Your Spanish journey"}
            </strong>
            <small className="block mt-[3px] text-[11px] xl:text-[10px] text-sage-400">
              Learning at your pace
            </small>
          </span>
          <Icon name="settings" size={18} className="ml-auto text-sage-500" />
        </button>
      </div>
    </aside>
  </>
);
