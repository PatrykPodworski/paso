// What every button shares: preflight leaves buttons with the default cursor and no
// pressed or disabled state.
export const PRESSABLE =
  "cursor-pointer transition duration-180 motion-reduce:transition-none active:not-disabled:translate-y-px disabled:cursor-default disabled:opacity-46";
