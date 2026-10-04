import { Icon } from "../design-system/Icon";

// The mistakes list sets the hint's text in its own type, as the old `.mistake details p` rule did.
const TEXT = {
  default: "mt-2 text-base",
  mistake: "my-3 text-sm text-sage-700",
};

type Props = { text?: string; variant?: keyof typeof TEXT };

export const MemoryHint = ({ text, variant = "default" }: Props) =>
  text ? (
    <div className="mt-4 py-4 px-5 border border-sand-200 rounded-lg bg-white text-sand-900">
      <span className="flex items-center gap-2 text-sand-700 text-xs font-semibold">
        <Icon name="spark" size={17} />
        Memory hint
      </span>
      <p className={`leading-relaxed ${TEXT[variant]}`}>{text}</p>
    </div>
  ) : null;
