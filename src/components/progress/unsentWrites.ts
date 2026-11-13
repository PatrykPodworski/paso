// Writes that failed to save, kept on this device so a closed tab does not lose them. The
// next visit sends them before it shows progress. Without browser storage they last for
// this visit only.
export type Body = { action: string } & Record<string, unknown>;

const keyOf = (learner: string) => `paso-unsent-v1-${learner}`;

const isBody = (value: unknown): value is Body =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as { action?: unknown }).action === "string";

export const readUnsent = (learner: string): Body[] => {
  try {
    const kept: unknown = JSON.parse(localStorage.getItem(keyOf(learner)) ?? "[]");

    return Array.isArray(kept) ? kept.filter(isBody) : [];
  } catch {
    return [];
  }
};

export const keepUnsent = (learner: string, writes: Body[]) => {
  try {
    if (writes.length) {
      localStorage.setItem(keyOf(learner), JSON.stringify(writes));
    } else {
      localStorage.removeItem(keyOf(learner));
    }
  } catch {
    // Storage is full or blocked: the writes still wait in memory.
  }
};
