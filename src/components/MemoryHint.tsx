import { Icon } from "./Icon";

export const MemoryHint = ({ text }: { text?: string }) =>
  text ? (
    <div className="memory-hint">
      <span className="memory-hint-label">
        <Icon name="spark" size={17} />
        Memory hint
      </span>
      <p>{text}</p>
    </div>
  ) : null;
