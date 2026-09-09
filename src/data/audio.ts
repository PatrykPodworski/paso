export const audioKey = (text: string) => {
  let hash = 2166136261;
  for (const ch of text) {
    hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  }
  return (hash >>> 0).toString(36);
};
