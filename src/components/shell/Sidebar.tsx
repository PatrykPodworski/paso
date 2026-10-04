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
  "fixed left-0 top-0 bottom-0 z-30 flex flex-col w-65 max-xl:w-54 max-md:w-61 pt-9 xl:pt-8 max-md:pt-7 px-5 max-xl:px-3.5 max-md:px-5 pb-0 bg-white border-r border-r-sage-200 max-md:transition-transform max-md:duration-200 max-md:motion-reduce:transition-none";

const NAV_ITEM =
  "w-full flex items-center text-left gap-3 max-xl:gap-2.5 bg-transparent border-0 rounded-lg p-3 xl:py-3.5 xl:px-3 my-1 mx-0 xl:my-1 xl:mx-0 text-sage-700 text-sm";

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
        className={`${PRESSABLE} hidden max-md:block fixed inset-0 z-25 border-0 bg-green-950/47 backdrop-blur-xs`}
        onClick={() => closeNav()}
        aria-label="Close navigation"
      />
    )}
    <aside
      className={`${SIDEBAR} ${
        mobileNav
          ? "max-md:translate-x-0 max-md:shadow-2xl max-md:shadow-green-950/11"
          : "max-md:-translate-x-full"
      }`}
    >
      <a
        href="#today"
        className="flex items-center gap-2 no-underline mt-0 mx-3 mb-8 text-4xl font-bold tracking-tighter leading-none"
        onClick={(e) => {
          e.preventDefault();
          navigate("today");
        }}
        aria-label="Paso home"
      >
        <span className="relative font-serif bg-green-900 text-sand-50 w-8 h-9 leading-7 text-center rounded-lg rounded-bl-xs text-4xl tracking-tighter pr-0.5">
          p<span className="absolute text-sand-400 text-xl left-3 -top-px">•</span>
        </span>
        <span>
          paso<span className="text-coral-600">.</span>
        </span>
      </a>
      <div className="flex items-center gap-2.5 border border-sage-200 rounded-lg py-3 px-2.5 bg-sage-50 mb-9 max-xl:gap-1.5 max-xl:py-3 max-xl:px-2">
        <span
          className="flex flex-col w-6 h-6 overflow-hidden rounded-full border-3 border-sand-50 ring ring-sage-200 shrink-0"
          aria-label="Spanish flag"
        >
          <span className="h-1/4 bg-coral-700" />
          <span className="flex-1 bg-yellow-300" />
          <span className="h-1/4 bg-coral-700" />
        </span>
        <div>
          <strong className="block text-xs tracking-normal">Spanish for your world</strong>
          <span className="block text-2xs text-sage-700 mt-1 max-xl:text-xs">
            DELE A1 · Beginner
          </span>
        </div>
      </div>
      <span className="text-2xs xl:text-2xs font-bold tracking-widest text-sage-500 px-3 mb-3">
        YOUR LEARNING SPACE
      </span>
      <nav aria-label="Main navigation">
        {navigation.map((n) => (
          <button
            key={n.id}
            className={`${PRESSABLE} ${NAV_ITEM} ${
              page === n.id ? "bg-sage-100 text-green-900 font-semibold" : "hover:bg-sage-50"
            }`}
            onClick={() => navigate(n.id)}
            aria-current={page === n.id ? "page" : undefined}
          >
            <Icon name={n.icon} className="w-4" />
            <span>{n.label}</span>
            {n.id === "practice" && mistakeCount > 0 && (
              <small className="ml-auto rounded-sm bg-sand-200 py-0.5 px-1 text-xs text-coral-800">
                {mistakeCount}
              </small>
            )}
            {page === n.id && <i className="ml-auto w-1 h-1 rounded-full bg-green-900" />}
          </button>
        ))}
      </nav>
      <div className="pt-9 max-md:pt-6 px-4 pb-7 mt-5">
        <span className="block text-3xl text-sand-500 leading-none">✺</span>
        <p className="leading-relaxed font-serif text-lg italic text-sage-700 mt-2.5 mx-0 mb-1">
          Un poquito cada día.
        </p>
        <span className="text-sage-600 text-sm xl:text-xs leading-relaxed">
          A little every day
          <br />
          takes you a long way.
        </span>
        <div className="w-17 h-2 border-t border-t-sage-300 rounded-full -rotate-5 mt-4" />
      </div>
      <div className="mt-auto pb-5 max-md:pb-4">
        <button
          className={`${PRESSABLE} flex items-center gap-2 text-xs text-sage-600 py-3.5 px-2 bg-transparent border-0`}
          onClick={() => navigate("guide")}
        >
          <Icon name="info" size={17} />
          Your exam, explained
          <Icon name="external" size={13} />
        </button>
        <button
          className={`${PRESSABLE} flex items-center gap-2.5 w-full text-left border-0 border-t border-t-sage-200 pt-5 px-0 pb-0 bg-transparent`}
          onClick={() => openSettings()}
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-sand-300 text-sand-800 text-sm font-serif font-semibold">
            {name ? name[0].toUpperCase() : "P"}
          </span>
          <span>
            <strong className="block max-w-32 overflow-hidden text-ellipsis text-xs xl:text-xs">
              {name || "Your Spanish journey"}
            </strong>
            <small className="block mt-0.5 text-2xs xl:text-2xs text-sage-400">
              Learning at your pace
            </small>
          </span>
          <Icon name="settings" size={18} className="ml-auto text-sage-500" />
        </button>
      </div>
    </aside>
  </>
);
