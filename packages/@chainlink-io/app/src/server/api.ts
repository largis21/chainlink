import { ChainlinkConfig } from "@chainlink-io/types";
import { Hono } from "hono";

export function getApiRoutes(config: ChainlinkConfig) {
  const api = new Hono();

  api.get("/getConfig", async (c) => {
    return c.json(config);
  });

  return api;
}
