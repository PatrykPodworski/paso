// Papercut marks from the illustration palette (docs/ILLUSTRATION-STYLE.md), so a result
// reads like the pictures around it rather than a pale tinted icon.
const src = {
  correct: "/icons/result-correct.svg",
  wrong: "/icons/result-wrong.svg",
};

type Props = {
  result: keyof typeof src;
  size?: number;
  // Without a label the mark is decorative and the text next to it carries the result.
  label?: string;
  className?: string;
};

export const ResultMark = ({ result, size = 24, label, className = "" }: Props) => (
  <img
    src={src[result]}
    width={size}
    height={size}
    alt={label ?? ""}
    draggable={false}
    className={`shrink-0 select-none ${className}`}
  />
);
