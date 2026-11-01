// A papercut illustration in the style of docs/ILLUSTRATION-STYLE.md.
export const JourneyArt = () => (
  <img
    src="/illustrations/today-hero.webp"
    width={1200}
    height={800}
    alt="A papercut Spanish village with terracotta roofs, a bell tower and an orange tree in front of a sky-blue sun disc"
    className="absolute right-6 bottom-11 w-1/2 max-h-[calc(100%-4.25rem)] z-1 object-contain object-right-bottom max-lg:w-3/5 max-md:w-1/2 max-sm:bottom-4 max-sm:right-4 max-sm:w-2/3"
  />
);

export const Stamp = () => (
  <div
    className="stamp flex flex-col items-center justify-center shrink-0 w-27 h-27 border border-dashed border-border rounded-full text-muted-foreground rotate-11 max-md:w-20 max-md:h-20"
    aria-hidden="true"
  >
    <span className="text-2xs tracking-widest">PASO A PASO</span>
    <svg viewBox="0 0 60 45" className="shrink-0 w-12 h-11 max-md:w-9 max-md:h-8">
      <path
        d="m5 35 16-27 13 27M12 24h17m7 11V10l-7 6m3 19h15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m7 41 42-3" stroke="currentColor" />
    </svg>
    <small className="text-[4px] tracking-widest max-md:text-[3px]">YOUR JOURNEY STARTS HERE</small>
  </div>
);
