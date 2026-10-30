import type { ComponentProps } from "react";
import { LiveQuestion } from "../live-talk/LiveQuestion";
import { QuestionCard } from "./QuestionCard";

type Props = ComponentProps<typeof QuestionCard>;

// A live talk replaces the whole answer area, so it is a separate view.
export const QuestionView = (props: Props) =>
  props.q.kind === "live" ? (
    <LiveQuestion q={props.q} onEvaluated={props.onEvaluated} onSubmit={props.onSubmit} />
  ) : (
    <QuestionCard {...props} />
  );
