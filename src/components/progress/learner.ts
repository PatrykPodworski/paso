const KEY = "paso-learner-v1";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The id the server keeps this browser's progress under. Without browser storage it
// lasts for this visit, and `kept` is false.
export const learnerId = () => {
  try {
    const saved = localStorage.getItem(KEY);

    if (saved && UUID.test(saved)) {
      return { id: saved, kept: true };
    }

    const id = crypto.randomUUID();

    localStorage.setItem(KEY, id);

    return { id, kept: true };
  } catch {
    return { id: crypto.randomUUID(), kept: false };
  }
};
