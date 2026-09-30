import { useEffect, useState } from "react";
import { pageFromHash, type Page } from "../navigation";

export const useNavigation = () => {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const handle = () => {
      setPage(pageFromHash());
      setMobileNav(false);
    };

    window.addEventListener("hashchange", handle);

    return () => window.removeEventListener("hashchange", handle);
  }, []);

  const navigate = (target: Page) => {
    setPage(target);
    window.location.hash = target;
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { page, setPage, navigate, mobileNav, setMobileNav };
};
