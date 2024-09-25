import "./index.css";
import "./lib/initMonacoWorkers";

import { chainlinkConfigSchema } from "@chainlink-io/types";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { apiHandler } from "./api/useApi";
import App from "./App";
import { configStore } from "./state/config-store";

async function startApp() {
  const config = await apiHandler("/getConfig", {}, chainlinkConfigSchema);

  configStore.setState({ config: config.data });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

startApp();
