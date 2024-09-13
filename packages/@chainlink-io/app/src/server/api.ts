import { Hono } from "hono";
import { ChainlinkConfig } from "@chainlink-io/core";
import { getFsRoutes } from "./fs";

export function getApiRoutes(config: ChainlinkConfig) {
  const api = new Hono();

  api.route("/fs", getFsRoutes(config));

  api.get("/getConfig", async (c) => {
    return c.json(config)
  })


  return api
}
