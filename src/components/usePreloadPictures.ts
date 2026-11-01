import { useEffect, useRef } from "react";
import type { Question } from "../data/types";
import { pictureSrc } from "./pictureSrc";

// Without this the browser fetches a picture only when its question renders, so it pops in late.
export const usePreloadPictures = (questions: Question[]) => {
  // Static files are served with revalidation headers, so a decoded image survives only while
  // something references it; a collected Image makes the question fetch its picture again.
  const held = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const slugs = new Set(questions.flatMap((q) => (q.picture ? [q.picture] : [])));

    held.current = [...slugs].map((slug) => {
      const image = new Image();

      image.src = pictureSrc(slug);
      // A failed preload is harmless: the question loads the image again when it renders.
      image.decode().catch(() => {});

      return image;
    });
  }, [questions]);
};
