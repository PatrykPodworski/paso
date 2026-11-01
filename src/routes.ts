import { createBrowserHistory, parseHref } from "@tanstack/history";
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import App from "./App";
import type { Page } from "./components/navigation";
import Gallery from "./design-system/Gallery";

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }

  interface StaticDataRouteOption {
    page?: Page;
  }
}

const rootRoute = createRootRoute();

// Pathless: the app shell around every page except the gallery.
const appRoute = createRoute({ getParentRoute: () => rootRoute, id: "app", component: App });

const pageRoute = <P extends Page>(page: P) =>
  createRoute({ getParentRoute: () => appRoute, path: page, staticData: { page } });

const routeTree = rootRoute.addChildren([
  appRoute.addChildren([
    pageRoute("today"),
    pageRoute("path"),
    pageRoute("practice"),
    pageRoute("exam"),
    pageRoute("guide"),
    pageRoute("backoffice"),
    // No hash and unknown hashes both show the today page.
    createRoute({ getParentRoute: () => appRoute, path: "/", staticData: { page: "today" } }),
    createRoute({ getParentRoute: () => appRoute, path: "$", staticData: { page: "today" } }),
  ]),
  // A visual-test harness with no nav entry, outside the app shell.
  createRoute({ getParentRoute: () => rootRoute, path: "design-system", component: Gallery }),
]);

// Keeps the URLs the app has always had, /#practice. createHashHistory reads and writes
// /#/practice, so it would break existing links and every test's page.goto.
const hashHistory = () =>
  createBrowserHistory({
    parseLocation: () => parseHref(`/${window.location.hash.slice(1)}`, window.history.state),
    createHref: (path) => `${window.location.pathname}${window.location.search}#${path.slice(1)}`,
  });

export const createAppRouter = () =>
  createRouter({
    routeTree,
    history: hashHistory(),
    // The router scrolls to the top after each navigation; smooth matches the old navigate().
    scrollRestorationBehavior: "smooth",
  });
