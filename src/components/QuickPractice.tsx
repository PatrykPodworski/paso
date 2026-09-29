import { Icon } from "../design-system/Icon";
import type { Practice } from "./practice";

type Props = {
  mistakeCount: number;
  practice: Practice;
};

export const QuickPractice = ({ mistakeCount, practice }: Props) => (
  <div className="quick-practice">
    <button onClick={() => practice("listening")}>
      <span className="quick-icon lavender">
        <Icon name="headphones" size={23} />
      </span>
      <strong>Tune your ear</strong>
      <small>Listen to everyday Spanish</small>
      <Icon name="arrow" size={17} />
    </button>
    <button onClick={() => practice("speaking")}>
      <span className="quick-icon peach">
        <Icon name="mic" size={23} />
      </span>
      <strong>Find your voice</strong>
      <small>A safe space to speak</small>
      <Icon name="arrow" size={17} />
    </button>
    <button onClick={() => practice(mistakeCount ? "mistakes" : "all")}>
      <span className="quick-icon sage">
        <Icon name="repeat" size={23} />
      </span>
      <strong>Make it stick</strong>
      <small>
        {mistakeCount ? `${mistakeCount} mistakes to revisit` : "A fresh mix of little challenges"}
      </small>
      <Icon name="arrow" size={17} />
    </button>
  </div>
);
