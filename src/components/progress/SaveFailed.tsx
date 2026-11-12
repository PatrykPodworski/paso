import { Button } from "../../design-system/Button";
import { ButtonRow } from "../../design-system/ButtonRow";
import { Dialog } from "../../design-system/Dialog";
import { FieldNote } from "../../design-system/FieldNote";

type Props = { refused: boolean; onRetry: () => void; onContinue: () => void };

// A modal, so it shows above an open lesson. Continue closes it: a failed write waits on this
// device and is sent again in the background, so the learner is never stuck here.
export const SaveFailed = ({ refused, onRetry, onContinue }: Props) => (
  <Dialog label="Progress not saved" onClose={onContinue} className="w-110 p-7 max-md:p-6">
    <h2 className="font-heading font-semibold tracking-tight leading-tight text-2xl">
      {refused ? "One change was not saved." : "Your progress is not saved yet."}
    </h2>
    <FieldNote className="mbs-3 mbe-5">
      {refused
        ? "The server refused it, so trying again will not help. The rest of your progress is saved."
        : "It waits on this device and is sent again when the connection works. You can go on in the meantime."}
    </FieldNote>
    <ButtonRow>
      {refused ? (
        <Button variant="primary" onClick={onContinue}>
          Continue
        </Button>
      ) : (
        <>
          <Button variant="secondary" onClick={onContinue}>
            Continue
          </Button>
          <Button variant="primary" onClick={onRetry}>
            Retry
          </Button>
        </>
      )}
    </ButtonRow>
  </Dialog>
);
