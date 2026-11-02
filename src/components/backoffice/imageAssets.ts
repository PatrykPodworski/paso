import { vocabulary } from "../../data/curriculum";
import { pictureSrc } from "../pictureSrc";

// A word without a picture has no file to flag: it still shows its emoji.
export type ImageAsset = {
  id?: string;
  word: string;
  english: string;
  unit: number;
  emoji: string;
  src?: string;
};

export const imageAssets: ImageAsset[] = vocabulary.map((w) => ({
  ...(w.picture && { id: `image:${w.picture}.webp`, src: pictureSrc(w.picture) }),
  word: w.es,
  english: w.en,
  unit: w.unit,
  emoji: w.visual,
}));

export const pictureIds = imageAssets.flatMap((a) => (a.id ? [a.id] : []));
