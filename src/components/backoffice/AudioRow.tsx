import { Play } from "lucide-react";
import { Button } from "../ui/button";
import type { AudioAsset } from "./audioAssets";
import { FlawedCheckbox } from "./FlawedCheckbox";
import { playClip } from "./playClip";
import type { Flags } from "./useFlags";

type Props = { asset: AudioAsset; flags: Flags };

export const AudioRow = ({ asset, flags }: Props) => (
  <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 max-sm:px-4">
    <Button
      variant="outline"
      size="icon-lg"
      aria-label={`Play “${asset.text}”`}
      onClick={() => playClip(asset.src)}
    >
      <Play aria-hidden="true" />
    </Button>
    <span className="flex-1 basis-60 min-w-0">
      <strong className="block text-sm font-semibold text-foreground">{asset.text}</strong>
      <small className="block text-xs text-muted-foreground break-all">
        {asset.source} · {asset.id} · {asset.src}
      </small>
    </span>
    <FlawedCheckbox id={asset.id} name={asset.text} flags={flags} />
  </li>
);
