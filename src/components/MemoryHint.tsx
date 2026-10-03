import { Icon } from "../design-system/Icon";

type Props = { text?: string };

export const MemoryHint = ({ text }: Props) =>
  text ? (
    <div className="mt-[16px] p-[17px_20px] border border-[#e5dcc6] rounded-[10px] bg-[#fffdf6] text-[#514c3d]">
      <span className="flex items-center gap-[8px] text-[#876237] text-[13px] font-semibold">
        <Icon name="spark" size={17} />
        Memory hint
      </span>
      <p className="mt-[8px] text-[16px] leading-[1.7]">{text}</p>
    </div>
  ) : null;
