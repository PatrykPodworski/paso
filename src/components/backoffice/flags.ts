const KEY = "paso-backoffice-flags-v1";

export const readFlags = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");

    return new Set<string>(Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set<string>();
  }
};

export const saveFlags = (flags: Set<string>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify([...flags]));
  } catch {
    // Without storage the flags last until the page reloads.
  }
};

// A flag outlives its asset when a clip or picture is removed, so only current ids are copied.
export const flaggedIdList = (ids: string[], flagged: Set<string>) =>
  ids.filter((id) => flagged.has(id)).join("\n");
