import { Button } from "../../design-system/Button";
import { FieldNote } from "../../design-system/FieldNote";

type Props = { failed: boolean; onRetry: () => void };

export const ProgressLoading = ({ failed, onRetry }: Props) => (
  <main className="min-h-screen grid place-items-center p-6 text-center">
    {failed ? (
      <div>
        <h1 className="font-heading font-semibold tracking-tight leading-tight text-2xl">
          Your progress could not be loaded.
        </h1>
        <FieldNote className="mbs-3 mbe-5">Check your connection and try again.</FieldNote>
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    ) : (
      <p role="status" className="text-sm text-muted-foreground">
        Loading your progress…
      </p>
    )}
  </main>
);
