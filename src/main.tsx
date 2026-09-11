import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Gallery from "./design-system/Gallery";
import "./styles.css";
// Read once at load: the gallery is reached by opening /#design-system, not by changing
// the hash in a running app. Deliberately not part of App's navigation array, which
// drives the visible nav bar and would move every page baseline.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.location.hash === "#design-system" ? <Gallery /> : <App />}
  </StrictMode>,
);
