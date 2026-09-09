import sources from "./audio-sources.json";
import { audioKey } from "./audio";

type GeneratedClip = { src: string; voiceId: string; modelId: string };
const recordings: Record<string, GeneratedClip> = sources;

export const audioSources = (text: string) => {
  const key = audioKey(text);
  const generated = recordings[key];
  const bundled = `/audio/${key}.m4a`;
  return generated ? [generated.src, bundled] : [bundled];
};
