import { MockExam } from "../components/mock-exam/MockExam";
import { useProgress } from "../components/progress/useProgress";

// The exam page wired to the progress API the way App wires it.
export const ProgressExam = () => {
  const { snapshot, actions } = useProgress();

  return (
    snapshot && (
      <MockExam
        progress={snapshot}
        onResult={actions.mockResult}
        onResponses={actions.mockResponses}
        onRunChange={actions.mockRun}
        onNewRun={actions.newMockRun}
        onSeen={actions.seen}
        onLeave={actions.flushDrafts}
      />
    )
  );
};
