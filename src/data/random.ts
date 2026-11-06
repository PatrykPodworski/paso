// FNV-1a: a fixed number for a string, the same on every device.
export const hash = (text: string) => {
  let h = 0x811c9dc5;

  for (const char of text) {
    h = Math.imul(h ^ char.codePointAt(0)!, 0x01000193);
  }

  return h >>> 0;
};

// Mulberry32: the same seed gives the same sequence on every device.
export const randomFrom = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
};

export const shuffle = <T>(items: T[], random: () => number) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// A new seed for one attempt.
export const randomSeed = () => crypto.getRandomValues(new Uint32Array(1))[0];
