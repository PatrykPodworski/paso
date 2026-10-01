import { Button } from "../../design-system/Button";
import { Panel } from "../../design-system/Panel";
import { TextLink } from "../../design-system/TextLink";
import type { Lesson } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { MemoryHint } from "../MemoryHint";
import type { Practice, Session } from "../practice";

type Props = {
  mistakeQuestions: Lesson["questions"];
  setSession: Session;
  practice: Practice;
};

export const MistakesPanel = ({ mistakeQuestions, setSession, practice }: Props) => (
  <Panel className="mistakes-panel">
    <span className="h-[47px] w-[47px] rounded-[12px] flex items-center justify-center shrink-0 peach">
      <Icon name="repeat" size={28} />
    </span>
    <h2>
      {mistakeQuestions.length ? "Mistakes are little signposts." : "A fresh page. A fresh start."}
    </h2>
    <p>
      {mistakeQuestions.length
        ? `${mistakeQuestions.length} questions are ready for another look. A correct answer without transcript assistance clears a question from this queue.`
        : "No mistakes waiting here yet. As you practise, tricky questions will collect here with their explanations."}
    </p>
    <Button
      variant="primary"
      className="my-[20px]"
      onClick={() => practice(mistakeQuestions.length ? "mistakes" : "all")}
    >
      {mistakeQuestions.length ? "Review my mistakes" : "Try a daily mix"}
      <Icon name="arrow" />
    </Button>
    {mistakeQuestions.slice(0, 12).map((q) => (
      <details key={q.id}>
        <summary>
          <span className={`skill-dot ${q.skill}`} />
          {q.prompt}
        </summary>
        <p>
          Correct answer: <strong>{q.answer}</strong>
        </p>
        <p>{q.explanation}</p>
        <MemoryHint text={q.memoryHint} />
        <TextLink
          onClick={() =>
            setSession({
              id: "review-one",
              title: "Another little chance",
              subtitle: "Mistake review",
              minutes: 2,
              icon: "repeat",
              questions: [q],
            })
          }
        >
          Try again
          <Icon name="arrow" size={15} />
        </TextLink>
      </details>
    ))}
  </Panel>
);
