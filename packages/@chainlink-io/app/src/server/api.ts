import { ChainlinkConfig } from "@chainlink-io/types";
import { Hono } from "hono";

import { getConfigRoutes } from "./routes/config/config-routes";
import { getFileRoutes } from "./routes/file/file-routes";

export function getApiRoutes(config: ChainlinkConfig) {
  const api = new Hono();

  api.route("/config", getConfigRoutes(config));

  api.route("/file", getFileRoutes(config));

  return api;
}
