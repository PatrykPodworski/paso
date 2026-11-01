import { RouterProvider } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { createAppRouter } from "../routes";

// Renders the app at the current URL hash. Loading the router before the first render
// makes that render show the page, so tests can assert on it straight away.
export const renderApp = async () => {
  const router = createAppRouter();

  await router.load();

  return render(<RouterProvider router={router} />);
};
