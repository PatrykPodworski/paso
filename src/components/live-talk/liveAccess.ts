const KEY = "paso-live-v1";

export type LiveAccess = { freeUsed: boolean; passcode: string };

export const readAccess = (): LiveAccess => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");

    return {
      freeUsed: raw?.freeUsed === true,
      passcode: typeof raw?.passcode === "string" ? raw.passcode : "",
    };
  } catch {
    return { freeUsed: false, passcode: "" };
  }
};

export const saveAccess = (access: LiveAccess) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(access));
  } catch {
    // Without storage the server cookie still limits the free talk.
  }
};

// A created session uses up the free talk; a rejected passcode is forgotten. Any other
// outcome leaves access as it was.
export const accessAfter = (
  code: string | null,
  access: LiveAccess,
  passcode: string,
): LiveAccess => {
  if (code === "passcode") {
    return { freeUsed: true, passcode: "" };
  }

  if (code === null) {
    return { freeUsed: true, passcode: access.freeUsed ? passcode : "" };
  }

  if (code === "free_used") {
    return { freeUsed: true, passcode: "" };
  }

  return access;
};
