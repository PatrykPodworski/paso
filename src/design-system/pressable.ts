// What every button shares: preflight leaves buttons with the default cursor and no
// pressed or disabled state.
export const PRESSABLE =
  "cursor-pointer transition-[background,box-shadow,transform] duration-180 ease-[ease] motion-reduce:transition-none active:not-disabled:transform-[translateY(1px)] disabled:cursor-default disabled:opacity-46";
