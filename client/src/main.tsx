import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

async function start() {
  // The mobile app has no backend server, so answer /api calls locally
  if (import.meta.env.VITE_STANDALONE === "true") {
    const { installLocalApi } = await import("./lib/local-api");
    installLocalApi();
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

start();
