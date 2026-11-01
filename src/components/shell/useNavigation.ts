import { useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Page } from "../navigation";

export const useNavigation = () => {
  const router = useRouter();
  // Every route under the app shell, unknown paths included, names its page in routes.ts.
  const page = useRouterState({ select: (s) => s.matches.at(-1)!.staticData.page! });
  const [mobileNav, setMobileNav] = useState(false);

  // Back, forward and edited URLs change the page without navigate(); close the nav for them too.
  useEffect(() => router.subscribe("onResolved", () => setMobileNav(false)), [router]);

  const navigate = (target: Page) => {
    void router.navigate({ to: `/${target}` });
    setMobileNav(false);
  };

  return { page, navigate, mobileNav, setMobileNav };
};
