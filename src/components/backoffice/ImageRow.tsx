import { Badge } from "../ui/badge";
import { FlawedCheckbox } from "./FlawedCheckbox";
import type { ImageAsset } from "./imageAssets";
import type { Flags } from "./useFlags";

type Props = { asset: ImageAsset; flags: Flags };

export const ImageRow = ({ asset, flags }: Props) => (
  <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 max-sm:px-4">
    {asset.src ? (
      <span className="flex items-end gap-3 shrink-0">
        {/* The lesson card shows the picture at 112 px, and at 96 px on a phone. */}
        <img
          className="size-28"
          src={asset.src}
          width={512}
          height={512}
          loading="lazy"
          alt={`“${asset.word}” at card size`}
        />
        <img
          className="size-24"
          src={asset.src}
          width={512}
          height={512}
          loading="lazy"
          alt={`“${asset.word}” at 96 px`}
        />
      </span>
    ) : (
      <span className="grid place-items-center size-28 shrink-0 text-7xl" aria-hidden="true">
        {asset.emoji}
      </span>
    )}
    <span className="flex-1 basis-60 min-w-0">
      <strong className="block text-sm font-semibold text-foreground">
        {asset.word} <span className="font-normal text-muted-foreground">· {asset.english}</span>
      </strong>
      <small className="block text-xs text-muted-foreground break-all">
        Unit {asset.unit} · {asset.id ? `${asset.id} · ${asset.src}` : "no picture file"}
      </small>
    </span>
    {asset.id ? (
      <FlawedCheckbox id={asset.id} name={asset.word} flags={flags} />
    ) : (
      <Badge variant="outline">Emoji fallback</Badge>
    )}
  </li>
);
