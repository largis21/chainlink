import "./index.css";
import "./lib/initMonacoWorkers";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { apiGetConfig } from "./api/useApi";
import App from "./App";
import { configStore } from "./state/config-store";

async function startApp() {
  const config = await apiGetConfig();

  if (!config.success) {
    throw new Error("Could not get config");
  }

  configStore.setState({ config: config.data.config });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

startApp();
