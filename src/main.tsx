import { hydrateRoot, createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start";
import { getRouter } from "./router";
import "./index.css";

const router = getRouter();

const rootElement = document.getElementById("root")!;

if (rootElement.innerHTML) {
  hydrateRoot(rootElement, <StartClient router={router} />);
} else {
  createRoot(rootElement).render(<StartClient router={router} />);
}
