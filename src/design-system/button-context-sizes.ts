// Delete this file, and every use of it, in the PR that replaces these with a real
// size scale. Nothing here is a design decision; it is a transcription.
// ponytail: escape hatches. styles.css used to restyle buttons from the outside through
// 13 descendant selectors, which had accreted into eight ad-hoc sizes with no shared
// scale. These reproduce them exactly so this extraction changes no pixel. The next PR
// replaces the lot with a real scale and deletes every use. Values transcribed from the
// computed styles of the old CSS at each breakpoint, not from reading the rules.
export const CONTEXT_SIZE = {
  heroCard:
    "min-h-[41px] gap-[13px] px-[18px] py-[14px] text-[13px] [@media(max-width:1240px)]:gap-[8px] [@media(max-width:1240px)]:px-[12px] [@media(max-width:1240px)]:py-[11px] [@media(max-width:1050px)]:text-[14px] [@media(max-width:760px)]:text-[12px] [@media(max-width:430px)]:px-[13px]",
  pathBanner:
    "gap-[12px] px-[20px] py-[13px] min-h-[44px] text-[15px] [@media(max-width:1240px)]:text-[14px]",
  pathFinish: "gap-[12px] px-[11px] py-[8px] min-h-[37px] text-[14px]",
  feedbackBottom: "gap-[12px] px-[17px] py-[10px] min-h-[40px] text-[14px]",
  settingsDialog: "gap-[12px] px-[15px] py-[12px] min-h-[44px] text-[14px]",
  flashcardRatings:
    "gap-[12px] px-[12px] py-[15px] min-h-[44px] text-[15px] [@media(max-width:430px)]:text-[14px]",
  questionFooter: "gap-[12px] px-[20px] py-[13px] min-h-[44px] text-[14px]",
  examResults:
    "gap-[12px] px-[20px] py-[13px] min-h-[44px] text-[15px] [@media(max-width:760px)]:text-[14px]",
};
