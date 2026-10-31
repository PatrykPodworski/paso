import type { ComponentProps } from "react";
import type { LiveGrade } from "../../data/types";
import { LiveQuestion } from "../live-talk/LiveQuestion";
import { QuestionCard } from "./QuestionCard";

type Props = Omit<ComponentProps<typeof QuestionCard>, "onEvaluated"> & {
  onEvaluated?: (
    answer: string,
    correct: boolean | null,
    assisted: boolean,
    grade?: LiveGrade,
  ) => void;
};

// A live talk replaces the whole answer area, so it is a separate view.
export const QuestionView = (props: Props) =>
  props.q.kind === "live" ? (
    <LiveQuestion
      q={props.q}
      onEvaluated={props.onEvaluated}
      onSubmit={props.onSubmit}
      previous={props.previous}
    />
  ) : (
    <QuestionCard {...props} />
  );
