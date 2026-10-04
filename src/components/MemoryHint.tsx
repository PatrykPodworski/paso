import { Icon } from "../design-system/Icon";

// The mistakes list sets the hint's text in its own type, as the old `.mistake details p` rule did.
const TEXT = {
  default: "mt-[8px] text-[16px]",
  mistake: "my-[12px] text-[14px] text-sage-700",
};

type Props = { text?: string; variant?: keyof typeof TEXT };

export const MemoryHint = ({ text, variant = "default" }: Props) =>
  text ? (
    <div className="mt-[16px] p-[17px_20px] border border-sand-200 rounded-[10px] bg-white text-sand-900">
      <span className="flex items-center gap-[8px] text-sand-700 text-[13px] font-semibold">
        <Icon name="spark" size={17} />
        Memory hint
      </span>
      <p className={`leading-[1.7] ${TEXT[variant]}`}>{text}</p>
    </div>
  ) : null;
