import { useEffect, useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) {
      return;
    }

    const id = setTimeout(() => setToast(""), 4000);

    return () => clearTimeout(id);
  }, [toast]);

  return [toast, setToast] as const;
};
