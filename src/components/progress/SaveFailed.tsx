import { Button } from "../../design-system/Button";
import { Dialog } from "../../design-system/Dialog";
import { FieldNote } from "../../design-system/FieldNote";

type Props = { onRetry: () => void };

// A modal, so it shows above an open lesson. Later writes wait until this one is saved.
export const SaveFailed = ({ onRetry }: Props) => (
  <Dialog label="Progress not saved" onClose={() => {}} className="w-110 p-7 max-md:p-6">
    <h2 className="font-heading font-semibold tracking-tight leading-tight text-2xl">
      Your progress was not saved.
    </h2>
    <FieldNote className="mbs-3 mbe-5">
      Check your connection and try again. Your next answers are saved after this one.
    </FieldNote>
    <Button variant="primary" onClick={onRetry}>
      Retry
    </Button>
  </Dialog>
);
