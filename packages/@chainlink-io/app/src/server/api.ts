import { ChainlinkConfig } from "@chainlink-io/types";
import { Hono } from "hono";

import { getApiRequestRoutes } from "./request";

export function getApiRoutes(config: ChainlinkConfig) {
  const api = new Hono();

  api.get("/getConfig", async (c) => {
    return c.json(config);
  });

  api.route("/request", getApiRequestRoutes(config));

  return api;
}
