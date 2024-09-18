import { ChainlinkConfig } from "@chainlink-io/types";
import { Hono } from "hono";

import { getApiRequestRoutes } from "./request";
import { BaseApiResult } from "./schemas/base-api-result";

export function getApiRoutes(config: ChainlinkConfig) {
  const api = new Hono();

  api.get("/getConfig", async (c) => {
    return c.json({
      success: true,
      data: config,
    } satisfies BaseApiResult);
  });

  api.route("/request", getApiRequestRoutes(config));

  return api;
}
