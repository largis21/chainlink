import { Hono } from "hono";
import { getFsRoutes } from "./fs";
import { ChainlinkConfig } from "@chainlink-io/core";

export function getApiRoutes(config: ChainlinkConfig) {
  const api = new Hono();

  api.route("/fs", getFsRoutes(config));

  return api
}
