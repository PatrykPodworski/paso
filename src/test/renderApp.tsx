import { RouterProvider } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { createAppRouter } from "../routes";

// Renders the app at `path`. Loading the router before the first render makes that render
// show the page, so tests can assert on it straight away.
export const renderApp = async (path: string) => {
  window.history.replaceState(null, "", path);

  const router = createAppRouter();

  await router.load();

  return render(<RouterProvider router={router} />);
};

// Changes the URL the way back, forward or an edited address bar does: no navigate() call,
// only a popstate event the router reacts to.
export const changeUrl = (path: string) => {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
