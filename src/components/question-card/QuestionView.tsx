import type { ComponentProps } from "react";
import { LiveQuestion } from "../live-talk/LiveQuestion";
import { QuestionCard } from "./QuestionCard";

type Props = ComponentProps<typeof QuestionCard>;

// A live talk replaces the whole answer area, so it is a separate view.
export const QuestionView = (props: Props) => {
  const { onEvaluated } = props;

  return props.q.kind === "live" ? (
    <LiveQuestion
      q={props.q}
      // A talk's fifth argument is its score, not a note.
      onEvaluated={
        onEvaluated &&
        ((answer, correct, assisted, grade) => onEvaluated(answer, correct, assisted, grade))
      }
      onSubmit={props.onSubmit}
      previous={props.previous}
    />
  ) : (
    <QuestionCard {...props} />
  );
};
