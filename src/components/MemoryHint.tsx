import { Icon } from "./Icon";

type Props = { text?: string };

export const MemoryHint = ({ text }: Props) =>
  text ? (
    <div className="memory-hint">
      <span className="memory-hint-label">
        <Icon name="spark" size={17} />
        Memory hint
      </span>
      <p>{text}</p>
    </div>
  ) : null;
